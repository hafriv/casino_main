import React, { useState, useEffect, useRef } from 'react';
import ParticlesBackground from '../components/ParticlesBackground.jsx';
import Header from '../components/header.jsx';
import Footer from '../components/Footer.jsx';
import WinModal from '../components/WinModal.jsx';
import '../App.css';
import slotsImage from '../assets/img/slots.jpg';
import cherry from '../assets/img/slot_icons/cherry.png';
import coconut from '../assets/img/slot_icons/coconut.png';
import diamond from '../assets/img/slot_icons/diamond.png';
import fig from '../assets/img/slot_icons/fig.png';
import grape from '../assets/img/slot_icons/grape.png';
import mango from '../assets/img/slot_icons/mango.png';
import pear from '../assets/img/slot_icons/pear.png';
import xpowLogo from '../assets/logo.png';
import './Slots.css';
// Slot symbols (use keys for logic, images for display)
const SYMBOLS = ['cherry', 'pear', 'mango', 'grape', 'fig', 'diamond', 'coconut', 'coconut', 'coconut'];

const SYMBOL_IMAGES = {
    cherry: cherry,
    pear: pear,
    mango: mango,
    grape: grape,
    fig: fig,
    diamond: diamond,
    coconut: coconut
};

// Paytable: symbol => multiplier for 3 matches
const PAYTABLE = {
    'cherry': 2,
    'pear': 4,
    'mango': 6,
    'grape': 8,
    'fig': 12,
    'diamond': 20,
    'coconut': 40
};

// Reel Component
const Reel = ({ symbols, isSpinning, delay = 0 }) => {
    const reelRef = useRef(null);

    useEffect(() => {
        if (isSpinning && reelRef.current) {
            reelRef.current.style.animation = `spinReel 2s ease-out ${delay}s forwards`;
        } else if (reelRef.current) {
            reelRef.current.style.animation = 'none';
        }
    }, [isSpinning, delay]);

    return (
        <div className="reel-container w-20 h-20 bg-black rounded-lg border-2 border-cyan-400 overflow-hidden relative">
            <div
                ref={reelRef}
                className="reel-symbols absolute inset-0 flex flex-col items-center justify-center text-4xl"
                style={{
                    transform: 'translateY(0)',
                    transition: isSpinning ? 'none' : 'transform 0.3s ease-out'
                }}
            >
                {symbols.map((symbol, index) => (
                    <div key={index} className="symbol-item h-20 flex items-center justify-center">
                        {symbol}
                    </div>
                ))}
            </div>
            {/* Win highlight overlay */}
            <div className="absolute inset-0 border-2 border-yellow-400 rounded-lg opacity-0 pointer-events-none win-highlight"></div>
        </div>
    );
};

export default function Slots() {
    const [reels, setReels] = useState([['cherry'], ['cherry'], ['cherry']]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [balance, setBalance] = useState(0);
    const [bet, setBet] = useState(10);
    const [userId, setUserId] = useState(null);
    const [lastWin, setLastWin] = useState(0);
    const [autoSpin, setAutoSpin] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [winModalOpen, setWinModalOpen] = useState(false);
    const [winMessage, setWinMessage] = useState('');
    const spinTimeoutRef = useRef(null);
    const autoSpinIntervalRef = useRef(null);

    const _spinSoundRef = useRef(new Audio());
    const _winSoundRef = useRef(new Audio());
    const _reelSoundRef = useRef(new Audio());

    useEffect(() => {
        // Initialize audio (we'll add actual audio files later)

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserId(user.id);
            setBalance(Number(user.balance || 0));

            fetch(`/api/users/${user.id}/balance`)
                .then(response => response.json())
                .then(data => {
                    const serverBalance = Number(data.balance || 0);
                    setBalance(serverBalance);
                    user.balance = serverBalance;
                    localStorage.setItem('user', JSON.stringify(user));
                    document.dispatchEvent(new Event('balanceUpdated'));
                })
                .catch(err => console.error('Error fetching balance:', err));
        } else {
            window.location.href = '/';
        }

        return () => {
            const timeoutId = spinTimeoutRef.current;
            const intervalId = autoSpinIntervalRef.current;
            if (timeoutId) clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const updateStoredBalance = (newBalance) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            user.balance = newBalance;
            localStorage.setItem('user', JSON.stringify(user));
            document.dispatchEvent(new Event('balanceUpdated'));
        }
    };

    const playSound = (sound) => {
        if (!soundEnabled) return;
        // Placeholder for sound effects
        console.log(`Playing ${sound} sound`);
    };

    const generateRandomReel = () => {
        const symbols = [];
        for (let i = 0; i < 20; i++) { // More symbols for smooth animation
            symbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
        }
        return symbols;
    };

    const spin = async () => {
        if (isSpinning || balance < bet) return;

        setIsSpinning(true);
        setLastWin(0);
        playSound('spin');

        // Deduct bet
        const newBalance = balance - bet;
        setBalance(newBalance);

        // Generate new reels
        const newReels = reels.map(() => generateRandomReel());
        setReels(newReels);

        // Simulate spinning animation
        setTimeout(() => {
            playSound('reel');
        }, 200);

        // Stop spinning after animation
        setTimeout(() => {
            let finalReels;
            const winChance = Math.random();
            
            if (winChance < 0.15) {
                const winningSymbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
                finalReels = [[winningSymbol], [winningSymbol], [winningSymbol]];
            } else {
                finalReels = newReels.map(() => {
                    const randomIndex = Math.floor(Math.random() * SYMBOLS.length);
                    return [SYMBOLS[randomIndex]];
                });
            }
            setReels(finalReels);
            calculateWin(finalReels, newBalance);
        }, 2000);
    };

    const calculateWin = (finalReels, currentBalance) => {
        const symbols = finalReels.map(reel => reel[0]);
        let winAmount = 0;

        // Check for 3 matching symbols
        if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
            const symbol = symbols[0];
            winAmount = bet * PAYTABLE[symbol];
        }

        setLastWin(winAmount);
        const finalBalance = currentBalance + winAmount;
        setBalance(finalBalance);

        // Update backend
        fetch(`/api/users/${userId}/balance`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({balance: finalBalance})
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.message || 'Server error updating balance');
                });
            }
            updateStoredBalance(finalBalance);
        })
        .catch(err => {
            console.error('Failed to update balance on server:', err);
            setBalance(currentBalance);
            updateStoredBalance(currentBalance);
            alert('Error updating balance on server. Balance has been reset.');
        });

        // Log bet
        fetch('/api/bets', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: userId,
                game_id: 4, // Slots (from database games table)
                amount: bet,
                result: winAmount > 0 ? 'win' : 'lose',
                payout: winAmount
            })
        }).catch(err => console.error('Error logging bet:', err));

        if (winAmount > 0) {
            playSound('win');
            // Trigger win animation
            setTimeout(() => {
                setWinMessage(`You won $${winAmount}!`);
                setWinModalOpen(true);
            }, 500);
        }

        setIsSpinning(false);

        // Continue auto spin if enabled
        if (autoSpin && finalBalance >= bet) {
            autoSpinIntervalRef.current = setTimeout(() => {
                spin();
            }, 1000);
        } else {
            setAutoSpin(false);
        }
    };

    const toggleAutoSpin = () => {
        if (autoSpin) {
            setAutoSpin(false);
            if (autoSpinIntervalRef.current) {
                clearInterval(autoSpinIntervalRef.current);
            }
        } else {
            setAutoSpin(true);
            if (!isSpinning) {
                spin();
            }
        }
    };

    const maxBet = () => {
        setBet(balance);
    };

    const getBonus = () => {
        if (balance === 0) {
            const bonusAmount = 500;
            const newBalance = balance + bonusAmount;
            setBalance(newBalance);

            fetch(`/api/users/${userId}/balance`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({balance: newBalance})
            })
            .then(() => updateStoredBalance(newBalance))
            .catch(err => console.error('Error getting bonus:', err));
        }
    };

    return (
        <div className="min-h-screen text-white overflow-hidden relative" style={{background: 'linear-gradient(135deg, #001a33 0%, #003366 100%)'}}>
            {/* Slots Background Image */}
            <div className="fixed inset-0 pointer-events-none opacity-8 z-0" style={{backgroundImage: `url(${slotsImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}></div>

            <Header />

            {/* Animated Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-20 left-10 w-32 h-32 bg-blue-900 rounded-full opacity-10 animate-pulse" style={{boxShadow: '0 0 40px rgba(77, 166, 255, 0.6)'}}></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-blue-700 rounded-full opacity-10 animate-pulse delay-1000" style={{boxShadow: '0 0 40px rgba(77, 166, 255, 0.6)'}}></div>
                <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-800 rounded-full opacity-10 animate-pulse delay-500" style={{boxShadow: '0 0 50px rgba(77, 166, 255, 0.6)'}}></div>
                <div className="absolute bottom-20 right-10 w-28 h-28 bg-blue-600 rounded-full opacity-10 animate-pulse delay-1500" style={{boxShadow: '0 0 40px rgba(77, 166, 255, 0.6)'}}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-200px)]" style={{backgroundColor: '#000000'}}>
                <div className="flex flex-col items-center space-y-8">

                    {/* Casino Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-7xl font-black mb-2 animate-pulse drop-shadow-2xl"
                            style={{fontFamily: 'Orbitron, sans-serif', backgroundImage: 'linear-gradient(to right, #a855f7, #ec4899, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', textShadow: '0 0 50px rgba(168, 85, 247, 0.8), 0 0 100px rgba(236, 72, 153, 0.5)'}}>
                            🎰 VEGAS SLOTS
                        </h1>
                        <div className="text-2xl font-bold" style={{fontFamily: 'Orbitron, sans-serif', color: '#00ffff', textShadow: '0 0 20px rgba(0, 255, 255, 0.8)'}}>
                            Hit the Jackpot! 🤑
                        </div>
                    </div>

                    {/* Stats Panel */}
                    <div className="rounded-3xl p-8 shadow-2xl backdrop-blur-sm" style={{background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)', border: '2px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)'}}>
                        <div className="grid grid-cols-3 gap-8 text-center">
                            <div className="space-y-3 px-4 py-3 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(34, 211, 238, 0.3)'}}>
                                <div className="text-sm font-semibold uppercase tracking-widest"
                                     style={{fontFamily: 'Orbitron, sans-serif', color: '#00ffff', textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'}}>
                                    💰 Balance
                                </div>
                                <div className="text-4xl font-black animate-pulse"
                                     style={{fontFamily: 'Orbitron, sans-serif', color: '#00ffff', textShadow: '0 0 15px rgba(0, 255, 255, 0.8)'}}>
                                    ${balance.toLocaleString()}
                                </div>
                            </div>
                            <div className="space-y-3 px-4 py-3 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)', border: '1px solid rgba(236, 72, 153, 0.3)'}}>
                                <div className="text-sm font-semibold uppercase tracking-widest"
                                     style={{fontFamily: 'Orbitron, sans-serif', color: '#ff6b35', textShadow: '0 0 10px rgba(255, 107, 53, 0.6)'}}>
                                    🎲 Current Bet
                                </div>
                                <div className="text-4xl font-black"
                                     style={{fontFamily: 'Orbitron, sans-serif', color: '#ff6b35', textShadow: '0 0 15px rgba(255, 107, 53, 0.8)'}}>
                                    ${bet}
                                </div>
                            </div>
                            <div className="space-y-3 px-4 py-3 rounded-2xl" style={{background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 107, 53, 0.1) 100%)', border: '1px solid rgba(255, 215, 0, 0.3)'}}>
                                <div className="text-sm font-semibold uppercase tracking-widest"
                                     style={{fontFamily: 'Orbitron, sans-serif', color: '#ffd700', textShadow: '0 0 10px rgba(255, 215, 0, 0.6)'}}>
                                    🏆 Last Win
                                </div>
                                <div className={`text-4xl font-black ${lastWin > 0 ? 'animate-bounce' : ''}`}
                                     style={{fontFamily: 'Orbitron, sans-serif', color: lastWin > 0 ? '#ffff00' : '#b0b0b0', textShadow: lastWin > 0 ? '0 0 15px rgba(255, 255, 0, 0.8)' : 'none'}}>
                                    ${lastWin}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="w-48 h-1.5 rounded-full" style={{background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8), transparent)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'}}></div>

                    {/* Main Slot Machine */}
                    <div className="rounded-3xl p-8 shadow-2xl backdrop-blur-sm" style={{background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)', border: '2px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)'}}>
                        <div className="relative" style={{perspective: '1200px'}}>

                            {/* Machine Body */}
                            <div className="relative" style={{width: '750px', margin: '0 auto'}}>

                                {/* Outer Cabinet */}
                                <div className="rounded-3xl relative overflow-hidden" style={{background: 'linear-gradient(135deg, #d63031 0%, #ff6b35 50%, #c1250f 100%)', padding: '35px', boxShadow: '0 30px 80px rgba(0,0,0,0.8), inset -8px -8px 20px rgba(0,0,0,0.4), inset 8px 8px 20px rgba(255,255,255,0.15), 0 0 60px rgba(255, 107, 53, 0.5)'}}>

                                    {/* Cabinet Shine */}
                                    <div className="absolute inset-0 rounded-3xl" style={{background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)', pointerEvents: 'none'}}></div>
                                    
                                    {/* Neon Glow Overlay */}
                                    <div className="absolute inset-0 rounded-3xl" style={{background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)', pointerEvents: 'none'}}></div>

                                {/* Top Section - BIG WIN Display */}
                                <div className="text-center mb-8 relative">
                                    <div className="inline-block px-10 py-5 rounded-3xl relative" style={{background: 'linear-gradient(180deg, #ffff00 0%, #ffd700 50%, #ffed4e 100%)', boxShadow: '0 0 50px rgba(255, 215, 0, 1), inset 0 4px 8px rgba(255,255,255,0.8), 0 10px 30px rgba(0,0,0,0.5)', border: '5px solid #c1250f', transform: 'scale(1.05)'}}>
                                        <span className="font-black text-4xl block" style={{fontFamily: 'Arial Black, sans-serif', color: '#c1250f', textShadow: '3px 3px 0 rgba(0,0,0,0.5), -2px -2px 0 rgba(255,255,255,0.8)'}}>
                                            🎰 BIG WIN 🎰
                                        </span>
                                        {/* LED Lights around BIG WIN */}
                                        <div className="absolute -top-5 left-0 right-0 flex justify-around px-4">
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className="w-4 h-4 rounded-full" style={{background: i % 2 === 0 ? '#ffff00' : '#ff6b35', boxShadow: `0 0 15px ${i % 2 === 0 ? '#ffff00' : '#ff6b35'}`, animation: 'pulse 0.6s infinite', animationDelay: `${i * 0.08}s`}}></div>
                                            ))}
                                        </div>
                                        <div className="absolute -bottom-5 left-0 right-0 flex justify-around px-4">
                                            {[...Array(10)].map((_, i) => (
                                                <div key={i} className="w-4 h-4 rounded-full" style={{background: i % 2 === 0 ? '#ff6b35' : '#ffff00', boxShadow: `0 0 15px ${i % 2 === 0 ? '#ff6b35' : '#ffff00'}`, animation: 'pulse 0.6s infinite', animationDelay: `${i * 0.08 + 0.3}s`}}></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Reels Container */}
                                <div className="relative mb-8 p-10 rounded-3xl" style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(20,20,40,0.7))', border: '8px solid #8b4513', boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.9), inset 0 -8px 16px rgba(0,0,0,0.7), 0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(255, 107, 53, 0.3)'}}>

                                    {/* Reel Display */}
                                    <div className="flex justify-center gap-10 mb-8">
                                        {reels.map((reelSymbols, index) => (
                                            <div key={index} className="relative">
                                                {/* Reel Outer */}
                                                <div className="relative" style={{width: '140px', height: '140px', background: 'linear-gradient(135deg, #8b6914, #654321)', border: '8px solid #8b4513', borderRadius: '16px', boxShadow: 'inset 0 8px 16px rgba(0,0,0,0.9), 0 10px 30px rgba(255,215,0,0.4), 0 0 25px rgba(255,107,53,0.3)', padding: '8px'}}>

                                                    {/* Reel Display Screen */}
                                                    <div className="w-full h-full rounded-lg flex items-center justify-center overflow-hidden relative" style={{background: 'linear-gradient(to bottom, #ffd700, #ffed4e)', border: '3px solid #ff6b35', boxShadow: 'inset 0 3px 8px rgba(255,255,255,0.7), inset 0 -2px 5px rgba(0,0,0,0.2), 0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(255,107,53,0.3)'}}>
                                                        <div className={`transition-all duration-300 ${isSpinning ? 'animate-spin' : ''}`} style={{textShadow: '2px 2px 4px rgba(0,0,0,0.4)'}}>
                                                            <img src={SYMBOL_IMAGES[reelSymbols[0]]} alt={reelSymbols[0]} style={{width: '100px', height: '100px', objectFit: 'contain', filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'}} />
                                                        </div>

                                                        {/* Spinning Overlay */}
                                                        {isSpinning && (
                                                            <div className="absolute inset-0 rounded-md animate-pulse" style={{background: 'radial-gradient(ellipse at center, transparent 0%, rgba(255,215,0,0.3) 100%)'}}></div>
                                                        )}

                                                        {/* Win Glow */}
                                                        {lastWin > 0 && !isSpinning && (
                                                            <div className="absolute inset-0 rounded-md border-2 animate-ping" style={{borderColor: '#ff6b35', boxShadow: '0 0 15px #ff6b35'}}></div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Reel Label */}
                                                <div className="text-center mt-2 text-sm font-bold" style={{color: '#ffd700', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', fontFamily: 'Arial Black, sans-serif'}}>
                                                    REEL {index + 1}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* LED Lights Bottom */}
                                    <div className="flex justify-center gap-4 mt-8">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="w-3 h-3 rounded-full" style={{background: i % 3 === 0 ? '#ff6b35' : i % 3 === 1 ? '#ffd700' : '#00ffff', boxShadow: `0 0 12px ${i % 3 === 0 ? '#ff6b35' : i % 3 === 1 ? '#ffd700' : '#00ffff'}`, animation: 'pulse 0.7s infinite', animationDelay: `${i * 0.07}s`}}></div>
                                        ))}
                                    </div>
                                </div>

                                {/* Coin Slot & Logo Area */}
                                <div className="flex justify-between items-center px-6 mb-6">
                                    <div style={{color: '#ffff00', fontFamily: 'Arial Black, sans-serif', fontSize: '20px', fontWeight: 'bold', textShadow: '3px 3px 0 rgba(0,0,0,0.8), 0 0 10px rgba(255,255,0,0.8)'}}>
                                        💰 INSERT COIN
                                    </div>
                                    <img src={xpowLogo} alt="XPOW Logo" style={{height: '40px', filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.6))'}} />
                                </div>

                                {/* Lever (Right Side) */}
                                <button
                                    onClick={spin}
                                    disabled={isSpinning || balance < bet}
                                    className="absolute right-6 top-1/2 transform -translate-y-1/2 cursor-pointer focus:outline-none"
                                    style={{
                                        width: '60px',
                                        height: '100px',
                                        opacity: 0
                                    }}
                                    title="Pull the lever to spin"
                                >
                                </button>

                                {/* Visual Lever (non-clickable decoration) */}
                                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{width: '80px', perspective: '1200px'}}>
                                    {/* Lever Handle */}
                                    <div className="relative w-full h-28" style={{transformStyle: 'preserve-3d'}}>
                                        <div className="absolute inset-0 rounded-2xl" style={{background: 'linear-gradient(135deg, #ff6b35 0%, #ffd700 50%, #ffed4e 100%)', boxShadow: '0 12px 24px rgba(0,0,0,0.7), inset 0 2px 5px rgba(255,255,255,0.4), 0 0 30px rgba(255, 107, 53, 0.4)', border: '4px solid #8b4513', transform: isSpinning ? 'rotateZ(-50deg)' : 'rotateZ(0deg)', transition: isSpinning ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', transformOrigin: 'bottom center'}}></div>

                                        {/* Lever Knob */}
                                        <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffff00, #ffd700, #ff6b35)', boxShadow: '0 6px 12px rgba(0,0,0,0.6), inset -3px -3px 6px rgba(0,0,0,0.3), 0 0 15px rgba(255,255,0,0.8)'}}>
                                            <div className="absolute inset-2 rounded-full" style={{background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8), transparent)'}}></div>
                                        </div>

                                        {/* Lever Shaft */}
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-14 rounded-full" style={{background: 'linear-gradient(90deg, #654321, #8b4513, #a0522d)', boxShadow: 'inset -2px 0 3px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.5)'}}></div>
                                    </div>

                                    {/* Spin Indicator Text */}
                                    {!isSpinning && (
                                        <div className="text-center mt-4" style={{color: '#ffff00', fontSize: '13px', fontWeight: 'bold', fontFamily: 'Arial Black, sans-serif', textShadow: '2px 2px 4px rgba(0,0,0,0.8), 0 0 8px rgba(255,255,0,0.8)'}}>
                                            PULL!
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="w-48 h-1.5 rounded-full" style={{background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8), transparent)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'}}></div>

                    {/* Paytable */}
                    <div className="rounded-2xl p-8 shadow-2xl mt-16" style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)'}}>
                        <div className="rounded-xl p-7 max-w-md mx-auto" style={{background: 'rgba(20, 20, 40, 0.7)', border: '2px solid rgba(255, 107, 53, 0.4)'}}>
                            <div className="text-center text-lg mb-6 font-semibold"
                                 style={{fontFamily: 'Orbitron, sans-serif', color: '#ff6b35', textShadow: '0 0 10px rgba(255, 107, 53, 0.6)'}}>
                                PAYTABLE
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { symbol: 'cherry', label: 'x2' },
                                    { symbol: 'pear', label: 'x4' },
                                    { symbol: 'mango', label: 'x6' },
                                    { symbol: 'grape', label: 'x8' },
                                    { symbol: 'fig', label: 'x12' },
                                    { symbol: 'diamond', label: 'x20' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-center gap-3 p-4 rounded-lg" style={{background: 'rgba(255, 107, 53, 0.08)', border: '1px solid rgba(255, 107, 53, 0.2)'}}>
                                        <img src={SYMBOL_IMAGES[item.symbol]} alt={item.symbol} style={{width: '52px', height: '52px', objectFit: 'contain', filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.3))'}} />
                                        <span className="font-black text-base" style={{color: '#ffff00', textShadow: '0 0 8px rgba(255, 255, 0, 0.6)'}}>
                                            {item.label}
                                        </span>
                                    </div>
                                ))}
                                <div className="flex items-center justify-center gap-3 p-4 rounded-lg col-span-2" style={{background: 'rgba(255, 215, 0, 0.12)', border: '2px solid rgba(255, 215, 0, 0.4)', boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)'}}>
                                    <img src={SYMBOL_IMAGES.coconut} alt="coconut" style={{width: '56px', height: '56px', objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))'}} />
                                    <span className="font-black text-base" style={{color: '#ffff00', textShadow: '0 0 10px rgba(255, 255, 0, 0.8)'}}>
                                        x40 JACKPOT!
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="w-48 h-1.5 rounded-full" style={{background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8), transparent)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'}}></div>

                    {/* Bet Controls */}
                    <div className="rounded-3xl p-8 shadow-2xl backdrop-blur-sm" style={{background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)', border: '2px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)'}}>
                        <div className="text-center mb-6">
                            <span className="font-black uppercase tracking-widest text-lg"
                                  style={{fontFamily: 'Orbitron, sans-serif', color: '#ff6b35', textShadow: '0 0 10px rgba(255, 107, 53, 0.6)'}}>
                                🎲 Adjust Your Bet
                            </span>
                        </div>
                        <div className="orbc">
                            <div className="orbc2">
                                <button
                                    onClick={() => setBet(Math.max(1, bet - 1000))}
                                    disabled={isSpinning}
                                    className="orb"
                                    style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)', color: 'white', boxShadow: '0 0 20px rgba(255, 51, 51, 0.5)'}}
                                    title="Decrease bet by $1000"
                                >
                                    -1000
                                </button>
                                <button
                                    onClick={() => setBet(Math.max(1, bet - 100))}
                                    disabled={isSpinning}
                                    className="orb"
                                    style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)', color: 'white', boxShadow: '0 0 20px rgba(255, 51, 51, 0.5)'}}
                                    title="Decrease bet by $100"
                                >
                                    -100
                                </button>
                                <button
                                    onClick={() => setBet(Math.max(1, bet - 10))}
                                    disabled={isSpinning}
                                    className="orb"
                                    style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)', color: 'white', boxShadow: '0 0 20px rgba(255, 51, 51, 0.5)'}}
                                    title="Decrease bet by $10"
                                >
                                    -10
                                </button>

                                <div className="orb" >
                                    <div className="text-center">
                                        <div className="text-3xl font-black"
                                             style={{fontFamily: 'Orbitron, sans-serif', color: '#ffff00', textShadow: '0 0 10px rgba(255, 255, 0, 0.8)'}}>
                                            ${bet}
                                        </div>
                                        <div className="text-xs uppercase tracking-widest font-bold" style={{color: '#ff6b35', textShadow: '0 0 5px rgba(255, 107, 53, 0.6)'}}>BET AMOUNT</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setBet(Math.min(balance, bet + 10))}
                                    disabled={isSpinning}
                                    className="orb"
                                    style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #00dd00 0%, #00aa00 100%)', color: 'white', boxShadow: '0 0 20px rgba(0, 221, 0, 0.5)'}}
                                    title="Increase bet by $10"
                                >
                                    +10
                                </button>
                                <button
                                    onClick={() => setBet(Math.min(balance, bet + 100))}
                                    disabled={isSpinning}
                                    className="orb"
                                    style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #00dd00 0%, #00aa00 100%)', color: 'white', boxShadow: '0 0 20px rgba(0, 221, 0, 0.5)'}}
                                    title="Increase bet by $100"
                                >
                                    +100
                                </button>
                                <button
                                    onClick={() => setBet(Math.min(balance, bet + 1000))}
                                    disabled={isSpinning}
                                    className="orb"
                                    style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #00dd00 0%, #00aa00 100%)', color: 'white', boxShadow: '0 0 20px rgba(0, 221, 0, 0.5)'}}
                                    title="Increase bet by $1000"
                                >
                                    +1000
                                </button>
                            </div>

                            <button
                                onClick={maxBet}
                                disabled={isSpinning}
                                className="orb"
                                style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(135deg, #ffd700 0%, #ff6b35 100%)', color: '#000000', boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 8px 16px rgba(0,0,0,0.6)'}}
                                title="Bet all your balance"
                            >
                                ALL IN
                            </button>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="w-48 h-1.5 rounded-full" style={{background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8), transparent)', boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)'}}></div>

                    {/* Main Control Buttons */}
                    <div className="rounded-2xl p-6 shadow-2xl" style={{background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 107, 53, 0.2)'}}>
                        <div className="flex flex-col space-y-4 items-center">

                        {/* Primary Action Buttons */}
                        <div className="flex space-x-6 orbc">
                            <button
                                onClick={spin}
                                disabled={isSpinning || balance < bet}
                                className="orb relative px-16 py-8 text-white font-black rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden group text-xl"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 50%, #00aa00 100%)',
                                    boxShadow: '0 0 40px rgba(0, 255, 0, 0.6), inset 0 2px 0 rgba(255,255,255,0.3), 0 10px 30px rgba(0,0,0,0.5)',
                                    textShadow: '0 0 10px rgba(0, 255, 0, 0.6)'
                                }}
                            >
                                <span className=" relative z-10 flex items-center space-x-3">
                                    <span className={`text-3xl ${isSpinning ? 'animate-spin' : ''}`}></span>
                                    <span>{isSpinning ? 'SPINNING...' : 'SPIN NOW'}</span>
                                </span>
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-3xl" style={{background: 'linear-gradient(135deg, #00ff00, #ff6b35)'}}></div>
                                <div className="absolute inset-0 rounded-3xl opacity-30"
                                     style={{
                                         background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                                         animation: 'shine 2s ease-in-out infinite'
                                     }}>
                                </div>
                            </button>

                            <button
                                onClick={() => setBet(10)}
                                disabled={isSpinning}
                                className="orb relative px-10 py-6 font-bold rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none overflow-hidden"
                                style={{
                                    fontFamily: 'Orbitron, sans-serif',
                                    background: 'linear-gradient(to right, #6366f1, #4f46e5)',
                                    color: 'white'
                                }}
                                title="Reset bet to $10"
                            >
                                <span className="relative z-10 text-lg flex items-center space-x-2">
                                    <span></span>
                                    <span>CLEAR BET</span>
                                </span>
                            </button>
                        </div>

                        {/* Secondary Controls */}
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setSoundEnabled(!soundEnabled)}
                                className="orb px-6 py-3 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                                style={{fontFamily: 'Orbitron, sans-serif', background: 'linear-gradient(to right, #6f42c1, #5a32a3)'}}
                            >
                                {soundEnabled ? '🔊 SOUND ON' : '🔇 SOUND OFF'}
                            </button>

                            {balance === 0 && (
                                <button
                                    onClick={getBonus}
                                    className="orb px-6 py-3 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 animate-pulse"
                                    style={{
                                        fontFamily: 'Orbitron, sans-serif',
                                        background: 'linear-gradient(to right, #ff6b35, #f7931e)',
                                        boxShadow: '0 0 20px rgba(255, 107, 53, 0.5)'
                                    }}
                                >
                                    🎁 BONUS +$500
                                </button>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <WinModal
                isOpen={winModalOpen}
                onClose={() => setWinModalOpen(false)}
                message={winMessage}
            />
            <Footer />

            <style>{`
                @keyframes spin {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-10px); }
                }

                @keyframes glow {
                    0% { opacity: 0.3; }
                    100% { opacity: 0.7; }
                }

                @keyframes reelGlow {
                    0% { box-shadow: inset 0 0 20px rgba(255,215,0,0.1), 0 0 30px rgba(255,215,0,0.3); }
                    100% { box-shadow: inset 0 0 30px rgba(255,215,0,0.2), 0 0 40px rgba(255,215,0,0.5); }
                }

                @keyframes rainbowGlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                @keyframes shine {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .neon-blue {
                    box-shadow: 0 0 10px #00ffff;
                }

                .delay-1000 {
                    animation-delay: 1s;
                }

                .delay-500 {
                    animation-delay: 0.5s;
                }

                .delay-1500 {
                    animation-delay: 1.5s;
                }
            `}</style>
        </div>
    );
}
