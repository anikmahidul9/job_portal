import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from './utils/db.js';
import userRoute from "./routes/user.route.js";

dotenv.config({});
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: ['http://localhost:3001',], // Allow specific origins
    credentials: true,
}
app.use(cors(corsOptions));

app.use("/api/v1/user",userRoute);
const PORT =process.env.PORT|| 3000
app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server running on port ${PORT}`);
})