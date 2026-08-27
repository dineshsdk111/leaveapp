const express = require('express');
const Leave = require('../models/Leave');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail, emailTemplates } = require('../utils/email');
const { protect, facultyOnly } = require('../middleware/auth');

const router = express.Router();

// Apply for leave (Student)
router.post('/apply', protect, async (req, res) => {
  try {
    const { type, fromDate, toDate, reason } = req.body;

    const leave = await Leave.create({
      applicant: req.user._id,
      type,
      fromDate,
      toDate,
      reason
    });

    // Notify faculty
    const faculty = await User.findOne({ role: 'faculty' });
    if (faculty) {
      await Notification.create({
        user: faculty._id,
        message: `New leave request from ${req.user.name} (${req.user.rollNumber})`,
        type: 'leave_applied',
        leaveId: leave._id
      });

      // Send email to faculty
      const emailContent = emailTemplates.leaveApplied(
        req.user.name, req.user.rollNumber, type, fromDate, toDate, reason
      );
      await sendEmail(faculty.email, emailContent.subject, emailContent.html);
    }

    res.status(201).json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get my leaves (Student)
router.get('/my', protect, async (req, res) => {
  try {
    const leaves = await Leave.find({ applicant: req.user._id })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending leaves (Faculty)
router.get('/pending', protect, facultyOnly, async (req, res) => {
  try {
    const leaves = await Leave.find({ status: 'pending' })
      .populate('applicant', 'name email rollNumber section')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all leaves (Faculty)
router.get('/all', protect, facultyOnly, async (req, res) => {
  try {
    const leaves = await Leave.find({})
      .populate('applicant', 'name email rollNumber section')
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Faculty action - Approve/Reject (Faculty)
router.put('/:id/action', protect, facultyOnly, async (req, res) => {
  try {
    const { status, remark } = req.body;
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    leave.status = status;
    leave.facultyRemark = remark || '';
    leave.reviewedAt = new Date();
    await leave.save();

    // Notify student
    const applicant = await User.findById(leave.applicant);
    if (applicant) {
      await Notification.create({
        user: leave.applicant,
        message: `Your ${leave.type} request has been ${status} by ${req.user.name}`,
        type: status === 'approved' ? 'leave_approved' : 'leave_rejected',
        leaveId: leave._id
      });

      // Send email to student
      const emailContent = emailTemplates.leaveAction(
        applicant.name, leave.type, status, leave.fromDate, leave.toDate, remark
      );
      await sendEmail(applicant.email, emailContent.subject, emailContent.html);
    }

    // Update leaves taken if approved
    if (status === 'approved') {
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      const diffTime = Math.abs(to - from);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      await User.findByIdAndUpdate(leave.applicant, {
        $inc: { leavesTaken: diffDays }
      });
    }

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete leave (Student - only if pending)
router.delete('/:id', protect, async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: 'Leave not found' });
    }

    if (leave.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete processed leave' });
    }

    await leave.deleteOne();
    res.json({ message: 'Leave deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
