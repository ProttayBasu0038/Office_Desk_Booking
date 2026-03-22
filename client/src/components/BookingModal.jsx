import React from "react";
import { FiX, FiCalendar } from "react-icons/fi";
import { BookingContext } from "../context/BookingContext";
import { useContext } from "react";
import { useState } from "react";

const BookingModal = ({ isOpen, onClose, seat, selectedDate }) => {
  const { confirmBooking, bookingLoading, bookingError } =
    useContext(BookingContext);
  const [slot, setSlot] = useState("full-day");
  const [error, setError] = useState(null);

  if (!isOpen || !seat) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Pass both the MongoDB ObjectId (_id) and the seatId
    const result = await confirmBooking(seat._id, seat.id, selectedDate, slot);

    if (result.success) {
      onClose();
      setSlot("full-day");
    } else {
      setError(result.error);
    }
  };

  const slots = [
    {
      id: "full-day",
      label: "Full Day",
      time: "09:00 AM - 06:00 PM",
      icon: "☀️",
    },
    {
      id: "morning",
      label: "Morning",
      time: "09:00 AM - 01:00 PM",
      icon: "🌅",
    },
    {
      id: "afternoon",
      label: "Afternoon",
      time: "02:00 PM - 06:00 PM",
      icon: "🌇",
    },
  ];

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop: Darker with more blur for focus */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              Confirm Reservation
            </h2>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">
              Seat {seat.id} • Floor 1
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-8">
          <div className="space-y-8 flex-1">
            {/* Error Message */}
            {(error || bookingError) && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-700">
                  {error || bookingError}
                </p>
              </div>
            )}
            {/* Selected Date Read-only Display */}
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center gap-4">
              <div className="bg-blue-600 text-white p-3 rounded-xl shadow-md shadow-blue-200">
                <FiCalendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest leading-none mb-1">
                  Booking Date
                </p>
                <p className="text-sm font-bold text-blue-900">
                  {new Date(selectedDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Visual Slot Selection */}
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
                Select Time Slot
              </label>
              <div className="space-y-3">
                {slots.map((s) => (
                  <label
                    key={s.id}
                    className={`
                      relative flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                      ${
                        slot === s.id
                          ? "border-blue-600 bg-blue-50/30 shadow-sm"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s.id}
                      checked={slot === s.id}
                      onChange={(e) => setSlot(e.target.value)}
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <p
                          className={`font-bold ${slot === s.id ? "text-blue-700" : "text-gray-700"}`}
                        >
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">
                          {s.time}
                        </p>
                      </div>
                    </div>
                    {slot === s.id && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button Area */}
          <div className="pt-6 border-t border-gray-100 mt-auto">
            <button
              type="submit"
              disabled={bookingLoading}
              className={`w-full py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                bookingLoading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black text-white"
              }`}
            >
              {bookingLoading ? "Confirming..." : "Confirm Reservation"}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-tighter">
              By confirming, you agree to the workspace policies.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
