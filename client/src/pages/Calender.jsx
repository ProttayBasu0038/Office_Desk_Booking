import { useState, useEffect } from "react";
import { FiCalendar, FiUser } from "react-icons/fi";
import { useContext } from "react";
import { BookingContext } from "../context/BookingContext";
import { AuthContext } from "../context/AuthContext";

const Calendar = () => {
  const { bookings, fetchBookingsByDate, bookingLoading, bookingError } =
    useContext(BookingContext);
  const { user } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch bookings when date is selected
  useEffect(() => {
    if (selectedDate) {
      fetchBookingsByDate(selectedDate);
    }
  }, [selectedDate, fetchBookingsByDate]);

  // Filter bookings for selected date
  const bookingsForDate = bookings.filter((b) => {
    const bookingDate = new Date(b.date).toISOString().split("T")[0];
    return bookingDate === selectedDate;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Check if booking belongs to current user
  const isCurrentUserBooking = (booking) => {
    return booking.user?._id === user?._id;
  };

  // Loading state
  if (bookingLoading && selectedDate && bookingsForDate.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FiCalendar className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  Daily Bookings
                </h1>
                <p className="text-gray-600 font-medium mt-1">
                  View all office seat reservations for the selected day
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-600 rounded-xl">
              <FiCalendar className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                Daily Bookings
              </h1>
              <p className="text-gray-600 font-medium mt-1">
                View all office seat reservations for the selected day
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Date Picker Section */}
          <div className="p-8 border-b border-gray-100 bg-linear-to-r from-blue-50/50 to-transparent">
            <label className="block text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">
              📅 Select Date
            </label>
            <div className="relative">
              <FiCalendar
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-semibold text-gray-700 bg-white transition-all duration-300"
              />
            </div>
            {selectedDate && (
              <p className="mt-3 text-sm font-semibold text-gray-600">
                Viewing bookings for:{" "}
                <span className="text-blue-600">
                  {formatDate(selectedDate)}
                </span>
              </p>
            )}
          </div>

          {/* Bookings List Section */}
          <div className="p-8">
            {bookingError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700 font-semibold">
                  Error: {bookingError}
                </p>
              </div>
            )}
            {!selectedDate ? (
              <div className="text-center py-16 px-6">
                <div className="mb-4 text-5xl">📅</div>
                <p className="text-gray-500 font-medium">
                  Select a date to view all bookings
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Choose any date from the calendar above
                </p>
              </div>
            ) : bookingsForDate.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="mb-4 text-5xl">✨</div>
                <p className="text-gray-500 font-medium">
                  No bookings for this date
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  All seats are available
                </p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    All Bookings
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {bookingsForDate.length}{" "}
                    {bookingsForDate.length === 1 ? "Booking" : "Bookings"}
                  </span>
                </div>

                <div className="space-y-3">
                  {bookingsForDate.map((booking) => (
                    <div
                      key={booking._id}
                      className={`group p-5 rounded-xl border-2 transition-all duration-300 flex justify-between items-center transform ${
                        isCurrentUserBooking(booking)
                          ? "bg-blue-50 border-blue-200 hover:border-blue-300 hover:shadow-md"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="h-12 w-12 rounded-lg flex items-center justify-center font-bold text-lg transition-all bg-blue-100 text-blue-700">
                          {booking.seatId}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-gray-900">
                              Seat {booking.seatId}
                            </p>
                            {isCurrentUserBooking(booking) && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                Your Booking
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center gap-1.5">
                              <FiUser size={14} className="text-gray-400" />
                              <p className="text-sm font-semibold text-gray-700">
                                {booking.user?.name || "Unknown"}
                              </p>
                            </div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              {booking.slot.replace("-", " - ")}
                            </p>
                            <div className="w-1 h-1 bg-gray-300 rounded-full" />
                            <p className="text-xs text-gray-500">
                              {booking.user?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-xs font-semibold text-blue-700">
                    💡 Tip: View all bookings for the selected day, including
                    details about who booked each seat
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Calendar;
