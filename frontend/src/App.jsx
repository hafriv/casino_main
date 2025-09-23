import Player from './components/Player';
import videoFile from './assets/Композиция 1_2.mp4';
import Header from "./components/header.jsx";
import './index.css'
import './App.css'


function App() {
    const handleVideoEnd = () => {
        console.log("Видео закончилось!");
    };

    return (
        <>
            <Player
                videoSrc={videoFile}
                onVideoEnd={handleVideoEnd}
                playbackRate={2.0}
            />
        <Header/>
        </>
    );
}

export default App;