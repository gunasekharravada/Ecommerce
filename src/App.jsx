import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Appredirect from './components/Appredirect';
import Navbar from "./components/Navbar";
import Categorybar from "./components/Categorybar";
import Homepage from "./components/Homepage";
import Signin from "./components/Signin";
import Fashion from "./components/Fashion";
import Profile from "./components/Profile";
import Editprofile from "./components/Editprofile";
import Orders from "./components/Orders";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import Userprofile from "./components/Userprofile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Categorybar />

      <Routes>
        <Route path="/" element={<Appredirect />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/edit-profile" element={<Editprofile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/Userprofile" element={<Userprofile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;