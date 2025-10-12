import { useRef, useEffect, useState } from 'react';
import './Player.css';

export default function Player({ videoSrc, onVideoEnd, playbackRate = 1 }) {
    const videoRef = useRef(null);
    const [fadeOut, setFadeOut] = useState(false);

    const handleEnd = () => {
        if (onVideoEnd) onVideoEnd();
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const video = videoRef.current;
            const duration = video.duration;
            const currentTime = video.currentTime;
            if (duration > 0 && (duration - currentTime) <= 0.5) {
                setFadeOut(true);
            }
        }
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
            onTimeUpdate={handleTimeUpdate}
            className={`fullscreen-video ${fadeOut ? 'fade-out' : ''}`}
        />
    );
}
