import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'
import './index.css'
import './components/slider.scss'
import { attachSparkles } from './utils/sparkles'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

if (typeof window !== 'undefined') {
  setTimeout(() => attachSparkles(document), 120);
}
