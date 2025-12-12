import React, { useEffect, useState } from "react";
import axios from "axios";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            const token = localStorage.getItem("token"); // Get token from localStorage
            
            if (!token) {
                setError("No authentication token found. Please log in.");
                return;
            }

            try {
                const response = await axios.get("http://127.0.0.1:8000/api/notifications/", {
                    headers: {
                        "Authorization": `Bearer ${token}`, // Include token in headers
                        "Content-Type": "application/json",
                    },
                });

                setNotifications(response.data); // Axios already parses JSON
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError("Failed to fetch notifications. Please try again.");
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="notifications-container">
            <h3>Notifications</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {notifications.length === 0 ? (
                <p>No new notifications</p>
            ) : (
                <ul>
                    {notifications.map((notif) => (
                        <li key={notif.id}>{notif.message}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
