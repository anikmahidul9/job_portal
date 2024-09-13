import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";


export const register = async (req,res)=>{
    try{
        const {name,email,phoneNumber,password,role} = req.body;
        if(!name||!email||!phoneNumber||!password){
            return res.status(400).json({error: 'All fields are required',
             success: false
            });
           
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({error: 'Email already exists',
             success: false
            });
        }
        const hashPassword = await bcrypt.hash(password,10)
        await User.create({
            name,
            email,
            phoneNumber,
            password:hashPassword,
            role,
            profile: {
                bio: '',
                skills: '',
                resume: '',
                company: null,
                profilePhoto:'',
            }
            
        })
        return res.status(200).json({message:"Account create Successfully",success:true});
    }catch(err){
        console.error(err);
        return res.status(500).json({error: 'Server error', success: false});
    }
}

export const login = async (req,res)=>{
    try{
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "All fields are required", success: false });
      }
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "User not found", success: false });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: "Incorrect password", success: false });
      }
      // check if role is correct or not
      if (user.role !== user.role) {
        return res.status(403).json({ error: "Access denied", success: false });
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
        profile: user.profile,
      }
     return res.status(200).cookie("token",token,{maxAge:7*24*60*60*1000,httpsOnly:true,sameSite:'strict'}).json({
        message:"User successfully signed",
        success: true,
        token,
      });
    }catch(err){
        console.error(err);
        return res.status(500).json({error: 'Server error', success: false});
    }
}

export const logOut = (req, res) => {
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"User successfully logged out",
            success: true,
        });
    }catch(err){
        console.error(err);
        return res.status(500).json({error: 'Server error', success: false});
    }
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, bio, skills, resume, company, profilePhoto } =
      req.body;


    const updateData = {
      name,
      phoneNumber,
      updatedAt: new Date(),
      "profile.bio": bio,
      "profile.skills": skills,
      "profile.resume": resume,
      "profile.company": company,
      "profile.profilePhoto": profilePhoto,
    };
    const userId= await User.findOne(req.id);
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: updateData,
      },
      { new: true }
    ).exec();

    if (!user) {
      return res.status(404).json({ error: "User not found", success: false });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully", success: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error", success: false });
  }
};


