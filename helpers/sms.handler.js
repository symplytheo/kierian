const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTHTOKEN);

async function sendSMSOtp(recipient) {
  await client.messages.create({
    body: 'Your OTP is ' + otp + '. Keep is secured. Do not share',
    to: recipient,
    from: process.env.TWILIO_PHONE_NUMBER,
  });
}

module.exports = sendSMSOtp;
