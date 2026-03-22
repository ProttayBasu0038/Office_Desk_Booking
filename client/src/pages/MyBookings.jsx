import React, { useState, useEffect } from "react";
import { FiClock, FiCalendar, FiTrash2 } from "react-icons/fi";
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [deletingId, setDeletingId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");
  const {
    allBookings,
    cancelBooking,
    fetchAllBookings,
    allBookingsLoading,
    allBookingsError,
    bookingLoading,
  } = useContext(BookingContext);

  // Fetch all bookings when component loads
  useEffect(() => {
    fetchAllBookings();
  }, [fetchAllBookings]);

  const todayISO = new Date().toISOString().split("T")[0];
  const upcomingBookings = allBookings.filter((b) => {
    const bookingDate = new Date(b.date).toISOString().split("T")[0];
    return bookingDate >= todayISO;
  });
  const pastBookings = allBookings.filter((b) => {
    const bookingDate = new Date(b.date).toISOString().split("T")[0];
    return bookingDate < todayISO;
  });
  const displayedBookings =
    activeTab === "upcoming" ? upcomingBookings : pastBookings;

  const handleCancelBooking = async (bookingId) => {
    setDeletingId(bookingId);
    const result = await cancelBooking(bookingId);
    
    if (result.success) {
      setDeleteMessage("Booking cancelled successfully!");
      setTimeout(() => setDeleteMessage(""), 3000);
    } else {
      setDeleteMessage(`Error: ${result.error}`);
      setTimeout(() => setDeleteMessage(""), 3000);
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            My Bookings
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage and track your workspace reservations
          </p>
        </div>

        {/* Modern Segmented Control (Tabs) */}
        <div className="flex p-1 bg-gray-100 rounded-xl">
          {["upcoming", "past"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${
                activeTab === tab
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}{" "}
              <span className="ml-1 opacity-50 text-xs">
                (
                {tab === "upcoming"
                  ? upcomingBookings.length
                  : pastBookings.length}
                )
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {allBookingsError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-700 font-semibold">
            Error: {allBookingsError}
          </p>
        </div>
      )}

      {/* Delete Success/Error Message */}
      {deleteMessage && (
        <div
          className={`mb-6 p-4 border rounded-xl ${
            deleteMessage.includes("Error")
              ? "bg-red-50 border-red-200"
              : "bg-green-50 border-green-200"
          }`}
        >
          <p
            className={
              deleteMessage.includes("Error")
                ? "text-red-700 font-semibold"
                : "text-green-700 font-semibold"
            }
          >
            {deleteMessage}
          </p>
        </div>
      )}

      {/* Booking Cards Grid */}
      <div className="grid gap-4">
        {allBookingsLoading && allBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-400 font-semibold tracking-wide">
              Loading bookings...
            </p>
          </div>
        ) : displayedBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="text-4xl mb-4">🗓️</div>
            <p className="text-gray-400 font-semibold tracking-wide">
              No {activeTab} bookings found.
            </p>
          </div>
        ) : (
          displayedBookings.map((booking) => (
            <div
              key={booking._id}
              className="group flex flex-wrap md:flex-nowrap justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Left Side: Seat Information */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-blue-100">
                    <span className="text-[10px] uppercase font-bold opacity-80">
                      Seat
                    </span>
                    <span className="text-xl font-black">{booking.seatId}</span>
                  </div>
                  {activeTab === "upcoming" && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    Floor 1 • Main Zone
                  </h3>
                  <div className="flex flex-wrap gap-y-1 gap-x-4 mt-2">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      <FiCalendar className="text-blue-500" />
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      <FiClock className="text-blue-500" />
                      {booking.slot}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Actions & Status */}
              <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0">
                <div className="flex flex-col items-end">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                      activeTab === "upcoming"
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {activeTab === "upcoming" ? "Confirmed" : "Completed"}
                  </span>
                </div>

                {activeTab === "upcoming" && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    disabled={deletingId === booking._id || bookingLoading}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cancel Booking"
                  >
                    {deletingId === booking._id ? (
                      <div className="animate-spin">⟳</div>
                    ) : (
                      <FiTrash2 size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyBookings;
