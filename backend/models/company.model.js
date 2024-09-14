import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String,},
    website: { type: String,  },
    logo: { type: String, },
    employees: { type: Number, },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
});

export const Company = mongoose.model("Company", companySchema);