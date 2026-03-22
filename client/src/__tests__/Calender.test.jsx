import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { BookingContext } from "../context/BookingContext";
import Calender from "../pages/Calender";
import { vi } from "vitest";

const renderCalendar = (overrideContext = {}) => {
  const defaultContext = {
    bookings: [],
    fetchBookingsByDate: vi.fn(),
    bookingLoading: false,
    bookingError: null,
  };

  const value = { ...defaultContext, ...overrideContext };

  return render(
    <BrowserRouter>
      <AuthProvider>
        <BookingContext.Provider value={value}>
          <Calender />
        </BookingContext.Provider>
      </AuthProvider>
    </BrowserRouter>,
  );
};

describe("Calendar Component", () => {
  test("renders calendar page", () => {
    renderCalendar();

    expect(screen.getByText(/daily bookings/i)).toBeInTheDocument();
    expect(
      screen.getByText(/view all office seat reservations/i),
    ).toBeInTheDocument();
  });

  test("has date input field", () => {
    renderCalendar();

    const dateInput = document.querySelector('input[type="date"]');
    expect(dateInput).not.toBeNull();
  });
});
