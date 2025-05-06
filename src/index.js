// const express =require("express");
import express from "express" //framework
import dotenv from 'dotenv'//for .env file to access
import {connectDB} from "./lib/db.js"
import authRoutes from "./routes/auth.Route.js"
import messageRoutes from "./routes/message.Route.js"
import cookieparser from "cookie-parser"
import cors from "cors"
import { app ,server} from "./lib/socket.js"
// const app =express();

import path from "path"



dotenv.config() //for .env file to access
const PORT= process.env.PORT;//for .env file to access
const __dirname=path.resolve();
app.use(express.json());//exract the json data from body
app.use(cookieparser());// to parse cookie
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    
})); 


app.use("/api/auth",authRoutes);    
app.use("/api/messages",messageRoutes); 
app.use((err, req, res, next) => {
    console.error("🔥 Global error handler caught:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  });
  

server.listen(PORT,()=>{
    console.log("server is runing on port",PORT);
    connectDB();
})