import emailjs from '@emailjs/browser';

// Initialize EmailJS (use your public key)
emailjs.init(process.env.EMAILJS_PUBLIC_KEY);

export const sendOTP = async (email, otp) => {
  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      {
        to_email: email,
        otp_code: otp,
        expiration: "10 minutes"
      }
    );
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
};