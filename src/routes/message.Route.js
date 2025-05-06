import express from "express";
import { isLoggedIn } from "../middleware/auth.middleware.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const router =express.Router();

//for user Sidebar and show all user expect the logged in(you)
router.get("/users", isLoggedIn,async(req,res)=>{
    try {
        const  loggedInUserId=req.user._id;
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        console.log(filteredUsers);
        

        res.status(200).json(filteredUsers)
        
    } catch (error) {
        console.log("error in sidebar:",error);
        res.status(500).json({error:"Internal server error"});
    }
})

//get messages on screen
router.get("/:id",isLoggedIn,async(req,res)=>{
    try {
        const {id}=req.params; //id to user chat
        const myid=req.user._id;
        console.log("send id:",myid);
        

        const message =await  Message.find({
            $or:[   
                {senderID:myid,receiverID:id},//sender to user
                {senderID:id,receiverID:myid},//user to sender
            ]
        })
        console.log("message",message);
        res.status(200).json(message)
        
    } catch (error) {
        console.log("Error in getmessages:",error.message);
        res.status(500).json({error:"internal server error"})
    }
})

//post  new messages to user or sender || send new message
router.post("/send/:id",isLoggedIn,async(req,res)=>{
    try {
        const {text ,image}=req.body;
        const {id:receiverID}= req.params; //reciever id or use in recevier id in newMessage
        const senderID=req.user._id;

        let imageUrl;
         if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
         }

         const newMessage= new Message({
            senderID,
            receiverID,
            text,
            image:imageUrl
         })
         console.log("new mwessages", newMessage);
         

         await newMessage.save();

         //done: the new message get only on reciever screen 
         const recevierSocketId=getReceiverSocketId(receiverID);
         if(recevierSocketId){
            io.to(recevierSocketId).emit("newMessage", newMessage)
         }

         res.status(201).json(newMessage)
        
    } catch (error) {
        console.log("error in send message",error.message);
        res.status(500).json({error:"internal server error"})
    }
})


export default router;