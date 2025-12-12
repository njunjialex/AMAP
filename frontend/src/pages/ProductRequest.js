import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ProductRequest.css";

const PostRequest = () => {
    const navigate = useNavigate();
    const [request, setRequest] = useState({
        product_name: "",
        quantity: "",
        measure: "",
        amount: "",
        expected_delivery: "",
        address: "",
        additional_notes: "",
        buyerId: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        setRequest({ ...request, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem("token");
        let buyerId = localStorage.getItem("user_id"); // ✅ Fetch buyer ID

        if (!token) {
            alert("You must be logged in to post a request.");
            navigate("/login");
            return;
        }

        const requestData = { ...request, buyer: buyerId }; // ✅ Include buyer ID

        try {
            // ✅ Send request to the backend
            await axios.post(
                "http://127.0.0.1:8000/api/post-request/",
                requestData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            alert("Request posted successfully!");
            navigate("/BuyerRequest");

        } catch (error) {
            console.error("Error posting request:", error.response?.data);

            if (error.response && error.response.status === 401) {
                // ✅ If Unauthorized (401), try refreshing the token
                try {
                    const refreshToken = localStorage.getItem("refresh_token");

                    if (!refreshToken) {
                        alert("Session expired. Please log in again.");
                        navigate("/login");
                        return;
                    }

                    const refreshResponse = await axios.post(
                        "http://127.0.0.1:8000/api/token/refresh/",
                        { refresh: refreshToken }
                    );

                    // ✅ Save new access token
                    localStorage.setItem("token", refreshResponse.data.access);
                    token = refreshResponse.data.access;

                    // ✅ Retry request with new token
                    await axios.post(
                        "http://127.0.0.1:8000/api/post-request/",
                        requestData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    alert("Request posted successfully!");
                    navigate("/buyer-dashboard");

                } catch (refreshError) {
                    console.error("Token refresh failed:", refreshError);
                    alert("Session expired. Please log in again.");
                    navigate("/login");
                }
            } else {
                alert("Failed to post request. Check the form and try again.");
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="post-request-container">
                <h2>Order an Agricultural Product</h2>
                <form onSubmit={handleSubmit}>
                    <label>Product Name:</label>
                    <input type="text" name="product_name" value={request.product_name} onChange={handleChange} required />

                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={request.quantity} onChange={handleChange} required />

                    <label>Measure:</label>
                    <input type="text" name="measure" value={request.measure} onChange={handleChange} required />

                    <label>Buying at:</label>
                    <input type="number" name="amount" value={request.amount} onChange={handleChange} required />

                    <label>Expected Delivery:</label>
                    <input type="date" name="expected_delivery" value={request.expected_delivery} onChange={handleChange} required />

                    <label>Location:</label>
                    <input type="text" name="address" value={request.address} onChange={handleChange} required />

                    <label>Additional Notes (Optional):</label>
                    <textarea name="additional_notes" value={request.additional_notes} onChange={handleChange} />

                    <button type="submit" className="submit-btn">Post Request</button>
                </form>
            </div>
        </div>
    );
};

export default PostRequest;
