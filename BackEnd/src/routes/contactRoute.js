const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, msg: "All fields required" });
    }

    console.log("New Contact Submission:", { name, email, message });

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to YOU (website admin)
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: "New Contact Form Submission",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    });

    // Optional: Confirmation email to the user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thanks for contacting us!",
      html: `
        <p>Hi ${name},</p>
        <p>We received your message. Our team will get back to you soon.</p>
        <br/>
        <p>Regards,<br/>BeastBuddy Team</p>
      `,
    });

    return res.status(200).json({
      success: true,
      msg: "Message sent successfully",
    });
  } catch (err) {
    console.error("Error sending contact email:", err);
    return res.status(500).json({
      success: false,
      msg: "Something went wrong. Please try again later.",
    });
  }
});

module.exports = router;
