import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import "./navbar.css";
import logo from "../images/logo.png"; // Replace with your logo

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [sticky, setSticky] = useState(false);

  const cartCount = 3;

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${sticky ? "sticky" : ""}`}>
      {/* Logo */}
      <div className="logo">
        <img src={logo} alt="logo" />
      </div>

      {/* Desktop Menu */}
      <ul className="nav-links">
        <li>Home</li>

        <li
          className="shop-menu"
          onMouseEnter={() => setShopDropdown(true)}
          onMouseLeave={() => setShopDropdown(false)}
        >
          Shop <FaChevronDown className="dropdown-icon" />

          {shopDropdown && (
            <ul className="dropdown">
              <li>Fashion</li>
              <li>Electronics</li>
              <li>Mobiles</li>
            </ul>
          )}
        </li>

        <li>About</li>
        <li>Contact</li>
      </ul>

      {/* Right Icons */}
      <div className="nav-icons">
        <div className="search-container">
          {searchOpen && (
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
            />
          )}

          <FaSearch
            className="icon"
            onClick={() => setSearchOpen(!searchOpen)}
          />
        </div>

        <FaUser className="icon" />

        <div className="cart-container">
          <FaShoppingBag className="icon" />
          <span className="cart-badge">{cartCount}</span>
        </div>

        <div
          className="hamburger"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenu ? "active" : ""}`}>
        <a href="/">Home</a>

        <div className="mobile-shop">
          <p>Shop</p>
          <a href="/">Fashion</a>
          <a href="/">Electronics</a>
          <a href="/">Mobiles</a>
        </div>

        <a href="/">About</a>
        <a href="/">Contact</a>
        <a href="/">Profile</a>
        <a href="/">Cart ({cartCount})</a>
      </div>
    </nav>
  );
};

export default Navbar;