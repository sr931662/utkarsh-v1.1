// utils/otpEmail.js
const nodemailer = require('nodemailer');

module.exports = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: +process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'Your App'}" <${process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_FROM}>`,
      to: email,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('OTP Email sending error:', err);
    throw err;
  }
};















































// const nodemailer = require('nodemailer');

// module.exports = async ({ email, subject, message }) => {
//   try {
//     // 1) Create transporter
//     const transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       secure: process.env.EMAIL_SECURE === 'true',
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });

//     // 2) Define email options
//     const mailOptions = {
//       from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
//       to: email,
//       subject,
//       text: message,
//       html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
//     };

//     // 3) Send email
//     await transporter.sendMail(mailOptions);
//   } catch (err) {
//     console.error('Email sending error:', err);
//     throw new Error('Failed to send email');
//   }
// };