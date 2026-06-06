import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Appredirect />} />
        <Route path="/signin" element={<Signin />} />
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