import express from "express";
import { registerAdmin } from "../controller/auth.controller.js";


const router = express.Router();

// Admin registration route
router.post("/register-admin", registerAdmin);

export default router;