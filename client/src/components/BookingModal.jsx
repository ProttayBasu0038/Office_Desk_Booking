import { FiX, FiCalendar, FiClock } from "react-icons/fi";
import { BookingContext } from "../context/BookingContext";
import { useContext, useState, useEffect, useRef } from "react";
import API from "../api/api";
 
const BookingModal = ({ isOpen, onClose, seat, selectedDate, onLockSeat }) => {
  const { confirmBooking, bookingLoading, bookingError } = useContext(BookingContext);
  const [slot, setSlot] = useState("full-day");
  const [error, setError] = useState(null);
  const [locking, setLocking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [myLockedSeat, setMyLockedSeat] = useState(null);
  const [seatJustBooked, setSeatJustBooked] = useState(false); // ✅ new state
 
  // ✅ Prevents double lock from React StrictMode
  const lockAttempted = useRef(false);
 
  const slots = [
    { id: "full-day",  label: "Full Day",  time: "09:00 AM - 06:00 PM", icon: "☀️" },
    { id: "morning",   label: "Morning",   time: "09:00 AM - 01:00 PM", icon: "🌅" },
    { id: "afternoon", label: "Afternoon", time: "02:00 PM - 06:00 PM", icon: "🌇" },
  ];
 
  // ── Reset + unlock when modal closes ─────────────────────────────────────
  useEffect(() => {
    if (!isOpen) {
      lockAttempted.current = false;
 
      // Unlock seat if user closes without booking
      if (myLockedSeat && seat) {
        API.post("/bookings/unlock", {
          seatId: seat.id,
          date: selectedDate,
          slot: myLockedSeat.slot,
        }).catch((err) => console.error("Unlock on close failed:", err.message));
      }
 
      // Reset all state
      setSlot("full-day");
      setError(null);
      setLocking(false);
      setTimeLeft(null);
      setMyLockedSeat(null);
      setSeatJustBooked(false);
    }
  }, [isOpen]);
 
  // ── Lock seat when modal opens ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen || !seat) return;
    if (lockAttempted.current) return; // ✅ skip StrictMode second call
    lockAttempted.current = true;
 
    const doLock = async () => {
      setLocking(true);
      setError(null);
 
      const result = await onLockSeat(seat, "full-day");
      console.log("📥 Lock result:", result);
 
      if (!result.success) {
        // ✅ User B — lock failed (seat locked by someone else)
        setMyLockedSeat(null);
        setTimeLeft(null);
        setError("This seat is temporarily locked by another user. Try again shortly.");
      } else {
        // ✅ User A — lock succeeded
        setMyLockedSeat({ seatId: seat.id, slot: "full-day" });
        setTimeLeft(120);
      }
      setLocking(false);
    };
 
    doLock();
  }, [isOpen, seat]);
 
  // ── Poll every 10 seconds to check if seat got booked by someone else ─────
  useEffect(() => {
    if (!isOpen || !seat || !selectedDate) return;
 
    const interval = setInterval(async () => {
      try {
        const res = await API.get(`/bookings/${selectedDate}`);
        const bookings = res.data;
 
        // Check if seat is booked for current slot
        const isBooked = bookings.some((b) => {
          const slotConflict =
            b.slot === slot ||
            b.slot === "full-day" ||
            slot === "full-day";
          return b.seatId === seat.id && slotConflict;
        });
 
        if (isBooked && !myLockedSeat) {
          // ✅ Seat was booked by someone else while User B was waiting
          setSeatJustBooked(true);
          setError(null);
          setTimeLeft(null);
        }
      } catch (err) {
        console.error("Booking check failed:", err.message);
      }
    }, 10000); // check every 10 seconds
 
    return () => clearInterval(interval);
  }, [isOpen, seat, selectedDate, slot, myLockedSeat]);
 
  // ── Re-lock when slot changes ─────────────────────────────────────────────
  const handleSlotChange = async (newSlot) => {
    if (newSlot === slot || locking) return;
 
    // Unlock previous slot first
    if (myLockedSeat) {
      try {
        await API.post("/bookings/unlock", {
          seatId: seat.id,
          date: selectedDate,
          slot: myLockedSeat.slot,
        });
      } catch (err) {
        console.error("Unlock failed:", err.message);
      }
      setMyLockedSeat(null);
    }
 
    setSlot(newSlot);
    setError(null);
    setSeatJustBooked(false);
    setLocking(true);
 
    const result = await onLockSeat(seat, newSlot);
    if (!result.success) {
      setError("This slot is temporarily locked by another user. Try again shortly.");
      setMyLockedSeat(null);
    } else {
      setMyLockedSeat({ seatId: seat.id, slot: newSlot });
      setTimeLeft(120);
    }
    setLocking(false);
  };
 
  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      setError("Your seat lock has expired. Please close and try again.");
      setMyLockedSeat(null);
      setTimeLeft(null);
      return;
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);
 
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };
 
  // ── Submit booking ────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
 
    if (!myLockedSeat) {
      setError("Seat lock expired. Please close and try again.");
      return;
    }
 
    const result = await confirmBooking(seat._id, seat.id, selectedDate, slot);
 
    if (result.success) {
      setTimeLeft(null);
      setMyLockedSeat(null);
      setSlot("full-day");
      onClose();
    } else {
      setError(result.error);
    }
  };
 
  if (!isOpen || !seat) return null;
 
  const isLocked = !!myLockedSeat;
 
  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop */}
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
          <div className="space-y-6 flex-1">
 
            {/* ❌ Seat just got booked by someone else */}
            {seatJustBooked && (
              <div className="bg-red-50 border border-red-300 p-4 rounded-lg flex items-center gap-3">
                <span className="text-xl">❌</span>
                <div>
                  <p className="text-sm font-bold text-red-800">
                    Seat no longer available
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    This seat was just booked by another user. Please close and choose a different seat.
                  </p>
                </div>
              </div>
            )}
 
            {/* 🔒 Locked by someone else — User B */}
            {!isLocked && !locking && !seatJustBooked && error?.includes("temporarily locked") && (
              <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg flex items-center gap-3">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="text-sm font-bold text-yellow-800">
                    Seat temporarily locked
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Another user is reserving this seat. It will be available within 2 minutes.
                  </p>
                </div>
              </div>
            )}
 
            {/* 🔴 Other errors */}
            {error && !error?.includes("temporarily locked") && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-700">{error}</p>
              </div>
            )}
 
            {/* 🔴 Booking context errors */}
            {bookingError && !error && !seatJustBooked && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-red-700">{bookingError}</p>
              </div>
            )}
 
            {/* Locking spinner */}
            {locking && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-semibold text-blue-700">Locking seat for you...</p>
              </div>
            )}
 
            {/* 🟢 Countdown Timer — User A */}
            {isLocked && timeLeft !== null && (
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                timeLeft <= 30 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"
              }`}>
                <FiClock size={18} className={timeLeft <= 30 ? "text-red-500" : "text-green-500"} />
                <div>
                  <p className={`text-sm font-bold ${timeLeft <= 30 ? "text-red-700" : "text-green-700"}`}>
                    Seat reserved for you!
                  </p>
                  <p className={`text-xs ${timeLeft <= 30 ? "text-red-500" : "text-green-500"}`}>
                    Complete booking in <strong>{formatTime(timeLeft)}</strong>
                    {timeLeft <= 30 && " — expiring soon!"}
                  </p>
                </div>
              </div>
            )}
 
            {/* Selected Date */}
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
                    weekday: "long", month: "long", day: "numeric", year: "numeric",
                  })}
                </p>
              </div>
            </div>
 
            {/* Slot Selection */}
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">
                Select Time Slot
              </label>
              <div className="space-y-3">
                {slots.map((s) => (
                  <label
                    key={s.id}
                    onClick={() => !locking && !seatJustBooked && handleSlotChange(s.id)}
                    className={`
                      relative flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
                      ${slot === s.id
                        ? "border-blue-600 bg-blue-50/30 shadow-sm"
                        : "border-gray-100 hover:border-gray-200 bg-white"
                      }
                      ${locking || seatJustBooked ? "opacity-50 pointer-events-none" : ""}
                    `}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s.id}
                      checked={slot === s.id}
                      onChange={() => {}}
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{s.icon}</span>
                      <div>
                        <p className={`font-bold ${slot === s.id ? "text-blue-700" : "text-gray-700"}`}>
                          {s.label}
                        </p>
                        <p className="text-xs text-gray-400 font-medium">{s.time}</p>
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
 
          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-100 mt-auto">
            <button
              type="submit"
              disabled={bookingLoading || locking || !isLocked || seatJustBooked}
              className={`w-full py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                bookingLoading || locking || !isLocked || seatJustBooked
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                  : "bg-gray-900 hover:bg-black text-white"
              }`}
            >
              {locking
                ? "Locking seat..."
                : bookingLoading
                ? "Confirming..."
                : seatJustBooked
                ? "❌ Seat no longer available"
                : !isLocked && error?.includes("temporarily locked")
                ? "🔒 Locked by another user"
                : !isLocked
                ? "Seat unavailable"
                : "Confirm Reservation"}
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
 
