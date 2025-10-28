import { useEffect } from 'react';

export default function LuckyJet() {
    useEffect(() => {
        // Выполняем редирект на внешний URL
        window.location.href = 'https://1wsfzc.com/casino/play/v_1winGames';
    }, []);

    return (
        <div className="redirect-page">
            <p>Перенаправление на игру LuckyJet...</p>
        </div>
    );
}