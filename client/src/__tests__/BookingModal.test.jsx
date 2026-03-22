import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import BookingModal from "../components/BookingModal";
import { vi } from "vitest";

describe("BookingModal Component", () => {
  const mockSeat = {
    _id: "1",
    id: "A1",
    zone: "North",
    type: "desk",
  };

  const mockOnClose = vi.fn();

  const mockConfirmBooking = vi.fn(() =>
    Promise.resolve({ success: true, booking: {} }),
  );

  const bookingContextValue = {
    confirmBooking: mockConfirmBooking,
    bookingLoading: false,
    bookingError: null,
  };

  test("renders booking modal with seat details", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <BookingModal
              seat={mockSeat}
              onClose={mockOnClose}
              isOpen={true}
              selectedDate={new Date().toISOString()}
            />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /confirm reservation/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Seat A1/i)).toBeInTheDocument();
  });

  test("displays slot selection options", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <BookingModal
              seat={mockSeat}
              onClose={mockOnClose}
              isOpen={true}
              selectedDate={new Date().toISOString()}
            />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Full Day")).toBeInTheDocument();
    expect(screen.getByText("Morning")).toBeInTheDocument();
    expect(screen.getByText("Afternoon")).toBeInTheDocument();
  });

  test("has confirm booking button", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <BookingModal
              seat={mockSeat}
              onClose={mockOnClose}
              isOpen={true}
              selectedDate={new Date().toISOString()}
            />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    const confirmButton = screen.getByRole("button", {
      name: /confirm reservation/i,
    });
    expect(confirmButton).toBeInTheDocument();
  });

  test("calls onClose when closed", async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <BookingModal
              seat={mockSeat}
              onClose={mockOnClose}
              isOpen={true}
              selectedDate={new Date().toISOString()}
            />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    // First button in the modal header is the close (X) button
    const [closeButton] = screen.getAllByRole("button");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  test("does not render when open is false", () => {
    const { container } = render(
      <BrowserRouter>
        <AuthProvider>
          <BookingContext.Provider value={bookingContextValue}>
            <BookingModal
              seat={mockSeat}
              onClose={mockOnClose}
              isOpen={false}
              selectedDate={new Date().toISOString()}
            />
          </BookingContext.Provider>
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(
      container.querySelector(".fixed.inset-0.z-100"),
    ).not.toBeInTheDocument();
  });
});
