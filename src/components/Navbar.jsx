import React, { useState,useRef, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaShoppingBag,
  FaChevronDown,
  FaHome,
  FaStore,
  FaTshirt,
  FaLaptop,
  FaMobile,
  FaClock,
  FaBook,
  FaSprayCan,
  FaPumpSoap,
  FaCouch,
} from "react-icons/fa";

import "./navbar.css";
import logo from "../images/logo.png";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdown, setShopDropdown] = useState(false);
  const [sticky, setSticky] = useState(false);

  const cartCount = 3; // Replace with actual cart count logic

  const shopDropdownRef = useRef(null); // Ref for shop dropdown

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(event.target)
      ) {
        setShopDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
   
    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <nav className={`navbar ${sticky ? "sticky" : ""}`}>
        {/* Logo */}
        <div className="logo">
          <a href="/">
            <img src={logo} alt="GoCart Logo" />
          </a>
        </div>

        {/* Center Menu */}
        <ul className="nav-links">
          <li><a href="/">Home</a></li>

          <li
            className="shop-menu"
           onMouseEnter={() => setShopDropdown(true)}
            ref={shopDropdownRef}
          >
            Shop <FaChevronDown className="dropdown-icon" />

            {shopDropdown && (
              <ul className="dropdown">

                <a href="/"><li><FaTshirt /> Fashion</li></a>
                <a href="/"><li><FaMobile /> Mobiles</li></a>
                <a href="/"><li><FaLaptop /> Electronics</li></a>
                <a href="/"><li><FaPumpSoap /> Skincare</li></a>
                <a href="/"><li><FaShoppingBag /> Accessories </li></a>
                <a href="/"><li><FaBook /> Books</li></a>
                
                <a href="/"><li><FaCouch /> Furniture</li></a>
              </ul>
            )}
          </li>

          <li>About</li>
          <li>Contact</li>
        </ul>

        {/* Right Icons */}
        <div className="nav-icons">
          <div className="search-container">
            {searchOpen && (
              <input type="text" placeholder="Search products..." className="search-input"/>
            )}

            <FaSearch
              className="icon"
              onClick={() => setSearchOpen(!searchOpen)}
            />
          </div>

          <FaUser className="icon" />

          <div className="cart-container">
            <FaShoppingBag className="icon" />
            <span className="cart-badge">{cartCount}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Top Section */}
      <div className="mobile-top">
        <div className="mobile-logo">
          <img src={logo} alt="GoCart Logo" />
        </div>

        <div className="mobile-search">
          
          <input
            type="text"
            placeholder="Search products..."
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <a href="/">
          <FaHome />
          <span>Home</span>
        </a>

        <a href="/shop">
          <FaStore />
          <span>Shop</span>
        </a>

        <a href="/profile">
          <FaUser />
          <span>Profile</span>
        </a>

        <a href="/cart" className="mobile-cart">
          <FaShoppingBag />
          <span>Cart</span>

          <div className="mobile-badge">
            {cartCount}
          </div>
        </a>
      </div>
    </>
  );
};

export default Navbar;