import React from 'react';
import { createRoot } from 'react-dom/client';

window.React = React;

import('react-router-dom').then((rrd) => {
    import('react').then((routerReact) => {
        window.ReactRouterReact = routerReact.default;
        console.log('window.React === window.ReactRouterReact:', window.React === window.ReactRouterReact);
    });
});

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);