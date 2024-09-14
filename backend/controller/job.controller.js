import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const postJob = async (req, res) => {
    try{
         const userId = req.id;
        const { title, companyId, description, location, jobType, salary, skills,position} = req.body;
        if(!title ||!companyId ||!description ||!location ||!jobType){
            return res.status(400).json({error: 'All fields are required', success: false});
        }
        const jobPost = new Job({
          title,
          description,
          location,
          jobType,
          salary,
          skills,
          position,
          company: companyId,
          created_by:userId,
        });
        await jobPost.save();
        return res.status(201).json({ message: 'Job Post created successfully', success: true, jobPost });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Server error', success: false });
    }
}

export const getAllJobs = async (req, res) =>{
    const keywords = req.query.keywords || [];
    const query = {
        $or: [
            { title: { $regex: keywords.join(' '), $options: 'i' } },
            { description: { $regex: keywords.join(' '), $options: 'i' } },
            { location: { $regex: keywords.join(' '), $options: 'i' } },
            { skills: { $all: keywords } },
        ],
    }
    const jobs = await Job.find(query);
    if(!jobs){
        return res.status(404).json({ message: 'No jobs found', success: false });
    }
    return res.status(200).json({ message: 'Jobs fetched successfully', success: true, jobs });
}

export const getJobById = async (req, res) => {
    try{
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({ message: 'Job not found', success: false });
        }
        return res.status(200).json({ message: 'Job fetched successfully', success: true, job });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Server error', success: false });
    }
}

export const getAdminJobs = async (req,res)=>{
    try{
       const adminId = req.id;
       const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            return res.status(404).json({ message: 'No jobs found', success: false });
        }
        return res.status(200).json({ message: 'Jobs fetched successfully', success: true, jobs });
    }catch(err){
        console.error(err);
        return res.status(500).json({ error: 'Server error', success: false });
    }
}