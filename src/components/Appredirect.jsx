import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseconfig'; 
import { onAuthStateChanged } from 'firebase/auth';

const Appredirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen directly to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isMobile = window.innerWidth <= 768;

      if (user) {
        // User is securely signed in -> Send them to home
        navigate('/home');
      } else {
        // User is logged out
        if (isMobile) {
          // TARGET ACHIEVED: Fast redirect to Sign-In form on mobile
          navigate('/signin'); 
        } else {
          // If laptop/desktop, default to /home or your main landing view
          navigate('/home');
        }
      }
      setLoading(false);
    });

    // 2. Handle screen resizing dynamically if they rotate their phone
    const handleResize = () => {
      const user = auth.currentUser;
      const isMobile = window.innerWidth <= 768;

      if (user) {
        navigate('/home');
      } else if (!isMobile) {
        navigate('/home');
      } else {
        navigate('/signin'); // Changed from '/' to '/signin'
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up listeners on unmount
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  if (loading) return null; // Wait for Firebase to confirm auth status before rendering anything

  return null;
};

export default Appredirect;