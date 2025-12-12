import { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import Products from "./pages/Products";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import About from "./pages/About";
import ProfileSetupFarmer from "./pages/ProfileSetupFarmer";
import ProfileSetupBuyer from "./pages/ProfileSetupBuyer";
import ProductRequest from "./pages/ProductRequest";
import BuyerRequest from "./pages/BuyerRequest";
import Notification from "./pages/Notification";
import MarketPrices from "./pages/MarketPrices";
import PriceTrends from "./pages/PriceTrends";
import BuyerDashboard from "./pages/BuyerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import LogisticsDashboard from "./pages/LogisticsDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import OrderTracking from "./pages/OrderTracking";
import Chat from "./components/Chat";
import FarmerProducts from "./pages/FarmerProducts";
import OrderManagement from "./components/OrderManagement";
import Logistics from "./components/Logistics";
import LogisticsProviderReg from "./components/LogisticsProviderReg";
import TransportModal from "./components/TransportModal";
import SetNewPassword from "./components/SetNewPassword";
import LogisticsAnalytics from "./components/LogisticsAnalytics";
import BookingsChart from "./components/BookingChart";
import Homepage from "./pages/Homepage";
import ProfileView from "./components/profile/ProfileView";
import EditProfile from "./components/profile/EditProfile";
import ChangePassword from "./components/profile/ChangePassword";
import CategoryProducts from "./pages/CategoryProducts";
import ReviewModal from "./components/ReviewModal";
import Users from "./components/Users";
import AdminOrdersView from "./components/AdminOrdersView";
import AdminOrderDashboard from "./components/AdminOrderDashboard";


function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/")
            .then(response => setMessage(response.data.message))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* Home Page */}
                <Route 
                    path="/" 
                    element={
                        <>
                            <Navbar />
                            {/*<Hero />  
                            <Products />*/}
                            <Homepage />
                           
                        </>
                    } 
                />
                <Route path="/admin-orders" element={<AdminOrderDashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/orders-view" element={<AdminOrdersView />} />
                <Route path="/category-products" element={<CategoryProducts />} />
                <Route path="/products" element={<Products />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/about" element={<About />} />
                <Route path="/farmer-profile" element={<ProfileSetupFarmer />} />
                <Route path="/buyer-profile" element={<ProfileSetupBuyer />} />

                <Route path="/ProductRequest" element={<ProductRequest />} />
                <Route path="/BuyerRequest" element={<BuyerRequest />} />

                <Route path="/notification" element={<Notification />} />

                <Route path="/market-prices" element={<MarketPrices />} />
                <Route path="/BuyerDashboard" element={<BuyerDashboard />} />

                <Route path="/FarmerDashboard" element={<FarmerDashboard />} />
                <Route path="/LogisticsDashboard" element={<LogisticsDashboard />} />
                <Route path="/Admin" element={<AdminDashboard />} />
                <Route path="/market-prices" element={<PriceTrends />} />
                

                <Route path="/orders" element={<OrderTracking />} />

                <Route path="/chat_history" element={<Chat />} />
                <Route path="/FarmerProducts" element={<FarmerProducts />} />
                <Route path="/OrderManagement" element={<OrderManagement />} />
                <Route path="/Logistics" element={<Logistics />} />
                <Route path="/logistics-register" element={<LogisticsProviderReg />} />
                <Route path="/TransportModal" element={<TransportModal />} />
                <Route path="/set-new-password" element={<SetNewPassword />} />
                <Route path="/logistics-analytics" element={<LogisticsAnalytics />} />
                <Route path="/bookings-chart" element={<BookingsChart />} />
                <Route path="/profile-view" element={<ProfileView />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/review" element={<ReviewModal />} />


            </Routes>

            {/* Display API Message */}
            <div>{message}</div>
        </BrowserRouter>
    );
}

export default App;
