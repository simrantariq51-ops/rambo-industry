import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Tag,
  Info,
  ChevronDown,
  CheckCircle2,
  PackageCheck,
  Truck,
  Building2,
  Copy,
  Check,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
  Pencil,
  Loader2,
  Lock,
} from "lucide-react";

// Small reusable section title with cyan accent
const SectionTitle = ({ children, action }) => (
  <div className="flex items-center justify-between">
    <h2 className="flex items-center gap-2.5 text-base font-bold text-[#0a1f44]">
      <span className="h-5 w-1 rounded-full bg-cyan-400" />
      {children}
    </h2>
    {action}
  </div>
);

export default function Checkout({
  cartItems = [],
  onBackToStore,
  onCompleteOrder,
}) {
  // Form State
  const [email, setEmail] = useState("");
  const [newsOffers, setNewsOffers] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  // Checkout Configuration Options
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [copiedOrderNo, setCopiedOrderNo] = useState(false);

  // Order metadata generated upon order completion
  const [orderDetails, setOrderDetails] = useState(null);

  // Financial Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee = 0;
  const originalShipping = 250;

  const grandTotal = Math.max(0, subtotal - appliedDiscount + shippingFee);
  const totalSavings = originalShipping + appliedDiscount;

  const inputClass =
    "w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-[#0a1f44] placeholder-slate-400 outline-none transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/30";

  const checkboxClass =
    "h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-400";

  const handleApplyDiscount = (e) => {
    e.preventDefault();

    if (discountCode.trim().toUpperCase() === "SAVE10") {
      setAppliedDiscount(subtotal * 0.1);
    } else {
      alert("Invalid Code! Try using 'SAVE10'");
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      customerName: `${firstName} ${lastName}`.trim() || "Valued Customer",
      email,
      phone,
      address,
      apartment,
      city,
      postalCode,
      country: "Pakistan",
      items: cartItems,
      subtotal,
      appliedDiscount,
      grandTotal,
      paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrderDetails(data.order);
        setOrderPlaced(true);

        if (onCompleteOrder) {
          onCompleteOrder();
        }
      } else {
        alert(`Order error: ${data.message || "Failed to save order"}`);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Network error: Unable to reach the backend server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderNo = () => {
    if (orderDetails?.orderNumber) {
      navigator.clipboard.writeText(orderDetails.orderNumber);
      setCopiedOrderNo(true);
      setTimeout(() => setCopiedOrderNo(false), 2000);
    }
  };

  // =====================================================
  // SUCCESS / THANK YOU PAGE
  // =====================================================
  if (orderPlaced && orderDetails) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-10 font-sans text-slate-900 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl space-y-6"
        >
          {/* Thank you banner */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500" />

            <div className="space-y-3">
              <div className="inline-flex items-center justify-center rounded-full bg-cyan-50 p-3 text-cyan-500">
                <CheckCircle2 size={40} />
              </div>

              <h1 className="text-2xl font-black tracking-tight text-[#0a1f44] sm:text-3xl">
                Thank You,{" "}
                <span className="text-cyan-500">{orderDetails.customerName}</span>!
              </h1>

              <p className="mx-auto max-w-lg text-sm leading-relaxed text-slate-600 sm:text-base">
                Your order is successfully placed! We've received your details
                and are getting it ready for shipment.
              </p>

              <div className="inline-flex items-center gap-3 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-2 text-xs font-semibold text-[#0a1f44]">
                <span>Order ID: {orderDetails.orderNumber}</span>
                <button
                  onClick={handleCopyOrderNo}
                  className="p-1 text-cyan-600 transition-colors hover:text-cyan-500"
                  title="Copy Order Number"
                >
                  {copiedOrderNo ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Delivery details */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center justify-between text-sm font-bold uppercase tracking-wider text-[#0a1f44]">
              <span className="flex items-center gap-2.5">
                <span className="h-5 w-1 rounded-full bg-cyan-400" />
                Delivery Details
              </span>
              <Pencil
                size={15}
                className="cursor-pointer text-slate-400 transition-colors hover:text-cyan-500"
              />
            </h3>

            <div className="grid gap-5 text-sm text-slate-600 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-cyan-500" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-[#0a1f44]">
                    {orderDetails.customerName}
                  </p>
                  <p className="leading-snug">{orderDetails.address}</p>
                  {orderDetails.apartment && <p>{orderDetails.apartment}</p>}
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {orderDetails.city}
                  </p>
                  <p>{orderDetails.country}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-cyan-500" />
                <span className="font-medium text-[#0a1f44]">
                  {orderDetails.phone}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-cyan-500" />
                <span className="break-all font-medium text-[#0a1f44]">
                  {orderDetails.email}
                </span>
              </div>
            </div>

            <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-500">
              Order receipt and shipping updates are sent to{" "}
              <span className="font-semibold text-[#0a1f44]">
                {orderDetails.email}
              </span>
              .
            </p>
          </div>

          {/* Shipment progress */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
              Shipment Progress
            </h3>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 text-[#0a1f44] shadow-md shadow-cyan-400/30">
                  <PackageCheck size={20} />
                </div>
                <p className="text-xs font-bold text-[#0a1f44]">Order Placed</p>
                <p className="text-[10px] text-slate-500">
                  {orderDetails.date || "Today"}
                </p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-200 bg-cyan-50 text-cyan-600">
                  <Building2 size={20} />
                </div>
                <p className="text-xs font-bold text-[#0a1f44]">Processing</p>
                <p className="text-[10px] text-slate-500">1 - 2 Days</p>
              </div>

              <div className="flex flex-col items-center space-y-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-400">
                  <Truck size={20} />
                </div>
                <p className="text-xs font-bold text-[#0a1f44]">
                  Out for Delivery
                </p>
                <p className="text-[10px] text-slate-500">Standard Transit</p>
              </div>
            </div>
          </div>

          {/* Items + payment summary */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-7">
              <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-base font-bold text-[#0a1f44]">
                <ShoppingBag size={18} className="text-cyan-500" />
                Purchased Items ({orderDetails.items?.length || 0})
              </h3>

              <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                {orderDetails.items?.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-2.5"
                  >
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
                      />
                      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-[#0a1f44]">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h4 className="text-xs font-bold leading-tight text-[#0a1f44]">
                        {item.name}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-slate-500">
                        {item.material || "Standard"}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-[#0a1f44]">
                      Rs {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-5">
              <div className="space-y-3 text-xs">
                <h4 className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-wider text-[#0a1f44]">
                  <span className="h-4 w-1 rounded-full bg-cyan-400" />
                  Payment Summary
                </h4>

                <div className="flex justify-between text-slate-600">
                  <span>Method</span>
                  <span className="font-semibold uppercase text-[#0a1f44]">
                    {orderDetails.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Bank Deposit"}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#0a1f44]">
                    Rs {orderDetails.subtotal?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-bold text-cyan-600">FREE</span>
                </div>

                {orderDetails.appliedDiscount > 0 && (
                  <div className="flex justify-between font-medium text-cyan-600">
                    <span>Discount</span>
                    <span>- Rs {orderDetails.appliedDiscount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex items-baseline justify-between border-t border-slate-200 pt-3 text-sm font-bold text-[#0a1f44]">
                  <span>Grand Total</span>
                  <span className="text-lg font-black">
                    Rs {Math.round(orderDetails.grandTotal).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onBackToStore}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0a1f44] transition-colors duration-200 hover:bg-cyan-300"
            >
              Back to Store
              <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // =====================================================
  // REGULAR CHECKOUT FORM
  // =====================================================
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 shadow-sm md:px-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-cyan-600"
          >
            <ArrowLeft size={16} />
            Back to Store
          </button>

          <h1 className="text-lg font-bold tracking-wide text-[#0a1f44]">
            Rambo Industry
          </h1>

          <div className="flex w-24 items-center justify-end gap-1.5 text-[11px] text-slate-500">
            <Lock size={12} className="text-cyan-500" />
            Secure
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500" />
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-7xl grid-cols-1 lg:grid-cols-12">
        {/* LEFT: FORM */}
        <div className="space-y-8 bg-white p-6 md:p-12 lg:col-span-7">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Contact */}
            <div className="space-y-4">
              <SectionTitle
                action={
                  <button
                    type="button"
                    className="text-xs font-medium text-cyan-600 transition-colors hover:text-cyan-500"
                  >
                    Sign in
                  </button>
                }
              >
                Contact
              </SectionTitle>

              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />

              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={newsOffers}
                  onChange={(e) => setNewsOffers(e.target.checked)}
                  className={checkboxClass}
                />
                Email me with news and offers
              </label>
            </div>

            {/* Delivery */}
            <div className="space-y-4">
              <SectionTitle>Delivery</SectionTitle>

              <div className="relative">
                <select
                  disabled
                  className="w-full cursor-not-allowed appearance-none rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm font-medium text-slate-500"
                >
                  <option>Pakistan</option>
                </select>
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-3.5 text-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  required
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputClass}
              />

              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className={inputClass}
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Postal code (optional)"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={inputClass}
                />
              </div>

              <input
                type="tel"
                required
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />

              <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className={checkboxClass}
                />
                Save this information for next time
              </label>
            </div>

            {/* Shipping method */}
            <div className="space-y-3">
              <SectionTitle>Shipping method</SectionTitle>

              <div className="flex items-center justify-between rounded-lg border border-cyan-400 bg-cyan-50/60 p-4 text-sm">
                <div>
                  <p className="font-semibold text-[#0a1f44]">Flat Rate</p>
                  <p className="text-xs text-slate-500">
                    Standard Delivery across Pakistan
                  </p>
                </div>

                <div className="text-right">
                  <span className="mr-2 text-xs text-slate-400 line-through">
                    Rs {originalShipping}.00
                  </span>
                  <span className="font-bold text-cyan-600">FREE</span>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="space-y-4">
              <div className="space-y-1">
                <SectionTitle>Payment</SectionTitle>
                <p className="pl-3.5 text-xs text-slate-500">
                  All transactions are secure and encrypted.
                </p>
              </div>

              <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
                {/* COD */}
                <label
                  className={`flex min-h-[60px] cursor-pointer items-center gap-4 px-5 py-4 transition-colors ${
                    paymentMethod === "cod"
                      ? "bg-cyan-50/70"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="h-4 w-4 shrink-0 accent-cyan-500"
                  />
                  <span className="text-sm font-semibold text-[#0a1f44]">
                    Cash on Delivery (COD)
                  </span>
                </label>

                {/* Bank deposit */}
                <label
                  className={`flex min-h-[60px] cursor-pointer items-center gap-4 px-5 py-4 transition-colors ${
                    paymentMethod === "bank"
                      ? "bg-cyan-50/70"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="h-4 w-4 shrink-0 accent-cyan-500"
                  />
                  <span className="text-sm font-semibold text-[#0a1f44]">
                    Bank Deposit
                  </span>
                </label>

                {paymentMethod === "bank" && (
                  <div className="bg-slate-50 px-5 py-5 text-sm leading-6 text-slate-700">
                    <p>Kindly transfer payable at this account number:-</p>
                    <p className="break-words">
                      Bank name:{" "}
                      <strong className="text-[#0a1f44]">YOUR BANK NAME</strong>
                    </p>
                    <p className="break-words">
                      Account number:{" "}
                      <strong className="text-[#0a1f44]">
                        YOUR ACCOUNT NUMBER
                      </strong>
                    </p>
                    <p className="break-words">
                      IBAN: <strong className="text-[#0a1f44]">YOUR IBAN</strong>
                    </p>
                    <p className="mt-1">
                      Share proof of payment at this whatsapp:{" "}
                      <a
                        href="https://wa.me/923394270842"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-cyan-600 underline-offset-2 hover:underline"
                      >
                        03394270842
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || cartItems.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 py-3.5 text-sm font-bold text-[#0a1f44] shadow-md shadow-cyan-400/30 transition-all duration-200 hover:bg-cyan-300 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing Order...
                </>
              ) : (
                `Complete Order • Rs ${Math.round(grandTotal).toLocaleString()}`
              )}
            </button>
          </form>
        </div>

        {/* RIGHT: ORDER SUMMARY (light) */}
        <div className="space-y-6 border-l border-slate-200 bg-slate-50 p-6 md:p-12 lg:col-span-5">
          <h2 className="flex items-center gap-2.5 text-base font-bold text-[#0a1f44]">
            <span className="h-5 w-1 rounded-full bg-cyan-400" />
            Order Summary
          </h2>

          <div className="max-h-[380px] space-y-3 overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors duration-200 hover:border-cyan-400"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg border border-slate-200 bg-white object-cover"
                  />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-xs font-bold text-[#0a1f44] shadow-md">
                    {item.quantity}
                  </span>
                </div>

                <div className="flex-1">
                  <h4 className="text-xs font-bold leading-snug text-[#0a1f44]">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {item.material || "Standard"}
                  </p>
                </div>

                <span className="text-xs font-bold text-[#0a1f44]">
                  {item.price === 0
                    ? "FREE"
                    : `Rs ${(item.price * item.quantity).toLocaleString()}`}
                </span>
              </div>
            ))}
          </div>

          <hr className="border-slate-200" />

          {/* Discount */}
          <form onSubmit={handleApplyDiscount} className="flex gap-2">
            <input
              type="text"
              placeholder="Discount code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-[#0a1f44] placeholder-slate-400 outline-none transition-all duration-200 hover:border-cyan-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-400/30"
            />
            <button
              type="submit"
              className="rounded-lg bg-cyan-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#0a1f44] transition-colors duration-200 hover:bg-cyan-300"
            >
              Apply
            </button>
          </form>

          <hr className="border-slate-200" />

          {/* Totals */}
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal · {cartItems.length} items</span>
              <span className="font-semibold text-[#0a1f44]">
                Rs {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                Shipping
                <Info size={12} />
              </span>
              <span>
                <span className="mr-1.5 text-xs text-slate-400 line-through">
                  Rs {originalShipping}.00
                </span>
                <span className="font-bold text-cyan-600">FREE</span>
              </span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-cyan-600">
                <span>Discount applied</span>
                <span className="font-semibold">
                  - Rs {appliedDiscount.toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex items-baseline justify-between border-t border-slate-200 pt-4">
              <div>
                <span className="text-base font-bold text-[#0a1f44]">Total</span>
                <span className="ml-2 text-[10px] text-slate-500">PKR</span>
              </div>
              <span className="text-2xl font-black text-[#0a1f44]">
                Rs {Math.round(grandTotal).toLocaleString()}
              </span>
            </div>

            {totalSavings > 0 && (
              <div className="flex items-center gap-1.5 pt-1 text-xs font-semibold text-slate-700">
                <Tag size={13} className="text-cyan-500" />
                <span>TOTAL SAVINGS</span>
                <span className="text-cyan-600">
                  Rs {totalSavings.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}