import React, { useEffect, useState } from 'react';
import './slider.scss';

const slidesData = [
  {
    id: 'slide-1',
    image: 'https://sahcon.com/wp-content/uploads/2025/08/3.jpg',
    label: 'lucky jet',
  },
  {
    id: 'slide-2',
    image: 'https://roarcdn.fitting-solutions.at/borgata/casino/en/blog/wp-content/uploads/2023/07/25114947/Header-A-close-up-of-a-white-roulette-ball-Roulette-odds.jpg?lossy=1&ssl=1',
    label: 'roulette',
  },
];



const Slide = ({ slide, index, isActive }) => (
    <div className={`slide ${isActive ? 'active' : ''}`} id={slide.id}>
      <div className="slide__bg" style={{ backgroundImage: `url(${slide.image})` }}></div>
    </div>
);

export default function Slider({ showLabels = true }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoSlideInterval = 10000;

  useEffect(() => {
    if (!showLabels) return;

    let progressInterval;

    const startProgress = () => {
      setProgress(0);
      let startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = (elapsed / autoSlideInterval) * 100;
        if (currentProgress >= 100) {
          setCurrentSlide((prev) => (prev + 1) % slidesData.length);
          startTime = Date.now();
          setProgress(0);
        } else {
          setProgress(currentProgress);
        }
      }, 50);
    };

    startProgress();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [currentSlide, showLabels]);

  const handleSlideClick = (index, e) => {
    e.preventDefault();
    setCurrentSlide(index);
  };

  return (
      <header className="header__main">
        <div className="slider">
          {slidesData.map((slide, index) => (
              <Slide key={slide.id} slide={slide} index={index} isActive={currentSlide === index} />
          ))}

          {showLabels && (
              <div className="slider__progress">
                <div className="slider__progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
          )}

          <div className={`slider__pagination ${showLabels ? 'show' : ''}`}>
            {slidesData.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={(e) => handleSlideClick(index, e)}
                  className={`button ${showLabels ? 'show' : ''} ${currentSlide === index ? 'active' : ''}`}
                >
                  {slide.label}
                </button>
            ))}
          </div>
        </div>
      </header>
  );
}
