import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ShoppingCart, LineChart, FilePlus, HomeIcon, MessageCircleIcon, BookMarkedIcon, AlignHorizontalJustifyStartIcon, PersonStanding } from "lucide-react";
import "./Dashboard.css";
import ProfileView from "../components/profile/ProfileView";
import Chat from "../components/Chat";
import Notification from "./Notification"; // Import Notifications Page
import { useNavigate } from "react-router-dom"
import Logistics from "../components/Logistics";
import LogisticsAnalytics from "../components/LogisticsAnalytics";
import BookingsChart from "../components/BookingChart";


// Inside JSX

const LogisticsDashboard = () => {
  const [activeSection, setActiveSection] = useState("logistics-analytics");
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
        <h2 className="dashboard-title">Logistics Dashboard</h2>
        <ul className="sidebar-menu">
          <li><Link to="/"><HomeIcon className="icon" />Home</Link></li>
          <li
            className={activeSection === "logistics-analytics" ? "active" : ""}
            onClick={() => setActiveSection("logistics-analytics")}
          >
            <LineChart className="icon" /> Analytics
          </li>
          <li
            className={activeSection === "bookings-chart" ? "active" : ""}
            onClick={() => setActiveSection("bookings-chart")}
          >
            <AlignHorizontalJustifyStartIcon className="icon" /> Booking View
          </li>
          <li
            className={activeSection === "logistics" ? "active" : ""}
            onClick={() => setActiveSection("logistics")}
          >
            <BookMarkedIcon className="icon" /> My Bookings
          </li>
         
          

          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notification")}
          >
            <Bell className="icon" /> Notifications
          </li>
          <li
            className={activeSection === "profile-view" ? "active" : ""}
            onClick={() => setActiveSection("profile-view")}
          >
            <PersonStanding className="icon" /> Profile
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
        {activeSection === "logistics-analytics" && <LogisticsAnalytics />}
        {activeSection === "bookings-chart" && <BookingsChart />}
        {activeSection === "logistics" && <Logistics />}
        {activeSection === "notification" && <Notification />}
        {activeSection === "profile-view" && <ProfileView />}
        {activeSection === "chat_history" && <Chat />}
        


      </div>
    </div>
  );
};

export default LogisticsDashboard;
