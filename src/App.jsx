import React, { useEffect } from 'react'
import  Navbar  from './components/Navbar'
import HomePage from './components/pages/HomePage'
import LoginPage from "./components/pages/LoginPage"
import SettingsPage from "./components/pages/SettingsPage"
import ProfilePage from "./components/pages/ProfilePage"
import SignUpPage from "./components/pages/SignUpPage"
import {Routes,Route,Navigate} from "react-router-dom"
import { useAuthStore } from './store/useAuthStore'
import {Loader} from "lucide-react";
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'






const App = () => {
  const {authUser,CheckAuth,isCheckingAuth , onlineUsers}=useAuthStore();
  const {theme}=useThemeStore();

  console.log({onlineUsers});

  useEffect(()=>{
    CheckAuth()
    
  },[CheckAuth])


console.log({authUser});



if(isCheckingAuth && !authUser) return(
  <div className="flex justify-center items-center h-screen ">
  <Loader className="size-10 animate-spin"/>
  </div>
)

  return (
    <div data-theme={theme} >

      <Navbar/>
      
      <Routes>
        <Route path="/" element={authUser ?   <HomePage /> : <Navigate to="/login"/>} />
        <Route path="/signup" element={!authUser ? <SignUpPage/> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser?  <LoginPage/> : <Navigate  to="/"/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
      </Routes>

      <Toaster/>
      
    </div>
  )
}

export default App