import React, { useState } from "react";
import { HomeIcon, SearchIcon, ShoppingCartIcon } from "lucide-react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Import CSS

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = () => {
        alert(`Searching for: ${searchQuery}`); // Replace with actual search logic
    };

    return (
        <nav className="navbar">
            {/* Logo */}
            <Link to="/" className="logo">AMAP</Link>

            {/* Search Bar */}
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
                <button className="search-button" onClick={handleSearch}><SearchIcon className="icon" /></button>
            </div>

            {/* Mobile Menu (Hamburger) */}
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                ☰
            </div>

            {/* Navigation Links */}
            <ul className={`nav-links ${menuOpen ? "show" : ""}`}>
                <li><Link to="/"><HomeIcon className="icon" />Home</Link></li>
                
                <li><Link to="/Login">Login</Link></li>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/market-prices">Market Prices</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
}

export default Header;
