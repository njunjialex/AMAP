import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TransportModal.css";

const TransportModal = ({ order, onClose }) => {
  const [formData, setFormData] = useState({
    pickup_address: "",
    destination_address: "",
    expected_delivery: "",
    commodity: "",
    quantity: "",
    measure: "",
    logistics_provider: '',
    order: order.id
  });

  const [logistics_providers, setProviders] = useState([]);

  useEffect(() => {
    // Pre-fill quantity and expected_delivery from order
    setFormData((prev) => ({
      ...prev,
      expected_delivery: order.expected_delivery,
      quantity: order.quantity, measure: order.measure,
      commodity: order.product_name
    }));

    const fetchProviders = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/logistics-providers/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProviders(response.data);
      } catch (error) {
        console.error("Failed to fetch providers", error);
      }
    };

    fetchProviders();
  }, [order]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.post("http://127.0.0.1:8000/api/book-transport/", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Transport booked!");
      onClose();
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert("Failed to book transport. Please check the form and try again.");
    }
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit} className="modal-content">
        <h3>Book Transportation</h3>
        <input
          type="text"
          name="pickup_address"
          placeholder="Pickup Address"
          value={formData.pickup_address}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="destination_address"
          placeholder="Destination Address"
          value={formData.destination_address}
          onChange={handleChange}
          required
        />
        <select
          name="logistics_provider"
          value={formData.logistics_provider}
          onChange={handleChange}
          required
        >
          <option value="">Select Logistics Company</option>
          {logistics_providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.company_name}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
        <button onClick={onClose} type="button">Cancel</button>
      </form>
    </div>
  );
};

export default TransportModal;
