import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FarmerProducts.css";

const FarmerProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    description: "",
    selling_price: "",
    original_price: "",
    quantity: "",
    location: "",
    image: null,
  });

  // Retrieve token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products for the logged-in farmer with Authorization header
  const fetchProducts = async () => {
    try {
        // Retrieve token from local storage (Assumes token is stored after login)
        const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/farmer-products/", {
        headers: { 
            "Authorization": `Bearer ${token}`,  // ✅ Add Authorization token
            "Content-Type": "application/json"
         }, 
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle delete request with Authorization token
  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/farmer-products/${productId}/delete/`, {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Include token
        });
        setProducts(products.filter((product) => product.id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Handle edit
  const startEdit = (product) => {
    setEditProduct(product.id);
    setFormData({
      category: product.category,
      name: product.name,
      original_price: product.original_price,
      selling_price: product.selling_price,
      
      quantity: product.quantity,
      location: product.location,
      
    });
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle update request with Authorization token
  const updateProduct = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://127.0.0.1:8000/api/farmer-products/${productId}/update/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Include token
        }
      );
      setEditProduct(null);
      fetchProducts(); // Refresh list after update
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="farmer-products-container">
      <h2>My Products</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Original Price</th>
            <th>Selling Price (KES)</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              {editProduct === product.id ? (
                <>
                  <td><input type="text" name="category" value={formData.category} onChange={handleChange} /></td>
                  <td><input type="text" name="name" value={formData.name} onChange={handleChange} /></td>
                  <td><input type="text" name="original_price" value={formData.original_price} onChange={handleChange} /></td>
                  <td><input type="number" name="selling_price" value={formData.selling_price} onChange={handleChange} /></td>
                 
                  <td><input type="number" name="quantity" value={formData.quantity} onChange={handleChange} /></td>
                  
                  <td>
                    <button onClick={() => updateProduct(product.id)} className="save-btn">Save</button>
                    <button onClick={() => setEditProduct(null)} className="cancel-btn">Cancel</button>
                  </td>
                </>
              ) : (
                <> 
                  <td>{product.category}</td>
                  <td>{product.name}</td>
                  <td>{product.original_price}</td>
                  <td>{product.selling_price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button onClick={() => startEdit(product)} className="edit-btn">Edit</button>
                    <button onClick={() => deleteProduct(product.id)} className="delete-btn">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FarmerProducts;
