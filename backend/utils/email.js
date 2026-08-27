const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
};

const emailTemplates = {
  leaveApplied: (studentName, rollNumber, type, fromDate, toDate, reason) => ({
    subject: `New ${type} Request - ${studentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #1e40af; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2>📝 New Leave Request</h2>
        </div>
        <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
          <p><strong>Student:</strong> ${studentName} (${rollNumber})</p>
          <p><strong>Type:</strong> ${type === 'on-duty' ? 'On-Duty' : 'Leave'}</p>
          <p><strong>From:</strong> ${new Date(fromDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(toDate).toLocaleDateString()}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <hr style="border: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px;">Please review this request in the IT Leave Portal.</p>
        </div>
      </div>
    `
  }),

  leaveAction: (studentName, type, status, fromDate, toDate, remark) => ({
    subject: `Your ${type} has been ${status}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: ${status === 'approved' ? '#059669' : '#dc2626'}; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2>${status === 'approved' ? '✅ Leave Approved' : '❌ Leave Rejected'}</h2>
        </div>
        <div style="background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0;">
          <p>Dear <strong>${studentName}</strong>,</p>
          <p>Your ${type === 'on-duty' ? 'On-Duty' : 'Leave'} request has been <strong style="color: ${status === 'approved' ? '#059669' : '#dc2626'};">${status.toUpperCase()}</strong>.</p>
          <p><strong>From:</strong> ${new Date(fromDate).toLocaleDateString()}</p>
          <p><strong>To:</strong> ${new Date(toDate).toLocaleDateString()}</p>
          ${remark ? `<p><strong>Remark:</strong> ${remark}</p>` : ''}
          <hr style="border: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px;">IT Department - SRM Easwari Engineering College</p>
        </div>
      </div>
    `
  })
};

module.exports = { sendEmail, emailTemplates };
