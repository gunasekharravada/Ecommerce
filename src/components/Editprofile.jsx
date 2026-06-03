import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCamera } from "react-icons/fa";

import "./editprofile.css";

const Editprofile = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const profileData = {
      firstName,
      lastName,
      mobile,
      email,
    };

    localStorage.setItem(
      "userProfile",
      JSON.stringify(profileData)
    );

    alert("Profile Updated Successfully");

    navigate("/profile");
  };

  return (
    <div className="edit-profile-page">

      {/* Header */}
      <div className="edit-header">
        <FaArrowLeft
          className="back-icon"
          onClick={() => navigate("/profile")}
        />
      </div>

      {/* Orange Banner */}
      <div className="profile-banner">

        <div className="profile-image">
          R

          <div className="camera-icon">
            <FaCamera />
          </div>

        </div>

      </div>

      {/* Form */}
      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >
        <div className="input-group">
          <label>First Name</label>

          <input
            type="text"
            value={firstName}
            onChange={(e) =>
              setFirstName(e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label>Last Name</label>

          <input
            type="text"
            value={lastName}
            onChange={(e) =>
              setLastName(e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label>Mobile Number</label>

          <input
            type="text"
            value={mobile}
            onChange={(e) =>
              setMobile(e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label>Email Address</label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="update-btn"
        >
          UPDATE PROFILE
        </button>

      </form>

    </div>
  );
};

export default Editprofile;