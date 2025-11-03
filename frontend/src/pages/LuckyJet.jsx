import { useEffect } from 'react';
import ParticlesBackground from '../components/ParticlesBackground.jsx';

export default function LuckyJet() {
    useEffect(() => {
        // Выполняем редирект на внешний URL
       // window.location.href = 'https://1wsfzc.com/casino/play/v_1winGames';
    }, []);

            return (
        <div className="redirect-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ParticlesBackground />
            <div>
                <p>Перенаправление на игру LuckyJet...</p>
            </div>
        </div>
    );
}