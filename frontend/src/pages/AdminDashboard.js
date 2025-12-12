import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ShoppingCart, LineChart, FilePlus, HomeIcon, MessageCircleIcon, BookMarkedIcon, AlignHorizontalJustifyStartIcon, Edit2Icon, PlusSquare } from "lucide-react";
import "./Dashboard.css";
import Chat from "../components/Chat";
import Notification from "./Notification"; // Import Notifications Page
import { useNavigate } from "react-router-dom"
import LogisticsProviderReg from "../components/LogisticsProviderReg";
import Users from "../components/Users";
import AdminOrdersView from "../components/AdminOrdersView";
import AdminOrderDashboard from "../components/AdminOrderDashboard";


// Inside JSX

const LogisticsDashboard = () => {
  const [activeSection, setActiveSection] = useState("logistics-register");
  const [user, setUser] = useState(null); 
  const navigate = useNavigate();     

  useEffect(() => {
    // Fetch user from local storage or API
    //const storedUser = JSON.parse(localStorage.getItem("user")); // Assuming user is stored in localStorage
    //setUser(storedUser);
    const raw = localStorage.getItem("user");
    const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;
  }, []);

  useEffect(() => {
    if (user?.is_temp_password) {
      navigate("/set-new-password");
    }
  }, [user]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="dashboard-title">Admin Dashboard</h2>
        <ul className="sidebar-menu">
          <li><Link to="/"><HomeIcon className="icon" />Home</Link></li>
          
          <li
            className={activeSection === "logistics-register" ? "active" : ""}
            onClick={() => setActiveSection("logistics-register")}
          >
            <Edit2Icon className="icon" /> Register Logistics
          </li>
          <li
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            <Bell className="icon" /> Users
          </li> 
           
          <li
            className={activeSection === "admin-orders" ? "active" : ""}
            onClick={() => setActiveSection("admin-orders")}
          >
            <PlusSquare className="icon" /> Orders
          </li> 

          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notification")}
          >
            <Bell className="icon" /> Notifications
          </li>
          
          <li
            className={activeSection === "chat_history" ? "active" : ""}
            onClick={() => setActiveSection("chat_history")}
          >
            <MessageCircleIcon className="icon" /> Message
          </li>
        </ul>
      </div>

      {/* Main Dashboard */}
      <div className="main-dashboard">
       
        {activeSection === "logistics-register" && <LogisticsProviderReg />}
        {activeSection === "users" && <Users />}
       
        {activeSection === "admin-orders" && <AdminOrderDashboard />}
        {activeSection === "notification" && <Notification />}
        {activeSection === "chat_history" && <Chat />}
        


      </div>
    </div>
  );
};

export default LogisticsDashboard;
