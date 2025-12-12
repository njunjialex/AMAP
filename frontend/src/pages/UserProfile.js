import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserProfile.css"

const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    location: "",
    profile_photo: null,
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  // Fetch buyer profile from the API
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfile({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          phone: res.data.phone,
          location: res.data.location,
          profile_photo: res.data.profile_photo,
        });
      })
      .catch((error) => console.error("Error fetching profile:", error));
  }, []);

  // Handle input change for profile fields
  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
  const handleFileChange = (e) => {
    setProfile({ ...profile, profile_photo: e.target.files[0] });
  };

  // Handle password change input
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // Submit profile updates
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", profile.first_name);
    formData.append("last_name", profile.last_name);
    formData.append("phone", profile.phone);
    formData.append("location", profile.location);
    if (profile.profile_photo) {
      formData.append("profile_photo", profile.profile_photo);
    }
    const token = localStorage.getItem("token");
    axios
      .put("http://127.0.0.1:8000/api/profile/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => setMessage("Profile updated successfully!"))
      .catch(() => setMessage("Error updating profile"));
  };

  // Submit password change
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    axios
      .post("http://127.0.0.1:8000/api/change-password/", passwords, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => setMessage("Password changed successfully!"))
      .catch(() => setMessage("Error changing password"));
  };

  return (
    <div className="profile-container">
      <h2>Buyer Profile</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleProfileSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="first_name"
            value={profile.name}
            onChange={handleProfileChange}
            required
          />
        </div>

        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="last_name"
            value={profile.email}
            onChange={handleProfileChange}
            required
          />
        </div>

        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleProfileChange}
            required
          />
        </div>

        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={profile.address}
            onChange={handleProfileChange}
            required
          />
        </div>

        <div>
          <label>Profile Photo:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <button type="submit">Update Profile</button>
      </form>

      <h3>Change Password</h3>
      <form onSubmit={handlePasswordSubmit}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default Profile;
