import express from "express";
import { applyJob, getApplicants, getAppliedJob, getUserApplicationStatuses, updateStatus } from "../controller/application.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/job").get(isAuthenticated, getAppliedJob);
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").put(isAuthenticated,updateStatus);
router.get('/user-application',isAuthenticated, getUserApplicationStatuses);
export default router;
