import express from "express";
import { adminmiddleware } from "../middleware/adminmiddleware.js";
import { getAllUsers, updateUser } from "../controllers/usercontrollers.js";

const router = express.Router();

// Get all users - only accessible to admins
router.get("/users", adminmiddleware, getAllUsers);

// Update user name/email - only accessible to admins
router.put("/users/:id", adminmiddleware, updateUser);

export default router;
