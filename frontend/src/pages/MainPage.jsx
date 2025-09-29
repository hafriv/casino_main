import Header from '../components/Header.jsx';
import Player from '../components/Player.jsx';
import { useState } from 'react';
import videoFile from '../assets/Композиция 1_2.mp4';

export default function MainPage() {
    const [showVideo, setShowVideo] = useState(true);
    const [showHeader, setShowHeader] = useState(false);

    const handleVideoEnd = () => {
        setTimeout(() => {
            setShowVideo(false);
            setShowHeader(true);
        }, 200); // Shorter delay
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {showVideo && (
                <Player
                    videoSrc={videoFile}
                    onVideoEnd={handleVideoEnd}
                    playbackRate={6.0}
                />
            )}
            {showHeader && <div className="fade-in"><Header /></div>}
        </div>
    );
}
