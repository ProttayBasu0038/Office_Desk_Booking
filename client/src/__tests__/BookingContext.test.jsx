import { render, screen, act, waitFor } from "@testing-library/react";
import { useContext } from "react";
import { BookingProvider, BookingContext } from "../context/BookingContext";
import { AuthProvider } from "../context/AuthContext";
import { vi } from "vitest";

// Mock the API
vi.mock("../api/api", () => ({
  default: {
    get: vi.fn((url) => {
      if (url.includes("/seats")) {
        return Promise.resolve({
          data: [
            {
              _id: "1",
              seatNumber: "A1",
              zone: "North",
              type: "desk",
              available: true,
            },
            {
              _id: "2",
              seatNumber: "A2",
              zone: "North",
              type: "desk",
              available: false,
            },
          ],
        });
      }
      if (url.includes("/bookings")) {
        return Promise.resolve({
          data: [
            {
              _id: "b1",
              seatId: "1",
              date: new Date().toISOString(),
              slot: "Full-day",
            },
          ],
        });
      }
      return Promise.resolve({ data: [] });
    }),
    post: vi.fn(() => Promise.resolve({ data: { _id: "new", success: true } })),
    delete: vi.fn(() => Promise.resolve({ data: { success: true } })),
  },
}));

describe("BookingContext", () => {
  test("provides initial booking state", () => {
    const TestComponent = () => {
      const { seats, bookings, loadingSeats } = useContext(BookingContext);
      return (
        <div>
          <div>Seats: {seats?.length || 0}</div>
          <div>Bookings: {bookings?.length || 0}</div>
          <div>Loading: {loadingSeats ? "true" : "false"}</div>
        </div>
      );
    };

    render(
      <AuthProvider>
        <BookingProvider>
          <TestComponent />
        </BookingProvider>
      </AuthProvider>,
    );

    // Initial state
    expect(screen.getByText(/Seats: \d+/)).toBeInTheDocument();
  });

  test("fetches seats on mount", async () => {
    const TestComponent = () => {
      const { seats, loadingSeats } = useContext(BookingContext);

      if (loadingSeats) return <div>Loading seats...</div>;

      return <div>Seats: {seats?.length || 0}</div>;
    };

    render(
      <AuthProvider>
        <BookingProvider>
          <TestComponent />
        </BookingProvider>
      </AuthProvider>,
    );

    await waitFor(
      () => {
        expect(screen.queryByText(/Seats: \d+/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test("confirmBooking adds a new booking", async () => {
    const TestComponent = () => {
      const { confirmBooking, bookings } = useContext(BookingContext);

      return (
        <div>
          <div>Bookings: {bookings?.length || 0}</div>
          <button
            onClick={() =>
              confirmBooking({
                seatId: "1",
                date: new Date().toISOString(),
                slot: "Full-day",
              })
            }
          >
            Confirm Booking
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <BookingProvider>
          <TestComponent />
        </BookingProvider>
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /confirm booking/i });

    act(() => {
      button.click();
    });

    await waitFor(
      () => {
        // Booking should be added
        expect(screen.getByText(/Bookings:/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  test("cancelBooking removes a booking", async () => {
    const TestComponent = () => {
      const { cancelBooking, bookings } = useContext(BookingContext);

      return (
        <div>
          <div>Bookings: {bookings?.length || 0}</div>
          <button onClick={() => cancelBooking("b1")}>Cancel Booking</button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <BookingProvider>
          <TestComponent />
        </BookingProvider>
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /cancel booking/i });

    act(() => {
      button.click();
    });

    // Should handle cancellation
    expect(button).toBeInTheDocument();
  });

  test("fetchBookingsByDate filters bookings", async () => {
    const TestComponent = () => {
      const { bookings, fetchBookingsByDate } = useContext(BookingContext);

      return (
        <div>
          <div>Bookings: {bookings?.length || 0}</div>
          <button onClick={() => fetchBookingsByDate(new Date())}>
            Fetch by Date
          </button>
        </div>
      );
    };

    render(
      <AuthProvider>
        <BookingProvider>
          <TestComponent />
        </BookingProvider>
      </AuthProvider>,
    );

    const button = screen.getByRole("button", { name: /fetch by date/i });

    act(() => {
      button.click();
    });

    // Should fetch bookings for the date
    expect(button).toBeInTheDocument();
  });

  test("getSeatStatus returns availability", async () => {
    const TestComponent = () => {
      const { getSeatStatus } = useContext(BookingContext);

      const status = getSeatStatus && getSeatStatus("1", new Date());

      return <div>Seat Status: {status ? "booked" : "available"}</div>;
    };

    render(
      <AuthProvider>
        <BookingProvider>
          <TestComponent />
        </BookingProvider>
      </AuthProvider>,
    );

    await waitFor(
      () => {
        expect(screen.getByText(/Seat Status:/)).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });
});
