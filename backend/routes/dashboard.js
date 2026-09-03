const express = require('express');
const Leave = require('../models/Leave');
const User = require('../models/User');
const { protect, facultyOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/student', protect, async (req, res) => {
  try {
    const [totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves, recentLeaves] = await Promise.all([
      Leave.countDocuments({ applicant: req.user._id }),
      Leave.countDocuments({ applicant: req.user._id, status: 'pending' }),
      Leave.countDocuments({ applicant: req.user._id, status: 'approved' }),
      Leave.countDocuments({ applicant: req.user._id, status: 'rejected' }),
      Leave.find({ applicant: req.user._id }).sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      stats: { totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves },
      recentLeaves
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/faculty', protect, facultyOnly, async (req, res) => {
  try {
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
    const approvedLeaves = await Leave.find({ status: 'approved' }).sort({ fromDate: -1 });
    const allLeavesRecent = await Leave.find({}).sort({ createdAt: -1 }).limit(20);

    const allIds = [...new Set([...approvedLeaves.map(l => l.applicant.toString()), ...allLeavesRecent.map(l => l.applicant.toString())])];
    const applicants = await User.find({ _id: { $in: allIds } }).select('name rollNumber section');
    const applicantMap = {};
    applicants.forEach(u => { applicantMap[u._id.toString()] = u; });

    const todayLeaves = [];
    const leavesByDate = {};

    approvedLeaves.forEach(leave => {
      const app = applicantMap[leave.applicant.toString()];
      if (!app) return;
      const from = new Date(leave.fromDate);
      const to = new Date(leave.toDate);
      const d = new Date(from);
      let days = 0;
      while (d <= to && days < 90) {
        const dateKey = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        if (!leavesByDate[dateKey]) leavesByDate[dateKey] = [];
        leavesByDate[dateKey].push({
          _id: leave._id, name: app.name, rollNumber: app.rollNumber,
          section: app.section, type: leave.type, reason: leave.reason
        });
        if (dateKey === todayStr) {
          todayLeaves.push({ _id: leave._id, applicant: app, type: leave.type, fromDate: leave.fromDate, toDate: leave.toDate, reason: leave.reason, status: 'approved' });
        }
        d.setDate(d.getDate() + 1);
      }
    });

    const recentLeaves = allLeavesRecent.map(l => ({
      _id: l._id,
      type: l.type,
      fromDate: l.fromDate,
      toDate: l.toDate,
      reason: l.reason,
      status: l.status,
      facultyRemark: l.facultyRemark,
      createdAt: l.createdAt,
      applicant: applicantMap[l.applicant.toString()] || null
    }));

    res.json({
      stats: { totalStudents, pendingLeaves, todayLeavesCount: todayLeaves.length },
      todayLeaves, leavesByDate, recentLeaves
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
