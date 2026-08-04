import User from "../models/User.js";

// Get all non-admin users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    return res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Update a user's basic profile (name, email) - admin only
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name && !email) {
      return res
        .status(400)
        .json({ message: "At least one of name or email is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If email is changing, make sure it's unique
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== id) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    const updatedUser = await user.save();
    const userObject = updatedUser.toObject();
    delete userObject.password;

    return res.status(200).json({
      message: "User updated successfully",
      data: userObject,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
