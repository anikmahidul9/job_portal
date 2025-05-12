import express from 'express';
import { login, logOut, register, updateProfile } from '../controller/user.controller.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import upload from '../middleware/upload.middleware.js';
import { uploadResume } from '../middleware/uploadResume.js';
import { combinedUpload } from '../middleware/upload.combine.js';

const router = express.Router();

router.post('/register', upload.single('profilePhoto'), register);
router.route("/login").post(login);
router.route("/logout").get(logOut);
router.route("/profile/update").post(isAuthenticated,updateProfile);
router.put("/upload-resume", 
    isAuthenticated,
    combinedUpload,
    updateProfile
  );

export default router;