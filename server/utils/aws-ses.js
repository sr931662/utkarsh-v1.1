const AWS = require('aws-sdk');
const AppError = require('./appError');

// Configure AWS SES
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_SES_REGION
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.sendOTPEmail = async (toEmail, otp) => {
  const params = {
    Destination: {
      ToAddresses: [toEmail]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f7f9fc; border-radius: 8px; border: 1px solid #e1e5ee;">
            <div style="text-align: center; padding-bottom: 10px;">
              <h2 style="color: #2d3748; margin-bottom: 5px;">Password Reset Request</h2>
              <p style="color: #718096; font-size: 14px;">You requested to reset your password. Use the OTP below to proceed:</p>
            </div>

            <div style="background: white; padding: 20px; text-align: center; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
              <p style="color: #4a5568; font-size: 14px; margin-bottom: 10px;">Your One-Time Password (OTP) is:</p>
              <h1 style="color: #2b6cb0; letter-spacing: 4px; font-size: 32px; margin: 0;">${otp}</h1>
              <p style="color: #e53e3e; font-size: 12px; margin-top: 8px;">This code will expire in 10 minutes.</p>
            </div>

            <p style="color: #4a5568; font-size: 14px; margin-top: 20px;">
              If you did not request a password reset, please ignore this email or contact our support team.
            </p>

            <div style="text-align: center; margin-top: 30px; font-size: 12px; color: #a0aec0;">
              &copy; ${new Date().getFullYear()} ${process.env.APP_NAME}. All rights reserved.
            </div>
          </div>
          `
        },
        Text: {
          Charset: 'UTF-8',
          Data: `Your OTP is ${otp}. It will expire in 10 minutes.`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Your Password Reset OTP'
      }
    },
    Source: process.env.AWS_SES_FROM_EMAIL
  };

  try {
    await ses.sendEmail(params).promise();
    return true;
  } catch (error) {
    console.error('AWS SES Error:', error);
    throw new AppError('Failed to send OTP email', 500);
  }
};

exports.sendContactEmail = async ({ name, email, phone, organization, subject, message }) => {
  const params = {
    Destination: {
      ToAddresses: [process.env.CONTACT_EMAIL] // Your receiving email
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f7f9fc; border-radius: 8px; border: 1px solid #e1e5ee;">
              <h2 style="color: #2d3748;">📩 New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-line;">${message}</p>
            </div>
          `
        },
        Text: {
          Charset: 'UTF-8',
          Data: `
            New Contact Form Submission:
            Name: ${name}
            Email: ${email}
            Phone: ${phone || 'Not provided'}
            Organization: ${organization || 'Not provided'}
            Message: ${message}
          `
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `New Contact: ${subject || 'No Subject'}`
      }
    },
    Source: process.env.AWS_SES_FROM_EMAIL,
    ReplyToAddresses: [email] // allows you to reply directly to sender
  };

  try {
    await ses.sendEmail(params).promise();
    return true;
  } catch (error) {
    console.error('AWS SES Error (contact):', error);
    throw new AppError('Failed to send contact email', 500);
  }
};
