import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import Dashboard from "../pages/Dashboard";
import { vi } from "vitest";

// Mock the API (not strictly needed for this test but kept for safety)
vi.mock("../api/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

const renderDashboard = (overrideContext = {}) => {
  const todayISO = new Date().toISOString().split("T")[0];

  const defaultContext = {
    seats: [{ id: "101" }, { id: "102" }],
    bookings: [
      {
        _id: "1",
        seat: { seatId: "101" },
        seatId: "101",
        date: todayISO,
        slot: "Full-day",
        user: { _id: "u1", name: "John Doe" },
      },
    ],
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
          <Dashboard />
        </BookingContext.Provider>
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("Dashboard Component", () => {
  test("renders dashboard heading", () => {
    renderDashboard();

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  test("displays today date", async () => {
    renderDashboard();

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    await waitFor(() => {
      expect(screen.getByText(today)).toBeInTheDocument();
    });
  });

  test("shows booking statistics section", () => {
    renderDashboard();

    expect(screen.getByText(/bookings today/i)).toBeInTheDocument();
    expect(screen.getByText(/seats available/i)).toBeInTheDocument();
    expect(screen.getByText(/total history/i)).toBeInTheDocument();
  });
});
