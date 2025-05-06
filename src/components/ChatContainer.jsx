import { useEffect, useRef } from 'react';
import {useChatStore} from '../store/useChatStore';
import { MessageInput } from './MessageInput';
import  ChatHeader  from './ChatHeader';
import MessageSkeleton from "./Skeletons/MessageSkeleton"
import { useAuthStore } from '../store/useAuthStore';
import {formatMessageTime} from "../lib/utils"


export const ChatContainer = () => {

  const {messages, getMessages,isMessagesLoading, selectedUser, subscribeToMessage,usubscribeToMessage}= useChatStore();
  const {authUser}=useAuthStore();
  const messageEndRef= useRef(null);

  useEffect(() => {
    
      getMessages(selectedUser._id);

      subscribeToMessage();
      return()=> usubscribeToMessage();
    
  }, [selectedUser._id, getMessages, subscribeToMessage,usubscribeToMessage]);

  useEffect(()=>{
    if(messageEndRef.current && messages)
    messageEndRef.current.scrollIntoView({behavior:"smooth"});
  },[messages])
  // useEffect(()=>{
  //   getMessages(selectedUser._id);
  // },[selectedUser._id, getMessages])

  if(isMessagesLoading) return (
    <div className='flex-2 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>

    </div>
  )

  

  return (
  <div className="flex-1 flex flex-col overflow-auto"> 
  <ChatHeader/>

 <div className='flex-1 overflow-y-auto p-4 space-y-4'>
  {messages.map((message)=>(
    <div key={message._id}
    className={`chat ${message.senderID===authUser._id?"chat-end":"chat-start"}`}
    ref={messageEndRef}>
      <div className='chat-image avatar'>
        <div className='size-10 rounded-full border'>
          <img src={message.senderID===authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="profile Pic" />

        </div>

      </div>
      <div className='chat-header mb-1'>
        <time className='text-xs opacity-50 ml-1' datetime='2025-10-10'></time>
        {formatMessageTime(message.createdAt)}
      </div>
      <div className='chat-bubble flex  flex-col'>
        {message.image &&(
          <img
           src={message.image}
           alt="attachment"
           className='sm:max-w-[200px] rounded-md mb-2' />
        )}
        {message.text && <p>{message.text}</p>}
      </div>

    </div>
  ))}
 </div>

  <MessageInput/>

  </div>
)}
