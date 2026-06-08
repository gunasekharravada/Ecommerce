import React from "react";
import "./categorybar.css";
import { Link } from "react-router-dom";

import {
  FaMobileAlt,
  FaLaptop,
  FaTshirt,
  FaHome,
  FaBook,
  FaGamepad,
  FaShoppingBasket,
  FaFutbol,
  FaPumpSoap,
  FaCouch,
  FaGlasses,
  FaHeartbeat,
  FaPuzzlePiece,
  FaListUl,
  FaChevronRight,

} from "react-icons/fa";

const categories = [
  { name: "All", icon: <FaListUl />, path: "/Homepage" },
  { name: "Fashion", icon: <FaTshirt />, path: "/fashion" },
  { name: "Mobiles", icon: <FaMobileAlt />, path: "/mobiles" },
  { name: "Electronics", icon: <FaLaptop />, path: "/electronics" },
  { name: "Skincare", icon: <FaPumpSoap />, path: "/skincare" },
  { name: "Accessories", icon: <FaGlasses />, path: "/accessories" },
  { name: "Grocery", icon: <FaShoppingBasket />, path: "/grocery" },
  { name: "Health", icon: <FaHeartbeat />, path: "/health" },
  { name: "Sports", icon: <FaFutbol />, path: "/sports" },
  { name: "Home", icon: <FaHome />, path: "/home" },
  { name: "Furniture", icon: <FaCouch />, path: "/furniture" },
  { name: "Books", icon: <FaBook />, path: "/books" },
  { name: "Toys/Kids", icon: <FaPuzzlePiece />, path: "/toys" },
  { name: "Gaming", icon: <FaGamepad />, path: "/gaming" },
];

const CategoryNavbar = () => {
  return (
    <div className="category-section">
      {/* Top row with Title and View All */}
      <div className="category-header">
        <h2 className="category-title">Categories</h2>
        <Link to="/all-categories" className="view-all-link">
          View all <FaChevronRight />
        </Link>
      </div>

      {/* Horizontal scrollable row of icons */}
      <div className="category-navbar">
        {categories.map((category, index) => (
          <Link to={category.path} className="category-item" key={index}>
            <div className="category-icon-bg">
              <span className="category-icon">{category.icon}</span>
            </div>
            <span className="category-name">{category.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavbar;