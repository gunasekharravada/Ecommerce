import React, { useEffect, useState } from 'react';
import { doc, onSnapshot, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';
import './cart.css';
import Cartitemlist from './Cartitemlist';
const Cart = () => {
const [cartItems, setCartItems] = useState([]);
useEffect(() => {
const unsubscribe = auth.onAuthStateChanged((user) => {
if (user) {
const cartRef = doc(db, 'users', user.uid, 'carts', 'userCart');
const unsubscribeCart = onSnapshot(cartRef, (docSnapshot) => {
if (docSnapshot.exists()) {
setCartItems(docSnapshot.data().items || []);
} else {
setCartItems([]);
}
});
return () => unsubscribeCart();
} else {
setCartItems([]);
}
});
return () => unsubscribe();
}, []);
const updateQuantity = async (itemId, newQuantity) => {
const user = auth.currentUser;
if (!user) return;
const cartRef = doc(db, 'users', user.uid, 'carts', 'userCart');
const cartSnap = await getDoc(cartRef);
if (cartSnap.exists()) {
const existingItems = cartSnap.data().items || [];
const itemIndex = existingItems.findIndex(i => i.id === itemId);
if (itemIndex > -1) {
if (newQuantity <= 0) {
existingItems.splice(itemIndex, 1);
} else {
existingItems[itemIndex].quantity = newQuantity;
}
await updateDoc(cartRef, { items: existingItems });
}
}
};
const removeItem = async (itemId) => {
const user = auth.currentUser;
if (!user) return;
const cartRef = doc(db, 'users', user.uid, 'carts', 'userCart');
const cartSnap = await getDoc(cartRef);
if (cartSnap.exists()) {
const existingItems = cartSnap.data().items || [];
const updatedItems = existingItems.filter(item => item.id !== itemId);
await updateDoc(cartRef, { items: updatedItems });
}
};
return (
<div>
<Cartitemlist 
items={cartItems} 
onUpdateQuantity={updateQuantity}
onRemoveItem={removeItem}
/>
</div>
);
};
export default Cart;