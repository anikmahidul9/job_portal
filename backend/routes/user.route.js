import express from 'express';
import { login, logOut, register, updateProfile } from '../controller/user.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/register', upload.single('profilePhoto'), register);
router.route("/login").post(login);
router.route("/logout").get(logOut);
router.route("/profile/update").post(isAuthenticated,updateProfile);

export default router;