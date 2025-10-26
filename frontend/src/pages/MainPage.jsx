import Header from '../components/Header.jsx';
import Player from '../components/Player.jsx';
import Slider from '../components/Slider.jsx';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import videoFile from '../assets/Композиция 1_2.mp4';
import '../App.css';

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};

export default function MainPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const windowSize = useWindowSize();
    const isMobile = windowSize.width < 1100;
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
            {showHeader && !isMobile && <div className={`site-enter ${animateHeader ? 'site-enter-active' : ''}`}><Slider showLabels={showLabels} /></div>}
            {isMobile && showHeader && (
                <div className={`site-enter ${animateHeader ? 'site-enter-active' : ''}`}>
                    <div className="mobile-menu">
                        <nav className="mobile-nav">
                            <ul>
                                <li><a href="#home">Home</a></li>
                                <li><a href="#casino">Casino</a></li>
                                <li><a href="#bonus">Free Money</a></li>
                                <li><a href="#sports">Sports</a></li>
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
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
