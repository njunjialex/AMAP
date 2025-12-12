import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/orders/";

// Get orders (for logged-in user)
export const fetchOrders = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update order status (Only for Farmers)
export const updateOrderStatus = async (orderId, status, token) => {
  const response = await axios.patch(
    `${API_URL}${orderId}/update-status/`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Fetch order details
export const fetchOrderDetails = async (orderId, token) => {
  const response = await axios.get(`${API_URL}${orderId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Download invoice
export const downloadInvoice = async (orderId, token) => {
  const response = await axios.get(`${API_URL}${orderId}/invoice/`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: "blob", // Important for handling PDFs
  });

  // Create a link to download the file
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `invoice_${orderId}.pdf`);
  document.body.appendChild(link);
  link.click();
};
