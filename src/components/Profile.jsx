import React from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaBell,
  FaCog,
  FaHeart,
  FaMapMarkerAlt,
  FaCreditCard,
  FaTag,
  FaEdit,
} from "react-icons/fa";

import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <FaArrowLeft
          className="header-icon"
          onClick={() => navigate("/")}
        />

        <div className="header-right">
          <Link to="/notifications">
            <FaBell className="header-icon" />
          </Link>

          <Link to="/settings">
            <FaCog className="header-icon" />
          </Link>
        </div>
      </div>

      {/* User Card */}
      <div className="user-card">

        <div className="avatar">
          R
        </div>

        <div>
          <h3>Rahul Sharma</h3>
          <p>+91 9876543210</p>
        </div>

      </div>

      <Link to="/edit-profile" className="edit-btn">
        Edit Profile
      </Link>

      {/* Orders */}

      <div className="section">

        <div className="section-header">
          <h3>My Orders</h3>

          <Link to="/orders">
            View All
          </Link>
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

      <button
        className="logout-btn"
        onClick={logout}
      >
        Logout
      </button>

    </div>
  );
};

export default Profile;