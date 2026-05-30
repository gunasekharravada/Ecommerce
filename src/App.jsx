import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Categorybar from "./components/Categorybar";
import Homepage from "./components/Homepage";
import Signin from "./components/Signin";
import Fashion from "./components/Fashion";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Categorybar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/fashion" element={<Fashion />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;