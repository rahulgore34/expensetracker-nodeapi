const { EmailClient } = require("@azure/communication-email");

const client = new EmailClient(
  process.env.AZURE_EMAIL_CONNECTION_STRING
);

const sendOtpEmail = async (toEmail, otp) => {
  const message = {
    senderAddress: process.env.AZURE_SENDER_EMAIL,
    content: {
      subject: "Your OTP Verification Code",
      plainText: `Your OTP is ${otp}. It is valid for 5 minutes.`,
      html: `<h3>Your OTP is <b>${otp}</b></h3><p>Valid for 5 minutes.</p>`
    },
    recipients: {
      to: [{ address: toEmail }]
    }
  };

  const poller = await client.beginSend(message);
  const result = await poller.pollUntilDone();

  return result;
};

module.exports = sendOtpEmail;