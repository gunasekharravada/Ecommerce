import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPlus,
  FaTrashAlt,
  FaEdit,
  FaCheck,
  FaTimes,
  FaExclamationTriangle // Modern alert icon
} from "react-icons/fa";

// FIREBASE IMPORTS
import { db } from "../firebase/firebaseconfig";
// Imported setDoc to prevent missing document crashes
import { doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import "./location.css";

const GEOAPIFY_API_KEY = "eba9d1d0871a4e3b9990b5a8a75b671e"; 

const Location = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const auth = getAuth();

  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]); 
  const [loading, setLoading] = useState(false);

  // EDITING STATES
  const [editingIndex, setEditingIndex] = useState(null); 
  const [editForm, setEditForm] = useState({
    houseNo: "",
    area: "",
    city: "",
    state: "",
    pincode: ""
  });

  // MODERN DELETE MODAL STATES
  const [deleteTarget, setDeleteTarget] = useState(null); // Stores { address, index }

  // 1. Fetch existing saved addresses from Firestore on load
  useEffect(() => {
    const fetchAddresses = async (user) => {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists() && docSnap.data().addresses) {
          setSavedAddresses(docSnap.data().addresses);
        }
      } catch (error) {
        console.error("Error fetching addresses from Firestore:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchAddresses(user);
      } else {
        setSavedAddresses([]);
      }
    });

    return unsubscribe;
  }, [auth]);

  // 2. Click Outside logic to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 3. Debounced API search fetch
  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            searchQuery
          )}&apiKey=${GEOAPIFY_API_KEY}`
        );
        const data = await response.json();

        if (data && data.features) {
          setSuggestions(data.features);
          setShowDropdown(true);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error searching location:", error);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // 4. Handle selecting location and storing directly to Cloud Firestore (FIXED ERROR)
  const handleSelectLocation = async (feature) => {
    const props = feature.properties;
    const user = auth.currentUser;

    if (!user) return;

    const newAddress = {
      houseNo: props.housenumber || "",
      area: props.street || props.suburb || props.name || props.formatted,
      city: props.city || props.county || props.municipality || "",
      state: props.state || "",
      pincode: props.postcode || "",
    };

    setLoading(true);
    const userDocRef = doc(db, "users", user.uid);

    try {
      // Switched from updateDoc to setDoc with merge: true to dynamically auto-create non-existent users docs
      await setDoc(userDocRef, {
        addresses: arrayUnion(newAddress),
      }, { merge: true });

      setSavedAddresses((prev) => [...prev, newAddress]);
      setSearchQuery("");
      setSuggestions([]);
      setShowDropdown(false);
    } catch (error) {
      console.error("Error saving selected address:", error);
    } finally {
      setLoading(false);
    }
  };

  // 5. Trigger Custom Delete Dialog
  const openDeleteModal = (address, index) => {
    setDeleteTarget({ address, index });
  };

  // 6. Confirm Delete action inside Modern Modal
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { address, index } = deleteTarget;
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);

    try {
      await updateDoc(userDocRef, {
        addresses: arrayRemove(address)
      });
      setSavedAddresses((prev) => prev.filter((_, idx) => idx !== index));
      if (editingIndex === index) setEditingIndex(null); 
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setDeleteTarget(null); // Close modal
    }
  };

  // 7. Start Editing Mode
  const startEditing = (address, index) => {
    setEditingIndex(index);
    setEditForm({
      houseNo: address.houseNo || "",
      area: address.area || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || ""
    });
  };

  // 8. Handle Input Change inside Edit Form
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  // 9. Submit Customized Address to Cloud Firestore (FIXED ERROR FOR EDITS AS WELL)
  const handleSaveEdit = async (index) => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    const userDocRef = doc(db, "users", user.uid);

    try {
      const updatedAddresses = [...savedAddresses];
      updatedAddresses[index] = {
        houseNo: editForm.houseNo,
        area: editForm.area,
        city: editForm.city,
        state: editForm.state,
        pincode: editForm.pincode
      };

      // Used setDoc with merge: true here as well to protect customized address submissions
      await setDoc(userDocRef, {
        addresses: updatedAddresses
      }, { merge: true });

      setSavedAddresses(updatedAddresses);
      setEditingIndex(null); 
    } catch (error) {
      console.error("Error updating customized address:", error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Search Bar Container */}
      <div className="search-container" ref={dropdownRef}>
        <input
          type="text"
          placeholder={loading ? "Processing..." : "Search Area, City, Pincode"}
          className="location-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          autoComplete="off"
          disabled={loading}
        />

        {showDropdown && suggestions.length > 0 && (
          <ul className="suggestions-dropdown">
            {suggestions.map((item, index) => (
              <li
                key={index}
                className="suggestion-item"
                onClick={() => handleSelectLocation(item)}
              >
                <FaMapMarkerAlt className="suggestion-icon" />
                <span>{item.properties.formatted}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Current Location */}
      <div className="current-location">
        <FaMapMarkerAlt />
        <div>
          <h4>Use My Current Location</h4>
          <p>Allow access to locate nearby address</p>
        </div>
      </div>

      {/* Saved Address Section Header */}
      <div className="saved-address-header">
        <h3>Saved Addresses</h3>
        <button onClick={() => navigate("/add-address")}>
          <FaPlus />
          Add New
        </button>
      </div>

      {/* Address List Container */}
      <div className="addresses-list-container">
        {savedAddresses.length > 0 ? (
          savedAddresses.map((addr, idx) => (
            <div className="saved-address-card" key={idx}>
              
              {editingIndex === idx ? (
                <div className="inline-edit-form">
                  <input 
                    type="text" 
                    name="houseNo" 
                    value={editForm.houseNo} 
                    placeholder="House/Flat No." 
                    onChange={handleEditChange} 
                  />
                  <textarea 
                    name="area" 
                    value={editForm.area} 
                    placeholder="Area / Street" 
                    onChange={handleEditChange} 
                  />
                  <div className="inline-row">
                    <input 
                      type="text" 
                      name="city" 
                      value={editForm.city} 
                      placeholder="City" 
                      onChange={handleEditChange} 
                    />
                    <input 
                      type="text" 
                      name="state" 
                      value={editForm.state} 
                      placeholder="State" 
                      onChange={handleEditChange} 
                    />
                  </div>
                  <input 
                    type="text" 
                    name="pincode" 
                    value={editForm.pincode} 
                    placeholder="Pincode" 
                    onChange={handleEditChange} 
                  />
                  
                  <div className="edit-actions-row">
                    <button className="save-edit-btn" onClick={() => handleSaveEdit(idx)} disabled={loading}>
                      <FaCheck /> Save
                    </button>
                    <button className="cancel-edit-btn" onClick={() => setEditingIndex(null)}>
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-left-content">
                    <FaMapMarkerAlt className="card-icon" />
                    <div className="card-details">
                      <h4>Address #{idx + 1}</h4>
                      <p>
                        {addr.houseNo && `${addr.houseNo}, `}
                        {addr.area}, {addr.city}, {addr.state} {addr.pincode && `- ${addr.pincode}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button 
                      className="edit-address-btn"
                      onClick={() => startEditing(addr, idx)}
                      title="Edit Address"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="delete-address-btn"
                      onClick={() => openDeleteModal(addr, idx)} 
                      title="Delete Address"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </>
              )}

            </div>
          ))
        ) : (
          <div className="empty-address">No saved addresses found</div>
        )}
      </div>

      {/* MODERN DIALOG BOX COMPONENT TRIGGER */}
      {deleteTarget && (
        <div className="modal-overlay">
          <div className="modern-modal-box">
            <div className="modal-icon-wrapper">
              <FaExclamationTriangle />
            </div>
            <h3>Delete Address?</h3>
            <p>Are you sure you want to remove this address? This action cannot be undone.</p>
            <div className="modal-buttons-row">
              <button className="modal-cancel-btn" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="modal-delete-btn" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Location;