import React, { useState, useEffect, useRef } from 'react';
import { RouletteWheel, RouletteTable, ChipList, useRoulette } from 'react-casino-roulette';
import 'react-casino-roulette/dist/index.css';
import ParticlesBackground from '../components/ParticlesBackground.jsx';
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
    const { bets, onBet, total: totalBetAmount, hasBets, clearBets } = useRoulette(); // Переименовал для ясности
    const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
    const [userId, setUserId] = useState(null);
    const [balance, setBalance] = useState(0);
    const canvasRef = useRef();
    const [winningBet, setWinningBet] = useState('-1');
    const [wheelStart, setWheelStart] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const balanceBeforeSpinRef = useRef(0);

    const updateStoredBalance = (newBalance) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            user.balance = newBalance;
            localStorage.setItem('user', JSON.stringify(user));
        }
    };

    const customOnBet = (amount) => {
        return (spot) => {
            if (balance >= amount) {
                const newBalance = balance - amount;
                setBalance(newBalance);
                updateStoredBalance(newBalance);
                onBet(amount)(spot);
                fetch(`/api/users/${userId}/balance`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({balance: newBalance})
                }).catch(_err => {
                    setBalance(balance);
                    updateStoredBalance(balance);
                    alert('Error updating balance');
                });
            } else {
                alert('Not enough balance');
            }
        };
    };

    const doSpin = () => {
        if (!hasBets) {
            alert("Place a bet first!");
            return;
        }
        balanceBeforeSpinRef.current = balance;
        const numbers = ['00', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36'];
        const randomWin = numbers[Math.floor(Math.random() * numbers.length)];
        setWinningBet(randomWin);
        setWheelStart(true);
        setReadOnly(true);
    };

    const isWinningSpot = (spot, winner) => {
        const num = Number(winner);
        if (spot === winner) { // straight
            return 35;
        } else if (spot === 'red') {
            const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            return red.includes(num) ? 1 : 0;
        } else if (spot === 'black') {
            const black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
            return black.includes(num) ? 1 : 0;
        } else if (spot === 'even') {
            return num > 0 && num % 2 === 0 ? 1 : 0;
        } else if (spot === 'odd') {
            return num > 0 && num % 2 === 1 ? 1 : 0;
        } else if (spot === '1-18') {
            return num >= 1 && num <= 18 ? 1 : 0;
        } else if (spot === '19-36') {
            return num >= 19 && num <= 36 ? 1 : 0;
        } else if (spot === '1st12') {
            return num >= 1 && num <= 12 ? 2 : 0;
        } else if (spot === '2nd12') {
            return num >= 13 && num <= 24 ? 2 : 0;
        } else if (spot === '3rd12') {
            return num >= 25 && num <= 36 ? 2 : 0;
        } else {
            return spot === winner ? 35 : 0;
        }
    };

    const handleEndSpin = (winner) => {
        const balanceBeforeBetting = balanceBeforeSpinRef.current;

        let totalPayout = 0;
        Object.entries(bets).forEach(([spot, betInfo]) => {
            const mul = isWinningSpot(spot, winner);
            totalPayout += betInfo.amount * mul;
        });
        const finalBalance = balanceBeforeBetting - totalBetAmount + totalPayout;
        fetch(`/api/users/${userId}/balance`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({balance: finalBalance})
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => { throw new Error(errData.message || 'Server error updating balance'); });
                }
                setBalance(finalBalance);
                updateStoredBalance(finalBalance);
            })
            .catch(_err => {
                setBalance(balanceBeforeBetting);
                updateStoredBalance(balanceBeforeBetting);
                alert('Error updating balance on server. Balance has been reset.');
                console.error('Failed to update balance on server:', _err);
            });
        Object.entries(bets).forEach(([spot, betInfo]) => {
            const mul = isWinningSpot(spot, winner);
            const payout = betInfo.amount * mul;
            fetch('/api/bets', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    user_id: userId,
                    game_id: 1,
                    amount: betInfo.amount,
                    result: payout > 0 ? 'win' : 'lose',
                    payout: payout
                })
            }).catch(err => {
                console.error('Error logging bet:', err);
            });
        });
        if (totalBetAmount === 0) {
            alert("No bets were placed.");
        } else {
            alert(totalPayout > 0 ? "You won $" + totalPayout : "You lost $" + totalBetAmount);
        }
        setWheelStart(false);
        setReadOnly(false);
    };
    useEffect(() => {
        const nav = document.querySelector('.nav');
        const buttons = document.querySelectorAll('.button');
        const light = document.querySelector('.light');
        const buttonLight = document.querySelector('.button-light');
        if (!nav || !light || !buttonLight) return;
        const buttonLightsAll = document.querySelectorAll('.button-light');

        buttons.forEach((item) => {
            item.addEventListener('mouseover', () => {
                item.classList.add('hover');
            });
            item.addEventListener('mouseout', () => {
                item.classList.remove('hover');
            });
            item.addEventListener('mousedown', () => {
                item.classList.add('press');
            });
            item.addEventListener('mouseup', () => {
                item.classList.remove('press');
            });
            item.addEventListener('touchstart', () => {
                item.classList.add('press');
            });
            item.addEventListener('touchend', () => {
                setTimeout(function() {
                    item.classList.remove('press');
                }, 300);
            });
        });

        const listener = (event) => {
            function calculateIntensity(innerRadius, outerRadius) {
                const rect = nav.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = event.clientX - centerX;
                const deltaY = event.clientY - centerY;
                const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
                let intensity = 0;
                if (distance > innerRadius && distance <= outerRadius) {
                    intensity = (distance - innerRadius) / (outerRadius - innerRadius);
                } else if (distance > outerRadius) {
                    intensity = 1;
                }
                return intensity;
            }

            function calculateAngle(element, cursorX, cursorY) {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle = Math.atan2(cursorY - centerY, cursorX - centerX) * (180 / Math.PI);
                return (angle + 180) % 360;
            }

            function easeOutQuint(t) {
                return 1 - Math.pow(1 - t, 5);
            }

            function easeInQuad(t) {
                return t * t;
            }

            const x = event.clientX;
            const y = event.clientY;
            light.style.transform = `translate(${x}px, ${y}px)`;

            const rect = nav.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const deltaX = x - centerX;
            const deltaY = y - centerY;
            const angle = Math.atan2(deltaY, deltaX);
            const maxOffset = 3;
            const detectionRadius = rect.width * 2;
            const distance = Math.min(maxOffset, Math.sqrt(deltaX ** 2 + deltaY ** 2) / detectionRadius * maxOffset);
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            const shadow = `${-offsetX * 2.6}px ${-offsetY * 2.6}px 1.5px rgba(0, 0, 0, 0.081), ${-offsetX * 5.8}px ${-offsetY * 5.8}px 3.4px rgba(0, 0, 0, 0.12), ${-offsetX * 9.8}px ${-offsetY * 9.8}px 5.6px rgba(0, 0, 0, 0.15), ${-offsetX * 14.8}px ${-offsetY * 14.8}px 8.5px rgba(0, 0, 0, 0.174), ${-offsetX * 21.3}px ${-offsetY * 21.3}px 12.3px rgba(0, 0, 0, 0.195), ${-offsetX * 30.1}px ${-offsetY * 30.1}px 17.4px rgba(0, 0, 0, 0.216), ${-offsetX * 42.7}px ${-offsetY * 42.7}px 24.6px rgba(0, 0, 0, 0.24), ${-offsetX * 62.1}px ${-offsetY * 62.1}px 35.8px rgba(0, 0, 0, 0.27), ${-offsetX * 95.6}px ${-offsetY * 95.6}px 55.1px rgba(0, 0, 0, 0.309), ${-offsetX * 170}px ${-offsetY * 170}px 98px rgba(0, 0, 0, 0.39)`;
            nav.style.boxShadow = shadow;

            const lightRadius = 400;
            const opacity = easeInQuad(calculateIntensity(lightRadius / 3, lightRadius * 1.3));
            for (let i = 0; i < buttonLightsAll.length; i++) {
                buttonLightsAll[i].style.opacity = opacity.toString();
            }

            buttons.forEach((item) => {
                const angle = calculateAngle(item, x, y);
                const scaleY = 10 - easeOutQuint(calculateIntensity(0, lightRadius * 1.4)) * 10;
                const img = item.querySelector('.button-bg');
                if (img) {
                    img.style.transform = `rotateZ(${angle}deg) scaleY(${scaleY})`;
                }
            });
        };

        window.addEventListener("mousemove", listener);

        return () => window.removeEventListener("mousemove", listener);
    }, []);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
            setBalance(Number(user.balance || 0));
        } else {
            window.location.href = '/';
        }
    }, []);
    useEffect(() => {
        if (canvasRef.current) {
            new Granim({
                element: canvasRef.current,
                direction: 'diagonal',
                states: {
                    "default-state": {
                        gradients: [
                            ['#001a33', '#003366'],
                            ['#003366', '#001a33']
                        ],
                        transitionSpeed: 4000
                    }
                }
            });
        }
    }, []);

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