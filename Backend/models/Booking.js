import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  seat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seat",
    required: true
  },

  seatId: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  slot: {
    type: String,
    enum: ["morning", "afternoon", "full-day"],
    required: true
  }

}, { timestamps: true });

bookingSchema.index(
  { seat: 1, date: 1, slot: 1 },
  { unique: true }
);

const Booking = mongoose.model("Booking", bookingSchema, "bookings");

export default Booking;
