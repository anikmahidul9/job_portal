import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ 
                error: 'All fields are required', 
                success: false 
            });
        }

        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ 
                error: 'Admin already exists', 
                success: false 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            isApproved: true,
            phoneNumber: '0000000000'
        });

        return res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            userId: admin._id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            error: 'Server error', 
            success: false 
        });
    }
};