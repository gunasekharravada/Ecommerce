// App.jsx

import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Categorybar from "./components/Categorybar";
import Homepage from "./components/Homepage";

import Fashion from "./components/Fashion";
// Import other category components as needed


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Categorybar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />

        <Route path="/fashion" element={<Fashion />} />
        // Import and add routes for other categories as needed

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;