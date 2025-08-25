import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Login.module.css';
import axios from 'axios';
import { Helmet } from 'react-helmet'

const Login = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const clearMessages = () => {
    setErrors('');
    setSuccessMessage('');
  };

  const handleChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      const response = await axios.post('https://utkarsh-x6xa.onrender.com/api/auth/login', loginForm);
      authLogin(response.data.token, response.data.data.user);

      const welcomeMessage = response.data.data.user.role === 'superadmin'
        ? 'Welcome Super Admin!'
        : 'Welcome Admin!';
      setSuccessMessage(`${welcomeMessage} Redirecting...`);

      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setErrors(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearMessages();

    try {
      await axios.post('https://utkarsh-x6xa.onrender.com/api/auth/send-otp', {
        email: forgotPasswordEmail,
      });
      setOtpSent(true);
      setSuccessMessage('OTP has been sent to your email.');
    } catch (err) {
      const message = err.response?.data?.message;
      setErrors(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
  e.preventDefault();
  setLoading(true);
  clearMessages();

  if (newPassword !== confirmPassword) {
    console.warn("⚠️ Passwords do not match");
    setErrors('Passwords do not match.');
    setLoading(false);
    return;
  }

  try {
    axios.post('https://utkarsh-x6xa.onrender.com/api/auth/verify-otp-reset', {
      email: forgotPasswordEmail,
      otp,
      newPassword
    });
    setSuccessMessage('Password reset successful! You can now log in.');
    setTimeout(resetForgotPasswordFlow, 2000);
  } catch (err) {
    console.error("❌ Reset password failed:", err.response?.data || err.message);
    const message = err.response?.data?.message || 'Failed to reset password.';
    setErrors(message);
  } finally {
    console.log("🔹 Reset password process finished");
    setLoading(false);
  }
};


  const resetForgotPasswordFlow = () => {
    setShowForgotPassword(false);
    setOtpSent(false);
    setForgotPasswordEmail('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    clearMessages();
  };

  return (
    <div className={`${styles.loginContainer} ${darkMode ? styles.dark : ''}`}>
      <Helmet>
        <title>Login - Mr. Utkarsh Gupta Portfolio</title>
        <link rel="canonical" href="https://utkarshgupta.info/login" />
      </Helmet>
      {!showForgotPassword ? (
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <h1>Admin Portal</h1>
          <p className={styles.subtitle}>Sign in to your account</p>

          {errors && <div className={styles.error}><i className="fas fa-exclamation-circle"></i> {errors}</div>}
          {successMessage && <div className={styles.success}><i className="fas fa-check-circle"></i> {successMessage}</div>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={loginForm.email}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={handleChange}
              required
              minLength="8"
              className={styles.inputField}
            />
          </div>

          <button type="submit" disabled={loading} className={`${styles.submitButton} ${loading ? styles.loading : ''}`}>
            {loading ? <><i className="fas fa-spinner fa-spin"></i> Signing In...</> : 'Sign In'}
          </button>

          <div className={styles.forgotPasswordLink}>
            <button type="button" onClick={() => { setShowForgotPassword(true); clearMessages(); }} className={styles.linkButton}>
              Forgot your password?
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className={styles.loginForm}>
          <h1>Reset Password</h1>
          <p className={styles.subtitle}>Enter the details to reset your password</p>

          {errors && <div className={styles.error}><i className="fas fa-exclamation-circle"></i> {errors}</div>}
          {successMessage && <div className={styles.success}><i className="fas fa-check-circle"></i> {successMessage}</div>}

          {!otpSent && (
            <div className={styles.inputGroup}>
              <label htmlFor="forgotEmail">Email</label>
              <input
                type="email"
                id="forgotEmail"
                placeholder="Enter your registered email"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
                className={styles.inputField}
              />
            </div>
          )}

          {otpSent && (
            <>
              <div className={styles.inputGroup}>
                <label htmlFor="otp">OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter the 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength="8"
                  className={styles.inputField}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength="8"
                  className={styles.inputField}
                />
              </div>
            </>
          )}

          <div className={styles.buttonGroup}>
            {!otpSent ? (
              <button type="button" onClick={handleSendOTP} disabled={loading} className={`${styles.submitButton} ${loading ? styles.loading : ''}`}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : 'Send OTP'}
              </button>
            ) : (
              <button type="submit" disabled={loading} className={`${styles.submitButton} ${loading ? styles.loading : ''}`}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Resetting...</> : 'Reset Password'}
              </button>
            )}

            <button type="button" onClick={resetForgotPasswordFlow} className={styles.cancelButton}>
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
































