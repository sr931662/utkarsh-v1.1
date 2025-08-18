const OTP = require('../db/otpSchema');
const emailjs = require('@emailjs/browser');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    // 1. Check if user exists - same as login check
    const user = await User.findOne({ email: email.toLowerCase() }); // Ensure case-insensitive
    
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'No account found with that email address'
      });
    }

    // 2. Generate and save OTP
    const otp = user.createOTP();
    await user.save({ validateBeforeSave: false });

    // 3. Send OTP
    try {
      await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID,
        {
          to_email: user.email,
          otp_code: otp,
          expiration: "10 minutes"
        },
        process.env.EMAILJS_PUBLIC_KEY
      );

      res.status(200).json({
        status: 'success',
        message: 'OTP sent successfully'
      });
    } catch (err) {
      // Clear OTP if email fails
      user.clearOTP();
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        status: 'error',
        message: 'Failed to send OTP email'
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
    console.log(err)
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const otpRecord = await OTP.findOne({ email });
    
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or invalid' });
    }
    
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    
    // OTP is valid - you can now allow password reset or whatever action
    await OTP.deleteOne({ email }); // Remove used OTP
    
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};