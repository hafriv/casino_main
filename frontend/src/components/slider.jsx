import React, { useEffect, useState } from 'react';
import './slider.scss';
import { Link } from 'react-router-dom';

const slidesData = [
  {
    id: 'slide-1',
    link: '/lucky-jet',
    image: 'https://sahcon.com/wp-content/uploads/2025/08/3.jpg',
    label: 'lucky-jet',
  },
  {
    id: 'slide-2',
    link: '/roulette',
    image: 'https://roarcdn.fitting-solutions.at/borgata/casino/en/blog/wp-content/uploads/2023/07/25114947/Header-A-close-up-of-a-white-roulette-ball-Roulette-odds.jpg?lossy=1&ssl=1',
    label: 'roulette',
  },
];

const Slide = ({ slide, isActive }) => (
    <div
        className={`slide ${isActive ? 'active' : ''}`}
        id={slide.id}
        aria-hidden={!isActive}
        style={{
          display: isActive ? 'block' : 'none',
          width: '100%',
          height: '100%',
        }}
    >
      <Link to={slide.link} style={{ display: 'block', width: '100%', height: '100%' }}>
        <div
            className="slide__bg"
            style={{
              backgroundImage: `url(${String(slide.image).trim()})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%',
            }}
        />
      </Link>
    </div>
);

export default function Slider({ showLabels = true }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoSlideInterval = 10000;

  useEffect(() => {
    if (!showLabels) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = (elapsed / autoSlideInterval) * 100;

      if (currentProgress >= 100) {
        setCurrentSlide((prev) => (prev + 1) % slidesData.length);
        setProgress(0); // сброс прогресса
      } else {
        setProgress(currentProgress);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentSlide, showLabels]); // зависимость от currentSlide — правильно

  const handleSlideClick = (index, e) => {
    e.preventDefault();
    setCurrentSlide(index);
    setProgress(0); // сброс прогресс-бара при ручном переключении
  };

  return (
      <header className="header__main">
        <div className="slider">
          {slidesData.map((slide, index) => (
              <Slide
                  key={slide.id}
                  slide={slide}
                  isActive={currentSlide === index}
              />
          ))}

          {showLabels && (
              <div className="slider__progress">
                <div
                    className="slider__progress-bar"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
          )}

          <div className={`slider__pagination ${showLabels ? 'show' : ''}`}>
            {slidesData.map((slide, index) => (
                <button
                    key={slide.id}
                    onClick={(e) => handleSlideClick(index, e)}
                    className={`button ${showLabels ? 'show' : ''} ${
                        currentSlide === index ? 'active' : ''
                    }`}
                    aria-label={`Go to ${slide.label}`}
                >
                  {slide.label}
                </button>
            ))}
          </div>
        </div>
      </header>
  );
}