import React from "react";
import Navbar from "../components/Navbar";
import "./About.css"

const About = () => {
    return (
        <div>
            <Navbar />
            <div className="about-container">
                <h1>About Us</h1>
                <p>
                Agriculture remains the backbone of many economies, yet farmers often struggle with 
                limited market access, unfair pricing, and inefficient supply chains.
                At AMAP (Agricultural Market Access Platform), we are committed to solving these challenges
                 by leveraging technology to create a seamless and transparent digital marketplace for 
                 agricultural products.

                AMAP was founded with the vision of transforming the agricultural sector by providing 
                smallholder farmers, cooperatives, and agribusinesses with direct 
                access to buyers, fair pricing, and essential services. Through our platform, farmers
                 can list their produce, negotiate prices, and connect with buyers without the need for 
                 intermediaries who often exploit them.

                Beyond just a marketplace, AMAP integrates real-time market data, logistics support, and financial
                 services to ensure smooth and efficient transactions. By using data-driven insights,
                  we help farmers
                  make informed decisions about what to grow, when to sell, and how to maximize their profits.

                Our commitment to fair trade and sustainability ensures that farmers receive competitive prices, 
                while buyers gain access to fresh, high-quality produce at transparent rates. We also collaborate 
                with agricultural extension officers, financial institutions, and logistics providers to offer
                 farmers access to credit, insurance, transportation, and agronomic advice.

                By bridging the gap between farmers and the market, AMAP is not just a platform—it’s a movement
                 toward a more inclusive, profitable, and technology-driven agricultural sector
                </p>
                <h2>Our Mission</h2>
                <p>
                    Our mission is to empower farmers by providing them with a reliable and accessible 
                    market for their produce. We strive 
                    to eliminate middlemen and offer fair prices to both buyers and sellers.
                </p>
                <h2>Why Choose Us?</h2>
                <ul>
                    <li>✅ Direct connection between farmers and buyers</li>
                    <li>✅ Transparent pricing</li>
                    <li>✅ Secure transactions</li>
                    <li>✅ Easy-to-use platform</li>
                </ul>
                <h2>Contact Us</h2>
                <p>Email: support@amap.com</p>
                <p>Phone: +254 758 240 567</p>
            </div>
        </div>
    );
};

export default About;
