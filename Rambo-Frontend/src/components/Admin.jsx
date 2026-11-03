import React, { useState, useEffect } from "react";
import { ShieldCheck, Package, ShoppingBag, BarChart3, RefreshCw } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState("analytics");
  
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalOrders: 0, lowStockCount: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Set default passcode key matching backend .env
  const OWNER_KEY = "M.NawazIndustry:RAMBO123";

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === OWNER_KEY) {
      setIsAuthenticated(true);
    } else {
      alert("Invalid Owner Passcode");
    }
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Analytics
      const resAnalytics = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: { "x-admin-key": OWNER_KEY }
      });
      const dataAnalytics = await resAnalytics.json();
      setAnalytics(dataAnalytics);

      // 2. Fetch Orders
      const resOrders = await fetch("http://localhost:5000/api/orders");
      const dataOrders = await resOrders.json();
      
      // Extract array safely from multiple response formats
      const orderList = Array.isArray(dataOrders)
        ? dataOrders
        : dataOrders.orders || dataOrders.data || [];

      setOrders(orderList);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch data upon successful login
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": OWNER_KEY
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-white">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <ShieldCheck className="mx-auto mb-2 text-amber-400" size={48} />
            <h2 className="text-2xl font-bold">Owner Access Only</h2>
            <p className="text-sm text-slate-400">Enter secret passcode to access Rambo Admin</p>
          </div>
          <input
            type="password"
            placeholder="Owner Security Key"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button type="submit" className="mt-4 w-full rounded-xl bg-amber-400 py-3 font-bold text-slate-900 hover:bg-amber-300">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 dark:bg-[#070b19] dark:text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase tracking-wider">Rambo Admin Portal</h1>
          <button onClick={fetchAdminData} className="flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold dark:bg-slate-800">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex gap-4 border-b border-slate-300 pb-4 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
              activeTab === "analytics" ? "bg-[#173b68] text-white" : "text-slate-500"
            }`}
          >
            <BarChart3 size={18} /> Analytics
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold ${
              activeTab === "orders" ? "bg-[#173b68] text-white" : "text-slate-500"
            }`}
          >
            <ShoppingBag size={18} /> Orders ({orders.length})
          </button>
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-400">Total Revenue</h3>
              <p className="mt-2 text-3xl font-extrabold text-emerald-500">Rs. {analytics.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-400">Total Orders</h3>
              <p className="mt-2 text-3xl font-extrabold text-[#173b68] dark:text-amber-400">{analytics.totalOrders || 0}</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-400">Low Stock Items</h3>
              <p className="mt-2 text-3xl font-extrabold text-rose-500">{analytics.lowStockCount || 0}</p>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="overflow-x-auto rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
            <h3 className="mb-4 text-lg font-bold">Manage Customer Orders</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 dark:border-slate-700">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Phone</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {orders.map((ord) => (
                  <tr key={ord._id}>
                    <td className="py-3 font-mono font-bold text-amber-500">{ord.orderNumber || ord._id?.slice(-6)}</td>
                    <td className="py-3">{ord.customerName}</td>
                    <td className="py-3">{ord.phone}</td>
                    <td className="py-3 font-bold">Rs. {ord.grandTotal}</td>
                    <td className="py-3">
                      <select
                        value={ord.status || "Confirmed"}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-semibold dark:border-slate-700 dark:bg-slate-900"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}