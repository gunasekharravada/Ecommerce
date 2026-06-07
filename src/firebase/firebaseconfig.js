// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth ,setPersistence,browserLocalPersistence} from "firebase/auth";
import{getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxdI3kk1ns_2MbQR-Z50nvw6g3jFewQV0",
  authDomain: "ecommerce-6c8c0.firebaseapp.com",
  projectId: "ecommerce-6c8c0",
  storageBucket: "ecommerce-6c8c0.firebasestorage.app",
  messagingSenderId: "234367049457",
  appId: "1:234367049457:web:34c1a715afc38f14079350",
  measurementId: "G-L3DRKY601E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence)
.then(() => {
}).catch((error) => {
  console.error("Error setting persistence:", error);
});
export const db = getFirestore(app);
export {auth};