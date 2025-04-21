import { User } from "../models/user.model.js";

export const getPendingRecruiters = async (req, res) => {
    try {
        const pendingRecruiters = await User.find({
            role: 'recruiter',
            isApproved: false
        }).select('-password');

        return res.status(200).json({
            message: "Pending recruiters fetched successfully",
            success: true,
            recruiters: pendingRecruiters
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    }
}

export const approveRecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const recruiter = await User.findByIdAndUpdate(
            recruiterId,
            { $set: { isApproved: true } },
            { new: true }
        ).select('-password');

        if (!recruiter) {
            return res.status(404).json({ 
                message: "Recruiter not found", 
                success: false 
            });
        }

        return res.status(200).json({
            message: "Recruiter approved successfully",
            success: true,
            recruiter
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    }
}

export const rejectRecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const recruiter = await User.findByIdAndDelete(recruiterId);

        if (!recruiter) {
            return res.status(404).json({ 
                message: "Recruiter not found", 
                success: false 
            });
        }

        return res.status(200).json({
            message: "Recruiter rejected successfully",
            success: true
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            users
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    }
}