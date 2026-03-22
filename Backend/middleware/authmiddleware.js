import jwt from "jsonwebtoken";

export const jwtauthmiddleware = (req, res, next) => {
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
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
