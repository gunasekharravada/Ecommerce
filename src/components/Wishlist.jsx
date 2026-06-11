import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseconfig";
import { useNavigate } from "react-router-dom";
import "./wishlist.css";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatingId, setAnimatingId] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const wishlistRef = collection(db, "users", user.uid, "wishlist");
    try {
      const querySnapshot = await getDocs(wishlistRef);
      const items = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        docId: doc.id
      }));
      setWishlistItems(items);
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (docId, productName) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const itemRef = doc(db, "users", user.uid, "wishlist", docId);
      await deleteDoc(itemRef);
      alert(`${productName} has been removed from your wishlist.`);
      fetchWishlist();
    } catch (error) {
      console.error("Error removing item from wishlist: ", error);
    }
  };

  const handleMoveToCart = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }

    // Trigger sliding animation for this specific item ID
    setAnimatingId(item.docId);

    try {
      // 1. Add item to the user's cart collection in Firestore
      const cartRef = doc(db, "users", user.uid, "carts", item.docId);
      await setDoc(cartRef, {
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1, // Default starting quantity
        addedAt: new Date()
      });

      // 2. Remove from wishlist
      const wishlistRef = doc(db, "users", user.uid, "wishlist", item.docId);
      await deleteDoc(wishlistRef);

      // 3. Let animation finish playing out, then redirect
      setTimeout(() => {
        setAnimatingId(null);
        navigate("/cart");
      }, 800);

    } catch (error) {
      console.error("Error moving item to cart: ", error);
      setAnimatingId(null);
    }
  };

  if (loading) {
    return <div className="loading-state">Loading your wishlist...</div>;
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header-wrapper" onClick={() => navigate("/wishlist")}>
        <span className="wishlist-heart-icon active"></span>
        <h2>My Wishlist</h2>
      </div>

      {wishlistItems.length === 0 ? (
        <p className="empty-message">Your wishlist is empty.</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div 
              className={`wishlist-item ${animatingId === item.docId ? "item-moving-out" : ""}`} 
              key={item.docId}
            >
              {/* Animation Slide overlay element */}
              {animatingId === item.docId && (
                <div className="bag-animation-overlay">
                  <span className="sliding-bag">🛍️</span>
                </div>
              )}

              <div className="image-wrapper">
                <img src={item.image} alt={item.name} />
              </div>
              <h3>{item.name}</h3>
              <p className="price-text">Locating... ₹{item.price.toLocaleString()}</p>
              
              <div className="action-buttons">
                <button 
                  className="move-cart-btn"
                  onClick={() => handleMoveToCart(item)}
                >
                  Move to Cart
                </button>
                <button 
                  className="remove-btn" 
                  onClick={() => handleRemove(item.docId, item.name)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;