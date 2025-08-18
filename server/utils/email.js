// utils/email.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",          // e.g. smtp.gmail.com
    port: 465,          // 465 (secure) or 587 (non-secure)
    secure: true, // true for port 465, false for others
    auth: {
      user: process.env.EMAIL_USERNAME,    // your email
      pass: process.env.EMAIL_PASSWORD,    // your email password or app password
    },
  });

  // 2) Define email options
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Admin'}" <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `<p>${options.message}</p>`,
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;




// // utils/email.js
// const nodemailer = require('nodemailer');

// const sendEmail = async (options) => {
//   // 1) Create transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,          // e.g. smtp.gmail.com
//     port: process.env.EMAIL_PORT,          // 465 (secure) or 587 (non-secure)
//     secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for others
//     auth: {
//       user: process.env.EMAIL_USERNAME,    // your email
//       pass: process.env.EMAIL_PASSWORD,    // your email password or app password
//     },
//   });

//   // 2) Define email options
//   const mailOptions = {
//     from: `"${process.env.EMAIL_FROM_NAME || 'Admin'}" <${process.env.EMAIL_FROM}>`,
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     html: options.html || `<p>${options.message}</p>`,
//   };

//   // 3) Send email
//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
