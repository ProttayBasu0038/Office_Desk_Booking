import { useState, useContext, useEffect } from "react";
import { BookingContext } from "../context/BookingContext";
import BookingModal from "../components/BookingModal";
import { FiCalendar, FiMapPin } from "react-icons/fi";

const FloorMap = () => {
  const {
    seats,
    getSeatStatus,
    loadingSeats,
    seatsError,
    fetchBookingsByDate,
  } = useContext(BookingContext);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch bookings when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchBookingsByDate(selectedDate);
    }
  }, [selectedDate, fetchBookingsByDate]);

  // Filter seats by zone
  const northDesks = seats.filter(
    (seat) => seat.type === "desk" && seat.zone === "North",
  );

  const centerDesks = seats.filter(
    (seat) => seat.type === "desk" && seat.zone === "Middle",
  );

  const southDesks = seats.filter(
    (seat) => seat.type === "desk" && seat.zone === "South",
  );

  const conferenceRooms = seats.filter((seat) => seat.type === "conference");

  const meetingRooms = seats.filter((seat) => seat.type === "meeting");

  const serverRooms = seats.filter((seat) => seat.type === "server");

  const handleSeatClick = (seat) => {
    // Allow booking for desks, meeting rooms, and conference rooms
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

    // Desk
    return status === "booked"
      ? "bg-red-200 border-red-500 text-red-700"
      : "bg-green-100 border-green-500 text-green-700 hover:bg-green-150";
  };

  const renderSeat = (seat) => {
    const status = selectedDate
      ? getSeatStatus(seat.id, selectedDate)
      : "available";

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
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <FiMapPin className="text-blue-600" size={28} />
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Floor Map
            </h1>
          </div>
          <p className="text-gray-600 font-medium">Office Desk Booking</p>
        </div>

        {/* Loading State */}
        {loadingSeats && (
          <div className="mb-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <p className="text-gray-700 font-semibold">
              Loading seats from database...
            </p>
          </div>
        )}

        {/* Error State */}
        {seatsError && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <p className="text-red-700 font-semibold">
              Error loading seats: {seatsError}
            </p>
          </div>
        )}

        {/* Disable interactions while loading */}
        {!loadingSeats && !seatsError && seats.length === 0 && (
          <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
            <p className="text-yellow-700 font-semibold">
              No seats found in database
            </p>
          </div>
        )}

        {/* Date Picker */}
        {!loadingSeats && seats.length > 0 && (
          <div className="mb-10">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Select Booking Date
            </label>
            <div className="relative max-w-xs">
              <FiCalendar
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]} 
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-semibold text-gray-700"
              />
            </div>
          </div>
        )}

        {/* Legend */}
        {!loadingSeats && seats.length > 0 && (
          <div className="mb-16 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded" />
              <span className="text-sm font-semibold text-gray-700">
                Available Desk
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-200 border-2 border-red-500 rounded" />
              <span className="text-sm font-semibold text-gray-700">
                Booked
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-100 border-2 border-purple-400 rounded" />
              <span className="text-sm font-semibold text-gray-700">
                Conference
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-100 border-2 border-orange-400 rounded" />
              <span className="text-sm font-semibold text-gray-700">
                Meeting Room
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 border-2 border-gray-600 rounded" />
              <span className="text-sm font-semibold text-gray-700">
                Server Room
              </span>
            </div>
          </div>
        )}

        {/* Desks by Zone with Directions */}
        {/* FLOOR LAYOUT WITH CARDINAL DIRECTIONS */}
        {!loadingSeats && seats.length > 0 && (
          <div className="relative">
            {/* WEST Label - Top */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
              <div className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-lg shadow-md">
                ← WEST
              </div>
            </div>

            {/* EAST Label - Bottom */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8">
              <div className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-lg shadow-md">
                EAST →
              </div>
            </div>

            {/* SOUTH Label - Left */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-16">
              <div
                className="bg-green-600 text-white px-4 py-6 rounded-lg font-bold text-lg shadow-md rotate-180 flex items-center justify-center"
                style={{
                  writingMode: "vertical-rl",
                  transform:
                    "translateX(-64px) translateY(-50%) rotate(180deg)",
                }}
              >
                SOUTH
              </div>
            </div>

            {/* NORTH Label - Right */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-16">
              <div
                className="bg-purple-600 text-white px-4 py-6 rounded-lg font-bold text-lg shadow-md flex items-center justify-center"
                style={{ writingMode: "vertical-rl" }}
              >
                NORTH
              </div>
            </div>

            {/* FLOOR LAYOUT */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-4 border-gray-300 space-y-10 mx-12">
              {/* NORTH SECTION */}
              <div className="flex gap-10 items-center">
                {/* Conference Room */}
                {conferenceRooms.length > 0 && (
                  <div className="flex flex-col items-center gap-3 shrink-0">
                    <div className="text-xs font-bold text-gray-500 uppercase">
                      Conference Room
                    </div>

                    {conferenceRooms.map((seat) => {
                      const status = selectedDate
                        ? getSeatStatus(seat.id, selectedDate)
                        : "available";

                      const isDisabled = status === "booked";

                      return (
                        <button
                          key={seat.id}
                          onClick={() => !isDisabled && handleSeatClick(seat)}
                          disabled={isDisabled}
                          className={`
            w-48 h-48
            flex flex-col items-center justify-center
            rounded-xl border-2 font-bold
            transition-all duration-200
            ${getSeatColor(seat, status)}
            ${isDisabled ? "cursor-not-allowed" : "hover:shadow-lg"}
          `}
                        >
                          <span className="text-lg">{seat.label}</span>
                          <span className="text-xs opacity-75 mt-1">
                            {seat.capacity} people
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* North desks */}
                <div className="flex-1 flex items-center">
                  <div className="grid grid-cols-7 gap-4 w-full">
                    {northDesks
                      .filter((seat) => Number(seat.id) % 2 === 0)
                      .sort((a, b) => Number(a.id) - Number(b.id))
                      .map(renderSeat)}

                    {northDesks
                      .filter((seat) => Number(seat.id) % 2 !== 0)
                      .sort((a, b) => Number(a.id) - Number(b.id))
                      .map(renderSeat)}
                  </div>
                </div>
              </div>

              {/* WALKWAY */}
              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 px-6 py-2 rounded-lg font-bold text-sm">
                  WALKWAY
                </div>
              </div>

              {/* CENTER SECTION */}
              <div className="grid grid-cols-10 gap-4">
                {centerDesks
                  .filter((seat) => Number(seat.id) % 2 === 0)
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .map(renderSeat)}

                {centerDesks
                  .filter((seat) => Number(seat.id) % 2 !== 0)
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .map(renderSeat)}
              </div>

              {/* WALKWAY */}
              <div className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 px-6 py-2 rounded-lg font-bold text-sm">
                  WALKWAY
                </div>
              </div>

              {/* SOUTH SECTION */}
              <div className="grid grid-cols-10 gap-4">
                {southDesks
                  .filter((seat) => Number(seat.id) % 2 === 0)
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .map(renderSeat)}

                {southDesks
                  .filter((seat) => Number(seat.id) % 2 !== 0)
                  .sort((a, b) => Number(a.id) - Number(b.id))
                  .map(renderSeat)}
              </div>

              {/* ENTRY */}
              <div className="text-green-600 font-bold text-sm text-center bg-green-50 py-3 px-4 rounded-lg border-2 border-green-300">
                ENTRY →
              </div>

              {/* ROOMS AT BOTTOM - FULL WIDTH */}
              <div className="grid grid-cols-2 gap-8 border-t pt-6">
                {/* Meeting Rooms */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-center">
                    Meeting Rooms
                  </h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {meetingRooms.map((seat) => {
                      const status = selectedDate
                        ? getSeatStatus(seat.id, selectedDate)
                        : "available";

                      const isDisabled =
                        seat.type === "server" || status === "booked";

                      return (
                        <button
                          key={seat.id}
                          onClick={() => !isDisabled && handleSeatClick(seat)}
                          disabled={isDisabled}
                          className={`
                          flex flex-col items-center justify-center
                          rounded-lg border-2 font-semibold
                          transition-all duration-200 p-4 w-28 h-28
                          ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
                          ${getSeatColor(seat, status)}
                        `}
                          title={`${seat.label} - ${status}`}
                        >
                          <span className="text-base font-bold">{seat.id}</span>
                          <span className="text-xs opacity-75 mt-1">
                            {seat.capacity ? `${seat.capacity} ppl` : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Server Rooms */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-center">
                    Server Rooms
                  </h3>
                  <div className="flex flex-wrap gap-4 justify-center">
                    {serverRooms.map((seat) => {
                      const status = selectedDate
                        ? getSeatStatus(seat.id, selectedDate)
                        : "available";

                      const isDisabled =
                        seat.type === "server" || status === "booked";

                      return (
                        <button
                          key={seat.id}
                          onClick={() => !isDisabled && handleSeatClick(seat)}
                          disabled={isDisabled}
                          className={`
                          flex items-center justify-center
                          rounded-lg border-2 font-semibold text-sm
                          transition-all duration-200 w-28 h-28
                          ${isDisabled ? "cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
                          ${getSeatColor(seat, status)}
                        `}
                          title={`${seat.label || `Seat ${seat.id}`} - ${status}`}
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

        {/* Info Box */}
        {selectedDate && (
          <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-bold text-blue-600">Booking Date: </span>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        seat={selectedSeat}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default FloorMap;
