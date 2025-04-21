import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                error: "Not authorized, token required", 
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(403).json({
                error: "Invalid token", 
                success: false
            });
        }

        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({
                error: "User not found", 
                success: false
            });
        }

        req.user = user;
        req.id = decoded.id;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Authentication failed", 
            success: false
        });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                error: "Access denied. Admin privileges required",
                success: false
            });
        }
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Authorization check failed",
            success: false
        });
    }
};