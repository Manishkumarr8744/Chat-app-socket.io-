import {create } from "zustand"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false, 
    isLogginging:false,
    isupdateingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,

    CheckAuth:async()=>{
        try{
            const res =await  axiosInstance.get("/auth/check");
            set({authUser:res.data});
            console.log("doneee");
            


            get().connectSocket();


        }catch(err){
            console.log("error in checkauth",err);
            set({authUser:null})
            
        }finally{
            set({isCheckingAuth:false})
        }


    },
    signup:async(data)=>{
        set({isSigningUp :true});
        try {
          const res=  await axiosInstance.post("/auth/signup", data) 
          set({authUser:res.data})
          toast.success("Account created Successfully");

          get().connectSocket()


        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isSigningUp:false})
        }

    },

    login:async(data)=>{
        set({isLogginging:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
            
            get().connectSocket();
            
        } catch (error) {
            toast.error(error.response.data.message)
        }finally{
            set({isLogginging:false})
        }


    }
    ,

    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logout successfully");

            get().disconnectSocket()

        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile:async(data)=>{
        console.log("profile sent:",data);
        
        set({ isupdateingProfile: true });
        try {
          const res = await axiosInstance.put("/auth/update-profile", data);
          console.log("updated dataaa:",res.data);
          
          set({ authUser: res.data });
          toast.success("Profile updated successfully");
        } catch (error) {
          console.log("error in update profile:", error);
          toast.error(error.response.data.message);
        } finally {
          set({ isupdateingProfile: false });
        }
    },

    connectSocket:()=>{
        const {authUser} =get();
        if(!authUser || get().socket?.connected) return;

        const socket =io(BASE_URL,
            {
                query:{
                    userId:authUser._id,
                }
            }
        )
        socket.connect();
        
        set({socket:socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();

    }

 
}))