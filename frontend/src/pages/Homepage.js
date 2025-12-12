import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

const images = [
  "/images/apple2.jfif", // tomatoes
  "/images/tomatoes1.jfif",
  "/images/tomatoes.jfif", 
  "/images/tomatoes2.jfif",// grains
  "/images/maize.jfif",
  "/images/eggs2.jfif",
  "/images/logo.png",
  "/images/apples.jfif",
];

const HomePage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="homepage">
      <div
        className="slideshow"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      ></div>

      <div className="overlay">
        <h1>Welcome to AMAP</h1>
        <p>
          Empowering farmers and buyers through seamless access to agricultural markets.  
          Discover fresh produce, track orders in real-time, connect with logistics providers,  
          and grow your agribusiness with confidence.
        </p>
        
        <button onClick={() => navigate("/products")} className="cta-btn">Get Started</button>

      </div>

      <footer className="footer">
        © {new Date().getFullYear()} AMAP | Connecting Farmers & Buyers | All rights reserved
      </footer>
    </div>
  );
};

export default HomePage;
