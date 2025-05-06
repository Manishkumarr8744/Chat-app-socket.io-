import express from "express";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utlis.js";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import cloudinary from "../lib/cloudinary.js";

const router =express.Router();

//signup route
router.post("/signup",async(req,res)=>{
    const{ fullName,email,password}=req.body;
    console.log(fullName,email,password);
    
    try{
        if(!fullName|| !email || !password){
            return res.status(400).json({ message:"ALL fields are required!"});

        }
        if(password.length<6){
            return res.status(400).json({ message:"PAssword must be at least 6 characters!!"});
        }

        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email already linked with another account"});
        }

        const salt =await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        const  newUser = new User({
            fullName,
            email,
            password:hashedPassword
        })
        if(newUser){
            //generate JWT token here
            generateToken(newUser._id,res)
            await newUser.save()

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilepic
            })
        }else{
            res.status(400).json({message:"Inavlid user data"})
        }

    }catch(err){
        console.log("error in sign up auth ", err);
        res.status(500).json({message:"Internal server error"})

    }
})

//login route
router.post("/login",async(req,res)=>{
    const  {email,password}=req.body;
    try{
        const user =await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"invalid details..!!"})
        }

       const isPasswordCorrect= await bcrypt.compare(password,user.password)
       if(!isPasswordCorrect){
        return res.status(400).json({message:"invalid Password..!!"})

       }

       generateToken(user._id,res)
       
       res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilepic:user.profilepic
       })

    }catch(err){
console.log("error in login detials",err.message);
return res.status(501).json({message:"internal server error"})

    }
})


//logout route
router.post("/logout",(req,res)=>{

    // res.send("logout route")
    try{
        res.cookie("jwt","",{maxAge:0})//empty the token by "" 
         res.status(200).json({message:"Logged Out successfully"})

    }catch(err){
        console.log("Error in logout authroute");
    }
})

//update profile picture
router.put("/update-profile",isLoggedIn ,async(req,res)=>{
    try {

        console.log("profile pic is recieved");
        console.log(req.user);

        


        const {profilePic}=req.body;
        console.log("profle pic get from ",profilePic);
        
        const userID=req.user._id;

        console.log("profilePic:", profilePic);
    console.log("userID:", userID);

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"})
        }
       const uploadResponse= await cloudinary.uploader.upload(profilePic);
       console.log("uploadResponse:", uploadResponse);

       const updatedUser=await User.findByIdAndUpdate( userID,{profilepic:uploadResponse.secure_url},{new:true})//new :true gives updated document
       console.log("updatedUser:", updatedUser);

       res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile picture", error)
        return res.status(500).json({message:"internal sever error"})
    }

} )

//CHECK ROUTE
router.get("/check", isLoggedIn, async(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(err){
        console.log("error in check",err.message);
        res.status(500).json({message:"Internal server error"});

    }
})




// manishchatpapp
// manishchatpapp87

export default router;