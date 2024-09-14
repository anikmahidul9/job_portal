import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { getAdminJobs, getAllJobs, postJob } from "../controller/job.controller.js";

const router = express.Router();

router.route("/jobAdd").post(isAuthenticated,postJob);
// router.route("/login").post(login);
 router.route("/jobs").get(getAllJobs);
router.route("/adminJobs").get(isAuthenticated, getAdminJobs);

export default router;
