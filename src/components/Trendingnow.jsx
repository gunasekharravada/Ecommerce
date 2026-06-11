import React, { useState } from "react";
import "./trendingnow.css";
import jacket1 from "../images/menjacket3.jpg";
import samsungs26f from "../images/samsungs26f.jpg";
import headset from "../images/headset.png";
import skincare3 from "../images/skincare3.jpg";
import handbag from "../images/handbag.png";
import shoe1 from "../images/shoe111.jpg";
import bag from "../images/bag.jpg";
import atomichabits from "../images/atomichabits.jpg";
import { FaHeart, FaStar, FaChevronRight } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig'; 

const trendingProducts = [
  {
    id: 1,
    name: "Men Premium Jacket",
    category: "Fashion",
    image: jacket1,
    price: 2499,
    oldPrice: 4350,
    rating: 4.8,
    discount: 24,
  },
  {
    id: 2,
    name: "Samsung S26 Ultra",
    category: "Mobiles",
    image: samsungs26f,
    price: 129999,
    oldPrice: 139999,
    rating: 4.9,
    discount: 8,
  },
  {
    id: 3,
    name: "Sony Wireless Headset",
    category: "Electronics",
    image: headset,
    price: 14990,
    oldPrice: 22990,
    rating: 4.7,
    discount: 35,
  },
  {
    id: 4,
    name: "Cetaphil Cleanser",
    category: "Beauty",
    image: skincare3,
    price: 599,
    oldPrice: 799,
    rating: 4.8,
    discount: 25,
  },
  {
    id: 5,
    name: "Leather Handbag",
    category: "Accessories",
    image: handbag,
    price: 1499,
    oldPrice: 1999,
    rating: 4.6,
    discount: 25,
  },
  {
    id: 6,
    name: "Nike Running Shoes",
    category: "Footwear",
    image: shoe1,
    price: 2999,
    oldPrice: 3999,
    rating: 4.7,
    discount: 25,
  },
  {
    id: 7,
    name: "Travel Backpack",
    category: "Bags",
    image: bag,
    price: 1299,
    oldPrice: 1799,
    rating: 4.5,
    discount: 28,
  },
  {
    id: 8,
    name: "Atomic Habits",
    category: "Books",
    image: atomichabits,
    price: 399,
    oldPrice: 599,
    rating: 4.9,
    discount: 33,
  },
];

const Trendingnow = () => {
  // State to control modal visibility and keep track of the selected product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Triggers when user clicks the heart icon
  const handleHeartClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Runs only if the user confirms "Yes" inside the modal
  const handleConfirmWishlist = async () => {
    if (!selectedProduct) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to add items to your wishlist.");
      setIsModalOpen(false);
      return;
    }

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', String(selectedProduct.id));

    try {
      await setDoc(wishlistRef, {
        id: selectedProduct.id,
        name: selectedProduct.name,
        category: selectedProduct.category,
        image: selectedProduct.image,
        price: selectedProduct.price,
        oldPrice: selectedProduct.oldPrice,
        rating: selectedProduct.rating,
        discount: selectedProduct.discount,
        addedAt: new Date()
      });
      // Close the modal cleanly after saving
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error adding to wishlist: ", error);
      setIsModalOpen(false);
    }
  };

  // --- CART FUNCTION ---
  const handleAddToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to add items to your cart.");
      return;
    }

    const cartRef = doc(db, "users", user.uid, "carts", "userCart");
    
    try {
      const cartSnap = await getDoc(cartRef);

      if (cartSnap.exists()) {
        const existingItems = cartSnap.data().items || [];
        const itemIndex = existingItems.findIndex(i => i.id === item.id);

        if (itemIndex > -1) {
          existingItems[itemIndex].quantity += 1;
        } else {
          existingItems.push({ ...item, quantity: 1 });
        }

        await updateDoc(cartRef, { items: existingItems });
      } else {
        await setDoc(cartRef, { items: [{ ...item, quantity: 1 }] });
      }
      alert(`${item.name} added to cart!`);
    } catch (error) {
      console.error("Error updating cart database: ", error);
    }
  };

  return (
    <section className="trending-section">
      <div className="section-header">
        <h2>Trending Now</h2>
        <span>View All <FaChevronRight /></span>
      </div>

      <div className="trending-slider">
        {trendingProducts.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="discount-badge">
              -{item.discount}%
            </div>

            {/* Triggers the confirmation modal instead of pushing instantly */}
            <button className="wishlist-btn" onClick={() => handleHeartClick(item)}>
              <FaHeart />
            </button>

            <div className="image-box">
              <img src={item.image} alt={item.name} />
            </div>

            <p className="category">{item.category}</p>

            <h4>{item.name}</h4>

            <div className="rating">
              <FaStar />
              <span>{item.rating}</span>
            </div>

            <div className="price-box">
              <span className="price">
                ₹{item.price.toLocaleString()}
              </span>

              <span className="old-price">
                ₹{item.oldPrice.toLocaleString()}
              </span>
            </div>

            <button className="cart-btn" onClick={() => handleAddToCart(item)}>
              Add To Cart
            </button>
          </div>
        ))}
      </div>

      {/* Modern Confirmation Box UI Overlay */}
      {isModalOpen && selectedProduct && (
        <div className="custom-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Save item to wishlist?</h3>
            <p>Do you want to add {selectedProduct.name} to your wishlist collection?</p>
            <div className="modal-actions">
              <button onClick={handleConfirmWishlist} className="btn-confirm">
                Yes
              </button>
              <button onClick={() => { setIsModalOpen(false); setSelectedProduct(null); }} className="btn-cancel">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Trendingnow;