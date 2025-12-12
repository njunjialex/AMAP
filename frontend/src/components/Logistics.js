import React, { useEffect, useState } from "react";

import axios from "axios";
import "./Logistics.css";

const LogisticsDashboard = () => {
  const [bookings, setBookings] = useState([]);
  
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user_id")
  const role = user?.role || localStorage.getItem("role") || "guest";


    /*fVlH0HiBVck*/
    //const user = JSON.parse(localStorage.getItem("user")); // Now it's an object
   // const raw = localStorage.getItem("user");
   // const user = raw && raw !== "undefined" ? JSON.parse(raw) : null;


    
    

  useEffect(() => {
    fetchBookings();
  }, []);  


  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/my-booking/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
    
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/my-booking/${bookingId}/update-status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchBookings(); // Refresh bookings
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="logistics-dashboard">
      <h2>My Transport Bookings</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Booking Id</th>
            {role === "logistics_provider" && <th>From</th>}
            {role === "logistics_provider" && <th>Phone</th>}
            {role === "farmer" && <th>Logistics Provider</th>}
            {role === "farmer" && <th>Phone</th>}
            <th>Commodity</th>
            <th>Quantity</th>
            <th>Pickup</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Expected Delivery</th>
            {role === "logistics_provider" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            
            <tr key={booking.id}>
              <td>{booking.id}</td>
              {role === "logistics_provider" && (<td>{booking.farmer.username}</td>)}
              {role === "logistics_provider" && (<td>{booking.farmer.phone}</td>)}
              {role === "farmer" && (<td>{booking.logistics_provider_username}</td>)}
              {role === "farmer" && (<td>{booking.logistics_provider_phone}</td>)}
              <td>{booking.commodity}</td>
              <td>{booking.quantity} {booking.measure}</td>
              
              <td>{booking.pickup_address}</td>
              <td>{booking.destination_address}</td>
              <td>{booking.status}</td>
              <td>{booking.expected_delivery}</td>
              {role === "logistics_provider" && (
                <td>
                {["Confirmed", "In Transit", "Delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(booking.id, status)}
                    className="update-btn"
                  >
                    {status}
                  </button>
                ))}
              </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogisticsDashboard;
