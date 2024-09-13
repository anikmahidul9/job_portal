import mongoose  from "mongoose";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber:{type:Number,required: true, unique: true},
    role: { type: String, default: 'user' },
    profile:{
        bio: { type: String},
        skills: { type: String},
        resume: { type: String},
        company:{type:mongoose.Schema.Types.ObjectId,ref:'Company'},
        profilePhoto:{
            type: String,
            default: ''
        }
        
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },

});

export const User = mongoose.model("User",userSchema);