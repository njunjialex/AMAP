import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, ShoppingCart, LineChart, FilePlus, HomeIcon, MessageCircleIcon } from "lucide-react";
import "./Dashboard.css";
import MarketPrices from "./MarketPrices"; // Import Market Prices Page
import Notification from "./Notification"; // Import Notifications Page
import Products from "./Products"; // Import Available Products Page
import ProductRequest from "./ProductRequest"; // Import Place Order Page
import ProfileView from "../components/profile/ProfileView";
import OrderTracking from "./OrderTracking";
import Chat from "../components/Chat";
import OrderManagement from "../components/OrderManagement";

// Inside JSX

const BuyerDashboard = () => {
  const [activeSection, setActiveSection] = useState("market-prices");
  const [user, setUser] = useState(null);      

  useEffect(() => {
    // Fetch user from local storage or API
    //const storedUser = JSON.parse(localStorage.getItem("user")); // Assuming user is stored in localStorage
    //setUser(storedUser);
    const raw = localStorage.getItem("user");
    const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="dashboard-title">Buyer Dashboard</h2>
        <ul className="sidebar-menu">
          <li><Link to="/"><HomeIcon className="icon" />Home</Link></li>
          <li
            className={activeSection === "market-prices" ? "active" : ""}
            onClick={() => setActiveSection("market-prices")}
          >
            <LineChart className="icon" /> Market Prices
          </li>
          <li
            className={activeSection === "products" ? "active" : ""}
            onClick={() => setActiveSection("products")}
          >
            <ShoppingCart className="icon" /> Available Products
          </li>
          <li
            className={activeSection === "product-request" ? "active" : ""}
            onClick={() => setActiveSection("product-request")}
          >
            <FilePlus className="icon" /> Place Order
          </li>
          <li
            className={activeSection === "orders" ? "active" : ""}
            onClick={() => setActiveSection("orders")}
          >
            <ShoppingCart className="icon" /> My Orders
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
            <Bell className="icon" /> Profile
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
        {activeSection === "product-request" && <ProductRequest />}
        {activeSection === "notification" && <Notification />}
        {activeSection === "profile-view" && <ProfileView />}
        {activeSection === "my-orders" && <OrderTracking />}
        {activeSection === "chat_history" && <Chat />}
        {activeSection === "orders" && <OrderManagement user={user} />}


      </div>
    </div>
  );
};

export default BuyerDashboard;
