import { useState, useContext, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { BookingContext } from "../context/BookingContext";
import BookingModal from "../components/BookingModal";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";

const FloorMap = () => {
  const {
    seats,
    getSeatStatus,
    loadingSeats,
    seatsError,
    fetchBookingsByDate,
  } = useContext(BookingContext);

  const { user } = useContext(AuthContext);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const preselectedDate = searchParams.get("date") || "";

  const [selectedDate, setSelectedDate] = useState(preselectedDate);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lockError, setLockError] = useState(null);

  // ── Auto-refresh bookings every 10 seconds ────────────────────────────────
  useEffect(() => {
    if (!selectedDate) return;

    fetchBookingsByDate(selectedDate); // fetch immediately on date change

    const interval = setInterval(() => {
      fetchBookingsByDate(selectedDate); // keep refreshing every 10s
    }, 10000);

    return () => clearInterval(interval); // cleanup on unmount
  }, [selectedDate, fetchBookingsByDate]);

  // ── Close modal ───────────────────────────────────────────────────────────
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setLockError(null);
  }, []);

  // ── Lock seat via API ─────────────────────────────────────────────────────
  const lockSeat = async (seat, slot) => {
    try {
      setLockError(null);
      console.log("📤 Locking seat:", seat.id, selectedDate, slot);
      const response = await API.post("/bookings/lock", {
        seatId: seat.id,
        date: selectedDate,
        slot,
      });
      return {
        success: true,
        message: response?.data?.message || "Seat locked successfully",
        status: response?.status,
      };
    } catch (err) {
      const msg = err.response?.data?.message || "Could not lock seat";
      // Only show banner for non-409 errors — 409 is handled inside modal
      if (err.response?.status !== 409) {
        setLockError(msg);
      }
      return {
        success: false,
        message: msg,
        status: err.response?.status,
      };
    }
  };

  // ── Handle seat click ─────────────────────────────────────────────────────
  const handleSeatClick = (seat) => {
    if (seat.type === "server") {
      alert("Server rooms cannot be booked");
      return;
    }
    if (!selectedDate) {
      alert("Please select a date first");
      return;
    }
    const status = getSeatStatus(seat.id, selectedDate);
    if (status === "booked") {
      alert("This space is already booked for the selected date");
      return;
    }
    setSelectedSeat(seat);
    setIsModalOpen(true);
  };

  // ── Filter seats by zone ──────────────────────────────────────────────────
  const northDesks = seats.filter((s) => s.type === "desk" && s.zone === "North");
  const centerDesks = seats.filter((s) => s.type === "desk" && s.zone === "Middle");
  const southDesks = seats.filter((s) => s.type === "desk" && s.zone === "South");
  const conferenceRooms = seats.filter((s) => s.type === "conference");
  const meetingRooms = seats.filter((s) => s.type === "meeting");
  const serverRooms = seats.filter((s) => s.type === "server");

  // ── Seat color logic ──────────────────────────────────────────────────────
  const getSeatColor = (seat, status) => {
    if (seat.type === "conference") {
      return status === "booked"
        ? "bg-purple-200 border-purple-500 text-purple-700"
        : "bg-purple-100 border-purple-400 text-purple-700 hover:bg-purple-150";
    }
    if (seat.type === "meeting") {
      return status === "booked"
        ? "bg-orange-200 border-orange-500 text-orange-700"
        : "bg-orange-100 border-orange-400 text-orange-700 hover:bg-orange-150";
    }
    if (seat.type === "server") {
      return "bg-gray-300 border-gray-600 text-gray-700 cursor-not-allowed";
    }
    return status === "booked"
      ? "bg-red-200 border-red-500 text-red-700"
      : "bg-green-100 border-green-500 text-green-700 hover:bg-green-150";
  };

  // ── Render individual seat ────────────────────────────────────────────────
  const renderSeat = (seat) => {
    const status = selectedDate ? getSeatStatus(seat.id, selectedDate) : "available";
    const isDisabled = seat.type === "server" || status === "booked";
    return (
      <button
        key={seat.id}
        onClick={() => !isDisabled && handleSeatClick(seat)}
        disabled={isDisabled}
        className={`
          flex items-center justify-center
          rounded-lg border-2 font-semibold text-xs
          transition-all duration-200
          ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
          ${getSeatColor(seat, status)}
          ${seat.type === "desk" ? "w-14 h-14" : "w-16 h-16"}
        `}
        title={`${seat.label || `Seat ${seat.id}`} - ${status}`}
      >
        <span>{seat.id}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header + Date Picker */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <FiMapPin className="text-blue-600" size={28} />
              <h1 className="text-4xl font-black text-gray-900 tracking-tight text-center">
                Floor Map
              </h1>
            </div>
            <p className="text-gray-600 font-medium text-center">
              Office Desk Booking
            </p>
          </div>

          {!loadingSeats && seats.length > 0 && (
            <div className="mt-2 flex flex-col items-center">
              <label className="block text-sm font-bold text-gray-700 mb-3 text-center">
                Select Booking Date
              </label>
              <div className="relative w-full max-w-xs">
                <FiCalendar
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-semibold text-gray-700 mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* Lock error banner */}
        {lockError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <p className="text-red-700 font-semibold text-sm">{lockError}</p>
          </div>
        )}

        {/* Loading State */}
        {loadingSeats && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <p className="text-gray-700 font-semibold">Loading seats from database...</p>
          </div>
        )}

        {/* Error State */}
        {seatsError && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <p className="text-red-700 font-semibold">Error loading seats: {seatsError}</p>
          </div>
        )}

        {!loadingSeats && !seatsError && seats.length === 0 && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
            <p className="text-yellow-700 font-semibold">No seats found in database</p>
          </div>
        )}

        {/* Legend */}
        {!loadingSeats && seats.length > 0 && (
          <div className="mb-16 grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { color: "bg-green-100 border-green-500", label: "Available Desk" },
              { color: "bg-red-200 border-red-500", label: "Booked" },
              { color: "bg-purple-100 border-purple-400", label: "Conference" },
              { color: "bg-orange-100 border-orange-400", label: "Meeting Room" },
              { color: "bg-gray-300 border-gray-600", label: "Server Room" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-6 h-6 ${item.color} border-2 rounded`} />
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Floor Layout */}
        {!loadingSeats && seats.length > 0 && (
          <div className="relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
              <div className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-lg shadow-md">← WEST</div>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
              <div className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-lg shadow-md">EAST →</div>
            </div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16">
              <div
                className="bg-green-600 text-white px-4 py-6 rounded-lg font-bold text-lg shadow-md flex items-center justify-center"
                style={{ writingMode: "vertical-rl", transform: "translateX(-64px) translateY(-50%) rotate(180deg)" }}
              >SOUTH</div>
            </div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16">
              <div
                className="bg-purple-600 text-white px-4 py-6 rounded-lg font-bold text-lg shadow-md flex items-center justify-center"
                style={{ writingMode: "vertical-rl" }}
              >NORTH</div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border-4 border-gray-300 space-y-10 mx-12">
              {/* NORTH */}
              <div className="flex gap-10 items-center">
                {conferenceRooms.length > 0 && (
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="text-xs font-bold text-gray-500 uppercase">Conference Room</div>
                    {conferenceRooms.map((seat) => {
                      const status = selectedDate ? getSeatStatus(seat.id, selectedDate) : "available";
                      const isDisabled = status === "booked";
                      return (
                        <button
                          key={seat.id}
                          onClick={() => !isDisabled && handleSeatClick(seat)}
                          disabled={isDisabled}
                          className={`w-48 h-48 flex flex-col items-center justify-center rounded-xl border-2 font-bold transition-all duration-200 ${getSeatColor(seat, status)} ${isDisabled ? "cursor-not-allowed" : "hover:shadow-lg"}`}
                        >
                          <span className="text-lg">{seat.label}</span>
                          <span className="text-xs opacity-75 mt-1">{seat.capacity} people</span>
                        </button>
                      );
                    })}
                  </div>
                )}
                <div className="flex-1 flex items-center">
                  <div className="grid grid-cols-7 gap-4 w-full">
                    {northDesks.filter((s) => Number(s.id) % 2 === 0).sort((a, b) => Number(a.id) - Number(b.id)).map(renderSeat)}
                    {northDesks.filter((s) => Number(s.id) % 2 !== 0).sort((a, b) => Number(a.id) - Number(b.id)).map(renderSeat)}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 px-6 py-2 rounded-lg font-bold text-sm">WALKWAY</div>
              </div>

              {/* CENTER */}
              <div className="grid grid-cols-10 gap-4">
                {centerDesks.filter((s) => Number(s.id) % 2 === 0).sort((a, b) => Number(a.id) - Number(b.id)).map(renderSeat)}
                {centerDesks.filter((s) => Number(s.id) % 2 !== 0).sort((a, b) => Number(a.id) - Number(b.id)).map(renderSeat)}
              </div>

              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 px-6 py-2 rounded-lg font-bold text-sm">WALKWAY</div>
              </div>

              {/* SOUTH */}
              <div className="grid grid-cols-10 gap-4">
                {southDesks.filter((s) => Number(s.id) % 2 === 0).sort((a, b) => Number(a.id) - Number(b.id)).map(renderSeat)}
                {southDesks.filter((s) => Number(s.id) % 2 !== 0).sort((a, b) => Number(a.id) - Number(b.id)).map(renderSeat)}
              </div>

              <div className="text-green-600 font-bold text-sm text-center bg-green-50 py-3 px-4 rounded-lg border-2 border-green-300">
                ENTRY →
              </div>

              {/* Rooms */}
              <div className="grid grid-cols-2 gap-8 border-t pt-6">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Meeting Rooms</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {meetingRooms.map((seat) => {
                      const status = selectedDate ? getSeatStatus(seat.id, selectedDate) : "available";
                      const isDisabled = seat.type === "server" || status === "booked";
                      return (
                        <button
                          key={seat.id}
                          onClick={() => !isDisabled && handleSeatClick(seat)}
                          disabled={isDisabled}
                          className={`flex flex-col items-center justify-center rounded-lg border-2 font-semibold transition-all duration-200 p-4 w-28 h-28 ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"} ${getSeatColor(seat, status)}`}
                          title={`${seat.label} - ${status}`}
                        >
                          <span className="text-base font-bold">{seat.id}</span>
                          <span className="text-xs opacity-75 mt-1">{seat.capacity ? `${seat.capacity} ppl` : ""}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Server Rooms</h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {serverRooms.map((seat) => {
                      const status = selectedDate ? getSeatStatus(seat.id, selectedDate) : "available";
                      return (
                        <button
                          key={seat.id}
                          disabled
                          className={`flex items-center justify-center rounded-lg border-2 font-semibold text-sm transition-all duration-200 w-28 h-28 cursor-not-allowed ${getSeatColor(seat, status)}`}
                          title={`${seat.label || `Seat ${seat.id}`} - server`}
                        >
                          <span>{seat.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedDate && (
          <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-blue-600">Booking Date: </span>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        seat={selectedSeat}
        selectedDate={selectedDate}
        onLockSeat={lockSeat}
      />
    </div>
  );
};

export default FloorMap;