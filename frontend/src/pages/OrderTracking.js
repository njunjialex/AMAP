import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/orders/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const downloadInvoice = (orderId) => {
    axios
      .get(`/api/orders/${orderId}/invoice/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error downloading invoice:", error));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Order Tracking</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Status</th>
              <th>Expected Delivery</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.product}</td>
                <td style={{ color: getStatusColor(order.status) }}>
                  {order.status}
                </td>
                <td>{order.expected_delivery_date || "N/A"}</td>
                <td>
                  <button
                    style={styles.button}
                    onClick={() => downloadInvoice(order.id)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Helper function to change status color dynamically
const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "orange";
    case "Confirmed":
      return "blue";
    case "Shipped":
      return "purple";
    case "Delivered":
      return "green";
    default:
      return "black";
  }
};

// Basic CSS styles
const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "5px 10px",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  },
};

export default OrderTracking;
