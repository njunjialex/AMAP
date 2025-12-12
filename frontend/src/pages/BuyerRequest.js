import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./BuyerRequest.css";

const BuyerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            let token = localStorage.getItem("token");
            
            if (!token) {
                console.error("No token found. Please log in.");
                setLoading(false);
                return;
            }

            try {
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.get("http://127.0.0.1:8000/api/unassigned-orders/", { headers });
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const acceptOrder = async (OrderId) => {
        let token = localStorage.getItem("token");
    
        if (!token) {
            alert("You must be logged in to accept an order.");
            return;
        }
    
        try {
            await axios.put(
                `http://127.0.0.1:8000/api/accept-order/${OrderId}/`,
                {},  // Empty request body
                { headers: { Authorization: `Bearer ${token}` } } // Pass headers separately
            );
            alert("Order accepted successfully!");
        } catch (error) {
            console.error("Error accepting order:", error.response?.data || error.message);
        }
    };
    

    return (
        <div>
            <Navbar />
            <div className="buyer-requests-container">
                <h2>Available Buyer Requests</h2>
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="requests-list">
                        {orders.map((order) => (
                            <div key={order.id} className="request-card">
                                <h3>{order.product_name}</h3>
                                <p>{order.created_at}</p>
                                <p><strong>Buyer:</strong> {order.buyer|| "Unknown"}</p>
                                <p><strong>Quantity:</strong> {order.quantity} {order.measure}</p>
                                <p><strong>Expected Delivery:</strong> {order.expected_delivery}</p>
                                <p><strong>Location:</strong> {order.address}</p>
                                <p>{order.additional_notes}</p>
                                <p><strong>Buying @ KES:</strong> {order.amount}</p>
                                <button onClick={() => acceptOrder(order.id)}>Accept Order</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyerOrders;