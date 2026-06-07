import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Appredirect from './components/Appredirect';
import Navbar from './components/Navbar';
import Categorybar from './components/Categorybar';
import Homepage from './components/Homepage';
import Fashion from './components/Fashion';
import Signin from './components/Signin';
import Profile from './components/Profile';
import Editprofile from './components/Editprofile';
import Orders from './components/Orders';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import UserProfile from './components/Userprofile';
import Location from './components/Location';
import Address from './components/Address';

// Import auth to track initial boot layer status
import { auth } from './firebase/firebaseconfig';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check background authentication status immediately on application boot
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsInitializing(false); // Token validation complete!
    });

    return () => unsubscribe();
  }, []);

  // While Firebase is reading the token, show a mobile-friendly clean loading state
  if (isInitializing) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'sans-serif',
        color: '#666'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '16px', fontWeight: '500' }}>Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Appredirect />} />
        
        {/* If user is already signed in, prevent them from accessing /signin manually */}
        <Route 
          path="/signin" 
          element={user ? <Navigate to="/home" replace /> : <Signin />} 
        />
        
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Homepage />
            </>
          }
        />
        <Route
          path="/fashion"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Fashion />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Profile />
            </>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Editprofile />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Orders />
            </>
          }
        />
        <Route
          path="/notifications"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Notifications />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Settings />
            </>
          }
        />
        <Route
          path="/userprofile"
          element={
            <>
              <Navbar />
              <Categorybar />
              <UserProfile />
            </>
          }
        />
        <Route
          path="/add-address"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Address />
            </>
          }
        />    
        <Route
          path="/location"
          element={
            <>
              <Navbar />
              <Categorybar />
              <Location />
            </>
          }
        />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;