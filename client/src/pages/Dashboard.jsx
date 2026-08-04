import React, { useContext, useEffect, useState } from "react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { seats, bookings, getSeatStatus, fetchAllBookings, allBookings } =
    useContext(BookingContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [calendarDate] = useState(() => new Date());

  // Formatted Date for UI
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ISO Date for comparison (YYYY-MM-DD)
  const todayISO = new Date().toISOString().split("T")[0];

  // Bookings Today - Only current user's bookings
  const bookingsToday = bookings.filter(
    (b) => b.user?._id === user?._id && b.date === todayISO,
  );

  // Load all bookings for calendar glance
  useEffect(() => {
    if (fetchAllBookings) {
      fetchAllBookings();
    }
  }, [fetchAllBookings]);

  const deskSeats = seats.filter((seat) => seat.type === "desk");
  const totalSeats = deskSeats.length || 1;
  const utilizationToday =
    totalSeats > 0 ? Math.round((bookingsToday.length / totalSeats) * 100) : 0;

  // Calendar helpers
  const calendarYear = calendarDate.getFullYear();
  const calendarMonth = calendarDate.getMonth(); // 0-11
  const firstOfMonth = new Date(calendarYear, calendarMonth, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  const userBookedDates = new Set(
    (allBookings || [])
      .filter((b) => b.user?._id === user?._id)
      .map((b) => new Date(b.date).toISOString().split("T")[0]),
  );

  const calendarCells = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const handleCalendarClick = (day) => {
    if (!day) return;
    const date = new Date(calendarYear, calendarMonth, day);
    const iso = date.toISOString().split("T")[0];
    navigate(`/floor-map?date=${iso}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-transparent min-h-screen">
      {/* Header: More personality with a subtle greeting color */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome back,{" "}
            <span className="text-blue-600">{user?.name || "User"} 👋</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
            <FiCalendar className="text-blue-400" /> {today}
          </p>
        </div>
        <div className="hidden md:block">
          <div className="h-12 w-12 rounded-full bg-linear-to-tr from-blue-600 to-indigo-400 shadow-lg border-2 border-white" />
        </div>
      </header>

      {/* Stats Cards: Glass-like finish and better spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {[
          {
            label: "Bookings today",
            val: bookingsToday.length,
            icon: <FiCalendar />,
            color: "blue",
          },
          {
            label: "Total seats",
            val: totalSeats,
            icon: "🛋",
            color: "green",
          },
          {
            label: "Total history",
            val: bookings.length,
            icon: <FiMapPin />,
            color: "indigo",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-5"
          >
            <div
              className={`bg-${stat.color}-50 p-4 rounded-2xl text-${stat.color}-600 text-2xl group-hover:scale-110 transition-transform`}
            >
              {stat.icon}
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 leading-none">
                {stat.val}
              </h2>
              <p className="text-gray-400 text-sm font-medium mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mini calendar glance */}
      <div className="mb-10 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-xl shadow-slate-950/60 p-5 md:p-6 text-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.25em]">
              Calendar glance
            </p>
            <p className="text-sm text-slate-100 font-medium">
              Click a day to open Floor Map for that date
            </p>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700/80">
            <FiCalendar className="text-blue-300" />
            <span className="font-medium">
              {calendarDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-[11px] text-slate-400 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <div key={d} className="text-center font-semibold tracking-wide">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-xs">
          {calendarCells.map((day, idx) => {
            if (!day) {
              return <div key={idx} />;
            }
            const date = new Date(calendarYear, calendarMonth, day);
            const iso = date.toISOString().split("T")[0];
            const hasBooking = userBookedDates.has(iso);
            const isToday = iso === todayISO;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleCalendarClick(day)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-2xl border text-xs transition
                  ${
                    isToday
                      ? "border-blue-400 text-blue-100 bg-blue-500/20 shadow-[0_0_0_1px_rgba(59,130,246,0.6)]"
                      : "border-transparent text-slate-100 hover:bg-slate-800/80 hover:border-slate-600/70"
                  }
                `}
                title={iso}
              >
                <span className="font-medium">{day}</span>
                {hasBooking && (
                  <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(15,23,42,0.9)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_2px_rgba(15,23,42,0.9)]" />
            <span>Day with at least one booking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-md border border-blue-400 bg-blue-500/20" />
            <span>Today</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Utilization + quick facts */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-700/80 p-5 shadow-xl shadow-slate-950/40">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-semibold mb-3">
            Today&apos;s utilization
          </p>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-3xl font-black text-slate-50">
                {utilizationToday}%
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Based on your bookings vs. total seats.
              </p>
            </div>
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700/70" />
              <div
                className="absolute inset-1 rounded-full bg-linear-to-tr from-blue-500 to-emerald-400 opacity-70"
                style={{
                  clipPath: `inset(${100 - utilizationToday}% 0 0 0)`,
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-300">Total seats</span>
              <span className="text-sm text-slate-200 font-medium">
                {totalSeats}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-slate-300">
                Your bookings
              </span>
              <span className="text-sm text-slate-200 font-medium">
                {bookingsToday.length} today
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900/70 border border-slate-700/70 p-4 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-200 mb-1">
            Tip for better planning
          </p>
          <p>
            Weekdays tend to fill up faster. Try reserving seats a few days
            ahead using the Floor Map to avoid last-minute rush.
          </p>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
