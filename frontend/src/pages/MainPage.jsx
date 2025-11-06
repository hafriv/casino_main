import Header from '../components/Header.jsx';
import Player from '../components/Player.jsx';
import Slider from '../components/Slider.jsx';
import Footer from '../components/Footer.jsx';
import ParticlesBackground from '../components/ParticlesBackground.jsx';
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
        <div className="min-h-screen bg-black text-white flex flex-col">
            {!showVideo && <ParticlesBackground />}
            {showHeader && <div className={`site-enter ${animateHeader ? 'site-enter-active' : ''}`}><Header /></div>}
            {showHeader && !isMobile && <div className={`site-enter ${animateHeader ? 'site-enter-active' : ''}`}><Slider showLabels={showLabels} /></div>}
            {isMobile && showHeader && (
                <div className={`site-enter ${animateHeader ? 'site-enter-active' : ''}`}>
                    <div className="mobile-menu">
                        <nav className="mobile-nav">
                            <ul>
                                <li><button onClick={() => navigate('/redirect?to=/home')}>Home</button></li>
                                <li><button onClick={() => navigate('/redirect?to=/games')}>Casino</button></li>
                                <li><button onClick={() => navigate('/redirect?to=/bonus')}>Free Money</button></li>
                                <li><button onClick={() => navigate('/redirect?to=/sports')}>Sports</button></li>
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
            {!showVideo && <Footer />}
        </div>
    );
}
