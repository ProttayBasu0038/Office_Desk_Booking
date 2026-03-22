import Booking from "../models/Booking.js";

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

export const getMonthlyUtilization = async (req, res) => {
  try {
    const { year, month } = req.query; // ?year=2025&month=3

    const matchStage = {};

    if (year && month) {
      // specific month
      const paddedMonth = String(month).padStart(2, "0"); // 3 → "03"
      matchStage.date = {
        $gte: new Date(`${year}-${paddedMonth}-01`),
        $lte: new Date(`${year}-${paddedMonth}-31`),
      };
    } else if (year) {
      // entire year
      matchStage.date = {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      };
    }

    const monthly = await Booking.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalBookings: { $sum: 1 },
          uniqueUsers: { $addToSet: "$user" },
          uniqueSeats: { $addToSet: "$seat" },
          slots: { $push: "$slot" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalBookings: 1,
          uniqueUsers: { $size: "$uniqueUsers" },
          uniqueSeats: { $size: "$uniqueSeats" },
          morningCount: {
            $size: {
              $filter: {
                input: "$slots",
                as: "s",
                cond: { $eq: ["$$s", "morning"] },
              },
            },
          },
          afternoonCount: {
            $size: {
              $filter: {
                input: "$slots",
                as: "s",
                cond: { $eq: ["$$s", "afternoon"] },
              },
            },
          },
          fullDayCount: {
            $size: {
              $filter: {
                input: "$slots",
                as: "s",
                cond: { $eq: ["$$s", "full-day"] },
              },
            },
          },
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    const result = monthly.map((m) => {
      const workingDays = getWorkingDays(m.year, m.month);
      const totalCapacity = TOTAL_SEATS * workingDays;
      const utilizationPercent = ((m.totalBookings / totalCapacity) * 100).toFixed(2);

      return {
        ...m,
        workingDays,
        totalCapacity,
        utilizationPercent: parseFloat(utilizationPercent),
      };
    });

    return res.status(200).json({
      message: "Monthly utilization fetched successfully",
      totalSeats: TOTAL_SEATS,
      data: result,
    });
  } catch (error) {
    console.error("Monthly utilization error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};