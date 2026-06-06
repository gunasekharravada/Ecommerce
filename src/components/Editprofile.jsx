import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft} from "react-icons/fa";
// ADDED: Firebase Auth and Firestore imports
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";


import "./editprofile.css";

const Editprofile = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);

  // ADDED: Fetch existing user data to pre-fill the form inputs
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/signin");
      } else {
        setUserId(user.uid);
        
        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // If fullName exists, split it back into first and last name placeholders
            if (data.fullName) {
              const nameParts = data.fullName.split(" ");
              setFirstName(nameParts[0] || "");
              setLastName(nameParts.slice(1).join(" ") || "");
            }
            setMobile(data.mobileNumber || "");
            setEmail(data.email || user.email || ""); // Fallback to auth email if not in firestore
          } else {
            // If no firestore doc exists yet, pull the default email from auth
            setEmail(user.email || "");
          }
        } catch (error) {
          console.error("Error loading profile data: ", error);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, auth, db]);

  // UPDATED: Save data directly to Firestore instead of localStorage
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) return;

    // Combine first and last name to match the profile page schema
    const combinedFullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    const profileData = {
      fullName: combinedFullName || "Full Name",
      mobileNumber: mobile,
      email: email,
    };

    try {
      const userDocRef = doc(db, "users", userId);
      
      // merge: true keeps other existing document fields safe from overwrites
      await setDoc(userDocRef, profileData, { merge: true });

      alert("Profile Updated Successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  // Helper to get the first letter for the avatar icon
  const avatarLetter = firstName ? firstName.charAt(0).toUpperCase() : "";

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
          {avatarLetter}

          

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
            required
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
            disabled // Often kept disabled so users change emails through auth settings
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