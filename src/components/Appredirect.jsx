import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseconfig'; // Make sure this path points to your firebase config
import { onAuthStateChanged } from 'firebase/auth';

const AppRedirect = () => {
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
          // If they are on mobile and logged out, keep them on sign-in
          navigate('/');
        } else {
          // If laptop/desktop, default to /home or wherever your main view is
          navigate('/home');
        }
      }
      setLoading(false);
    });

    // 2. Handle screen resizing dynamically
    const handleResize = () => {
      const user = auth.currentUser;
      const isMobile = window.innerWidth <= 768;

      if (user) {
        navigate('/home');
      } else if (!isMobile) {
        navigate('/home');
      } else {
        navigate('/');
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up listeners on unmount
    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  if (loading) return null; // Wait for Firebase to confirm auth status

  return null;
};

export default AppRedirect;