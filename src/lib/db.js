import mongoose from "mongoose";

export const connectDB=async()=>{
    try{
        const conn= await mongoose.connect(process.env.MONGODB_URL);
        console.log(`successfully connected to database ${conn.connection.host}`);
        
    }catch(err){
        console.log("error in mongodb connection" ,err);
        
    }
}