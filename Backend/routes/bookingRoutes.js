import express from "express";
import { getBookingsByDate,createBooking,deleteBooking,getAllBookings } from "../controllers/bookingcontrollers.js";
import { jwtauthmiddleware } from "../middleware/authmiddleware.js";
const router = express.Router()

router.post("/",jwtauthmiddleware, createBooking);
router.get("/all",jwtauthmiddleware, getAllBookings);
router.get("/:date", jwtauthmiddleware, getBookingsByDate);
router.delete("/delete/:id", jwtauthmiddleware,deleteBooking);

export default router;