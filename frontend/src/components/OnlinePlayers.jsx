import React, { useEffect, useState, useRef } from 'react';
import './slider.scss';

// Small internal wheel numeric component — avoids external deps.
const WheelNumber = ({ value, digitHeight = 28, duration = 600 }) => {
  const str = String(value);
  const prevRef = useRef(String(value));
  const [digits, setDigits] = useState(str.split(''));
  useEffect(() => {
    const newStr = String(value);
    // pad to same length as previous to avoid layout shifts
    const maxLen = Math.max(prevRef.current.length, newStr.length);
    const a = prevRef.current.padStart(maxLen, '0').split('');
    const b = newStr.padStart(maxLen, '0').split('');
    setDigits(b);
    prevRef.current = newStr;
  }, [value]);

  return (
    <div className="wheel-number" style={{ display: 'inline-flex', gap: 4 }}>
      {digits.map((d, i) => (
        <div className="digit-slot" key={i} style={{ height: digitHeight }}>
          <div
            className="digit-list"
            style={{
              transform: `translateY(-${parseInt(d, 10) * digitHeight + digitHeight * 10}px)`,
              transition: `transform ${duration}ms cubic-bezier(.2,.8,.2,1)`,
            }}
          >
            {/* render 0-9 three times so the reel can spin visually */}
            {Array.from({ length: 3 }).map((_, cycle) => (
              <React.Fragment key={cycle}>
                {Array.from({ length: 10 }).map((__, n) => (
                  <div className="digit" key={`${cycle}-${n}`} style={{ height: digitHeight }}>
                    {n}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const OnlinePlayers = ({ apiPath = '/api/players/online', start = 1243 }) => {
  const [count, setCount] = useState(start);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // Randomly change every 1-3 seconds and animate via WheelNumber
    const tick = () => {
      setCount((prev) => {
        const delta = Math.floor(Math.random() * 41) - 20; // -20..20
        const next = Math.max(0, prev + delta);
        return next;
      });
      // schedule next tick randomly between 1s and 3s
      const t = 1000 + Math.floor(Math.random() * 2000);
      return t;
    };

    let timer = null;
    const schedule = () => {
      const t = 1000 + Math.floor(Math.random() * 2000);
      timer = setTimeout(() => {
        tick();
        schedule();
      }, t);
    };
    schedule();

    return () => {
      mounted.current = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <div className="online-players header-online" aria-live="polite">
      <div className="op-icon" aria-hidden="true">
        {/* animated wifi icon implemented as SVG for crisper arcs */}
        <svg className="wifi-svg" viewBox="0 0 24 24" width="28" height="20" aria-hidden="true" focusable="false">
          <path className="wifi-arc arc-outer" d="M2.88 7.58a15 15 0 0 1 18.24 0" fill="none" stroke="#dfe9ee" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" />
          <path className="wifi-arc arc-middle" d="M5.76 10.46a11 11 0 0 1 12.48 0" fill="none" stroke="#dfe9ee" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
          <path className="wifi-arc arc-inner" d="M8.64 13.34a7 7 0 0 1 6.72 0" fill="none" stroke="#4da6ff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
          <circle className="wifi-dot" cx="12" cy="18" r="1.6" fill="#4da6ff" />
        </svg>
      </div>
      <div className="op-body">
        <div className="op-value" aria-label={`${count}`}>
          <WheelNumber value={count} digitHeight={28} duration={420} />
        </div>
      </div>
    </div>
  );
};

export default OnlinePlayers;
