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
} from "react-icons/fa";

const categories = [
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
    <div className="category-navbar">
      {categories.map((category, index) => (
        <Link
          to={category.path}
          className="category-item"
          key={index}
        >
          <span className="category-icon">{category.icon}</span>
          <span>{category.name}</span>
        </Link>
      ))}
      
    </div>
  );
};

export default CategoryNavbar;