import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import seatRoutes from "./routes/seatsRouts.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./db/db.js";
import adminRoutes from "./routes/adminroutes.js";
import userRoutes from "./routes/userroutes.js";
import redisclient from "./config/redis.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/seats", seatRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", userRoutes);

const port = 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
