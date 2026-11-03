
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { fileURLToPath } from "node:url";

// Load the backend .env file before initializing Nodemailer.
dotenv.config({
  path: fileURLToPath(new URL("../.env", import.meta.url)),
});

// Diagnostic check: never print actual credentials.
console.log("Email configuration check:", {
  companyEmailLoaded: Boolean(process.env.COMPANY_EMAIL),
  appPasswordLoaded: Boolean(process.env.EMAIL_APP_PASSWORD),
});

// Company email used for notifications.
const COMPANY_EMAIL =
  process.env.COMPANY_EMAIL

// Create the shared Gmail transporter.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.COMPANY_EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Escape user-provided text before inserting it into HTML emails.
const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

// Existing order notification — preserved.
export const sendCompanyNotification = async (orderData) => {
  try {
    const orderId =
      orderData.orderNumber ||
      orderData._id?.toString().slice(-6) ||
      "N/A";

    const items =
      orderData.items
        ?.map(
          (item) =>
            `<li>${escapeHtml(item.name || "Product")} - Qty: ${escapeHtml(
              item.quantity || 1
            )}</li>`
        )
        .join("") || "<li>Details in Admin Panel</li>";

    await transporter.sendMail({
      from: `"Rambo Industry Bot" <${COMPANY_EMAIL}>`,
      to: COMPANY_EMAIL,
      subject: `NEW ORDER RECEIVED: #${orderId}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;color:#333">
          <h2 style="color:#173b68">New Customer Order Placed!</h2>
          <hr />
          <p><strong>Customer Name:</strong> ${escapeHtml(orderData.customerName)}</p>
          <p><strong>Email:</strong> ${escapeHtml(orderData.email)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(orderData.phone)}</p>
          <p><strong>Address:</strong> ${escapeHtml(orderData.address || "N/A")}</p>
          <p><strong>Total:</strong> Rs. ${escapeHtml(orderData.grandTotal)}</p>
          <p><strong>Status:</strong> ${escapeHtml(orderData.status || "Confirmed")}</p>
          <h3>Order Items</h3>
          <ul>${items}</ul>
        </div>
      `,
    });

    console.log("Order email notification sent successfully!");
  } catch (error) {
    console.error("Error sending order email notification:", error);
  }
};

// Contact Us enquiry notification.
export const sendContactNotification = async ({
  name,
  email,
  phone,
  subject,
  message,
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone || "Not provided");
  const safeSubject = escapeHtml(subject || "General enquiry");
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");

  try {
    const info = await transporter.sendMail({
      from: `"Rambo Industry Website" <${COMPANY_EMAIL}>`,
      to: "rambobathaccessories@gmail.com",
      replyTo: email,
      subject: `Website enquiry: ${subject || "General enquiry"}`,
      text: [
        "New Contact Us enquiry",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Subject: ${subject || "General enquiry"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:650px;margin:auto;padding:24px;color:#333">
          <h2 style="color:#173b68">New Contact Us Enquiry</h2>
          <p>You have received a new message through the Rambo Industry website.</p>
          <hr />
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <h3>Message</h3>
          <div style="padding:16px;background:#f5f5f5;border-radius:8px;line-height:1.7">
            ${safeMessage}
          </div>
          <p style="margin-top:24px;color:#777;font-size:12px">
            Reply directly to this email to respond to the customer.
          </p>
        </div>
      `,
    });

    console.log("Contact enquiry email sent successfully!", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
    });

    return info;
  } catch (error) {
    console.error("Contact email error:", error);
    throw error;
  }
};
