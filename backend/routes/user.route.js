import express from 'express';
import { login, logOut, register, updateProfile } from '../controller/user.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logOut);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

export default router;