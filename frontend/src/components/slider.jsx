import React, { useEffect, useState } from 'react';
import './slider.scss';

const slidesData = [
  {
    id: 'slide-1',
    leftImage: 'https://www.androidp1.com/uploads/posts/2023-07/lucky-jet.webp',
    rightImage: 'https://www.androidp1.com/uploads/posts/2023-07/lucky-jet.webp',
    label: 'lucky jet',
  },
  {
    id: 'slide-2',
    leftImage: 'https://roarcdn.fitting-solutions.at/borgata/casino/en/blog/wp-content/uploads/2023/07/25114947/Header-A-close-up-of-a-white-roulette-ball-Roulette-odds.jpg?lossy=1&ssl=1',
    rightImage: 'https://roarcdn.fitting-solutions.at/borgata/casino/en/blog/wp-content/uploads/2023/07/25114947/Header-A-close-up-of-a-white-roulette-ball-Roulette-odds.jpg?lossy=1&ssl=1',
    label: 'roulette',
  },
];

const SvgDefs = ({ slide, index }) => (
    <>
      <pattern id={`pattern${index + 1}l`} patternUnits="userSpaceOnUse" width="562" height="366" viewBox="0 0 562 366">
        <image xlinkHref={slide.leftImage} width="600px" height="600px" />
      </pattern>
      <pattern id={`pattern${index + 1}r`} patternUnits="userSpaceOnUse" x="365px" width="562" height="366" viewBox="0 0 562 366">
        <image xlinkHref={slide.rightImage} width="600px" height="600px" />
      </pattern>
    </>
);

const Slide = ({ slide, index }) => (
    <div className="slide" id={slide.id}>
      <div className="slide__images">
        <div className="slide__image slide__image--left">
          <svg viewBox="0 0 900 365" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" x="0px" y="0px">
            <path d="M 0 0 L 0 365 L 351.2382 365 L 562 0 L 0 0 Z" fill={`url(#pattern${index + 1}l)`} />
          </svg>
        </div>
        <div className="slide__image slide__image--right">
          <svg viewBox="0 0 900 365" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" x="0px" y="0px">
            <path d="M 900 365 L 900 0 L 548.7618 0 L 338 365 L 900 365 Z" fill={`url(#pattern${index + 1}r)`} />
          </svg>
        </div>
      </div>
    </div>
);

export default function Slider({ showLabels = true }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const autoSlideInterval = 10000;

  useEffect(() => {
    window.location.href = "#slide-1";
  }, []);

  useEffect(() => {
    if (!showLabels) return;

    let progressInterval;

    const startProgress = () => {
      let startTime = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentProgress = (elapsed / autoSlideInterval) * 100;
        if (currentProgress >= 100) {
          setCurrentSlide((prev) => (prev + 1) % slidesData.length);
          startTime = Date.now();
        }
        setProgress(currentProgress);
      }, 50);
    };

    startProgress();

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [showLabels]);

  useEffect(() => {
    if (!showLabels) return;

    const nextSlideHref = slidesData[(currentSlide + 1) % slidesData.length].id;
    const timer = setTimeout(() => {
      window.location.href = `#${nextSlideHref}`;
    }, autoSlideInterval);

    return () => clearTimeout(timer);
  }, [currentSlide, showLabels]);

  return (
      <header className="header__main">
        <div className="slider">
          <svg className="slider__mask" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080" width="0" height="0">
            <defs>
              {slidesData.map((slide, index) => (
                  <SvgDefs key={slide.id} slide={slide} index={index} />
              ))}
            </defs>
          </svg>

          {slidesData.map((slide, index) => (
              <Slide key={slide.id} slide={slide} index={index} />
          ))}

          {showLabels && (
              <div className="slider__progress">
                <div className="slider__progress-bar" style={{ width: `${Math.min(progress, 100)}%` }}></div>
              </div>
          )}

          <div className={`slider__pagination ${showLabels ? 'show' : ''}`}>
            {slidesData.map((slide) => (
                <a key={slide.id} href={`#${slide.id}`} className={`button ${showLabels ? 'show' : ''}`}>{slide.label}</a>
            ))}
          </div>
        </div>
      </header>
  );
}
