import React, { useEffect } from 'react';
import './slider.scss';

const slidesData = [
  {
    id: 'slide-1',
    leftImage: 'https://images.unsplash.com/photo-1454328911520-ccf83f1ef41d?dpr=1&auto=format&fit=crop&w=600&h=600&q=80&cs=tinysrgb&crop=&bg=',
    rightImage: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?dpr=1&auto=format&fit=crop&w=600&h=600&q=80&cs=tinysrgb&crop=&bg=',
    label: 'lucky jet',
  },
  {
    id: 'slide-2',
    leftImage: 'https://images.unsplash.com/photo-1497377825569-02ad2f9edb81?dpr=1&auto=format&fit=crop&w=600&h=600&q=80&cs=tinysrgb&crop=&bg=',
    rightImage: 'https://images.unsplash.com/photo-1496060169243-453fde45943b?dpr=1&auto=format&fit=crop&w=600&h=600&q=80&cs=tinysrgb&crop=&bg=',
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
  useEffect(() => {
    window.location.href = "#slide-1";
  }, []);

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

        <div className={`slider__pagination ${showLabels ? 'show' : ''}`}>
          {slidesData.map((slide, index) => (
            <a key={slide.id} href={`#${slide.id}`} className={`button ${showLabels ? 'show' : ''}`}>{slide.label}</a>
          ))}
        </div>
      </div>
    </header>
  );
}
