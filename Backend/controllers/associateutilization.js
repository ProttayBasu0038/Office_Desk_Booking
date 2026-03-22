import Booking from "../models/Booking.js";
import Seat from "../models/Seat.js";

export const getAssociateUtilization = async (req, res) => {
  try {
    const { year, month, name } = req.query;
 
    if (!year) {
      return res.status(400).json({ message: "year is required" });
    }
 
    const y = parseInt(year);
    const m = month ? parseInt(month) : null;
 
    // ── Date range filter ────────────────────────────────────────────────────
    let startDate, endDate;
 
    if (m) {
      // specific month
      startDate = new Date(y, m - 1, 1);
      endDate   = new Date(y, m, 1);
    } else {
      // full year
      startDate = new Date(y, 0, 1);
      endDate   = new Date(y + 1, 0, 1);
    }
 
    // ── Total available desk seats ───────────────────────────────────────────
    // Only count "desk" seats as bookable seats for utilization %
    const totalSeats = await Seat.countDocuments({ type: "desk" });
 
    // ── Aggregate bookings per user ──────────────────────────────────────────
    const results = await Booking.aggregate([
      // 1. Filter by date range (only bookings with a valid user)
      {
        $match: {
          date: { $gte: startDate, $lt: endDate },
          user: { $exists: true, $ne: null },
        },
      },
 
      // 2. Group by user + slot type
      {
        $group: {
          _id:              "$user",
          totalBookings:    { $sum: 1 },
          morningCount:     { $sum: { $cond: [{ $eq: ["$slot", "morning"]   }, 1, 0] } },
          afternoonCount:   { $sum: { $cond: [{ $eq: ["$slot", "afternoon"] }, 1, 0] } },
          fullDayCount:     { $sum: { $cond: [{ $eq: ["$slot", "full-day"]  }, 1, 0] } },
          uniqueDates:      { $addToSet: "$date" },
          uniqueSeats:      { $addToSet: "$seat" },
        },
      },
 
      // 3. Join with User collection to get name + email
      {
        $lookup: {
          from:         "users",
          localField:   "_id",
          foreignField: "_id",
          as:           "userInfo",
        },
      },
 
      // 4. Flatten userInfo array → single object
      { $unwind: "$userInfo" },
 
      // 5. Filter by name if provided (case-insensitive partial match)
      ...(name && name.trim()
        ? [{
            $match: {
              "userInfo.name": { $regex: name.trim(), $options: "i" },
            },
          }]
        : []),
 
      // 6. Shape the final output
      {
        $project: {
          _id:            0,
          userId:         "$_id",
          name:           "$userInfo.name",
          email:          "$userInfo.email",
          totalBookings:  1,
          morningCount:   1,
          afternoonCount: 1,
          fullDayCount:   1,
          uniqueDaysBooked: { $size: "$uniqueDates" },
          uniqueSeatsUsed:  { $size: "$uniqueSeats" },
 
          // utilization % = (totalBookings / totalSeats) * 100
          // capped at 100
          utilizationPercent: {
            $min: [
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: ["$totalBookings", totalSeats || 1] },
                      100,
                    ],
                  },
                  2,
                ],
              },
              100,
            ],
          },
        },
      },
 
      // 7. Sort by most bookings first
      { $sort: { totalBookings: -1 } },
    ]);
 
    return res.status(200).json({
      message: "Associate utilization fetched successfully",
      filters: { year: y, month: m || "all", name: name?.trim() || "all" },
      totalSeats,
      count: results.length,
      data: results,
    });
 
  } catch (error) {
    console.error("getAssociateUtilization error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};