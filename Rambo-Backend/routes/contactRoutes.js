
import express from "express";
import { sendContactNotification } from "../utils/sendEmail.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body || {};

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    // Validate field lengths
    if (
      name.trim().length > 100 ||
      email.trim().length > 254 ||
      message.trim().length > 5000 ||
      (typeof phone === "string" && phone.length > 40) ||
      (typeof subject === "string" && subject.length > 150)
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more fields exceed the allowed length.",
      });
    }

    const normalizedEmail = email.trim();

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    await sendContactNotification({
      name: name.trim(),
      email: normalizedEmail,
      phone: typeof phone === "string" ? phone.trim() : "",
      subject: typeof subject === "string" ? subject.trim() : "",
      message: message.trim(),
    });

    return res.status(200).json({
      success: true,
      message:
        "Your message has been sent successfully. Thank you for contacting us!",
    });
  } catch (error) {
    console.error("Contact email error:", error);

    return res.status(500).json({
      success: false,
      message:
        "We couldn't send your message right now. Please try again later.",
    });
  }
});

export default router;
