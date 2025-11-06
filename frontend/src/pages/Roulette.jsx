import React, { useState } from 'react';
import { RouletteWheel, RouletteTable, ChipList, useRoulette } from 'react-casino-roulette';
import 'react-casino-roulette/dist/index.css';
import ParticlesBackground from '../components/ParticlesBackground.jsx';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Bronze from '../assets/badges/Bronze.png';
import Gold from '../assets/badges/Gold.png';
import Platinum from '../assets/badges/Platinum.png';
import Diamond from '../assets/badges/Diamond.png';
import rouletteBanner from '../assets/roulette.gif';

import '../App.css';

const chips = {
  '1': Bronze,
  '10': Gold,
  '100': Platinum,
  '500': Diamond,
};

export default function Roulette() {
    const { bets, onBet, total, hasBets, clearBets } = useRoulette();
    const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
    const [winningBet, setWinningBet] = useState('-1');
    const [wheelStart, setWheelStart] = useState(false);
    const [readOnly, setReadOnly] = useState(false);

    const doSpin = () => {
        if (!hasBets) {
            alert("Place a bet first!");
            return;
        }
        // Random winning bet: 0-36, '00' for american
        const numbers = ['00', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];
        const randomWin = numbers[Math.floor(Math.random() * numbers.length)];
        setWinningBet(randomWin);
        setWheelStart(true);
        setReadOnly(true);
    };

    const handleEndSpin = (winner) => {
        alert("The ball landed on " + winner);
        setWheelStart(false);
        setReadOnly(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-red-900 text-white flex flex-col">
            <ParticlesBackground />
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8">
                <div className="bg-black bg-opacity-50 p-4 sm:p-8 rounded-lg max-w-6xl w-full">
                    <div className="text-center mb-6 sm:mb-8">
                        <img src={rouletteBanner} alt="Roulette Game" className="w-32 h-32 sm:w-48 sm:h-48 mx-auto mb-4 rounded-full shadow-lg" />
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-yellow-400 mb-2">Roulette</h1>
                        <p className="text-lg sm:text-xl text-gray-300">Place your bets and spin the wheel!</p>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-8 space-y-8 lg:space-y-0">
                        <div className="order-2 lg:order-1 w-full lg:w-auto">
                            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Betting Table</h3>
                            <div className="overflow-x-auto">
                                <RouletteTable
                                    chips={chips}
                                    bets={bets}
                                    onBet={onBet(Number(selectedChip))}
                                    layoutType="american"
                                    readOnly={readOnly}
                                />
                            </div>
                        </div>

                        <div className="order-1 lg:order-2 flex flex-col items-center w-full lg:w-auto">
                            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Chip Selection</h3>
                            <ChipList
                                chips={chips}
                                selectedChip={selectedChip}
                                onChipPressed={setSelectedChip}
                            />
                            <div className="mt-6 sm:mt-8">
                                <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Roulette Wheel</h3>
                                <RouletteWheel
                                    start={wheelStart}
                                    winningBet={winningBet}
                                    onSpinningEnd={handleEndSpin}
                                    layoutType="american"
                                    spinLaps={3}
                                    spinDuration={3}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
                        <button
                            onClick={doSpin}
                            disabled={wheelStart || !hasBets}
                            className={`${wheelStart || !hasBets ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'} text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg text-lg sm:text-xl font-bold transition duration-300 shadow-lg`}
                        >
                            {wheelStart ? 'Spinning...' : `Spin (${total}$)`}
                        </button>
                        <button
                            onClick={clearBets}
                            disabled={readOnly}
                            className="px-6 py-3 sm:px-8 sm:py-4 bg-red-500 hover:bg-red-600 text-white rounded-lg text-lg sm:text-xl font-bold transition duration-300 shadow-lg disabled:opacity-50"
                        >
                            Clear Bets
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
