// SMS notification service using Twilio
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendEmergencySMS = async (phoneNumber, userName, alertType, location) => {
  try {
    const message = await client.messages.create({
      body: `🚨 EMERGENCY ALERT: ${userName} triggered ${alertType}. Location: ${location || 'Unknown'}. Please respond immediately if available.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`✓ SMS sent to ${phoneNumber} (SID: ${message.sid})`);
    return message;
  } catch (error) {
    console.error('✗ SMS sending failed:', error.message);
  }
};

const sendHealthAlert = async (phoneNumber, userName, healthData) => {
  try {
    const message = await client.messages.create({
      body: `⚠️ Health Alert: ${userName}'s heart rate is ${healthData.heartRate} bpm (abnormal). Please check on them.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log(`✓ Health alert SMS sent to ${phoneNumber}`);
    return message;
  } catch (error) {
    console.error('✗ Health alert SMS failed:', error.message);
  }
};

module.exports = {
  sendEmergencySMS,
  sendHealthAlert,
};
