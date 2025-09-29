import { useState, useRef, useEffect } from 'react';

export default function Player({ videoSrc, onVideoEnd, playbackRate = 1.0 }) {
    const videoRef = useRef(null);
    const [showVideo, setShowVideo] = useState(true);

    const handleEnd = () => {
        setShowVideo(false);
        if (onVideoEnd) onVideoEnd(); // вызываем колбэк из родителя
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate; // устанавливаем скорость
        }
    }, [playbackRate]);

    if (!showVideo) return null; // или можно вернуть что-то другое

    return (
        <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            muted
            onEnded={handleEnd}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 9999,
            }}
        />
    );
}
