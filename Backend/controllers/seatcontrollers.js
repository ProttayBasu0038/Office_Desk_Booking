import Seat from "../models/Seat.js";

// Get all seats
export const getAllSeats = async (req, res) => {
    try {
        const seats = await Seat.find();
        res.json(seats);
    } catch (err) {
        res.status(500).json({ message: "Error fetching seats", error: err.message });
    }
}
