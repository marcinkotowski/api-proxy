const nodemailer = require("nodemailer");

async function sendMail(clientEmail, keyboardPwd) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_ADDRESS,
      to: clientEmail,
      subject: "Passcode",
      html: `
      <html>
        <head>
          <style>
          h1 {
            margin-bottom: 5px;
          }
          h2 {
            margin-top: 0px;
            color: #f71a63;
            font-size: 2.125rem;
          }
          </style>
        </head>
        <body>
          <h1>Your access code is:</h1>
          <div></div>
          <h2>${keyboardPwd}</h2>
        </body>
      </html>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Send mail failed: " + error);
  }
}

module.exports = { sendMail };
