import React from 'react';
import { createRoot } from 'react-dom/client';

// Сохраняем "нашу" копию React
window.React = React;

// Импортируем react-router-dom ДО рендера
import('react-router-dom').then((rrd) => {
    // Получаем React, который использует react-router-dom
    import('react').then((routerReact) => {
        window.ReactRouterReact = routerReact.default;
        console.log('window.React === window.ReactRouterReact:', window.React === window.ReactRouterReact);
    });
});

// Твой основной импорт App
import App from './App';

// Создание корня и рендеринг
const root = createRoot(document.getElementById('root'));
root.render(<App />);