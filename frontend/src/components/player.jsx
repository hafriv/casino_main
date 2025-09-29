import { useState, useRef, useEffect } from 'react';
import './Player.css';

export default function Player({ videoSrc, onVideoEnd, playbackRate = 0.5 }) {
    const videoRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);

    const handleEnd = () => {
        setFadeOut(true);
        setTimeout(() => {
            if (onVideoEnd) onVideoEnd();
        }, 50); // Shorter wait
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);

    return (
        <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            onEnded={handleEnd}
            className={`fullscreen-video ${fadeOut ? 'fade-out' : ''}`}
        />
    );
}
