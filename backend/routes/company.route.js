import express from "express";
import { getCompany, getCompanyById, getCompanyByRecruiter, registerCompany, updateCompany } from "../controller/company.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";


const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(getCompany)
router.route("/recruiter").get(isAuthenticated, getCompanyByRecruiter);
router.route("/get/:id").get(isAuthenticated, getCompanyById);
router.route("/update/:id").post(isAuthenticated, updateCompany);


export default router;
