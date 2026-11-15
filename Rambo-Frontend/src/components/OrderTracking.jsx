import React, { useState } from "react";
import {
  Search,
  CheckCircle2,
  PackageCheck,
  Truck,
  Home,
  ArrowLeft,
  Loader2,
  MapPin,
  Phone,
  ShoppingBag,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Same status names the Admin page uses
const STEPS = [
  { key: "Confirmed", label: "Confirmed", hint: "Order received", icon: CheckCircle2 },
  { key: "Processing", label: "Processing", hint: "Being packed", icon: PackageCheck },
  { key: "Dispatched", label: "Dispatched", hint: "On the way", icon: Truck },
  { key: "Delivered", label: "Delivered", hint: "At your door", icon: Home },
];

function StatusTimeline({ status }) {
  const found = STEPS.findIndex((s) => s.key === status);
  const current = found === -1 ? 0 : found;
  const progress = (current / (STEPS.length - 1)) * 100;

  return (
    <div className="relative grid grid-cols-4 text-center">
      {/* Track runs from the centre of the first step to the centre of the last */}
      <div className="absolute left-[12.5%] right-[12.5%] top-5 h-0.5 bg-slate-200">
        <div
          className="h-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = i < current;
        const active = i === current;

        return (
          <div key={step.key} className="relative flex flex-col items-center gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                done
                  ? "border-cyan-400 bg-cyan-400 text-[#0a1f44]"
                  : active
                  ? "border-[#0a1f44] bg-[#0a1f44] text-cyan-300 ring-4 ring-cyan-400/30"
                  : "border-slate-200 bg-white text-slate-400"
              }`}
            >
              <Icon size={18} />
            </div>
            <div>
              <p
                className={`text-xs font-bold ${
                  done || active ? "text-[#0a1f44]" : "text-slate-400"
                }`}
              >
                {step.label}
              </p>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                {active ? step.hint : ""}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderTracking({ onBackToStore }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMessage("");
    setSearched(true);

    try {
      const response = await fetch(
        `${API_URL}/api/orders/lookup?query=${encodeURIComponent(searchQuery.trim())}`
      );
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        setErrorMessage(
          data.message ||
            "No order found. Check the order ID or phone number and try again."
        );
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setOrders([]);
      setErrorMessage("Can't reach the server right now. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // pt-24 keeps the page clear of the fixed navbar; raise or lower it to match your navbar height
    <div className="min-h-screen bg-slate-50 px-4 pb-16 pt-24 font-sans text-slate-900 md:pt-28">
      <div className="mx-auto max-w-3xl space-y-6">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-cyan-600"
        >
          <ArrowLeft size={16} />
          Back to store
        </button>

        {/* Search panel */}
        <section className="overflow-hidden rounded-2xl bg-[#0a1f44] p-6 shadow-lg md:p-10">
          <h1 className="text-2xl font-black text-white md:text-3xl">Track your order</h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-300">
            Enter the order ID from your confirmation (like RM-704525) or the phone
            number you used at checkout.
          </p>

          <form onSubmit={handleTrackOrder} className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                required
                placeholder="Order ID or phone number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-transparent bg-white py-3.5 pl-11 pr-4 text-sm text-[#0a1f44] placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-7 py-3.5 text-sm font-bold text-[#0a1f44] transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-200"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Searching
                </>
              ) : (
                "Track order"
              )}
            </button>
          </form>
        </section>

        {/* Results */}
        {searched && !loading && (
          <div className="space-y-5">
            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            {orders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Order header */}
                <header className="flex flex-col gap-1 border-b border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Order ID</p>
                    <h2 className="font-mono text-lg font-bold text-[#0a1f44]">
                      {order.orderNumber}
                    </h2>
                  </div>
                  <div className="text-sm text-slate-600 sm:text-right">
                    <p>
                      Placed{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="font-semibold text-[#0a1f44]">
                      {order.paymentMethod === "cod" ? "Cash on delivery" : "Bank deposit"}
                    </p>
                  </div>
                </header>

                {/* Status */}
                <div className="px-6 py-8">
                  <StatusTimeline status={order.status || "Confirmed"} />
                </div>

                {/* Delivery + items */}
                <div className="grid gap-6 border-t border-slate-100 px-6 py-6 md:grid-cols-2">
                  <div className="space-y-3 text-sm">
                    <h3 className="font-bold text-[#0a1f44]">Delivering to</h3>
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-cyan-500" />
                      <p className="leading-snug">
                        <span className="font-semibold text-[#0a1f44]">{order.customerName}</span>
                        <br />
                        {order.address}
                        {order.apartment ? `, ${order.apartment}` : ""}
                        <br />
                        {order.city}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-600">
                      <Phone size={16} className="shrink-0 text-cyan-500" />
                      <span>{order.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <h3 className="flex items-center gap-2 font-bold text-[#0a1f44]">
                      <ShoppingBag size={16} className="text-cyan-500" />
                      Items ({order.items?.length || 0})
                    </h3>
                    <ul className="space-y-2">
                      {order.items?.map((item, i) => (
                        <li key={item.id || i} className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-md border border-slate-200 object-cover"
                            />
                          )}
                          <span className="flex-1 text-slate-700">
                            {item.name}
                            <span className="text-slate-400"> × {item.quantity}</span>
                          </span>
                          <span className="font-semibold text-[#0a1f44]">
                            Rs {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Total */}
                <footer className="flex items-baseline justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
                  <span className="text-sm font-semibold text-slate-600">Total</span>
                  <span className="text-xl font-black text-[#0a1f44]">
                    Rs {Math.round(order.grandTotal).toLocaleString()}
                  </span>
                </footer>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
