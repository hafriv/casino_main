import Header from '../components/Header.jsx';
import Player from '../components/Player.jsx';
import Slider from '../components/Slider.jsx';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import videoFile from '../assets/Композиция 1_2.mp4';
import '../App.css';

export default function MainPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [showVideo, setShowVideo] = useState(true);
    const [showHeader, setShowHeader] = useState(false);
    const [animateHeader, setAnimateHeader] = useState(false);
    const [showLabels, setShowLabels] = useState(false);

    const handleVideoEnd = () => {
        setShowVideo(false);
        setShowHeader(true);
        setAnimateHeader(true);
        setShowLabels(true);
    };

    useEffect(() => {
        if (location.pathname !== '/home') {
            navigate('/home', { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="min-h-screen bg-black text-white">
            {showHeader && <div className={`site-enter ${animateHeader ? 'site-enter-active' : ''}`}><Header /></div>}
            <Slider showLabels={showLabels} />
            {showVideo && (
                <Player
                    videoSrc={videoFile}
                    onVideoEnd={handleVideoEnd}
                    playbackRate={1.0}
                />
            )}

        </div>
    );
}
