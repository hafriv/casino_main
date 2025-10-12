import Header from '../components/Header.jsx';
import Player from '../components/Player.jsx';
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

    const handleVideoEnd = () => {
        setShowVideo(false);
        setShowHeader(true);
        setTimeout(() => {
            setAnimateHeader(true);
        }, 10);
    };

    useEffect(() => {
        if (location.pathname !== '/home') {
            navigate('/home', { replace: true });
        }
    }, [location.pathname, navigate]);

    return (
        <div className="min-h-screen bg-black text-white">
            {showVideo && (
                <Player
                    videoSrc={videoFile}
                    onVideoEnd={handleVideoEnd}
                    playbackRate={1.0}
                />
            )}
            {showHeader && <div className={`site-enter ${animateHeader ? 'site-enter-active' : ''}`}><Header /></div>}
        </div>
    );
}
