import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseconfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import "./address.css";

// Your Geoapify API key is safely configured here
const GEOAPIFY_API_KEY = "eba9d1d0871a4e3b9990b5a8a75b671e";

const Address = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    pincode: "",
    state: "",
    city: "",
    houseNo: "",
    area: "",
  });

  const [errors, setErrors] = useState({
    state: "",
    city: "",
    area: "",
    auth: "",
  });

  // State management for API suggestions
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // CRITICAL FIX 1: Prevent API from firing right after clicking an address option
  const [isSelecting, setIsSelecting] = useState(false);

  // Close suggestions drop-down if user clicks outside of the form wrapper container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API Fetching: Monitors all fields to build a unified search query
  useEffect(() => {
    // If we just clicked an address option, DO NOT fetch suggestions again!
    if (isSelecting) {
      setIsSelecting(false); // Reset flag for the next keystroke
      return;
    }

    const { houseNo, area, city, state, pincode } = form;
    
    // Combine all filled inputs into a comma-separated query string
    const queryParts = [houseNo, area, city, state, pincode].filter(
      (field) => field.trim() !== ""
    );
    const searchQuery = queryParts.join(", ");

    // Trigger API only if the combined query is 2 or more characters long
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        console.log("Fired network request for text:", searchQuery);

        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            searchQuery
          )}&apiKey=${GEOAPIFY_API_KEY}`
        );
        const data = await response.json();
        
        console.log("API Response Data:", data);

        if (data && data.features && data.features.length > 0) {
          setSuggestions(data.features);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    }, 400); // 400ms debounce prevents flooding API allocations

    return () => clearTimeout(delayDebounceFn);
  }, [form]); // Re-runs whenever any text input inside 'form' updates

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handles auto-filling the fields upon selecting an address option
  const handleSelectSuggestion = (feature) => {
    const props = feature.properties;
    console.log("Selected Location Properties:", props);
    
    // Turn on the selection block flag right before changing form state
    setIsSelecting(true);
    
    setForm({
      houseNo: props.housenumber || form.houseNo, 
      pincode: props.postcode || "",
      state: props.state || "",
      city: props.city || props.county || props.municipality || "",
      area: props.street || props.suburb || props.name || "", 
    });

    setSuggestions([]);
    setShowDropdown(false);
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { state: "", city: "", area: "", auth: "" };

    if (!form.state.trim()) {
      newErrors.state = "Please enter the state.";
      valid = false;
    }
    if (!form.city.trim()) {
      newErrors.city = "Please enter the city.";
      valid = false;
    }
    if (!form.area.trim()) {
      newErrors.area = "Please enter the area, street, and landmark.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const saveAddress = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userDocRef, {
          addresses: arrayUnion({
            pincode: form.pincode,
            state: form.state,
            city: form.city,
            houseNo: form.houseNo,
            area: form.area,
            timestamp: new Date(),
          })
        });
        navigate("/location");
      } catch (error) {
        console.error("Error saving address: ", error);
        setErrors(prev => ({...prev, auth: "Failed to save address. Please try again."}));
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(prev => ({...prev, auth: "You must be logged in to save an address."}));
      setLoading(false);
    }
  };

  return (
    <div className="address-page">
      <div className="address-header">
        <FaArrowLeft onClick={() => navigate("/location")} />
        <h2>Add Delivery Address</h2>
      </div>

      {/* The ref here safely covers everything inside the form block */}
      <div className="address-form" ref={dropdownRef}>
        {errors.auth && <div className="form-error-main">{errors.auth}</div>}

        <input
          type="text"
          name="houseNo"
          placeholder="House / Flat Number (Optional)"
          value={form.houseNo}
          onChange={handleChange}
        />

        <div className="autocomplete-container">
          <textarea
            name="area"
            placeholder="Area / Street / Landmark *"
            value={form.area}
            onChange={handleChange}
            autoComplete="off"
            onFocus={() => {
              // Re-open list if user clicks back into input and suggestions exist
              if (suggestions.length > 0) setShowDropdown(true);
            }}
          />
          {showDropdown && suggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {suggestions.map((item, index) => (
                <li 
                  key={index} 
                  onClick={() => handleSelectSuggestion(item)}
                  className="suggestion-item"
                >
                  {item.properties.formatted}
                </li>
              ))}
            </ul>
          )}
        </div>
        {errors.area && <span className="error-text">{errors.area}</span>}

        <input
          type="text"
          name="city"
          placeholder="City *"
          value={form.city}
          onChange={handleChange}
        />
        {errors.city && <span className="error-text">{errors.city}</span>}

        <input
          type="text"
          name="state"
          placeholder="State *"
          value={form.state}
          onChange={handleChange}
        />
        {errors.state && <span className="error-text">{errors.state}</span>}

        <input
          type="text"
          name="pincode"
          placeholder="Pincode (Optional)"
          value={form.pincode}
          onChange={handleChange}
        />

        <button
          className="save-address-btn"
          onClick={saveAddress}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Address"}
        </button>
      </div>
    </div>
  );
};

export default Address;