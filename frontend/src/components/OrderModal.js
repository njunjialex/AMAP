import React, { useState } from "react";
import axios from "axios";
import "./OrderModal.css";

const OrderModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const totalCost = quantity * product.selling_price;

  const handleOrder = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");

    if (!token) {
      alert("Please log in to place an order.");
      return;
    }

    const orderData = {
      buyer: userId,
      product_id: product.id,
      product_name: product.name,
      quantity,
      measure: product.measure,
      amount: totalCost,
      expected_delivery: new Date().toISOString().split("T")[0], // Default to today
      address,
      additional_notes: notes,
      status: "Pending",
      payment_status: "Not Paid",
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/create-order/", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Order placed successfully!");
      onClose();
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Order {product.name}</h2>
        <p>Price: KES {product.selling_price} per {product.measure}</p>

        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          min="1"
          max={product.quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <label>Address:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter delivery address"
        />

        <label>Additional Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests..."
        />

        <h3>Total: KES {totalCost.toFixed(2)}</h3>

        <button id="confirm" onClick={handleOrder}>Confirm Order</button>
        <button id="cancle" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default OrderModal;
