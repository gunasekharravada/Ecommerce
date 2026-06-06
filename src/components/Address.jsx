import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseconfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import "./address.css";

const Address = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    pincode: "",
    state: "",
    city: "",
    houseNo: "",
    area: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
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
        alert("Address saved successfully!");
        navigate("/location");
      } catch (error) {
        console.error("Error saving address: ", error);
        alert("Failed to save address. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("You must be logged in to save an address.");
      setLoading(false);
    }
  };

  return (
    <div className="address-page">
      <div className="address-header">
        <FaArrowLeft onClick={() => navigate("/location")} />
        <h2>Add Delivery Address</h2>
      </div>

      <div className="address-form">
        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="houseNo"
          placeholder="House / Flat Number"
          value={form.houseNo}
          onChange={handleChange}
        />
        <textarea
          name="area"
          placeholder="Area / Street / Landmark"
          value={form.area}
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