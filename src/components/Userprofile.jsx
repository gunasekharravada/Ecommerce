import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig'; // Adjust the import path if needed

const UserProfile = () => {
  const [profileData, setProfileData] = useState({});
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email || '');
        const userRef = doc(db, 'users', user.uid);
        onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfileData(docSnap.data());
          }
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="profile-details">
      <h3>User Profile</h3>
      <p><strong>Full Name:</strong> {profileData.fullName || ""}</p>
      <p><strong>Email:</strong> {userEmail}</p>
      <p><strong>Mobile Number:</strong> {profileData.mobileNumber || ""}</p>
    </div>
  );
};

export default UserProfile;