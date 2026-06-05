import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. ADDED: doc and onSnapshot for live Firestore data fetching
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore"; 

import {
  FaArrowLeft,
  FaBell,
  FaCog,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTag,
  FaEdit,
  FaSignOutAlt,
} from "react-icons/fa";

import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore(); // Initialize Firestore instance

  // STATE: Added to store the live database values
  const [profileData, setProfileData] = useState({
    fullName: "",
    mobileNumber: ""
  });

  useEffect(() => {
    let unsubscribeFirestore;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        // FETCHING: Start listening to the logged-in user's document in the 'users' collection
        const userRef = doc(db, "users", user.uid);
        unsubscribeFirestore = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        });
      }
    });

    // Cleanup both listeners on unmount
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [navigate, auth, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Dynamically get the first letter of the name for the avatar icon (defaults to '?' if empty)
  const avatarLetter = profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : "?";

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <FaArrowLeft className="header-icon" onClick={() => navigate("/")} />

        <div className="header-right">
          <Link to="/notifications">
            <FaBell className="header-icon" />
          </Link>

          <Link to="/settings">
            <FaCog className="header-icon" />
          </Link>
        </div>
      </div>

      {/* User Card - UPDATED WITH LIVE DATA */}
      <Link to="/Userprofile" className="user-card-link" style={{ textDecoration: "none", color: "" }}>
        <div className="user-card">
          <div className="avatar">{avatarLetter}</div>
          <div>
            <h3>{profileData.fullName || "Loading Name..."}</h3>
            <p>
              {profileData.mobileNumber 
                ? `+91 ${profileData.mobileNumber}` 
                : "No Number Added "}
            </p>
            
          </div>
        </div>
      </Link>

      {/* Orders */}
      <div className="section">
        <div className="section-header">
          <h3>My Orders</h3>
          <Link to="/orders">View All</Link>
        </div>

        <button
          className="select-order-btn"
          onClick={() => navigate("/orders")}
        >
          Select Order
        </button>
      </div>

      {/* Account */}
      <div className="section">
        <h3>Account</h3>

        <Link to="/wishlist" className="menu-item">
          <FaHeart />
          Wishlist
        </Link>

        <Link to="/edit-profile" className="menu-item">
          <FaEdit />
          Edit Profile
        </Link>

        <Link to="/payment" className="menu-item">
          <FaCreditCard />
          Payment Method
        </Link>

        <Link to="/addresses" className="menu-item">
          <FaMapMarkerAlt />
          Addresses
        </Link>

        <Link to="/coupons" className="menu-item">
          <FaTag />
          Coupon & Offers
        </Link>
      </div>

      {/* Logout Button */}
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Profile;