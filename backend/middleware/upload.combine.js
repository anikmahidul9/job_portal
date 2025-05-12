// file: combinedUpload.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const profilePhotoDir = path.join(__dirname, '../uploads/profile-photos');
const resumeDir = path.join(__dirname, '../uploads/resumes');

[profilePhotoDir, resumeDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'profilePhoto') {
      cb(null, profilePhotoDir);
    } else if (file.fieldname === 'resume') {
      cb(null, resumeDir);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.fieldname === 'profilePhoto' ? 'profile-' : 'resume-';
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});

export const combinedUpload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for both files
    files: 2 // Maximum of 2 files
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePhoto' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else if (file.fieldname === 'resume' && file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type for ${file.fieldname}`), false);
    }
  }
}).fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]);