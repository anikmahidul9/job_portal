import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJob, updateStatus } from "../controller/application.controller.js";

const router = express.Router();
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/job").get(isAuthenticated, getAppliedJob);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated,updateStatus);
export default router;
