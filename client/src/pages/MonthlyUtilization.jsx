import { fetchMonthlyUtilization } from "../api/adminapi";
import { useState } from "react";
import { FiLogOut, FiCalendar, FiTrendingUp, FiUsers, FiGrid } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
 
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
 
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
 
// ─── Custom Tooltip ───────────────────────────────────────────────────────────
 
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="font-bold text-white">
              {entry.value}{entry.name === "Utilization %" ? "%" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};
 
// ─── Stat Card ────────────────────────────────────────────────────────────────
 
function StatCard({ label, value, icon: Icon, accent, sublabel }) {
  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-hidden group hover:border-gray-600 transition-all duration-300">
      {/* Subtle glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl ${accent || "bg-blue-500"}`} />
 
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent ? `bg-opacity-10 ${accent}` : "bg-blue-500 bg-opacity-10"}`}>
          <Icon className={`text-lg ${accent ? "text-current" : "text-blue-400"}`} style={{ color: accent }} />
        </div>
      </div>
 
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
      {sublabel && <p className="text-xs text-gray-600 mt-0.5">{sublabel}</p>}
    </div>
  );
}
 
// ─── Main Page ────────────────────────────────────────────────────────────────
 
export default function MonthlyUtilization() {
 
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
 
  const fetchData = async () => {
    if (!year) {
      setError("Please select a year");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetchMonthlyUtilization(Number(year), month ? Number(month) : "");
      const formatted = res.data.map((d) => ({
        ...d,
        monthName: MONTHS[d.month - 1],
      }));
      setData(formatted);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="min-h-screen bg-gray-950 p-8">
 
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
            Admin Dashboard
          </p>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Monthly Utilization
          </h1>
        </div>
 
        <div className="flex items-center gap-4">
          {/* User info */}
          <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl px-4 py-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-500 bg-opacity-20 overflow-hidden shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "Admin"}`}
                alt="avatar"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{user?.email}</p>
            </div>
          </div>
 
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-400 hover:text-red-300 bg-gray-900 border border-gray-800 hover:border-red-900 rounded-2xl transition-all duration-200"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
 
      {/* ── Filters ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
          Filters
        </p>
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 w-36 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="2026"
            />
          </div>
 
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              Month <span className="text-gray-600 font-normal">(optional)</span>
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">All Months</option>
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
 
          <div className="flex items-end">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 text-sm"
            >
              <FiCalendar className="text-sm" />
              {loading ? "Loading…" : "Apply Filter"}
            </button>
          </div>
        </div>
      </div>
 
      {/* ── Error ── */}
      {error && (
        <div className="mb-6 p-4 bg-red-950 border border-red-900 rounded-xl text-red-400 text-sm flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
          {error}
        </div>
      )}
 
      {/* ── Stat Cards ── */}
      {data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total Bookings"
              value={data.reduce((sum, d) => sum + d.totalBookings, 0)}
              icon={FiCalendar}
              accent="#3b82f6"
            />
            <StatCard
              label="Avg Utilization"
              value={`${(data.reduce((sum, d) => sum + d.utilizationPercent, 0) / data.length).toFixed(2)}%`}
              icon={FiTrendingUp}
              accent="#10b981"
            />
            <StatCard
              label="Unique Users"
              value={data.reduce((sum, d) => sum + d.uniqueUsers, 0)}
              icon={FiUsers}
              accent="#8b5cf6"
            />
            <StatCard
              label="Unique Seats Used"
              value={data.reduce((sum, d) => sum + d.uniqueSeats, 0)}
              icon={FiGrid}
              accent="#f59e0b"
            />
          </div>
 
          {/* ── Bookings by Slot Chart ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-white">Monthly Bookings by Slot</h2>
              <p className="text-xs text-gray-500 mt-0.5">Morning, afternoon and full-day breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#9ca3af", paddingTop: "16px" }}
                />
                <Bar dataKey="morningCount"   name="Morning"   fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={40} />
                <Bar dataKey="afternoonCount" name="Afternoon" fill="#8b5cf6" radius={[4,4,0,0]} maxBarSize={40} />
                <Bar dataKey="fullDayCount"   name="Full Day"  fill="#10b981" radius={[4,4,0,0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
 
          {/* ── Utilization % Chart ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-base font-bold text-white">Utilization % per Month</h2>
              <p className="text-xs text-gray-500 mt-0.5">Percentage of total seat capacity used</p>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar
                  dataKey="utilizationPercent"
                  name="Utilization %"
                  fill="#3b82f6"
                  radius={[4,4,0,0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
 
      {/* ── Empty State ── */}
      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
            <FiCalendar className="text-2xl text-gray-600" />
          </div>
          <p className="text-lg font-bold text-gray-400">No data found</p>
          <p className="text-sm text-gray-600 mt-1">Select a year and click Apply Filter to load data</p>
        </div>
      )}
    </div>
  );
}