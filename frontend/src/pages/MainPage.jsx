import Header from '../components/Header.jsx';
import Player from '../components/Player.jsx';
import { useState } from 'react';
import videoFile from '../assets/Композиция 1_2.mp4';

export default function MainPage() {
    const [showContent, setShowContent] = useState(false);

    const handleVideoEnd = () => {
        setShowContent(true);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {!showContent ? (
                <Player
                    videoSrc={videoFile}
                    onVideoEnd={handleVideoEnd}
                    playbackRate={2.0}
                />
            ) : (
                <Header />
            )}
        </div>
    );
}
