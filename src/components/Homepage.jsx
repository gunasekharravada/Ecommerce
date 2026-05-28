import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";

import fashionImg from "../images/fashion3.jpg";
import mobileImg from "../images/mobile1.jpg";
import electronicsImg from "../images/electronics2.jpg";
import skincareImg from "../images/skincare1.jpg";
import gamingImg from "../images/gaming.jpg";

const slides = [
  {
    title: "Discover Your Perfect Style",
    subtitle: "NEW FASHION",
    image: fashionImg,
    path: "/fashion",
  },
  {
    title: "Latest Smartphones Collection",
    subtitle: "SMART MOBILES",
    image: mobileImg,
    path: "/mobile",
  },
  {
    title: "Upgrade Your Electronics",
    subtitle: "TRENDING GADGETS",
    image: electronicsImg,
    path: "/electronics",
  },
  {
    title: "Glow With Premium Skincare",
    subtitle: "SKINCARE PRODUCTS",
    image: skincareImg,
    path: "/skincare",
  },
  {
    title: "Level Up Your Gaming Setup",
    subtitle: "GAMING EQUIPMENT",
    image: gamingImg,
    path: "/gaming",
  },
];

/* Duplicate first slide */

const extendedSlides = [...slides, slides[0]];

const Homepage = () => {
  const [current, setCurrent] = useState(0);

  const [transitionEnabled, setTransitionEnabled] =
    useState(true);

  const navigate = useNavigate();

  /* AUTO SLIDE */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  /* SEAMLESS INFINITE LOOP */

  useEffect(() => {
    if (current === slides.length) {
      const timeout = setTimeout(() => {
        /* Disable animation */

        setTransitionEnabled(false);

        /* Jump to first slide instantly */

        setCurrent(0);
      }, 600);

      return () => clearTimeout(timeout);
    }

    /* Re-enable animation */

    if (!transitionEnabled) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
        });
      });
    }
  }, [current, transitionEnabled]);

  return (
    <div className="carousel">

      {/* SLIDER TRACK */}

      <div
        className="slider-track"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: transitionEnabled
            ? "transform 0.6s ease-in-out"
            : "none",
        }}
      >
        {extendedSlides.map((slide, index) => (
          <div className="slide" key={index}>

            {/* CONTENT */}

            <div className="content">
              <p>{slide.subtitle}</p>

              <h1>{slide.title}</h1>

              <button onClick={() => navigate(slide.path)}>
                SHOP NOW
              </button>
            </div>

            {/* IMAGE */}

            <div className="image-section">
              <img src={slide.image} alt="category" />
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION DOTS */}

      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={
              current % slides.length === index
                ? "dot active-dot"
                : "dot"
            }
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Homepage;