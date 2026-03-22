import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminmiddleware = async (req, res, next) => {
    // frst check request header has authorization field or not
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: "Token Not Found" });
    }
    
    // extract token from header
    const token = authHeader.split(" ")[1];
    if(!token){
        return res.status(401).json({ message: "Token not found" });
    }
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        
        req.user = await User.findById(decoded.id).select("-password") // Fetch user from DB and attach to request

        if(!req.user){
            return res.status(401).json({ message: "User not found" });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admins only." });
        }
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}