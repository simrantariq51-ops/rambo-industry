import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowRight } from "lucide-react";

import SectionTag from "./ui/SectionTag";

// =====================================================
// API URL
// Set VITE_API_URL in your frontend .env for production
// e.g. VITE_API_URL=https://your-backend-domain.com
// =====================================================
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// Contact Information
// =====================================================
const contactItems = [
  {
    icon: Mail,
    title: "Email us",
    value: "rambobathaccessories@gmail.com",
    href: "mailto:rambobathaccessories@gmail.com",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+92 305 3888666",
    href: "tel:+923053888666",
  },
];

// =====================================================
// Animation (one single entrance for the whole card)
// =====================================================
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// =====================================================
// Shared form styles (underline style fields)
// =====================================================
const labelClass =
  "mb-1 block text-xs font-semibold tracking-wide text-slate-600";

const inputClass =
  "w-full border-0 border-b-2 border-blue-100 bg-transparent px-0 py-2.5 text-sm text-slate-900 outline-none transition-colors duration-200 placeholder:text-slate-400 hover:border-blue-300 focus:border-blue-600 focus:ring-0";

// =====================================================
// Contact Section
// =====================================================
export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // -----------------------------------------------------
  // Submit handler: sends the form data to the backend
  // -----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message:
            data.message ||
            "Your message has been sent successfully. Thank you for contacting us!",
        });
        form.reset();
      } else {
        setStatus({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        type: "error",
        message: "Could not reach the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-blue-200/60 bg-blue-50 py-16 sm:py-20 lg:py-24"
    >
      {/* Soft background: faint grid + one glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(59,130,246,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.08) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-5 lg:px-8">
        {/* =====================================================
            HEADER (centered)
        ====================================================== */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <SectionTag index="02" label="Contact & Support" />

          <h2 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-blue-950 sm:text-5xl lg:text-6xl">
            Let's Talk <span className="text-blue-600">With Us</span>
          </h2>

          <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            Have a question about our products or need assistance with your
            requirements? Our team is ready to help.
          </p>
        </div>

        {/* =====================================================
            SPLIT CARD: dark info panel + light form panel
        ====================================================== */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid overflow-hidden rounded-3xl bg-white shadow-2xl shadow-blue-950/10 ring-1 ring-blue-100 lg:mt-16 lg:grid-cols-12"
        >
          {/* -------------------------------------------------
              LEFT PANEL: CONTACT INFORMATION
          -------------------------------------------------- */}
          <aside className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 p-8 text-white sm:p-10 lg:col-span-5 lg:p-12">
            {/* Decorative rings */}
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-cyan-300/20" />
            <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full border border-cyan-300/20" />
            <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative">
              <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                Get In Touch
              </h3>

              <p className="mt-3 max-w-xs text-sm leading-6 text-blue-100/80">
                Send us your enquiry and our team will get back to you shortly.
              </p>

              {/* Contact rows */}
              <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        className="group flex items-center gap-4 py-5 outline-none transition-colors focus-visible:text-cyan-200"
                      >
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-cyan-200 ring-1 ring-white/15 transition-all duration-300 group-hover:bg-white group-hover:text-blue-700">
                          <Icon size={19} strokeWidth={1.8} />
                        </span>

                        <span className="min-w-0">
                          <span className="block text-xs font-medium text-cyan-200/90">
                            {item.title}
                          </span>
                          <span className="mt-0.5 block break-all text-sm font-medium text-white sm:text-base">
                            {item.value}
                          </span>
                        </span>

                        <ArrowRight
                          size={17}
                          className="ml-auto shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Bottom line */}
            <div className="relative mt-10 flex items-center gap-3 lg:mt-14">
              <div className="h-px w-10 bg-gradient-to-r from-cyan-300 to-blue-400" />
              <span className="text-xs font-medium tracking-wide text-blue-100/70">
                Quality • Reliability • Support
              </span>
            </div>
          </aside>

          {/* -------------------------------------------------
              RIGHT PANEL: FORM
          -------------------------------------------------- */}
          <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
            <p className="font-display text-2xl font-semibold leading-tight tracking-tight text-blue-950 sm:text-3xl">
              Tell us what you need.
            </p>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Name
                    <span className="ml-1 text-blue-600">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    placeholder="Your name"
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                    <span className="ml-1 text-blue-600">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={40}
                    placeholder="+92 300 0000000"
                    className={inputClass}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    maxLength={150}
                    placeholder="How can we help?"
                    className={inputClass}
                  />
                </div>

                {/* Message */}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={labelClass}>
                    Message
                    <span className="ml-1 text-blue-600">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    maxLength={5000}
                    placeholder="Tell us about your requirements..."
                    className={`${inputClass} resize-none leading-6`}
                  />
                </div>
              </div>

              {/* Status message */}
              {status.message && (
                <p
                  role="status"
                  className={`mt-6 rounded-xl px-4 py-3 text-sm ${
                    status.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {status.message}
                </p>
              )}

              {/* Footer */}
              <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-xs text-xs leading-5 text-slate-500">
                  Our team will review your enquiry and contact you with the
                  appropriate information.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:bg-blue-950 hover:shadow-blue-950/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Message"}
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
