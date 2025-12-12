import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderManagement.css";
import { saveAs } from "file-saver";
import TransportModal from "./TransportModal";
import ReviewModal from "./ReviewModal"; // import ReviewModal

const OrderManagement = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false); // state for ReviewModal
  const [selectedOrder, setSelectedOrder] = useState(null);

  const bookTransport = (order) => {
    setSelectedOrder(order);
    setShowTransportModal(true);
  };

  const review = (order) => {
    setSelectedOrder(order);
    setShowReviewModal(true); // Show ReviewModal
  };

  // Ensure user is available
  const role = user?.role || localStorage.getItem("role") || "guest";
  const userId = user?.id || localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) return; // Ensure userId is available before fetching orders

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found. Please log in.");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(`http://127.0.0.1:8000/api/orders/`, { headers });
        console.log("RAW API response:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId, role]);

  // Function to update order status (Farmers only)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.put(
        `http://127.0.0.1:8000/api/orders/${orderId}/update-status/`,
        { status: newStatus },
        { headers }
      );

      // Update order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const proceedToPayment = async (orderId) => {
    const phone = prompt("Enter your M-Pesa phone number:");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/initiate-payment/",
        { order_id: orderId, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Payment initiated. Please check your phone to complete the transaction.");
    } catch (error) {
      console.error("Payment failed:", error.response?.data || error.message);
      alert("Failed to initiate payment.");
    }
  };

  // Function to download invoice
  const downloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.get(
        `http://127.0.0.1:8000/api/orders/${orderId}/invoice/`,
        { headers, responseType: "blob" } // Expect a file response
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      saveAs(blob, `invoice_${orderId}.pdf`);
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  // Show loading messages
  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found.</p>;

  return (
    <div className="order-management-container">
      <h2>{role === "buyer" ? "My Orders" : "Order Management"}</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Amount (KES)</th>
            
            <th>Expected Delivery</th>
            <th>Status</th>
            {role === "farmer" && <th>Update Status</th>}
            <th>Payment Status</th>
            {role === "buyer" && <th>Make Payment</th>}
            {role === "farmer" && <th>Book Transport</th>}
            <th>Invoice</th>
            {role === "buyer" && <th>Review</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.product_name}</td>
              <td>{order.quantity} {order.measure}</td>
              <td>{order.amount}</td>
              
              <td>{order.expected_delivery}</td>
              <td>{order.status}</td>
              {role === "farmer" && (
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              )}
              <td>{order.payment_status}</td>
              {role === "buyer" && order.status === "Confirmed" && (
                <td>
                  <button onClick={() => proceedToPayment(order.id)}>Pay with M-Pesa</button>
                </td>
              )}
              {role === "farmer" && (
                <td>
                  <button onClick={() => bookTransport(order)}>Book Transport</button>
                </td>
              )}
              <td>
                <button onClick={() => downloadInvoice(order.id)}>Download</button>
              </td>
              {role === "buyer" && order.status === "Delivered" && (
                <td>
                  <button onClick={() => review(order)}>Review</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {showTransportModal && (
        <TransportModal
          order={selectedOrder}
          onClose={() => setShowTransportModal(false)}
        />
      )}
      {showReviewModal && (
        <ReviewModal
          order={selectedOrder}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
