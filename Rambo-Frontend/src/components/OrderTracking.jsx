import React, { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Building2, ArrowLeft, Loader2 } from "lucide-react";

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
      const response = await fetch(`http://localhost:5000/api/orders/lookup?query=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        setErrorMessage(data.message || "No orders found.");
      }
    } catch (error) {
      console.error("Tracking error:", error);
      setErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation / Header */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Store
          </button>
          <h1 className="text-lg font-bold text-slate-900">Rambo Industry Order Tracker</h1>
          <div className="w-16" />
        </div>

        {/* Search Input Box */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-black text-slate-900">Track Your Shipment</h2>
            <p className="text-xs text-slate-500">Enter your Order ID (e.g., RM-704525) or Phone Number below.</p>
          </div>

          <form onSubmit={handleTrackOrder} className="flex gap-2 pt-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                required
                placeholder="Enter Order ID or Phone Number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-purple-600 disabled:bg-slate-400 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Track"}
            </button>
          </form>
        </div>

        {/* Results Section */}
        {searched && (
          <div className="space-y-4">
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-4 rounded-xl text-center font-semibold">
                {errorMessage}
              </div>
            )}

            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}
                    </span>
                    <h3 className="text-base font-bold font-mono text-slate-900 mt-2">
                      Order ID: {order.orderNumber}
                    </h3>
                  </div>
                  <div className="text-xs text-slate-500">
                    Placed on: {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>

                {/* Timeline Status */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 text-center">Shipping Status</h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="space-y-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <CheckCircle2 size={16} />
                      </div>
                      <p className="font-bold text-slate-800">Confirmed</p>
                    </div>
                    <div className="space-y-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 border border-purple-200 flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      <p className="font-bold text-slate-800">Processing</p>
                    </div>
                    <div className="space-y-1 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center">
                        <Truck size={16} />
                      </div>
                      <p className="font-bold text-slate-500">Dispatched</p>
                    </div>
                  </div>
                </div>

                {/* Summary & Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 uppercase text-[11px] mb-2">Delivery Destination</p>
                    <p><span className="font-semibold">Name:</span> {order.customerName}</p>
                    <p><span className="font-semibold">Address:</span> {order.address}, {order.city}</p>
                    <p><span className="font-semibold">Phone:</span> {order.phone}</p>
                  </div>
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="font-bold text-slate-800 uppercase text-[11px] mb-2">Payment Details</p>
                    <p><span className="font-semibold">Items Count:</span> {order.items?.length || 0}</p>
                    <p><span className="font-semibold">Grand Total:</span> Rs {Math.round(order.grandTotal).toLocaleString()}</p>
                    <p><span className="font-semibold">Status:</span> <span className="text-amber-600 font-bold">Pending Fulfillment</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}