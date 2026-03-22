import Booking from "../models/Booking.js";

// Get bookings by date - returns ALL bookings for the day (all users)
export const getBookingsByDate = async (req, res) => {
  try {
    const dateString = req.params.date;

    // Validate date parameter
    if (!dateString) {
      return res
        .status(400)
        .json({ message: "Date parameter is required. Format: YYYY-MM-DD" });
    }

    // Parse the date string (format: YYYY-MM-DD)
    const selectedDate = new Date(dateString);
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    // Query for ALL bookings within the date range (entire day) - not filtered by user
    const bookings = await Booking.find({
      date: {
        $gte: selectedDate,
        $lt: nextDate,
      },
    }).populate("seat user");

    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: err.message });
  }
};


// Get all bookings for authenticated user
export const getAllBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Get user from JWT
    const bookings = await Booking.find({ user: userId }).populate("seat user");
    res.json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: err.message });
  }
};


// Create new booking for authenticated user
export const createBooking = async (req, res) => {
  try {
    const { seat, date, slot, seatId } = req.body;
    const userId = req.user.id; // Get user from JWT

    // FIXED DATE HANDLING
    const mybook = new Date(date.split("T")[0]);

    const nextDate = new Date(mybook);
    nextDate.setDate(nextDate.getDate() + 1);

    const existingBooking = await Booking.findOne({
      seat: seat,
      date: { $gte: mybook, $lt: nextDate },
      slot: slot,
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Seat is already booked for the selected date and slot",
      });
    }

    const newBooking = new Booking({
      user: userId,
      seat,
      seatId,
      date: mybook,
      slot,
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating booking",
      error: err.message,
    });
  }
};


// Delete booking by id - only if user owns it
export const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id; // Get user from JWT

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    // Verify that the booking belongs to the authenticated user
    if (booking.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your own bookings" });
    }

    // Delete the booking
    const deletedBooking = await Booking.findOneAndDelete({
     _id: bookingId,
     user: userId
    });

    res.status(200).json({
      message: "Booking deleted successfully",
      deletedBooking: deletedBooking,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting booking", error: err.message });
  }
};
