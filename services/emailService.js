// Email notification service
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmergencyNotification = async (recipientEmail, userData, alertData) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `🚨 EMERGENCY ALERT - ${userData.name} needs help!`,
      html: `
        <h2 style="color: red;">Emergency Alert</h2>
        <p><strong>User:</strong> ${userData.name}</p>
        <p><strong>Alert Type:</strong> ${alertData.alertType}</p>
        <p><strong>Description:</strong> ${alertData.description}</p>
        <p><strong>Time:</strong> ${new Date(alertData.createdAt).toLocaleString()}</p>
        ${alertData.latitude ? `<p><strong>Location:</strong> <a href="https://maps.google.com/?q=${alertData.latitude},${alertData.longitude}">View on Map</a></p>` : ''}
        <p style="color: red; font-weight: bold;">PLEASE RESPOND IMMEDIATELY IF AVAILABLE!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Notification email sent to ${recipientEmail}`);
  } catch (error) {
    console.error('✗ Email notification failed:', error.message);
  }
};

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Welcome to SecurePulse!',
      html: `
        <h2>Welcome, ${userName}!</h2>
        <p>Thank you for joining SecurePulse. Your safety is our priority.</p>
        <p>Next steps:</p>
        <ol>
          <li>Complete your profile</li>
          <li>Register your bracelet(s)</li>
          <li>Add emergency contacts</li>
          <li>Download the mobile app</li>
        </ol>
        <p>Need help? <a href="mailto:hello@securepulse.co.za">Contact Support</a></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✓ Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('✗ Welcome email failed:', error.message);
  }
};

module.exports = {
  sendEmergencyNotification,
  sendWelcomeEmail,
};
