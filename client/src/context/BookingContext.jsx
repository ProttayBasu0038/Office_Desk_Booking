import {
  useState,
  createContext,
  useEffect,
  useCallback,
  useContext,
} from "react";
import API from "../api/api";
import { AuthContext } from "./AuthContext";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  
  const { token } = useContext(AuthContext);
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [seatsError, setSeatsError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [allBookings, setAllBookings] = useState([]);
  const [allBookingsLoading, setAllBookingsLoading] = useState(false);
  const [allBookingsError, setAllBookingsError] = useState(null);

  // Fetch seats from backend - only when user is authenticated
  useEffect(() => {
    if (!token) {
      setLoadingSeats(false);
      return;
    }

    const fetchSeats = async () => {
      try {
        setLoadingSeats(true);
        const response = await API.get("/seats");
        // Transform backend data to include 'id' field from 'seatId'
        const transformedSeats = response.data.map((seat) => ({
          ...seat,
          id: seat.seatId,
        }));
        setSeats(transformedSeats);
        setSeatsError(null);
      } catch (error) {
        console.error("Error fetching seats:", error);
        setSeatsError(error.message);
        setSeats([]);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [token]);

  // Fetch bookings by date from backend
  const fetchBookingsByDate = useCallback(async (date) => {
    try {
      setBookingLoading(true);
      const response = await API.get(`/bookings/${date}`);
      setBookings(response.data);
      setBookingError(null);
    } catch (error) {
      // 404 is expected when no bookings exist for a date
      if (error.response?.status === 404) {
        setBookings([]);
        setBookingError(null);
      } else {
        console.error("Error fetching bookings:", error);
        setBookingError(error.message);
      }
    } finally {
      setBookingLoading(false);
    }
  }, []);

  // Fetch all bookings (for MyBookings page)
  const fetchAllBookings = useCallback(async () => {
    try {
      setAllBookingsLoading(true);
      const response = await API.get("/bookings/all");
      setAllBookings(response.data);
      setAllBookingsError(null);
    } catch (error) {
      console.error("Error fetching all bookings:", error);
      setAllBookingsError(error.message);
      setAllBookings([]);
    } finally {
      setAllBookingsLoading(false);
    }
  }, []);

  const confirmBooking = async (seatObjectId, seatId, date, slot) => {
    try {
      setBookingLoading(true);
      setBookingError(null);

      const bookingData = {
        seat: seatObjectId,
        seatId: seatId,
        date: new Date(date).toISOString().split("T")[0],
        slot: slot,
      };

      const response = await API.post("/bookings", bookingData);

      // Add the new booking to state
      setBookings((prev) => [...prev, response.data.booking]);

      return { success: true, booking: response.data.booking };
    } catch (error) {
      console.error("Error creating booking:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to create booking";
      setBookingError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      setBookingLoading(true);
      setBookingError(null);

      const response = await API.delete(`/bookings/delete/${bookingId}`);

      console.log("Delete response:", response.data);

      // Remove from both bookings arrays
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      setAllBookings((prev) => prev.filter((b) => b._id !== bookingId));

      return { success: true, message: response.data.message };
    } catch (error) {
      console.error("Error deleting booking:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete booking";
      setBookingError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setBookingLoading(false);
    }
  };

  const getSeatStatus = (seatId, date) => {
    const dateStr = new Date(date).toISOString().split("T")[0];
    const found = bookings.find(
      (b) =>
        b.seatId === seatId &&
        new Date(b.date).toISOString().split("T")[0] === dateStr,
    );

    return found ? "booked" : "available";
  };
  return (
    <BookingContext.Provider
      value={{
        seats,
        bookings,
        confirmBooking,
        cancelBooking,
        getSeatStatus,
        loadingSeats,
        seatsError,
        fetchBookingsByDate,
        bookingLoading,
        bookingError,
        fetchAllBookings,
        allBookings,
        allBookingsLoading,
        allBookingsError,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};
export default BookingProvider;
