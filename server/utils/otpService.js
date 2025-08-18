// utils/otpService.js
const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Academic Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code for Password Reset",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset OTP</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333333;
                  margin: 0;
                  padding: 0;
                  background-color: #f7f9fc;
              }
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
              }
              .header {
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  padding: 30px 20px;
                  text-align: center;
                  color: white;
              }
              .logo {
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .content {
                  padding: 30px;
              }
              h1 {
                  color: #2d3748;
                  margin-top: 0;
                  font-size: 24px;
              }
              .otp-container {
                  background: #f8f9fa;
                  border-radius: 6px;
                  padding: 20px;
                  text-align: center;
                  margin: 25px 0;
              }
              .otp-code {
                  font-size: 32px;
                  letter-spacing: 5px;
                  color: #2d3748;
                  font-weight: bold;
                  margin: 15px 0;
                  font-family: monospace;
              }
              .note {
                  font-size: 14px;
                  color: #718096;
                  margin-top: 25px;
              }
              .footer {
                  padding: 20px;
                  text-align: center;
                  font-size: 12px;
                  color: #a0aec0;
                  border-top: 1px solid #e2e8f0;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 4px;
                  font-weight: 500;
                  margin: 15px 0;
              }
              @media only screen and (max-width: 600px) {
                  .content {
                      padding: 20px;
                  }
                  .otp-code {
                      font-size: 24px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="header">
                  <div class="logo">Mr. Utkarsh Gupta Portfolio</div>
                  <div>Password Reset Request</div>
              </div>
              <div class="content">
                  <h1>Reset Your Password</h1>
                  <p>We received a request to reset your password. Please use the following One-Time Password (OTP) to verify your identity:</p>
                  <div class="otp-container">
                      <div>Your verification code is:</div>
                      <div class="otp-code">${otp}</div>
                      <div>This code expires in <strong>10 minutes</strong>.</div>
                  </div>
                  <p>If you didn't request this password reset, you can safely ignore this email.</p>
                  <p class="note">For security reasons, please don't share this code with anyone.</p>
              </div>
              <div class="footer">
                  © 2025 Mr. Utkarsh Gupta. All rights reserved.<br>
                  <small>If you have any questions, please contact sr931662@gmail.com</small>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOTPEmail };
