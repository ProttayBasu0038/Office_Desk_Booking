import Booking from "../models/Booking.js";
import { lockSeat, unlockSeat, getLockOwner } from "../utils/seatLock.js";

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
    const userId = req.user.id;
 
    const mybook = new Date(date.split("T")[0]);
    mybook.setHours(23, 59, 59, 999);
 
    const nextDate = new Date(mybook);
    nextDate.setDate(nextDate.getDate() + 1);
 
    const dateOnly = date.split("T")[0];
 
    // ✅ Step 1 — Check Redis lock (is seat locked by someone else?)
    if (slot === "full-day") {
      // full-day conflicts with morning, afternoon and full-day
      const slots = ["full-day", "morning", "afternoon"];
      for (const s of slots) {
        const lockOwner = await getLockOwner(seatId, dateOnly, s);
        if (lockOwner && lockOwner !== userId) {
          return res.status(409).json({
            message: "Seat is temporarily locked by another user. Try again shortly.",
          });
        }
      }
    } else {
      // morning or afternoon — check its own slot and full-day
      const ownLock = await getLockOwner(seatId, dateOnly, slot);
      if (ownLock && ownLock !== userId) {
        return res.status(409).json({
          message: "Seat is temporarily locked by another user. Try again shortly.",
        });
      }
      const fullDayLock = await getLockOwner(seatId, dateOnly, "full-day");
      if (fullDayLock && fullDayLock !== userId) {
        return res.status(409).json({
          message: "Seat is temporarily locked by another user. Try again shortly.",
        });
      }
    }
 
    // ✅ Step 2 — Check MongoDB for slot conflicts
    const existingBookings = await Booking.find({
      seat,
      date: { $gte: mybook, $lt: nextDate },
    });
 
    for (const existing of existingBookings) {
      const bookedSlot = existing.slot;
 
      const conflict =
        bookedSlot === slot ||         // exact same slot
        bookedSlot === "full-day" ||   // existing full-day blocks everything
        slot === "full-day";           // new full-day blocked by anything
 
      if (conflict) {
        return res.status(400).json({
          message:
            bookedSlot === "full-day"
              ? "Seat is already booked for the full day."
              : slot === "full-day"
              ? `Seat already has a ${bookedSlot} booking. Cannot book full day.`
              : `Seat is already booked for ${bookedSlot}.`,
        });
      }
    }
 
    // ✅ Step 3 — Save to MongoDB
    const newBooking = new Booking({
      user: userId,
      seat,
      seatId,
      date: mybook,
      slot,
    });
 
    await newBooking.save();
 
    // ✅ Step 4 — Release Redis lock after successful booking
    await unlockSeat(seatId, dateOnly, slot, userId);
 
    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Seat was just booked by someone else, please try another seat or slot",
      });
    }
    res.status(500).json({ message: "Error creating booking", error: err.message });
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

export const lockSeatHandler = async (req, res) => {
  try {
    const { seatId, date, slot } = req.body;
    const userId = req.user.id;
 
    if (!seatId || !date || !slot) {
      return res.status(400).json({ message: "seatId, date and slot are required" });
    }
 
    const locked = await lockSeat(seatId, date, slot, userId);
 
    if (!locked) {
      return res.status(409).json({
        message: "Seat is temporarily locked by another user. Try again shortly.",
      });
    }
 
    res.status(200).json({
      message: "Seat locked successfully",
      expiresIn: 120, // 2 minutes
    });
  } catch (err) {
    res.status(500).json({ message: "Lock failed", error: err.message });
  }
};

export const unlockSeatHandler = async (req, res) => {
  try {
    const { seatId, date, slot } = req.body;
    const userId = req.user.id;
 
    if (!seatId || !date || !slot) {
      return res.status(400).json({ message: "seatId, date and slot are required" });
    }
 
    await unlockSeat(seatId, date, slot, userId);
 
    res.status(200).json({ message: "Seat unlocked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Unlock failed", error: err.message });
  }
};



