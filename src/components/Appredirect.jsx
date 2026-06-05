import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseconfig';
import { onAuthStateChanged } from 'firebase/auth';

const Appredirect = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isMobile = window.innerWidth <= 768;

      if (user) {
        navigate('/home');
      } else {
        if (isMobile) {
          navigate('/signin');
        } else {
          navigate('/home');
        }
      }
      setLoading(false);
    });

    const handleResize = () => {
      const user = auth.currentUser;
      const isMobile = window.innerWidth <= 768;

      if (user) {
        navigate('/home');
      } else if (!isMobile) {
        navigate('/home');
      } else {
        navigate('/signin');
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      window.removeEventListener('resize', handleResize);
    };
  }, [navigate]);

  if (loading) return null;

  return null;
};

export default Appredirect;