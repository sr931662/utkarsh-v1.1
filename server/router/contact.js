// contact.js
import express from "express";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const router = express.Router();

const ses = new SESClient({ region: process.env.AWS_REGION });

router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const params = {
    Destination: {
      ToAddresses: ["sr931662@gmail.com"], // <-- Your email
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `You got a new message from ${name} (${email}):\n\n${message}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `New Contact Form Submission from ${name}`,
      },
    },
    Source: "verified-sender@example.com", // must be verified in SES
    ReplyToAddresses: [email],
  };

  try {
    const command = new SendEmailCommand(params);
    await ses.send(command);
    res.json({ status: "success", message: "Message sent successfully!" });
  } catch (err) {
    console.error("SES Error:", err);
    res.status(500).json({ status: "error", message: "Error sending email", error: err.message });
  }
});

export default router;
