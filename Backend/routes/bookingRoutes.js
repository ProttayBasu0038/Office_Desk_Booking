import express from "express";
import { getBookingsByDate,createBooking,deleteBooking,getAllBookings ,lockSeatHandler,unlockSeatHandler} from "../controllers/bookingcontrollers.js";
import { jwtauthmiddleware } from "../middleware/authmiddleware.js";
const router = express.Router()

router.post("/",jwtauthmiddleware, createBooking);
router.get("/all",jwtauthmiddleware, getAllBookings);
router.get("/:date", jwtauthmiddleware, getBookingsByDate);
router.delete("/delete/:id", jwtauthmiddleware,deleteBooking);

router.post("/lock", jwtauthmiddleware, lockSeatHandler);     // user clicks seat
router.post("/unlock", jwtauthmiddleware, unlockSeatHandler); // user cancels/leaves

export default router;