import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

export const applyJob = async (req, res) => {
    try {
        const  jobId  = req.params.id;
        const userId = req.id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        })
     
          job.applications.push(newApplication._id);
          await job.save();
          return res.status(201).json({
            message: "Job applied successfully.",
            success: true,
          })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    }
}

export const getAppliedJob = async (req, res) => {
    try {
        const userId = req.id;
     const applications = await Application.find({ applicant: userId })
       .sort({ createdAt: -1 })
       .populate({
        path: "job",
        options: {sort: {createdAt: -1}},
        populate: {path: "company"},
       });
        if (!applications) {
            return res.status(404).json({ message: "No applications found", success: false });
        }
        return res.status(200).json({ message: "Applications fetched successfully", success: true, applications });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    } 
}

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications",
            options: { sort: { createdAt: -1 } },
            populate: { path: "applicant" },
        });
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
     
        return res.status(200).json({ message: "Applicants fetched successfully", success: true, job });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    }
}


export const updateStatus = async (req,res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(
            applicationId,
            { $set: { status } },
            { new: true }
        ).exec();
        if (!application) {
            return res.status(404).json({ message: "Application not found", success: false });
        }
        return res.status(200).json({ message: "Application status updated successfully", success: true, application });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", success: false });
    }
}