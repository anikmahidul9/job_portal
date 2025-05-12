import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import cloudinary from '../utils/cloudinary.js';



export const register = async (req, res) => {
  try {
      const { name, email, phoneNumber, password, role } = req.body;
      if (!name || !email || !phoneNumber || !password) {
          return res.status(400).json({ error: 'All fields are required', success: false });
      }

      // Check for existing email AND phone number
      const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
      if (existingUser) {
          if (existingUser.email === email) {
              return res.status(400).json({ error: 'Email already exists', success: false });
          } else {
              return res.status(400).json({ error: 'Phone number already exists', success: false });
          }
      }

      const hashPassword = await bcrypt.hash(password, 10);
      
      const newUser = new User({
          name,
          email,
          phoneNumber,
          password: hashPassword,
          role,
      });

      // Handle profile photo if uploaded
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile-photos',
            transformation: { width: 200, height: 200, crop: 'fill' }
        });
        newUser.profile.profilePhoto = result.secure_url;
    }

    await newUser.save();
      
      return res.status(201).json({
          message: "Account created successfully",
          success: true,
          user: {
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              profile: newUser.profile
          }
      });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error', success: false });
  }
}


export const login = async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ error: "All fields are required", success: false });
      }
      
      let user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ error: "User not found", success: false });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ error: "Incorrect password", success: false });
      }

      // Check if recruiter is approved
      if (user.role === 'recruiter' && !user.isApproved) {
          return res.status(403).json({ 
              error: "Your account is pending approval from admin", 
              success: false 
          });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
      });
      
      user = {
          _id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isApproved: user.isApproved,
          profile: user.profile,
      };

      return res.status(200)
          .cookie("token", token, { maxAge: 7*24*60*60*1000, httpOnly: true, sameSite: 'none' })
          .json({
              message: "User successfully signed in",
              user,
              success: true,
              token,
          });
  } catch(err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error', success: false });
  }
}

export const logOut = (req, res) => {
    try {
      return res.status(200)
        .cookie("token", "", {
          maxAge: 0,
          httpOnly: true,
          sameSite: 'none',
          secure: true // Add secure flag if using HTTPS
        })
        .json({
          message: "User successfully logged out",
          success: true,
        });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error', success: false });
    }
  }
// file: user.controller.js (update the updateProfile function)
export const updateProfile = async (req, res) => {
    try {
      const { name, phoneNumber, bio, skills } = req.body;
      const userId = req.id;
  
      // Check if phoneNumber is being updated and if it's unique
      if (phoneNumber) {
        const existingUser = await User.findOne({ phoneNumber, _id: { $ne: userId } });
        if (existingUser) {
          return res.status(400).json({ error: "Phone number already in use", success: false });
        }
      }

      // Get current user data to preserve existing profile photo
      const currentUser = await User.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ error: "User not found", success: false });
      }

      const updateData = {
        updatedAt: new Date(),
      };
  
      if (name) updateData.name = name;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
  
      // Handle profile updates while preserving existing profile photo
      if (bio || skills || req.files) {
        updateData.profile = {
          ...currentUser.profile, // Preserve all existing profile data
          bio: bio !== undefined ? bio : currentUser.profile?.bio,
          skills: skills !== undefined 
            ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()))
            : currentUser.profile?.skills,
        };
        
        // Handle profile photo upload if exists
        if (req.files?.profilePhoto) {
          const profilePhoto = req.files.profilePhoto[0];
          const result = await cloudinary.uploader.upload(profilePhoto.path, {
            folder: 'profile-photos',
            transformation: { width: 200, height: 200, crop: 'fill' }
          });
          updateData.profile.profilePhoto = result.secure_url;
        }
        
        // Handle resume upload if exists
        if (req.files?.resume) {
          const resume = req.files.resume[0];
          const result = await cloudinary.uploader.upload(resume.path, {
            folder: 'resumes',
            resource_type: 'raw'
          });
          updateData.profile.resume = result.secure_url;
        }
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).exec();
  
      return res.status(200).json({ 
        message: "Profile updated successfully", 
        success: true, 
        user 
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error", success: false });
    }
};



