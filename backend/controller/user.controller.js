import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";



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
          newUser.profile.profilePhoto = `/uploads/profile-photos/${req.file.filename}`;
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
export const updateProfile = async (req, res) => {
    try {
      const { name, phoneNumber, bio, skills, resume, company, profilePhoto } = req.body;
      const userId = req.id;
  
      // Check if phoneNumber is being updated and if it's unique
      if (phoneNumber) {
        const existingUser = await User.findOne({ phoneNumber, _id: { $ne: userId } });
        if (existingUser) {
          return res.status(400).json({ error: "Phone number already in use", success: false });
        }
      }
  
      const updateData = {
        updatedAt: new Date(),
      };
  
      if (name) updateData.name = name;
      if (phoneNumber) updateData.phoneNumber = phoneNumber;
  
      // Profile updates
      if (bio || skills || resume || company || profilePhoto) {
        updateData.profile = {};
        if (bio !== undefined) updateData.profile.bio = bio;
        if (skills !== undefined) updateData.profile.skills = skills;
        if (resume !== undefined) updateData.profile.resume = resume;
        if (company !== undefined) updateData.profile.company = company;
        if (profilePhoto !== undefined) updateData.profile.profilePhoto = profilePhoto;
      }
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).exec();
  
      if (!user) {
        return res.status(404).json({ error: "User not found", success: false });
      }
  
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




