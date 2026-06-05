import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaChevronDown,
  FaHome,
  FaStore,
  FaTshirt,
  FaLaptop,
  FaMobile,
  FaClock,
  FaBook,
  FaSprayCan,
  FaPumpSoap,
  FaCouch,
  FaThLarge,
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaPhoneAlt,
  FaEdit,
  FaSignOutAlt,
  FaBell,
  FaCog,
 
} from "react-icons/fa";

import "./navbar.css";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showLoginTip, setShowLoginTip] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const cartCount = 3; // Replace with actual cart count logic

  const shopDropdownRef = useRef(null); // Ref for shop dropdown
  const profileMenuRef = useRef(null); // Create a ref for profile menu wrapper

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close shop dropdown if clicked outside
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target)
      ) {
        setShopDropdown(false);
      }

      // NEW: Close profile menu if clicked outside
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handler to toggle profile menu when icon is clicked
  const handleProfileIconClick = (e) => {
    // Prevents conflicts between mouse enter and click events
    e.stopPropagation(); 
    setShowProfileMenu((prev) => !prev);
  };

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <nav className={`navbar ${sticky ? "sticky" : ""}`}>
        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img src={logo} alt="GoCart Logo" />
          </a>
        </div>

        {/* Center Menu */}
        <ul className="nav-links">
          <li><a href="/">Home</a></li>

          <li
            className="shop-menu"
            onMouseEnter={() => setShopDropdown(true)}
            ref={shopDropdownRef}
          >
            Shop <FaChevronDown className="dropdown-icon" />

            {shopDropdown && (
              <ul className="dropdown">
                <a href="/"><li><FaTshirt /> Fashion</li></a>
                <a href="/"><li><FaMobile /> Mobiles</li></a>
                <a href="/"><li><FaLaptop /> Electronics</li></a>
                <a href="/"><li><FaPumpSoap /> Skincare</li></a>
                <a href="/"><li><FaShoppingBag /> Accessories </li></a>
                <a href="/"><li><FaBook /> Books</li></a>
                <a href="/"><li><FaCouch /> Furniture</li></a>
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
              <input type="text" placeholder="Search for products..." className="search-input" />
            )}

            <FaSearch
              className="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            />
          </div>

          {/* UPDATED: Added ref, onMouseEnter, and custom onClick logic to profile wrapper */}
          <div
            className="profile-wrapper"
            ref={profileMenuRef}
            onMouseEnter={() => setShowProfileMenu(true)}
          >
            <FaUser className="icon" onClick={handleProfileIconClick} />

            {showProfileMenu && (
              <div className="profile-menu">
                <h3 className="menu-title">Your Account</h3>

                <Link to="/userprofile" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaUser />
                  <span>My Profile</span>
                </Link>

                <Link to="/orders" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaShoppingBag />
                  <span>Orders</span>
                </Link>

                <Link to="/wishlist" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaHeart />
                  <span>Wishlist</span>
                </Link>

                <Link to="/addresses" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaMapMarkerAlt />
                  <span>Saved Address</span>
                </Link>

                <Link to="/coupons" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaTag />
                  <span>Coupons & Offers</span>
                </Link>

                 <Link to="/notifications" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaBell />
                  <span>Notifications</span>
                </Link>

                 <Link to="/settings" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaCog />
                  <span>Settings</span>
                </Link>

                <Link to="/edit-profile" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                  <FaEdit />
                  <span>Edit Profile</span>
                </Link>

                <button
                  className="logout-btn-desktop"
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/signin";
                  }}
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}

            {showLoginTip && (
              <div className="login-callout">
                Please <span>Login</span> / <span>Sign Up</span>
              </div>
            )}
          </div>

          <div className="cart-container">
            <FaShoppingBag className="icon" />
            <span className="cart-badge">{cartCount}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Top Section */}
      <div className="mobile-top">
        <div className="mobile-logo">
          <img src={logo} alt="GoCart Logo" />
        </div>

        <div className="mobile-search">
          <input type="text" placeholder="Search for products..." />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <a href="/home">
          <FaHome />
          <span>Home</span>
        </a>

        <a href="/shop">
          <FaThLarge />
          <span>Category</span>
        </a>
        
        <Link to="/profile" className="mobile-profile-wrapper">
          <FaUser />
          <span>Profile</span>

          {window.innerWidth <= 768 && showLoginTip && (
            <div className="mobile-login-callout">
              Login / Sign Up
            </div>
          )}
        </Link>

        <a href="/cart" className="mobile-cart">
          <FaShoppingBag />
          <span>Cart</span>
          <div className="mobile-badge">{cartCount}</div>
        </a>
      </div>
    </>
  );
};

export default Navbar;