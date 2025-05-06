import jwt from "jsonwebtoken"
import  User from "../models/user.model.js"

export const isLoggedIn=async(req,res,next)=>{
    try{
        const token = req.cookies.jwt; //gives value in object so it can accessable [cookie-parser]
        if(!token){
            return res.status(401).json({message:"Unauthorized user - no token provided"})
        }

        const decode= jwt.verify(token,process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({message:"Unauthorized user - Invalid token "})
        }

        const user= await User.findById(decode.userID).select("-password");
        if(!user){
            return res.status(404).json({message:"user not found"})
        }

        req.user =user;
        next();
    }catch(err){
        console.log("error in isLoggedIn middleware ",err.message)
        res.status(500).json({message:"internal server error"})
    }
}