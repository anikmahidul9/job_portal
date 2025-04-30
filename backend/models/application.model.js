// import mongoose from "mongoose";

// const applicationSchema = new mongoose.Schema({
//     job:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Job',
//         required: true,
//     },
//     applicant:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     status:{
//         type: String,
//         default: 'Pending',
//         enum: ['Pending', 'Accepted', 'Rejected']
//     },
// });

// export const Application = mongoose.model("Application", applicationSchema);

import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'interview_invited', 'rejected', 'hired'],
    default: 'applied'
  },
  interviewDetails: {
    date: Date,
    time: String,
    location: String,
    notes: String,
    meetingLink: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Application = mongoose.model("Application", applicationSchema);