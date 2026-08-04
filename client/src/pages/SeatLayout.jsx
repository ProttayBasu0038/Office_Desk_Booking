import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const citySeatConfig = [
  { name: "Kolkata", totalSeats: 54 },
  { name: "Hyderabad", totalSeats: 62 },
  { name: "Bangalore", totalSeats: 80 },
  { name: "Pune", totalSeats: 124 },
];

const SeatLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Seat Layout by Location
            </h1>
            <p className="mt-2 text-gray-600 text-sm">
              Overview of available seats across offices. Kolkata is currently
              configured with 54 seats.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-colors"
          >
            <FiArrowLeft className="text-base" />
            Back
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {citySeatConfig.map((city) => (
            <div
              key={city.name}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {city.name}
                </h2>
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-3">
                  Office Seats
                </p>
              </div>

              <div className="mt-2">
                {city.totalSeats != null ? (
                  <p className="text-3xl font-black text-blue-600">
                    {city.totalSeats}
                    <span className="ml-1 text-sm font-semibold text-gray-500">
                      seats
                    </span>
                  </p>
                ) : (
                  <p className="text-sm font-medium text-gray-500">
                    Seats not configured yet
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
