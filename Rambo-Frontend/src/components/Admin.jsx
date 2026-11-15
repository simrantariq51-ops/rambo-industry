import React, { useState, useEffect, useCallback } from "react";
import { ShieldCheck, ShoppingBag, BarChart3, RefreshCw, LogOut } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "rambo_admin_token";

// sessionStorage can be blocked in some browsers, so every call is guarded
const readToken = () => {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
};

const saveToken = (value) => {
  try {
    if (value) sessionStorage.setItem(TOKEN_KEY, value);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export default function Admin() {
  const [token, setToken] = useState(readToken);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState("analytics");
  const [analytics, setAnalytics] = useState({ totalRevenue: 0, totalOrders: 0, lowStockCount: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    saveToken("");
    setToken("");
    setOrders([]);
    setAnalytics({ totalRevenue: 0, totalOrders: 0, lowStockCount: 0 });
    setPassword("");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setLoginError(data.message || "Login failed. Check your email and password.");
        return;
      }

      if (data.user?.role !== "admin") {
        setLoginError("This account does not have admin access.");
        return;
      }

      saveToken(data.token);
      setToken(data.token);
      setPassword("");
    } catch (err) {
      console.error("Admin login error:", err);
      setLoginError("Can't reach the server right now. Please try again.");
    } finally {
      setLoggingIn(false);
    }
  };

  const fetchAdminData = useCallback(async () => {
    if (!token) return;
    setLoading(true);

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resAnalytics, resOrders] = await Promise.all([
        fetch(`${API_URL}/api/admin/analytics`, { headers }),
        fetch(`${API_URL}/api/orders`, { headers }),
      ]);

      const unauthorized = [resAnalytics.status, resOrders.status].some(
        (s) => s === 401 || s === 403
      );

      if (unauthorized) {
        logout();
        setLoginError("Your session expired or this account is not an admin. Please sign in again.");
        return;
      }

      const dataAnalytics = await resAnalytics.json();
      const dataOrders = await resOrders.json();

      setAnalytics(dataAnalytics);
      setOrders(
        Array.isArray(dataOrders) ? dataOrders : dataOrders.orders || dataOrders.data || []
      );
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }, [token, logout]);

  // Load data whenever a valid token is present (login or page refresh)
  useEffect(() => {
    if (token) fetchAdminData();
  }, [token, fetchAdminData]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.status === 401 || res.status === 403) {
        logout();
        setLoginError("Your session expired. Please sign in again.");
        return;
      }

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-white">
        <form onSubmit={handleLogin} className="w-full max-w-md rounded-2xl bg-slate-800 p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <ShieldCheck className="mx-auto mb-2 text-amber-400" size={48} />
            <h2 className="text-2xl font-bold">Admin sign in</h2>
            <p className="text-sm text-slate-400">Use your admin account to open the Rambo dashboard</p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-300">
              {loginError}
            </div>
          )}

          <input
            type="email"
            required
            autoComplete="username"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={loggingIn}
            className="mt-4 w-full rounded-xl bg-amber-400 py-3 font-bold text-slate-900 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {loggingIn ? "Signing in..." : "Sign in"}
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
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              className="flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold dark:bg-slate-800"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh data
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-xs font-bold dark:bg-slate-800"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
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
              <p className="mt-2 text-3xl font-extrabold text-emerald-500">
                Rs. {analytics.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-md dark:bg-slate-800">
              <h3 className="text-sm font-semibold text-slate-400">Total Orders</h3>
              <p className="mt-2 text-3xl font-extrabold text-[#173b68] dark:text-amber-400">
                {analytics.totalOrders || 0}
              </p>
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
                    <td className="py-3 font-mono font-bold text-amber-500">
                      {ord.orderNumber || ord._id?.slice(-6)}
                    </td>
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
