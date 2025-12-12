import React, { useState } from "react";
import axios from "axios";
import "./ReviewModal.css"; // Optional styling

const ReviewModal = ({ order, onClose }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/reviews/",
        {
          reviewer: localStorage.getItem("user_id"),
          reviewed_user: order.farmer, // or order.provider_id if it's logistics
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Review submitted successfully.");
      onClose(); // close modal
    } catch (error) {
      console.error("Error submitting review:", error.response?.data || error.message);
      alert("Failed to submit review.");
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <h3>Leave a Review</h3>
        <label>Rating (1 to 5):</label>
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>

        <label>Comment:</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Write your feedback here..."
        />

        <div className="modal-actions">
          <button onClick={submitReview}>Submit</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
