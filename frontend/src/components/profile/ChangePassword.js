import React, { useState } from "react";
import axios from "axios";
import "./Profile.css";

const ChangePassword = () => {
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/change-password/", {
        old_password: passwords.old_password,
        new_password: passwords.new_password,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Password changed successfully.");
    } catch (err) {
      console.error("Password change failed:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Change Password</h2>
      <input type="password" name="old_password" onChange={handleChange} placeholder="Old Password" />
      <input type="password" name="new_password" onChange={handleChange} placeholder="New Password" />
      <input type="password" name="confirm_password" onChange={handleChange} placeholder="Confirm New Password" />
      <button type="submit">Change Password</button>
    </form>
  );
};

export default ChangePassword;
