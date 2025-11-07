import React, { useState, useEffect, useRef } from 'react';
import { RouletteWheel, RouletteTable, ChipList } from 'react-casino-roulette';
import 'react-casino-roulette/dist/index.css';
import ParticlesBackground from '../components/ParticlesBackground.jsx';
import Header from '../components/header.jsx';
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
    const [bets, setBets] = useState({}); // Our own bets state using object with string keys
    const [selectedChip, setSelectedChip] = useState(Object.keys(chips)[0]);
    const [userId, setUserId] = useState(null);
    const [balance, setBalance] = useState(0);
    const canvasRef = useRef();
    const [winningBet, setWinningBet] = useState('-1');
    const [wheelStart, setWheelStart] = useState(false);
    const [readOnly, setReadOnly] = useState(false);
    const balanceBeforeSpinRef = useRef(0);

    // Calculate derived values
    const totalBetAmount = Object.values(bets).reduce((sum, bet) => sum + bet.amount, 0);
    const hasBets = Object.keys(bets).length > 0;

    // Load bets from localStorage on mount
    useEffect(() => {
        const storedBets = localStorage.getItem('roulette_bets');
        if (storedBets) {
            try {
                const parsedBets = JSON.parse(storedBets);
                setBets(parsedBets);
            } catch (err) {
                console.error('Error loading stored bets:', err);
                localStorage.removeItem('roulette_bets');
            }
        }
    }, []);

    // Function to handle right click on specific spot
    const handleTableRightClick = (spot) => {
        console.log('Right click on spot:', spot);
        if (bets[spot.id]) {
            handleRightClick(spot.id);
        }
    };

    // Save bets to localStorage whenever bets change
    useEffect(() => {
        if (Object.keys(bets).length > 0) {
            localStorage.setItem('roulette_bets', JSON.stringify(bets));
        } else {
            localStorage.removeItem('roulette_bets');
        }
    }, [bets]);

    const updateStoredBalance = (newBalance) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            user.balance = newBalance;
            localStorage.setItem('user', JSON.stringify(user));
            // Dispatch event to update header balance
            document.dispatchEvent(new Event('balanceUpdated'));
        }
    };

    const customOnBet = (spot, amount) => {
        console.log('Placing bet:', amount, 'on spot:', spot);
        // Use spot.id as key in plain object
        const spotKey = spot.id;
        setBets(prevBets => {
            const newBets = { ...prevBets };
            if (newBets[spotKey]) {
                newBets[spotKey] = { amount: newBets[spotKey].amount + amount };
            } else {
                newBets[spotKey] = { amount };
            }
            console.log('New bets state:', newBets);
            return newBets;
        });
    };

    const handleRightClick = (spot) => {
        // Check if there's a bet on this spot
        if (bets[spot]) {
            // Remove bet from our state
            setBets(prevBets => {
                const newBets = { ...prevBets };
                delete newBets[spot];
                return newBets;
            });
        }
    };

    const clearBets = () => {
        console.log('Clearing all bets');
        setBets({});
    };

    const doSpin = () => {
        if (!hasBets) {
            alert("Place a bet first!");
            return;
        }

        // Check if user has enough balance for the total bet amount
        if (balance < totalBetAmount) {
            alert(`Not enough balance! You need $${totalBetAmount} but only have $${balance}`);
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
        console.log('Checking win for spot:', spot, 'winner:', winner);
        const num = Number(winner);
        if (spot === winner) { // straight
            console.log('Straight win:', spot, '===', winner);
            return 35;
        } else if (spot === 'red' || spot === 'RED') {
            const red = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            const isWin = red.includes(num);
            console.log('Red/RED check:', num, 'in red?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === 'black' || spot === 'BLACK') {
            const black = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
            const isWin = black.includes(num);
            console.log('Black/BLACK check:', num, 'in black?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === 'even' || spot === 'EVEN') {
            const isWin = num > 0 && num % 2 === 0;
            console.log('Even/EVEN check:', num, 'is even?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === 'odd' || spot === 'ODD') {
            const isWin = num > 0 && num % 2 === 1;
            console.log('Odd/ODD check:', num, 'is odd?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '1-18' || spot === '1_TO_18') {
            const isWin = num >= 1 && num <= 18;
            console.log('1-18/1_TO_18 check:', num, 'in range?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '19-36' || spot === '19_TO_36') {
            const isWin = num >= 19 && num <= 36;
            console.log('19-36/19_TO_36 check:', num, 'in range?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '1st12' || spot === '1ST_DOZEN') {
            const isWin = num >= 1 && num <= 12;
            console.log('1st12/1ST_DOZEN check:', num, 'in range?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '2nd12' || spot === '2ND_DOZEN') {
            const isWin = num >= 13 && num <= 24;
            console.log('2nd12/2ND_DOZEN check:', num, 'in range?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '3rd12' || spot === '3RD_DOZEN') {
            const isWin = num >= 25 && num <= 36;
            console.log('3rd12/3RD_DOZEN check:', num, 'in range?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '1ST_COLUMN') {
            const column1 = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34];
            const isWin = column1.includes(num);
            console.log('1ST_COLUMN check:', num, 'in column?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '2ND_COLUMN') {
            const column2 = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35];
            const isWin = column2.includes(num);
            console.log('2ND_COLUMN check:', num, 'in column?', isWin);
            return isWin ? 2 : 0;
        } else if (spot === '3RD_COLUMN') {
            const column3 = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36];
            const isWin = column3.includes(num);
            console.log('3RD_COLUMN check:', num, 'in column?', isWin);
            return isWin ? 2 : 0;
        } else {
            console.log('Unknown spot type:', spot);
            return spot === winner ? 35 : 0;
        }
    };

    const handleEndSpin = (winner) => {
        console.log('Spin ended with winner:', winner);
        console.log('Current bets:', bets);
        const balanceBeforeBetting = balanceBeforeSpinRef.current;

        let totalPayout = 0;
        Object.entries(bets).forEach(([spot, betInfo]) => {
            const mul = isWinningSpot(spot, winner);
            console.log(`Bet on ${spot}: amount ${betInfo.amount}, multiplier ${mul}, payout ${betInfo.amount * mul}`);
            totalPayout += betInfo.amount * mul;
        });
        console.log('Total payout:', totalPayout);
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
                    payout: payout,
                    winning_number: winner
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
        // Clear stored bets after spin
        localStorage.removeItem('roulette_bets');
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
            // Initialize with localStorage balance first
            setBalance(Number(user.balance || 0));

            // Then fetch current balance from backend and update if different
            fetch(`/api/users/${user.id}/balance`)
                .then(response => response.json())
                .then(data => {
                    const serverBalance = Number(data.balance || 0);
                    if (serverBalance !== Number(user.balance || 0)) {
                        setBalance(serverBalance);
                        // Update localStorage with server balance
                        user.balance = serverBalance;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                })
                .catch(err => {
                    console.error('Error fetching balance:', err);
                    // Keep the localStorage balance
                });
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
        <div className="min-h-screen bg-black text-white">
            <Header />
            <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]">
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-4xl font-bold mb-4">Roulette</h1>

                    {/* Chip Selection */}
                    <ChipList
                        chips={chips}
                        selectedChip={selectedChip}
                        onChipPressed={setSelectedChip}
                    />

                    {/* Table */}
                    <div className="roulette-table-container">
                        <RouletteTable
                            chips={chips}
                            bets={bets}
                            onBet={(spot) => customOnBet(spot, Number(selectedChip))}
                            onRightClick={handleTableRightClick}
                            layoutType="american"
                            readOnly={readOnly}
                        />
                    </div>

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
                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={doSpin}
                            disabled={wheelStart || !hasBets}
                            className="relative px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden"
                        >
                            <span className="relative z-10">🎰 Spin ({totalBetAmount}$)</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
                        </button>
                        <button
                            onClick={() => {
                                console.log('Clear Bets clicked, readOnly:', readOnly, 'hasBets:', hasBets);
                                clearBets();
                            }}
                            disabled={readOnly}
                            className="relative px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden"
                        >
                            <span className="relative z-10">🗑️ Clear Bets</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-red-500 opacity-0 hover:opacity-20 transition-opacity duration-200"></div>
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
