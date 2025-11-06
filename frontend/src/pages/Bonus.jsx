import React, { useState } from 'react';
import ParticlesBackground from '../components/ParticlesBackground.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import '../App.css';

const symbols = ['$', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

export default function Bonus() {
    const [reels, setReels] = useState([0, 0, 0]);
    const [spinning, setSpinning] = useState(false);
    const [win, setWin] = useState(null);

    const spin = () => {
        if (spinning) return;
        setSpinning(true);
        setWin(null);

        // Simulate spinning animation
        const interval = setInterval(() => {
            setReels([Math.floor(Math.random() * symbols.length), Math.floor(Math.random() * symbols.length), Math.floor(Math.random() * symbols.length)]);
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            setSpinning(false);
            const newReels = [Math.floor(Math.random() * symbols.length), Math.floor(Math.random() * symbols.length), Math.floor(Math.random() * symbols.length)];
            setReels(newReels);
            // Simple win condition
            if (newReels[0] === newReels[1] && newReels[1] === newReels[2]) {
                setWin('Jackpot!');
            } else if (newReels[0] === newReels[1] || newReels[1] === newReels[2] || newReels[0] === newReels[2]) {
                setWin('Small win!');
            }
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900 text-white flex flex-col">
            <ParticlesBackground />
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-4xl sm:text-6xl font-bold mb-4 text-yellow-400">Slots Bonus</h1>
                        <p className="text-lg sm:text-xl text-gray-300">Spin the reels and win big!</p>
                    </div>
                    <div className="bg-black bg-opacity-50 p-4 sm:p-8 rounded-lg">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-yellow-400">Slot Machine</h2>
                            <div id="reels" className="reel-display mb-6 text-4xl sm:text-6xl font-mono bg-gray-900 p-4 sm:p-6 rounded-lg flex justify-center items-center flex-wrap">
                                <div className="reel inline-block mx-2 sm:mx-4">{symbols[reels[0]]}</div>
                                <div className="reel inline-block mx-2 sm:mx-4">{symbols[reels[1]]}</div>
                                <div className="reel inline-block mx-2 sm:mx-4">{symbols[reels[2]]}</div>
                            </div>
                            <button
                                onClick={spin}
                                disabled={spinning}
                                className={`${spinning ? 'bg-gray-500' : 'bg-red-500 hover:bg-red-600'} text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-lg sm:text-xl font-bold transition shadow-lg`}
                            >
                                {spinning ? 'Spinning...' : 'Spin'}
                            </button>
                            {win && <p className="win-message text-green-400 text-lg sm:text-xl mt-4 font-semibold">{win}</p>}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
