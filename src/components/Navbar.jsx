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
import logo1 from "../images/logo1.png";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";

// IMPORT FIREBASE AUTH & FIRESTORE REAL-TIME LISTENER
import { auth, db } from "../firebase/firebaseconfig"; 
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";


const Navbar = () => {
  const [user, setUser] = useState(null);
  const [currentLocationName, setCurrentLocationName] = useState("Select Location"); 

  const navigate = useNavigate();
  const [showLoginTip, setShowLoginTip] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Mobile profile card utility toggle state
  const [showMobileProfileSlider, setShowMobileProfileSlider] = useState(false);
  
  const notificationCount = 2;
  const cartCount = 3; 

  const shopDropdownRef = useRef(null); 
  const profileMenuRef = useRef(null); 

  useEffect(() => {
    let unsubscribeFromFirestore = null;

    const unsubscribeFromAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (unsubscribeFromFirestore) {
        unsubscribeFromFirestore();
      }

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        unsubscribeFromFirestore = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists() && docSnap.data().addresses && docSnap.data().addresses.length > 0) {
            const addressesArray = docSnap.data().addresses;
            const recentAddress = addressesArray[addressesArray.length - 1];
            const readableName = recentAddress.area || recentAddress.city || "Saved Location";
            setCurrentLocationName(readableName);
          } else {
            setCurrentLocationName("Select Location");
          }
        }, (error) => {
          console.error("Error streaming dynamic user locations:", error);
        });
      } else {
        setCurrentLocationName("Select Location");
      }
    });

    const handleClickOutside = (event) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target)) {
        setShopDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
        setShowLoginTip(false); 
      }
    };

    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      unsubscribeFromAuth(); 
      if (unsubscribeFromFirestore) unsubscribeFromFirestore();
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleProfileIconClick = (e) => {
    e.stopPropagation(); 
    
    if (user) {
      setShowProfileMenu((prev) => !prev);
    } else {
      navigate("/signin");
    }
  };

  const handleProfileMouseEnter = () => {
    if (user) {
      setShowProfileMenu(true);
    } else {
      setShowLoginTip(true);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 
      setShowProfileMenu(false);
      setShowMobileProfileSlider(false);
      navigate("/signin"); 
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Dedicated Mobile UI Trigger for Profile Interactions
  const handleMobileProfileClick = (e) => {
    if (!user) {
      navigate("/signin");
    } else {
      setShowMobileProfileSlider((prev) => !prev);
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
            <img src={logo1} alt="GoCart Logo" />
          </Link>
        </div>

        {/* Location Selector */}
        <div className="location-container" onClick={() => navigate("/location")}>
          <FaMapMarkerAlt className="location-icon" />
          <div className="location-text-wrapper">
            <span className="deliver-label">Deliver to</span>
            <span className="location-text">{currentLocationName}</span>
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
          </div>

          <Link to="/cart" >
          <div className="cart-container">
            <FaShoppingBag className="icon" />
            <span className="cart-badge">{cartCount}</span>
            </div>
          </Link>
         
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
                <span className="mobile-address">{currentLocationName}</span>
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
        <Link to="/">
          <FaHome />
          <span>Home</span>
        </Link>

        <Link to="/shop">
          <FaThLarge />
          <span>Category</span>
        </Link>
        
        {/* FIXED: Removed the authLoading condition and the "..." text entirely */}
        <Link to={user ? "/profile" : "/signin"} className="mobile-profile-wrapper">
          <FaUser />
          <span>{user ? "Profile" : "Login"}</span>
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