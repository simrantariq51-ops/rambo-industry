import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ShoppingBag,
  User,
  Mail,
  Lock,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

import logo from "../assets/rambo-logo.png";

// ============================================================
// BRAND & NAVIGATION DATA
// ============================================================

const brand = {
  tagline: "Quality Conscious Company",
};

// "Home" tab removed. The logo still links to "/".
const nav = [
  { label: "Products", href: "/products" },
  { label: "Contact Us", href: "/contact" },
];

const MotionLink = motion(Link);

// Express Backend Base API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = `${API_URL}/api/users`;

// ============================================================
// AUTH MODAL COMPONENT (Internal - Connected to Custom Express Backend)
// ============================================================

function AuthModal({ isOpen, onClose }) {
  // Modal View Mode: 'signIn' | 'signUp' | 'forgot'
  const [mode, setMode] = useState("signIn");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Password Visibility Toggle State
  const [showPassword, setShowPassword] = useState(false);

  // Feedback & Loading States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Automatically reset form inputs and errors whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: "", email: "", password: "" });
      setError("");
      setSuccessMsg("");
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(""); // Clear errors when user types
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setFormData({ name: "", email: "", password: "" }); // Clear form when switching modes
    setError("");
    setSuccessMsg("");
    setShowPassword(false); // Reset password visibility when changing mode
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    // Route mapping for your Express server
    const endpoints = {
      signIn: `${API_BASE_URL}/login`,
      signUp: `${API_BASE_URL}/register`,
      forgot: `${API_BASE_URL}/forgot-password`,
    };

    try {
      const res = await fetch(endpoints[mode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      if (mode === "signIn") {
        // Store JWT token returned from backend
        if (data.token) {
          localStorage.setItem("userToken", data.token);
        }
        onClose(); // Close modal on login success
      } else if (mode === "signUp") {
        setSuccessMsg("Account created successfully! Please sign in.");
        switchMode("signIn");
      } else if (mode === "forgot") {
        setSuccessMsg("Password reset email sent! Please check your inbox.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-amber-500/30 bg-blue-950 p-6 text-white shadow-2xl shadow-blue-950/50 sm:p-8"
        >
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-amber-400"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span className="bg-gradient-to-r from-white via-amber-100 to-amber-300 bg-clip-text text-transparent">
                {mode === "signUp" && "Create Account"}
                {mode === "signIn" && "Sign In"}
                {mode === "forgot" && "Reset Password"}
              </span>
            </h2>
            <p className="mt-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400">
              {brand.tagline}
            </p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="mt-6 space-y-4">
            {mode === "signUp" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-white/80">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <User size={18} className="absolute left-3.5 text-amber-400/70" />
                  <input
                    type="text"
                    name="name"
                    autoComplete="off"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 transition-all focus:border-amber-400/80 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-white/80">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail size={18} className="absolute left-3.5 text-amber-400/70" />
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/40 transition-all focus:border-amber-400/80 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                />
              </div>
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-white/80">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-3.5 text-amber-400/70" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/15 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder-white/40 transition-all focus:border-amber-400/80 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 text-white/50 transition-colors hover:text-amber-400 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === "signIn" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => switchMode("forgot")}
                  className="text-xs text-amber-400 transition-colors hover:text-amber-300 hover:underline"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 py-3.5 text-sm font-bold text-blue-950 shadow-lg shadow-amber-500/20 transition-all duration-300 hover:from-amber-300 hover:via-amber-400 hover:to-yellow-400 hover:shadow-amber-400/30 active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin text-blue-950" />
              ) : (
                <>
                  <span>
                    {mode === "signUp" && "CREATE ACCOUNT"}
                    {mode === "signIn" && "SIGN IN"}
                    {mode === "forgot" && "SEND RESET LINK"}
                  </span>
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Tab */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-white/70">
            {mode === "signIn" && (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signUp")}
                  className="font-semibold text-amber-400 transition-colors hover:text-amber-300 hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}

            {mode === "signUp" && (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signIn")}
                  className="font-semibold text-amber-400 transition-colors hover:text-amber-300 hover:underline"
                >
                  Sign In
                </button>
              </>
            )}

            {mode === "forgot" && (
              <button
                type="button"
                onClick={() => switchMode("signIn")}
                className="mx-auto flex items-center justify-center gap-1.5 font-semibold text-amber-400 transition-colors hover:text-amber-300 hover:underline"
              >
                <KeyRound size={14} /> Back to Sign In
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ============================================================
// MAIN NAVBAR COMPONENT
// ============================================================

export default function Navbar({ cartCount = 0, onOpenCart }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Search Submit
  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearchOpen(false);
    setMenuOpen(false);
    window.location.href = `/products?search=${encodeURIComponent(query)}`;
  };

  // Nav Link Click
  const handleNavClick = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Floating wrapper: transparent, only positions the bar */}
      <header
        className="fixed inset-x-0 top-0 z-50"
      >
        {/* The bar itself keeps the same blue-950 color */}
        <div
          className={`
            relative w-full overflow-hidden border-b border-blue-900/60 text-white transition-all duration-300
            ${
              scrolled
                ? "bg-blue-950/90 shadow-xl shadow-blue-950/30 backdrop-blur-md"
                : "bg-blue-950 shadow-lg shadow-blue-950/20"
            }
          `}
        >
          {/* Top Accent Line */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />

          {/* Glows */}
          <div className="pointer-events-none absolute -left-40 -top-40 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-40 -top-40 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          {/* Container */}
          <div
            className={`relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 transition-all duration-300 lg:px-8 ${
              scrolled ? "h-[66px]" : "h-[76px]"
            }`}
          >
            {/* Logo (also the way back to the home page) */}
            <Link
              to="/"
              onClick={handleNavClick}
              aria-label="Rambo Industry home"
              className="flex shrink-0 items-center gap-3 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={logo}
                alt="Rambo Industry"
                className="h-9 w-auto object-contain sm:h-10"
              />
            </Link>

            {/* Desktop Nav: pill tabs */}
            <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
              {nav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={handleNavClick}
                    className={`
                      relative rounded-full px-5 py-2 text-sm font-medium tracking-wide transition-colors duration-200
                      ${isActive ? "text-blue-950" : "text-white/85 hover:text-cyan-400"}
                    `}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-indicator"
                        className="absolute inset-0 rounded-full bg-cyan-400"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Desktop Search Bar */}
              <form
                onSubmit={handleSearch}
                className="hidden h-10 w-[190px] items-center overflow-hidden rounded-full border border-white/15 bg-white/10 transition-all duration-300 focus-within:w-[250px] focus-within:border-cyan-400/60 focus-within:bg-white/[0.14] lg:flex"
              >
                <Search size={17} strokeWidth={1.8} className="ml-3.5 shrink-0 text-white/60" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/45"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="mr-2 rounded-full p-1 text-white/50 transition-colors hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>

              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen((val) => !val);
                  setMenuOpen(false);
                }}
                aria-label="Search products"
                className="rounded-full p-2.5 text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-cyan-400 lg:hidden"
              >
                <Search size={20} strokeWidth={1.8} />
              </button>

              {/* Desktop Account Button */}
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                aria-label="User Account"
                className="hidden rounded-full p-2.5 text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-cyan-400 sm:block"
              >
                <User size={20} strokeWidth={1.8} />
              </button>

              {/* Cart Button */}
              <button
                type="button"
                onClick={onOpenCart}
                aria-label="Shopping Cart"
                className="relative rounded-full p-2.5 text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-cyan-400"
              >
                <ShoppingBag size={21} strokeWidth={1.8} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={cartCount}
                    className="absolute right-0 top-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-cyan-400 px-1 text-[9px] font-bold text-blue-950 shadow-md shadow-cyan-400/20"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen((val) => !val);
                  setSearchOpen(false);
                }}
                aria-expanded={menuOpen}
                aria-label="Toggle navigation menu"
                className="rounded-full p-2.5 text-white/85 transition-all duration-200 hover:bg-white/10 hover:text-cyan-400 md:hidden"
              >
                {menuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Dropdown */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="relative z-10 overflow-hidden border-t border-white/10 lg:hidden"
              >
                <form onSubmit={handleSearch} className="px-4 py-4">
                  <div className="flex h-11 items-center overflow-hidden rounded-full border border-white/15 bg-white/10 focus-within:border-cyan-400/60">
                    <Search size={18} className="ml-3.5 shrink-0 text-white/60" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      placeholder="Search products..."
                      aria-label="Search products"
                      className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/45"
                    />
                    <button
                      type="submit"
                      className="mr-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-cyan-600"
                    >
                      Search
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile Navigation Drawer */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="relative z-10 overflow-hidden border-t border-white/10 md:hidden"
              >
                <div className="px-4 py-5">
                  <div className="mb-3 px-3 text-xs font-semibold text-cyan-400">
                    {brand.tagline}
                  </div>

                  <div className="space-y-1">
                    {nav.map((item, index) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <MotionLink
                          key={item.href}
                          to={item.href}
                          onClick={handleNavClick}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between rounded-xl px-3 py-3.5 text-sm font-medium transition-colors ${
                            isActive
                              ? "bg-cyan-400 text-blue-950"
                              : "text-white/85 hover:bg-white/5 hover:text-cyan-400"
                          }`}
                        >
                          {item.label}
                          <span className={isActive ? "text-blue-950" : "text-cyan-400"}>→</span>
                        </MotionLink>
                      );
                    })}
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setAuthOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 text-sm font-medium text-white/75 transition-colors hover:text-cyan-400"
                    >
                      <User size={18} />
                      Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Embedded Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
