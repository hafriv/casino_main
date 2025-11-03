import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import './index.css'
import './components/slider.scss'
// attach sparkle hover behavior to elements with .sparkle-hover
import { attachSparkles } from './utils/sparkles'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// run after mount to pick up dynamically rendered elements as well
if (typeof window !== 'undefined') {
  // give React a tick to render
  setTimeout(() => attachSparkles(document), 120);
}
