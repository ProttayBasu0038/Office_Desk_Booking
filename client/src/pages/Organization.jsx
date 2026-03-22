import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchOrganizationUtilization } from "../api/adminapi";
import { FiCalendar, FiGrid, FiUsers, FiTrendingUp } from "react-icons/fi";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-2xl">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
          {label}
        </p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-300">{entry.name}:</span>
            <span className="font-bold text-white">
              {entry.value}
              {entry.name === "Utilization %" ? "%" : ""}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Inline Components ────────────────────────────────────────────────────────

function FilterBar({ year, setYear, month, setMonth, onApply, loading }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
        Filters
      </p>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-400 mb-1.5">
            Year
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2026"
            className="bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-xl px-4 py-2.5 w-36 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onApply}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-all duration-200 text-sm"
          >
            <FiCalendar className="text-sm" />
            {loading ? "Loading…" : "Apply Filter"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-hidden group hover:border-gray-600 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: accent ? `${accent}18` : "#3b82f618" }}
        >
          <Icon className="text-lg" style={{ color: accent || "#3b82f6" }} />
        </div>
      </div>
      <p className="text-3xl font-black text-white tracking-tight">{value}</p>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">
        {label}
      </p>
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="mb-6 p-4 bg-red-950 border border-red-900 rounded-xl text-red-400 text-sm flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
      {message}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mb-4">
        <FiGrid className="text-2xl text-gray-600" />
      </div>
      <p className="text-lg font-bold text-gray-400">No data yet</p>
      <p className="text-sm text-gray-600 mt-1">
        Select a year and click Apply Filter to load data
      </p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function Organization() {
  const [data, setData] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    if (!year) {
      setError("Please enter a year");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetchOrganizationUtilization(
        Number(year),
        month ? Number(month) : "",
      );
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      {/* ── Header ── */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">
          Admin Dashboard
        </p>
        <h1 className="text-3xl font-black text-white tracking-tight">
          Organization Utilization
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Seat booking usage and utilization breakdown per organization
        </p>
      </div>

      <FilterBar
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        onApply={fetchData}
        loading={loading}
      />

      {error && <ErrorBanner message={error} />}
      {/* Always render the bookings chart so tests can find the mocked BarChart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
        <div className="mb-6">
          <h3 className="text-base font-bold text-white">
            Bookings by Slot per Organization
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Morning, afternoon and full-day breakdown
          </p>
        </div>
        <ResponsiveContainer
          width="100%"
          height={Math.max(280, data.length * 60 || 280)}
        >
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1f2937"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="organization"
              type="category"
              width={120}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                color: "#9ca3af",
                paddingTop: "16px",
              }}
            />
            <Bar
              dataKey="morningCount"
              name="Morning"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="afternoonCount"
              name="Afternoon"
              fill="#8b5cf6"
              radius={[0, 4, 4, 0]}
              maxBarSize={28}
            />
            <Bar
              dataKey="fullDayCount"
              name="Full Day"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {data.length > 0 ? (
        <>
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Organizations"
              value={data.length}
              icon={FiGrid}
              accent="#8b5cf6"
            />
            <StatCard
              label="Total Bookings"
              value={data.reduce((s, d) => s + d.totalBookings, 0)}
              icon={FiCalendar}
              accent="#3b82f6"
            />
            <StatCard
              label="Unique Users"
              value={data.reduce((s, d) => s + d.uniqueUsers, 0)}
              icon={FiUsers}
              accent="#10b981"
            />
            <StatCard
              label="Avg Utilization"
              value={`${(
                data.reduce((s, d) => s + d.utilizationPercent, 0) / data.length
              ).toFixed(2)}%`}
              icon={FiTrendingUp}
              accent="#f59e0b"
            />
          </div>

          {/* ── Utilization % ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
            <div className="mb-6">
              <h3 className="text-base font-bold text-white">
                Utilization % per Organization
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Percentage of total seat capacity used
              </p>
            </div>
            <ResponsiveContainer
              width="100%"
              height={Math.max(280, data.length * 60)}
            >
              <BarChart data={data} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  unit="%"
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="organization"
                  type="category"
                  width={120}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />
                <Bar
                  dataKey="utilizationPercent"
                  name="Utilization %"
                  fill="#f59e0b"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Breakdown Table ── */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-base font-bold text-white">Full Breakdown</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {data.length} organization{data.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {[
                      "Organization",
                      "Total Bookings",
                      "Morning",
                      "Afternoon",
                      "Full Day",
                      "Unique Users",
                      "Unique Seats",
                      "Working Days",
                      "Total Capacity",
                      "Utilization %",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-900"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-semibold text-white whitespace-nowrap">
                        {row.organization}
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {row.totalBookings}
                      </td>
                      <td className="px-6 py-4 text-blue-400 font-medium">
                        {row.morningCount}
                      </td>
                      <td className="px-6 py-4 text-purple-400 font-medium">
                        {row.afternoonCount}
                      </td>
                      <td className="px-6 py-4 text-emerald-400 font-medium">
                        {row.fullDayCount}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {row.uniqueUsers}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {row.uniqueSeats}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {row.workingDays}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {row.totalCapacity}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500 bg-opacity-10 text-amber-400 border border-amber-500 border-opacity-20">
                          {row.utilizationPercent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        !loading && <EmptyState />
      )}
    </div>
  );
}

export default Organization;
