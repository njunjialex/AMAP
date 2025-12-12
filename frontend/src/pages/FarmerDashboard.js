import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ShoppingCart, LineChart, FilePlus, HomeIcon, MessageCircleIcon, List, Settings2Icon, BookMarkedIcon, ListOrdered, PlusSquareIcon, ListOrderedIcon, LogInIcon, PersonStanding, PersonStandingIcon, } from "lucide-react";
import "./Dashboard.css";
import MarketPrices from "./MarketPrices"; // Import Market Prices Page
import Notification from "./Notification"; // Import Notifications Page
import Products from "./Products"; // Import Available Products Page
import Upload from "./Upload";
import ProfileView from "../components/profile/ProfileView";
import OrderTracking from "./OrderTracking";
import Chat from "../components/Chat";
import FarmerProducts from "./FarmerProducts";
import OrderManagement from "../components/OrderManagement";
import Logistics from "../components/Logistics";
import BuyerRequest from "./BuyerRequest";

const BuyerDashboard = () => {
  const [activeSection, setActiveSection] = useState("market-prices");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch user from local storage or API
   //const user = JSON.parse(localStorage.getItem("user")); // Assuming user is stored in localStorage
    
    const user = localStorage.getItem("user");
  
    //const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;
    setUser(user);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="dashboard-title">Welcome {}</h2>
        <ul className="sidebar-menu">
          <li><Link to="/"><HomeIcon className="icon" />Home</Link></li>
          <li
            className={activeSection === "market-prices" ? "active" : ""}
            onClick={() => setActiveSection("market-prices")}
          >
            <LineChart className="icon" /> Market Prices
          </li>
          
          <li
            className={activeSection === "upload" ? "active" : ""}
            onClick={() => setActiveSection("upload")}
          >
            <PlusSquareIcon className="icon" /> Add Catalog
          </li>
          <li
            className={activeSection === "my-catalog" ? "active" : ""}
            onClick={() => setActiveSection("my-catalog")}
          >
            <List className="icon" /> My Catalog
          </li>
          <li
            className={activeSection === "BuyerRequest" ? "active" : ""}
            onClick={() => setActiveSection("BuyerRequest")}
          >
            <FilePlus className="icon" /> Available Orders
          </li>
          <li
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => setActiveSection("orders")}
          >
            <ListOrderedIcon className="icon" /> Order Management
          </li>

          <li
            className={activeSection === "notifications" ? "active" : ""}
            onClick={() => setActiveSection("notification")}
          >
            <Bell className="icon" /> Notifications
          </li>
          <li
            className={activeSection === "logistics" ? "active" : ""}
            onClick={() => setActiveSection("logistics")}
          >
            <BookMarkedIcon className="icon" /> Transport Bookings
          </li>
          <li
            className={activeSection === "profile-view" ? "active" : ""}
            onClick={() => setActiveSection("profile-view")}
          >
            <PersonStandingIcon className="icon" /> Profile
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
        {activeSection === "market-prices" && <MarketPrices />}
        {activeSection === "products" && <Products />}
        {activeSection === "upload" && <Upload />}
        {activeSection === "my-catalog" && <FarmerProducts />}
        {activeSection === "logistics" && <Logistics />}
        {activeSection === "notification" && <Notification />}
        {activeSection === "profile-view" && <ProfileView />}
        {activeSection === "my-orders" && <OrderTracking />}
        {activeSection === "BuyerRequest" && <BuyerRequest />}
        {activeSection === "chat_history" && <Chat />}
        {activeSection === "orders" && <OrderManagement user={user} />}


      </div>
    </div>
  );
};

export default BuyerDashboard;
