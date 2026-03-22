import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import FloorMap from "../pages/FloorMap";
import { vi } from "vitest";

const renderFloorMap = (overrideContext = {}) => {
  const defaultContext = {
    seats: [
      { id: "101", zone: "North", type: "desk" },
      { id: "201", zone: "Middle", type: "desk" },
      { id: "301", zone: "South", type: "desk" },
    ],
    bookings: [],
    getSeatStatus: vi.fn(() => "available"),
    fetchBookingsByDate: vi.fn(),
    loadingSeats: false,
    seatsError: null,
    confirmBooking: vi.fn(),
    cancelBooking: vi.fn(),
    bookingLoading: false,
    bookingError: null,
    fetchAllBookings: vi.fn(),
    allBookings: [],
    allBookingsLoading: false,
    allBookingsError: null,
  };

  const value = { ...defaultContext, ...overrideContext };

  return render(
    <BrowserRouter>
      <AuthProvider>
        <BookingContext.Provider value={value}>
          <FloorMap />
        </BookingContext.Provider>
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("FloorMap Component", () => {
  test("renders floor map page", () => {
    renderFloorMap();

    expect(screen.getByText(/floor map/i)).toBeInTheDocument();
    expect(screen.getByText(/office desk booking/i)).toBeInTheDocument();
  });

  test("has date picker input", () => {
    renderFloorMap();

    const dateInput = document.querySelector('input[type="date"]');
    expect(dateInput).not.toBeNull();
  });

  test("displays seat zones (North, Middle, South)", async () => {
    renderFloorMap();

    expect(screen.getByText(/north/i)).toBeInTheDocument();
    expect(screen.getByText(/south/i)).toBeInTheDocument();
  });

  test("displays available seats", async () => {
    renderFloorMap();

    expect(screen.getByText("101")).toBeInTheDocument();
    expect(screen.getByText("201")).toBeInTheDocument();
    expect(screen.getByText("301")).toBeInTheDocument();
  });
});
