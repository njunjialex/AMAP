import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Editor } from "@tinymce/tinymce-react";
import "./Upload.css"

const Upload = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]); // Store available categories
    const [product, setProduct] = useState({
        category: "",
        name: "",
        description: "",
        selling_price: "",
        original_price: "",
        quantity: "",
        measure: "",
        location: "",
        image: null,
    });
        
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Retrieve token from local storage (Assumes token is stored after login)
                const token = localStorage.getItem("token");
    
                const response = await axios.get("http://127.0.0.1:8000/api/categories/", {
                    headers: {
                        "Authorization": `Bearer ${token}`,  // ✅ Add Authorization token
                        "Content-Type": "application/json"   // ✅ Ensure JSON format
                    }
                });
    
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
    
        fetchCategories();
    }, []);
    
    const handleChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleDescriptionChange = (content) => {
        setProduct({ ...product, description: content });
    };

    const handleFileChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            formData.append(key, value);
        });
    
        try {
            // Retrieve token from local storage
            const token = localStorage.getItem("token");
    
            // Check if token is missing
            if (!token) {
                alert("Authentication required. Please log in again.");
                navigate("/login");
                return;
            }
    
            // Decode token to check expiration (assuming JWT)
            const jwtDecode = (token) => {
                try {
                    return JSON.parse(atob(token.split(".")[1]));
                } catch (e) {
                    return null;
                }
            };
    
            const tokenData = jwtDecode(token);
            if (tokenData && tokenData.exp * 1000 < Date.now()) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
                return;
            }
    
            // Make API request with valid token
            await axios.post("http://127.0.0.1:8000/api/upload-product/", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
    
            alert("Product Uploaded Successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error uploading product:", error);
    
            // Handle authentication errors
            if (error.response && error.response.status === 401) {
                alert("Authentication failed. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                alert("Failed to upload product. Please try again.");
            }
        }
    };
    
    

    return (
        <div>
            <Navbar />
            <div className="upload-container">
                <h2>Add Product to Your Catalog</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label>Category:</label>
                    <select name="category" value={product.category} onChange={handleChange} required>
                        <option value="">-- Select Category --</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <label>Name:</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange} required />

                    <label>Description:</label>
                    <Editor
                        apiKey="ki3kom4gsrjroan2teg9agtv1ergmu6uvgoh0mylvkfu17p2" // Replace with your TinyMCE API key if needed
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: "advlist autolink lists link image charmap print preview anchor",
                            toolbar:
                                "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
                        }}
                        value={product.description} // Use product.description
                        onEditorChange={handleDescriptionChange} // Use the correct function
                    />
                    <textarea
                       value={product.description}
                       onChange={(e) => handleDescriptionChange(e.target.value)}
                       placeholder="Any special requests..."
                    />

                    <label>Selling Price:</label>
                    <input type="number" name="selling_price" value={product.selling_price} onChange={handleChange} required />

                    <label>Original Price:</label>
                    <input type="number" name="original_price" value={product.original_price} onChange={handleChange} required />

                    <label>Quantity:</label>
                    <input type="number" name="quantity" value={product.quantity} onChange={handleChange} required />

                    <label>Measure:</label>
                    <input type="text" name="measure" value={product.measure} onChange={handleChange} required />

                    <label>Location:</label>
                    <input type="text" name="location" value={product.location} onChange={handleChange} required />

                    <label>Image:</label>
                    <input type="file" name="image" accept="image/*" onChange={handleFileChange} required />

                    <button type="submit" className="upload-btn">Upload Product</button>
                </form>
            </div>
        </div>
    );
};

export default Upload;
