import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import MyBookings from "../pages/MyBookings";
import { vi } from "vitest";

const futureDate = new Date(Date.now() + 86400000).toISOString();
const pastDate = new Date(Date.now() - 86400000).toISOString();

const bookingContextValue = {
  allBookings: [
    {
      _id: "1",
      seatId: "A1",
      date: futureDate,
      slot: "Full-day",
      status: "booked",
    },
    {
      _id: "2",
      seatId: "B2",
      date: pastDate,
      slot: "Morning",
      status: "completed",
    },
  ],
  cancelBooking: vi.fn(async () => ({ success: true })),
  fetchAllBookings: vi.fn(),
  allBookingsLoading: false,
  allBookingsError: null,
  bookingLoading: false,
};

describe("MyBookings Component", () => {
  test("renders my bookings page", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <MyBookings />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText(/my bookings|your bookings/i)).toBeInTheDocument();
  });

  test("displays upcoming and past booking tabs", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <MyBookings />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/upcoming/i)).toBeInTheDocument();
      expect(screen.getByText(/past/i)).toBeInTheDocument();
    });
  });



  test("has cancel booking button for upcoming bookings", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <MyBookings />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    await waitFor(() => {
      // Icon-only button uses title "Cancel Booking" as accessible name
      const cancelButtons = screen.queryAllByRole("button", {
        name: /cancel booking/i,
      });
      expect(cancelButtons.length).toBeGreaterThan(0);
    });
  });
});
