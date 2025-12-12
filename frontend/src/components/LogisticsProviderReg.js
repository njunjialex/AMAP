import React, { useState } from "react";
import axios from "axios";
import "./LogisticsProviderReg.css";

const RegisterLogisticsProvider = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    company_name: "",
    contact_email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("access"); // Assuming token is stored here
      const response = await axios.post(
        "http://127.0.0.1:8000/api/logistics-register/",
        formData,
        {
          /*headers: {
            Authorization: `Bearer ${token}`,
          },*/
        }
      );
      setSuccessMessage(response.data.message);
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone_number: "",
        company_name: "",
        contact_email: "",
        password: "",
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Something went wrong. Try again later."
      );
    }
  };

  return (
    <div className="logistics-registration-container">
      <h2>Register Logistics Provider</h2>
      <form onSubmit={handleSubmit} className="logistics-form">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_namename}
          onChange={handleChange}
          required
        />
         <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_namename}
          onChange={handleChange}
          required
        />
        <input
         type="text"
         name="username"
         placeholder="Username"
         value={formData.username}
         onChange={handleChange}
         required
        />
        <input
          type="email"
          name="email"
          placeholder="Provider Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact_email"
          placeholder="Company Email"
          value={formData.contact_email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Temporary Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Register Provider</button>
      </form>
      {successMessage && <p className="success-msg">{successMessage}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default RegisterLogisticsProvider;
