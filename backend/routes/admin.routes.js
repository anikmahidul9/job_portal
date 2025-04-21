import express from "express";

import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { approveRecruiter, getAllUsers, getPendingRecruiters, rejectRecruiter } from "../controller/admin.controller.js";

const router = express.Router();

// Admin dashboard routes
router.get("/recruiters/pending", isAuthenticated, isAdmin, getPendingRecruiters);
router.put("/recruiters/approve/:recruiterId", isAuthenticated, isAdmin, approveRecruiter);
router.delete("/recruiters/reject/:recruiterId", isAuthenticated, isAdmin, rejectRecruiter);
router.get("/users", isAuthenticated, isAdmin, getAllUsers);

export default router;