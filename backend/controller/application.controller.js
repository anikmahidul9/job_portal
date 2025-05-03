import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import mongoose from 'mongoose';
import { sendStatusEmail } from "../utils/emailService.js";

export const applyJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const userId = req.id;

        // Check if user already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You've already applied for this job",
                success: false
            });
        }

        // Create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
            status: 'applied'
        });

        // Add to job's applications
        await Job.findByIdAndUpdate(jobId, {
            $push: { applications: newApplication._id }
        });

        return res.status(201).json({
            message: "Application submitted successfully",
            success: true,
            application: newApplication
        });

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
      
      // Validate ObjectId format first
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid job ID format"
        });
      }
  
      const job = await Job.findOne({ 
        _id: jobId,
        created_by: req.id 
      }).lean();
  
      if (!job) {
        return res.status(404).json({ 
          success: false,
          message: "Job not found or unauthorized" 
        });
      }
  
      const applications = await Application.find({ job: jobId })
        .populate('applicant', 'name email profile')
        .lean();
  
      return res.status(200).json({
        success: true,
        applications
      });
  
    } catch (err) {
      console.error('Error in getApplicants:', err);
      return res.status(500).json({ 
        success: false,
        error: "Server error" 
      });
    }
  }

  export const updateStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status, interviewDetails } = req.body;
        
        // Validate application ID
        if (!mongoose.Types.ObjectId.isValid(applicationId)) {
            return res.status(400).json({ 
                message: "Invalid application ID", 
                success: false 
            });
        }

        const updateData = { 
            status,
            updatedAt: new Date() 
        };
        
        if (status === 'interview_invited' && interviewDetails) {
            updateData.interviewDetails = interviewDetails;
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { $set: updateData },
            { new: true }
        )
        .populate('applicant', 'name email')
        .populate('job', 'title');

        if (!application) {
            return res.status(404).json({ 
                message: "Application not found", 
                success: false 
            });
        }

        // Send email notification
        try {
            await sendStatusEmail({
                to: application.applicant.email,
                userName: application.applicant.name,
                jobTitle: application.job.title,
                status: status,
                interviewDetails: application.interviewDetails
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        return res.status(200).json({ 
            message: "Application status updated successfully", 
            success: true, 
            application 
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            error: "Server error", 
            success: false 
        });
    }
}

export const getUserApplicationStatuses = async (req, res) => {
    try {
        const userId = req.id; // Get logged-in user ID
        
        // Find all applications with status and basic job info
        const applications = await Application.find({ applicant: userId })
            .select('status createdAt updatedAt interviewDetails')
            .populate({
                path: 'job',
                select: 'title company',
                populate: {
                    path: 'company',
                    select: 'name'
                }
            })
            .sort({ updatedAt: -1 }); // Sort by most recent update

        if (!applications || applications.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No applications found",
                statuses: []
            });
        }

        // Format the response with status information
        const statuses = applications.map(app => ({
            jobId: app.job._id,
            jobTitle: app.job.title,
            companyName: app.job.company.name,
            status: app.status,
            lastUpdated: app.updatedAt,
            appliedDate: app.createdAt,
            interviewDetails: app.interviewDetails || null
        }));

        // Count statuses for summary
        const statusSummary = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            statuses,
            summary: {
                total: applications.length,
                ...statusSummary
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ 
            success: false,
            error: "Failed to fetch application statuses" 
        });
    }
}