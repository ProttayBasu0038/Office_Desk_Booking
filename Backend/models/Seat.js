import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({

  seatId: {
    type: String,
    required: true,
    unique: true
  },

  type: {
    type: String,
    enum: ["desk", "meeting", "conference", "server"],
    required: true
  },

  zone: {
    type: String,
    enum: ["North", "Center", "South"],
    required: true
  },

  label: {
    type: String
  },

  capacity: {
    type: Number,
    default: 1
  }

}, {
  timestamps: true
});

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;
