import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

function SectionWithSidebar() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slideImages, setSlideImages] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/slides/")  // Fetch images from Django API
            .then(response => response.json())
            .then(data => {
                setSlideImages(data.map(item => item.image_url));  // Extract image URLs
            })
            .catch(error => console.error("Error fetching slides:", error));
    }, []);

    useEffect(() => {
        if (slideImages.length === 0) return;
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 3000);  // Change slide every 3 seconds
        return () => clearInterval(interval);
    }, [slideImages]);

    return (
        <div className="section-container">
            {/* Left Sidebar */}
            <aside className="sidebar">
                <ul>
                    <li><a href="#">Farmers</a></li>
                    <li><Link to="/market-prices">Market prices</Link></li>
                    <li><a href="#"></a></li>
                    <li><a href="#">Logistics</a></li>
                    <li><a href="#">Featured Products</a></li>
                    <li><Link to="/upload">Add Catalog</Link></li>
                    <li><Link to="/BuyerDashboard">BuyerDashboard</Link></li>

                                  
                    <li><Link to="/Notification">Notifications</Link></li>

                    <li><Link to="/ProductRequest">Place Order</Link></li>
                    <li><Link to="/BuyerRequest">Buyer's Requests</Link></li>

                    <li><a href="#">Categories</a></li>
                </ul>
            </aside>

            {/* Right Main Content */}
            <main className="main-content">
                <h1 className="slogan">"Connecting Farmers to Buyers Seamlessly!"</h1>

                {/* Slideshow */}
                <div className="slideshow">
                    {slideImages.length > 0 ? (
                        <img src={slideImages[currentSlide]} alt="Slide" />
                    ) : (
                        <p>Loading slides...</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SectionWithSidebar;
