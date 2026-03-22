import React, { useContext } from "react";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { seats, bookings, getSeatStatus } = useContext(BookingContext);
  const { user } = useContext(AuthContext);

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

  // Available Seats Today
  const availableSeatsToday = seats.filter(
    (seat) => getSeatStatus(seat.id, todayISO) === "available",
  );

  // Upcoming Bookings (Today + Future) - Only current user's bookings
  const upcomingBookings = bookings
    .filter((b) => b.user?._id === user?._id && b.date >= todayISO)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50/50 min-h-screen">
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
            label: "Seats available",
            val: availableSeatsToday.length,
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Bookings: Clean list with a "Ticket" feel */}

        <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Upcoming Bookings
              </h2>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
                Active Reservations
              </p>
            </div>
            <button className="text-blue-600 font-bold text-sm hover:underline">
              View All
            </button>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">
                No bookings yet. Start by picking a seat!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingBookings.slice(0, 3).map((booking) => (
                <div
                  key={booking._id}
                  className="group flex justify-between items-center p-4 bg-white hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div className="bg-gray-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-inner">
                      <span className="text-xs text-gray-400 uppercase leading-none">
                        Seat
                      </span>
                      <span className="text-lg font-bold leading-none mt-1">
                        {booking.seat.seatId}
                      </span>
                    </div>

                    <div>
                      <p className="text-gray-900 font-bold">
                        Main Floor • Zone A
                      </p>
                      <p className="text-gray-500 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {booking.date} · {booking.slot}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                      Confirmed
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
