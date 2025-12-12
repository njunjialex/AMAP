import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "farmer",  // Default role is 'farmer'
    });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (user.password !== user.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/register/", {
                username: user.username,
                email: user.email,
                password: user.password,
                role: user.role,
            });

            alert("Registration successful!");

            navigate("/Login");

            
        } catch (error) {
            console.error("Registration failed:", error);
            alert("Failed to register. Please try again.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="register-container">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <label>Username:</label>
                    <input type="text" name="username" value={user.username} onChange={handleChange} required />

                    <label>Email:</label>
                    <input type="email" name="email" value={user.email} onChange={handleChange} required/>

                    <label>Password:</label>
                    <input type="password" name="password" value={user.password} onChange={handleChange} required />

                    <label>Confirm Password:</label>
                    <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required />

                    <label>Select Role:</label>
                    <select name="role" value={user.role} onChange={handleChange} required>
                        <option value="farmer">Farmer</option>
                        <option value="buyer">Buyer</option>
                    </select>

                    <button type="submit" className="register-btn">Register</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
