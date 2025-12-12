import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ProfileSetup.css";

const ProfileSetupBuyer = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        location: "",
        phone: "",
        profile_photo: null,
    });

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfile({ ...profile, profile_photo: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(profile).forEach(([key, value]) => {
            formData.append(key, value);
        });

        // Get token from local storage
        const token = localStorage.getItem("token");

        if (!token) {
            alert("You need to log in first!");
            navigate("/login");
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/buyer-profile/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // Include auth token
                },
            });

            alert("Buyer profile setup complete!");
            navigate("/dashboard-buyer"); // Redirect after setup
        } catch (error) {
            console.error("Profile setup failed:", error);

            if (error.response && error.response.status === 401) {
                alert("Session expired! Please log in again.");
                localStorage.removeItem("token");  // Remove invalid token
                navigate("/login");
            } else {
                alert("Failed to complete profile.");
            }
        }
    };

    return (
        <div>
            <Navbar />
            <div className="form-container">
                <h2>Buyer Profile Setup</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Profile Photo:</label>
                    <input type="file" name="profile_photo" accept="image/*" onChange={handleFileChange} required />

                    <label>First Name:</label>
                    <input type="text" name="first_name" value={profile.first_name} onChange={handleChange} required />

                    <label>Last Name:</label>
                    <input type="text" name="last_name" value={profile.last_name} onChange={handleChange} required />

                    <label>Location:</label>
                    <input type="text" name="location" value={profile.location} onChange={handleChange} />

                    <label>Phone Number:</label>
                    <input type="text" name="phone" value={profile.phone} onChange={handleChange} required />

                    <button type="submit" className="submit-btn">Save Profile</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSetupBuyer;
