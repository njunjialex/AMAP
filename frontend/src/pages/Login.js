import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  // Import navigate for redirection
import Navbar from "../components/Navbar";
import "./Auth.css";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Clear previous messages

        try {
            const response = await fetch("http://127.0.0.1:8000/api/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                // Store the access token and user details
                

                localStorage.setItem("token", data.access);
                localStorage.setItem("username", data.username);
                localStorage.setItem("user_id", data.id);
                localStorage.setItem("role", data.role);  // Store user role
                localStorage.setItem("password", data.is_temp_password);
                //localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Login successful!");
                if (data.role === "farmer") {
                    navigate("/FarmerDashboard");
                }
                else if(data.role === "logistics_provider"){
                    navigate("/LogisticsDashboard");
                }
                else {
                    navigate("/BuyerDashboard");
                }
            
                  
               
            } else {
                setMessage(data.error || "Login failed.");
            }
        } catch (error) {
            setMessage("Something went wrong.");
        }
    };

    return (
        <div className="auth-container">
            <Navbar />
            <h2>Login</h2>
            {message && <p className="message">{message}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
                <p> Don't have an account? <a href="/Register">Register</a></p>
            </form>
        </div>
    );
};

export default Login;
