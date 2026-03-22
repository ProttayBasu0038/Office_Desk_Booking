import Booking from "../models/Booking.js";
import User from "../models/User.js";

const TOTAL_SEATS = 54;
 
const getWorkingDays = (year, month) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  let workingDays = 0;
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = new Date(year, month - 1, day).getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) workingDays++;
  }
  return workingDays;
};
 
// ─── Controller ───────────────────────────────────────────────────────────────
 
// GET /admin/organization?year=2026&month=3
export const getOrganizationUtilization = async (req, res) => {
  try {
    const { year, month } = req.query;
 
    if (!year) {
      return res.status(400).json({ message: "year is required" });
    }
 
    // ── Date range (same logic as monthly) ──────────────────────────────────
    const matchStage = {};
 
    if (year && month) {
      const paddedMonth = String(month).padStart(2, "0");
      matchStage.date = {
        $gte: new Date(`${year}-${paddedMonth}-01`),
        $lte: new Date(`${year}-${paddedMonth}-31`),
      };
    } else if (year) {
      matchStage.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }
 
    // Only include bookings that have a user
    matchStage.user = { $exists: true, $ne: null };
 
    // ── Step 1: Get all users grouped by organization ────────────────────────
    // Since User model has no organization field, we group all users under
    // a single "General" organization. 
    // 👉 If you add an `organization` field to User later, just change
    //    the $group _id below to "$organization" and update the $project.
 
    const orgBookings = await Booking.aggregate([
      // 1. Match by date range
      { $match: matchStage },
 
      // 2. Join with users to get user details
      {
        $lookup: {
          from:         "users",
          localField:   "user",
          foreignField: "_id",
          as:           "userInfo",
        },
      },
 
      // 3. Flatten userInfo
      { $unwind: "$userInfo" },
 
      // 4. Group by organization
      //    → Right now User has no org field so we use a hardcoded "General"
      //    → Replace "$userInfo.organization" once you add that field to User
      {
        $group: {
          _id: { $ifNull: ["$userInfo.organization", "General"] },
          totalBookings:  { $sum: 1 },
          uniqueUsers:    { $addToSet: "$user" },
          uniqueSeats:    { $addToSet: "$seat" },
          slots:          { $push: "$slot" },
          // collect year+month for working days calculation
          years:          { $addToSet: { $year:  "$date" } },
          months:         { $addToSet: { $month: "$date" } },
        },
      },
 
      // 5. Shape output
      {
        $project: {
          _id:            0,
          organization:   "$_id",
          totalBookings:  1,
          uniqueUsers:    { $size: "$uniqueUsers" },
          uniqueSeats:    { $size: "$uniqueSeats" },
          morningCount: {
            $size: {
              $filter: {
                input: "$slots",
                as:    "s",
                cond:  { $eq: ["$$s", "morning"] },
              },
            },
          },
          afternoonCount: {
            $size: {
              $filter: {
                input: "$slots",
                as:    "s",
                cond:  { $eq: ["$$s", "afternoon"] },
              },
            },
          },
          fullDayCount: {
            $size: {
              $filter: {
                input: "$slots",
                as:    "s",
                cond:  { $eq: ["$$s", "full-day"] },
              },
            },
          },
        },
      },
 
      // 6. Sort by most bookings first
      { $sort: { totalBookings: -1 } },
    ]);
 
    // ── Step 2: Calculate utilization % (same formula as monthly) ────────────
    const y = parseInt(year);
    const m = month ? parseInt(month) : null;
 
    // If filtering by specific month use that, otherwise average across year
    const workingDays = m
      ? getWorkingDays(y, m)
      : Array.from({ length: 12 }, (_, i) => getWorkingDays(y, i + 1))
          .reduce((a, b) => a + b, 0);
 
    const totalCapacity = TOTAL_SEATS * workingDays;
 
    const result = orgBookings.map((org) => {
      const utilizationPercent = parseFloat(
        ((org.totalBookings / totalCapacity) * 100).toFixed(2)
      );
 
      return {
        ...org,
        workingDays,
        totalCapacity,
        utilizationPercent,
      };
    });
 
    return res.status(200).json({
      message:    "Organization utilization fetched successfully",
      filters:    { year: y, month: m || "all" },
      totalSeats: TOTAL_SEATS,
      workingDays,
      totalCapacity,
      count:      result.length,
      data:       result,
    });
 
  } catch (error) {
    console.error("Organization utilization error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};