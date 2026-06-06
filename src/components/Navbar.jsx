import React, { useState, useRef, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaChevronDown,
  FaHome,
  FaThLarge,
  FaHeart,
  FaMapMarkerAlt,
  FaTag,
  FaBell,
  FaCog,
  FaEdit,
  FaSignOutAlt,
  FaTshirt,
  FaMobile,
  FaLaptop,
  FaPumpSoap,
  FaBook,
  FaCouch,
  FaRegHeart,
  FaMicrophone,
} from "react-icons/fa";

import "./navbar.css";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";

// 1. IMPORT FIREBASE AUTH
import { auth } from "../firebase/firebaseconfig"; 
import { onAuthStateChanged, signOut } from "firebase/auth";


const Navbar = () => {
  // STATE TO TRACK LOGGED IN USER & AUTH LOADING STATUS
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Tracks if Firebase is still checking session
  const navigate = useNavigate();
  const [showLoginTip, setShowLoginTip] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Declared missing state to prevent crashes
  const notificationCount = 2;
  const cartCount = 3; 

  const shopDropdownRef = useRef(null); 
  const profileMenuRef = useRef(null); 

  useEffect(() => {
    // LISTEN TO FIREBASE AUTH STATE CHANGES
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false); // Firebase check complete!
    });

    const handleClickOutside = (event) => {
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target)
      ) {
        setShopDropdown(false);
      }

      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
        setShowLoginTip(false); // Clean up login tooltip on click outside
      }
    };

    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      unsubscribe(); 
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // HANDLER FOR PROFILE ICON CLICK
  const handleProfileIconClick = (e) => {
    e.stopPropagation(); 
    if (authLoading) return; // Freeze actions if auth state isn't determined yet
    
    if (user) {
      setShowProfileMenu((prev) => !prev);
    } else {
      navigate("/signin");
    }
  };

  // HANDLER FOR MOUSE ENTER (HOVER)
  const handleProfileMouseEnter = () => {
    if (authLoading) return; // Do nothing while loading
    
    if (user) {
      setShowProfileMenu(true);
    } else {
      setShowLoginTip(true);
    }
  };

  // HANDLER FOR FIREBASE LOGOUT
  const handleLogout = async () => {
    try {
      await signOut(auth); 
      localStorage.clear(); 
      setShowProfileMenu(false);
      navigate("/signin"); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* LAPTOP / DESKTOP VIEW                                                     */}
      {/* ========================================================================= */}
      <nav className={`navbar ${sticky ? "sticky" : ""}`}>
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="GoCart Logo" />
          </Link>
        </div>

        {/* Location Selector */}
        <div className="location-container" onClick={() => navigate("/location")}>
          <FaMapMarkerAlt className="location-icon" />
          <div className="location-text-wrapper">
            <span className="deliver-label">Deliver to</span>
            <span className="location-text">Select Location</span>
          </div>
          <FaChevronDown className="location-dropdown" />
        </div>

        {/* Center Menu */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>

          <li
            className="shop-menu"
            onMouseEnter={() => setShopDropdown(true)}
            ref={shopDropdownRef}
          >
            Shop <FaChevronDown className="dropdown-icon" />

            {shopDropdown && (
              <ul className="dropdown">
                <li><a href="/"><FaTshirt /> Fashion</a></li>
                <li><a href="/"><FaMobile /> Mobiles</a></li>
                <li><a href="/"><FaLaptop /> Electronics</a></li>
                <li><a href="/"><FaPumpSoap /> Skincare</a></li>
                <li><a href="/"><FaShoppingBag /> Accessories </a></li>
                <li><a href="/"><FaBook /> Books</a></li>
                <li><a href="/"><FaCouch /> Furniture</a></li>
              </ul>
            )}
          </li>

          <li>About</li>
          <li>Contact</li>
        </ul>

        {/* Right Icons */}
        <div className="nav-icons">
          <div className="search-container">
            <input type="text" placeholder="Search for products... " className="search-input" />
            <FaSearch className="search-icon"/>
          </div>

          <div className="whishlist-icon">
            <FaRegHeart/>
          </div>

          {/* Profile Wrapper Component */}
          <div
            className="profile-wrapper"
            ref={profileMenuRef}
            onMouseEnter={handleProfileMouseEnter}
          >
            <FaUser className="icon" onClick={handleProfileIconClick} />

            {/* ONLY RENDER INTERFACES ONCE AUTH HAS SETTLED */}
            {!authLoading && (
              <>
                {/* User Dropdown Menu */}
                {user && showProfileMenu && (
                  <div className="profile-menu">
                    <h3 className="menu-title">Your Account</h3>
                    <p className="user-email-display">{user.email}</p>

                    <Link to="/userprofile" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaUser /> <span>My Profile</span>
                    </Link>
                    <Link to="/orders" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaShoppingBag /> <span>Orders</span>
                    </Link>
                    <Link to="/wishlist" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaHeart /> <span>Wishlist</span>
                    </Link>
                    <Link to="/location" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaMapMarkerAlt /> <span>Saved Address</span>
                    </Link>
                    <Link to="/coupons" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaTag /> <span>Coupons & Offers</span>
                    </Link>
                    <Link to="/notifications" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaBell /> <span>Notifications</span>
                    </Link>
                    <Link to="/settings" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaCog /> <span>Settings</span>
                    </Link>
                    <Link to="/edit-profile" className="profile-menu-item" onClick={() => setShowProfileMenu(false)}>
                      <FaEdit /> <span>Edit Profile</span>
                    </Link>

                    <button className="logout-btn-desktop" onClick={handleLogout}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="cart-container">
            <FaShoppingBag className="icon" />
            <span className="cart-badge">{cartCount}</span>
          </div>
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* MOBILE VIEW                                                               */}
      {/* ========================================================================= */}
      <div className="mobile-top">
        <div className="mobile-header">
          {/* Left Side: Logo & Location Bar */}
          <div className="mobile-left">
            <div className="mobile-logo">
              <img src={logo} alt="GoCart" />
            </div>

            <div className="mobile-location" onClick={() => navigate("/location")}>
              <span className="mobile-deliver">
                <FaMapMarkerAlt /> Deliver to
              </span>
              <div className="mobile-address-row">
                <span className="mobile-address">Select Location</span>
                <FaChevronDown />
              </div>
            </div>
          </div>
          

          {/* Right Side: Wishlist next to Notification Icon arranged side-by-side */}
          <div className="mobile-right">
            <div className="mobile-wishlist-wrapper" onClick={() => navigate("/wishlist")}>
              <FaRegHeart className="mobile-wishlist" />
            </div>

            <div className="mobile-bell-wrapper" onClick={() => navigate("/notifications")}>
              <FaBell className="mobile-bell" />
              {notificationCount > 0 && (
                <span className="mobile-notification-badge">{notificationCount}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="mobile-search-container">
          <FaSearch className="mobile-search-icon" />
          <input type="text" placeholder="Search for products, brands..." />
          <FaMicrophone className="mobile-mic-icon" />
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav">
        <Link to="/home">
          <FaHome />
          <span>Home</span>
        </Link>

        <Link to="/shop">
          <FaThLarge />
          <span>Category</span>
        </Link>
        
        <Link to={authLoading ? "#" : user ? "/profile" : "/signin"} className="mobile-profile-wrapper">
          <FaUser />
          <span>{authLoading ? "..." : user ? "Profile" : "Login"}</span>
        </Link>

        <Link to="/cart" className="mobile-cart">
          <FaShoppingBag />
          <span>Cart</span>
          <div className="mobile-badge">{cartCount}</div>
        </Link>
      </div>
    </>
  );
};

export default Navbar;