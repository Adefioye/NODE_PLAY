const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  // 1) Create a transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Create email options
  const emailOptions = {
    from: "Koko lamba <no-reply@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send email
  await transporter.sendMail(emailOptions);
};

module.exports = sendMail;
