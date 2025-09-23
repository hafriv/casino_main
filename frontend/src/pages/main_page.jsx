import Header from '../components/Header';
import Player from '../components/Player';
import {useState} from "react";
export default function MainPage() {
    const [showContent, setShowContent] = useState(false);

    const handleVideoEnd = () => {
        setShowContent(true);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {!showContent ? (
                <Player
                    videoSrc={"../assets/Композиция 1_2.mp4"}
                    onVideoEnd={handleVideoEnd}
                    playbackRate={2.0}
                />
            ) : (
                <Header />
            )}
        </div>
    );
}