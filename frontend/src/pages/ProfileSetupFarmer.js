import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ProfileSetup.css";

const ProfileSetupFarmer = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        farming_type: "",
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
            await axios.post("http://127.0.0.1:8000/api/farmer-profile/", 
                formData, {

                    headers: { 
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`

                    },          
            

                }
            );

            alert("Farmer profile setup complete!");
            navigate("/dashboard-farmer"); // Redirect after setup
        } catch (error) {
            console.error("Profile setup failed:", error);
            alert("Failed to complete profile.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="form-container">
                <h2>Farmer Profile Setup</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Profile Photo:</label>
                    <input type="file" name="profile_photo" accept="image/*" onChange={handleFileChange} required />

                    <label>First Name:</label>
                    <input type="text" name="first_name" value={profile.first_name} onChange={handleChange} required />

                    <label>Last Name:</label>
                    <input type="text" name="last_name" value={profile.last_name} onChange={handleChange} required />

                    <label>Type of Farming:</label>
                    <input type="text" name="farming_type" value={profile.farming_type} onChange={handleChange} />

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

export default ProfileSetupFarmer;
