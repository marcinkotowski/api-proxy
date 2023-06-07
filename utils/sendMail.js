const nodemailer = require("nodemailer");

async function sendMail() {
  try {
    const transporter = await nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_ADDRESS,
      to: process.env.GMAIL_ADDRESS,
      subject: "Generated passcode",
      text: "0123456",
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Send mail failed: " + error.message);
  }
}

module.exports = { sendMail };
