import express from "express";
import { getAllSeats } from "../controllers/seatcontrollers.js";
import { jwtauthmiddleware } from "../middleware/authmiddleware.js";
const router = express.Router();

// Example route for getting all seats
router.get("/", jwtauthmiddleware, getAllSeats); 


export default router;