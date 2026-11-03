import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/rambo-logo.png";

// =====================================================
// Social Icons (use currentColor so Tailwind text colors apply)
// =====================================================

const FacebookIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const TikTokIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 1 0 5.55 6.29V8.69a8.18 8.18 0 0 0 4.77 1.52V6.69z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-4 w-4 shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

const PinIcon = () => (
  <svg className="h-4 w-4 shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// =====================================================
// Data
// =====================================================

const socials = [
  {
    component: FacebookIcon,
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61594253841482",
  },
  {
    component: InstagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/rambobathaccessories/",
  },
  {
    component: TikTokIcon,
    label: "TikTok",
    href: "https://www.tiktok.com/@rambobathaccesories/",
  },
];

// Change these paths to match your router
const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// =====================================================
// Footer
// =====================================================

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden bg-[#0a1f44] text-slate-300">
      {/* Cyan accent line on top */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500" />

      {/* Soft cyan glow */}
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-14"
      >
        {/* Brand */}
        <div className="lg:col-span-5">
          <div className="inline-block rounded-lg bg-white px-3 py-2">
            <img
              src={logo}
              alt="Rambo — M. Nawaz Industry"
              className="h-10 w-auto object-contain"
            />
          </div>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
            Premium bathroom accessories crafted with precision, combining
            elegant contemporary design, lasting durability, and everyday
            functionality for modern spaces.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socials.map((social) => {
              const IconComponent = social.component;
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-200 hover:border-cyan-400 hover:bg-cyan-400 hover:text-[#0a1f44] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                >
                  <IconComponent />
                </motion.a>
              );
            })}
          </div>
        </div>

        

        {/* Contact */}
        <div className="lg:col-span-4">
          <h4 className="text-sm font-semibold uppercase tracking-widest text-white">
            Get In Touch
          </h4>
          <div className="mt-3 h-0.5 w-8 rounded-full bg-cyan-400" />

          <div className="mt-5 space-y-3 text-sm">
            <p className="font-semibold text-white">Gala Magna Sanitary</p>

            <p className="flex items-start gap-2.5">
              <PinIcon />
              <span>Kanganiwala G.T Road, Gujranwala</span>
            </p>

            <a
              href="mailto:ramboindustry@gmail.com"
              className="flex items-center gap-2.5 break-all transition-colors duration-200 hover:text-cyan-400"
            >
              <MailIcon />
              ramboindustry@gmail.com
            </a>
          </div>

          {/* Small button */}
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-cyan-400 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#0a1f44] transition-colors duration-200 hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Contact Us
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="relative z-10 border-t border-white/10 bg-[#081832]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center text-xs text-slate-400 sm:flex-row lg:px-8">
          <p>
            © {currentYear}{" "}
            <span className="font-semibold text-white">Rambo Industry</span>.
            All Rights Reserved.
          </p>

          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors duration-200 hover:text-cyan-400">
              Privacy Policy
            </a>
            <span className="text-white/20">|</span>
            <a href="#" className="transition-colors duration-200 hover:text-cyan-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}