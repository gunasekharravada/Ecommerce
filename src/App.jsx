import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Appredirect from './components/Appredirect';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Homepage from './components/Homepage';
import Fashion from './components/Fashion';
import Signin from './components/Signin';
import Profile from './components/Profile';
import EditProfile from './components/Editprofile';
import Orders from './components/Orders';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import UserProfile from './components/Userprofile';

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
              <CategoryBar />
              <Homepage />
            </>
          }
        />
        <Route
          path="/fashion"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Fashion />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Profile />
            </>
          }
        />
        <Route
          path="/edit-profile"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <EditProfile />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Orders />
            </>
          }
        />
        <Route
          path="/notifications"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Notifications />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <Settings />
            </>
          }
        />
        <Route
          path="/userprofile"
          element={
            <>
              <Navbar />
              <CategoryBar />
              <UserProfile />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;