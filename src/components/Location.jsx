import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPlus,
} from "react-icons/fa";

import "./location.css";

const Location = () => {
  const navigate = useNavigate();

  return (
    <div className="location-page">

      {/* Header */}

      <div className="location-header">
        <FaArrowLeft
          className="back-btn"
          onClick={() => navigate("/")}
        />

        <h2>Select Delivery Address</h2>
      </div>

      {/* Search */}

      <input
        type="text"
        placeholder="Search Area, City, Pincode"
        className="location-search"
      />

      {/* Current Location */}

      <div className="current-location">
        <FaMapMarkerAlt />

        <div>
          <h4>Use My Current Location</h4>
          <p>Allow access to locate nearby address</p>
        </div>
      </div>

      {/* Saved Address */}

      <div className="saved-address-header">
        <h3>Saved Addresses</h3>

        <button
          onClick={() => navigate("/add-address")}
        >
          <FaPlus />
          Add New
        </button>
      </div>

      <div className="empty-address">
        No saved addresses found
      </div>

    </div>
  );
};

export default Location;