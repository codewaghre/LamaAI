import React from 'react'
import './DashboardLayout.css'
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import ChatList from '../components/chatList/ChatList';
import Dashboard from '../routes/dashBoardPage/Dashboard';

function DashboardLayout() {
  const { userId, isLoaded } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]);

  if (!isLoaded) return "Loading...";

  return (

      <div className="dashboardLayout">
      
      <div className="menu"><ChatList/></div>
      <div className="content">
         <Outlet/>
        {/* <Dashboard /> */}
      </div>
    </div>
        
      
  )
}

export default DashboardLayout