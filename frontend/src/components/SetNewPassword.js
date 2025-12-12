// SetNewPassword.js
import React, { useState } from "react";
import axios from "axios";

const SetNewPassword = () => {
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/change-temp-password/",
        { new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Password updated successfully. Please log in again.");
      localStorage.removeItem("access");
      window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Failed to update password.");
    }
  };

  return (
    <div>
      <h2>Set New Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Set Password</button>
      </form>
    </div>
  );
};

export default SetNewPassword;
