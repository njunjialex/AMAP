import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LogisticsAnalytics.css";

const LogisticsAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/logistics-analytics/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAnalytics(response.data);
    };

    fetchAnalytics();
  }, []);

  if (!analytics) return <p>Loading analytics...</p>;

  return (
    <div className="dashboard-container">
      
      <div className="cards-container">
        <div className="card">
          <h3>Total Bookings</h3>
          <p>{analytics.total_bookings}</p>
        </div>
        <div className="card">
          <h3>Completion Rate</h3>
          <p>{analytics.completion_rate.toFixed(1)}%</p>
        </div>
        <div className="card">
          <h3>Average Delivery Time</h3>
          <p>{analytics.average_delivery_time || "N/A"}</p>
        </div>
        <div className="card">
          <h3>Bookings by Status</h3>
          <ul>
            {analytics.bookings_by_status.map((item) => (
              <li key={item.status}>{item.status}: {item.count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LogisticsAnalytics;
