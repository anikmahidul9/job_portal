import jwt from "jsonwebtoken";

const isAuthenticated =async (req, res, next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({error: "Not authorized, token required", success: false});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(403).json({error: "Invalid token", success: false});
        }
        req.id=decoded.userId;
        next();
    }catch(err){
        console.log(err);
    }
}

export default isAuthenticated;