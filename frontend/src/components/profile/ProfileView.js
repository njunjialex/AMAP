import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Profile.css';
import { Edit2Icon } from "lucide-react";

const ProfileView = () => {
  const [profile, setProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    fetchProfile();
    fetchReviews();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data);
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/reviews/user/${userId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(res.data.slice(0, 3)); // Only latest 3
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      {profile.profile_photo && (

        <img src={profile.profile_photo} alt="Profile" width="100" height="100"/>
      )}
      <p><strong>Username:</strong> @{profile.username} </p>
      <p><strong> Name:</strong> {profile.first_name} {profile.last_name}</p>
      
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Phone:</strong> {profile.phone}</p>
      <p><strong>Address:</strong> {profile.location}</p>

      <button onClick={() => navigate("/edit-profile")}><Edit2Icon className="icon" /> Edit Profile</button>
      <button onClick={() => navigate("/change-password")}>Change Password</button>

      <hr />

      <h3 style={{ marginTop: "30px" }}>Recent Buyer Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="review-card">
            <div className="stars">
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </div>
            <p><strong>{review.reviewer_name}</strong> says:</p>
            <p>"{review.comment}"</p>
          </div>
        ))
      )}

      <button onClick={() => navigate(`/reviews/${userId}`)} style={{ marginTop: "20px" }}>
        View All Reviews
      </button>
    </div>
  );
};

export default ProfileView;
