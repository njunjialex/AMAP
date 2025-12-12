import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    address: "",
    profile_photo: null,
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData(res.data);
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "profile_picture") {
      setFormData({ ...formData, profile_photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.put("http://127.0.0.1:8000/api/profile/edit/", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
      navigate("/profileView");
    } catch (err) {
      console.error("Profile update failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Profile</h2>
      <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" />
      <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" />
      <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
      <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
      <input type="file" name="profile_picture" onChange={handleChange} />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default ProfileEdit;
