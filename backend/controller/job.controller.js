import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const postJob = async (req, res) => {
    try {
      const userId = req.id;
      const { title, company, description, location, jobType } = req.body;
  
      // Validate required fields
      if (!title || !company || !description || !location || !jobType) {
        return res.status(400).json({
          error: 'All required fields must be provided',
          success: false,
          requiredFields: ['title', 'company', 'description', 'location', 'jobType']
        });
      }
  
      const jobPost = new Job({
        title,
        description,
        location,
        jobType,
        salary: req.body.salary,
        skills: req.body.skills || [],
        position: req.body.position,
        company,  // Using 'company' to match model
        created_by: userId
      });
  
      await jobPost.save();
  
      return res.status(201).json({ 
        message: 'Job Post created successfully', 
        success: true, 
        jobPost 
      });
    } catch (err) {
      console.error('Job creation error:', err);
      return res.status(500).json({ 
        error: err.message || 'Server error', 
        success: false 
      });
    }
  }
export const getAllJobs = async (req, res) => {
    try {
      const { search, location, jobType } = req.query;
      let query = {};
      
      // Text search across multiple fields
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { 'company.name': { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      
      // Additional filters
      if (location) query.location = { $regex: location, $options: 'i' };
      if (jobType) query.jobType = jobType;
      
      const jobs = await Job.find(query)
        .populate("company", "name logo")
        .sort({ createdAt: -1 }); // Newest first
      
      return res.status(200).json({ 
        success: true, 
        count: jobs.length,
        jobs 
      });
      
    } catch (err) {
      console.error('Search error:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Server error during search' 
      });
    }
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