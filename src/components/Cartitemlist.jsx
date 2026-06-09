import React from 'react';

// FIXED: Destructured "items" to match the prop sent from Cart.jsx
function Cartitemlist({ items, onUpdateQuantity, onRemoveItem }) {
  
  // Checking "items" instead of "cartItems"
  if (!items || items.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-items-container">
      {items.map((item) => (
        <div key={item.id} className="cart-item">
          <img src={item.image} alt={item.name} className="item-image" />
          <div className="item-details">
            <h4>{item.name}</h4>
            <p>Price: ${item.price.toFixed(2)}</p>
            <div className="quantity-controls">
              <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
            </div>
            <button onClick={() => onRemoveItem(item.id)}>Remove</button>
          </div>
        </div>
      ))}
      <div className="cart-total">
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
      </div>
    </div>
  );
}

export default Cartitemlist;