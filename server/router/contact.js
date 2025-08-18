// routes/contact.js
const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../utils/aws-ses'); // adjust path

router.post('/api/contact', async (req, res) => {
  const { name, email, phone, organization, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await sendContactEmail({ name, email, phone, organization, subject, message });
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
});

module.exports = router;
