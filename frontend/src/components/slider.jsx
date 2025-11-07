import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import rouletteGif from '../assets/img/roulette.webp';
import luckyJetGif from '../assets/img/luckyjet.webp';
import slotsImg from '../assets/img/slots.jpg';
import './slider.scss';
import { clearAllSparkles } from '../utils/sparkles';

const sliderData = [
  {
    id: 'slide-1',
    image: luckyJetGif,
    link: '/lucky-jet',
    title: 'Lucky Jet',
  },
  {
    id: 'slide-2',
    image: rouletteGif,
    link: '/roulette',
    title: 'Roulette',
  },
  {
    id: 'slide-3',
    image: slotsImg,
    link: '/slots',
    title: 'Slots',
  },
];

const Slider = ({ showLabels = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = (index) => {
    if (index !== currentIndex) {
      try { clearAllSparkles(); } catch { /* */ }
      setIsTransitioning(true);
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    const next = (currentIndex + 1) % sliderData.length;
    goToSlide(next);
  };

  const prevSlide = () => {
    const prev = currentIndex === 0 ? sliderData.length - 1 : currentIndex - 1;
    goToSlide(prev);
  };

  // Auto slide
  useEffect(() => {
    if (!showLabels) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [currentIndex, showLabels]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * -0.005;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      document.documentElement.style.setProperty('--move-x', `${moveX}deg`);
      document.documentElement.style.setProperty('--move-y', `${moveY}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!showLabels) return null;

  return (
    <div className="header__main">
      <div className="slider">
        <div
          className="slides"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? 'transform 0.5s ease-in-out' : 'none',
          }}
        >
          {sliderData.map((slide) => (
            <div key={slide.id} className="slide">
              <Link to={`/redirect?to=${slide.link}`}>
                <div className="layers">
                  <div className="layers__container">
                    <div
                      className="layers__item layer-1"
                      style={{
                        backgroundImage: `url(${slide.image})`,
                      }}
                    />
                  </div>
                </div>
                <div className="hero-content">

                  <h2
                  className="sparkle-hover hero-text">{slide.title}</h2>
                </div>
              </Link>
            </div>
          ))}
  </div>

        <button
          type="button"
          className="nav-btn prev"
          onClick={prevSlide}
          aria-label="Previous slide"
          title="Previous"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <polyline points="15 18 9 12 15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <button
          type="button"
          className="nav-btn next"
          onClick={nextSlide}
          aria-label="Next slide"
          title="Next"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <polyline points="9 18 15 12 9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </button>

        <div className="dots">
          {sliderData.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
