import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";

export const registerCompany = async (req,res)=>{
  try {
    const { name, description, website, logo, employees,jobPosts } = req.body;
      const user = await User.findOne(req.id);
    console.log(user);
    const newCompany = new Company({
      name,
      description,
      website,
      logo,
      employees,
      userId:user._id,
      jobPosts,
    });
    let isCompanyExist = await Company.findOne({name:name});
    if (isCompanyExist) return res.status(400).json({ message: "Company already exists", success: false });
    const company = await newCompany.save();
    return res.status(201).json({ message: "Company registered successfully", success: true, company });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error", success: false });
  }
}
export const getCompany=async (req, res)=>{
    try{
        const companies = await Company.find();
        return res.status(200).json({ message: "Companies fetched successfully", success: true, companies });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
}
export const getCompanyById = async (req,res)=>{
    try{
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company){
            return res.status(404).json({ message: "Company not found", success: false });
        }
        return res.status(200).json({ message: "Company fetched successfully", success: true, company });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
}

export const updateCompany = async (req,res)=>{
    try{
        const companyId = req.params.id;
        const updateData = req.body;
        const company = await Company.findByIdAndUpdate(
            companyId,
            { $set: updateData },
            { new: true }
        ).exec();
        if(!company){
            return res.status(404).json({ message: "Company not found", success: false });
        }
        return res.status(200).json({ message: "Company updated successfully", success: true, company });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: "Internal server error", success: false });
    }
}