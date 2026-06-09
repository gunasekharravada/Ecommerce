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
import Trendingnow from './components/Trendingnow';

// Import auth to track initial boot layer status
import { auth } from './firebase/firebaseconfig';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check background authentication status immediately on application boot
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

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
              <Trendingnow /> {/* Added here so it shows up on the Homepage directly under the slider */}
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
        <Route 
          path='/trendingnow'
          element={
            <>
              <Navbar />
              <Categorybar />
              <Trendingnow />
            </>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;