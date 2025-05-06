import { create  } from "zustand";

import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import{useAuthStore} from "./useAuthStore";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,


    getUser:async()=>{
        set({isUserLoading:true});
        try {
            const res =await axiosInstance.get("/messages/users");
            console.log("coming data:",res.data);
            
            set({users:res.data})
        } catch (error) {
            toast.error(error.response.data.message);      
        }finally{
           set({isUserLoading:false})
        }
    }
,
    getMessages:async(userID)=>{
        set({isMessagesLoading:true})
        try {
            const res=await axiosInstance.get(`/messages/${userID}`)
            set({messages:res.data})
        } catch (error) {
            toast.error("no message here coming from getmessages",error.message)
        }finally{
            set({isMessagesLoading:false})
        }

    },

    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get();
        try {
            const res= await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message)
        }
    },

    subscribeToMessage:()=>{
        const {selectedUser}= get();
        if(!selectedUser) return

       const socket= useAuthStore.getState().socket;

       socket.on("newMessage", (newMessage)=>{
        const isMessageSentFromSelectedUSer=newMessage.senderID!==selectedUser._id
        if(!isMessageSentFromSelectedUSer) return;

        set({
            messages:[...get().messages, newMessage]
        })
       })
    },
    usubscribeToMessage:()=>{
        const socket= useAuthStore.getState().socket;
        socket.off("newMessage");

    }
    ,
    setSelectedUser:(selectedUser)=>
        set({selectedUser})
    ,

}))