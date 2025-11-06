import React, { useState } from 'react';
import { RouletteWheel, RouletteTable, ChipList, useRoulette } from 'react-casino-roulette';
import 'react-casino-roulette/dist/index.css';
import ParticlesBackground from '../components/ParticlesBackground.jsx';
import Bronze from '../assets/badges/Bronze.png';
import Gold from '../assets/badges/Gold.png';
import Platinum from '../assets/badges/Platinum.png';
import Diamond from '../assets/badges/Diamond.png';

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
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-4xl font-bold mb-4">Roulette</h1>

                {/* Chip Selection */}
                <ChipList
                    chips={chips}
                    selectedChip={selectedChip}
                    onChipPressed={setSelectedChip}
                />

                {/* Table */}
                <RouletteTable
                    chips={chips}
                    bets={bets}
                    onBet={onBet(Number(selectedChip))}
                    layoutType="american"
                    readOnly={readOnly}
                />

                {/* Wheel */}
                <RouletteWheel
                    start={wheelStart}
                    winningBet={winningBet}
                    onSpinningEnd={handleEndSpin}
                    layoutType="american"
                    spinLaps={3}
                    spinDuration={3}
                />

                {/* Controls */}
                <div className="flex space-x-4">
                    <button
                        onClick={doSpin}
                        disabled={wheelStart || !hasBets}
                        className="px-4 py-2 bg-blue-600 rounded disabled:opacity-50"
                    >
                        Spin ({total}$)
                    </button>
                    <button
                        onClick={clearBets}
                        disabled={readOnly}
                        className="px-4 py-2 bg-red-600 rounded"
                    >
                        Clear Bets
                    </button>
                </div>
            </div>
        </div>
    );
}
