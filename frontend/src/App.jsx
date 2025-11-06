import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LuckyJet from './pages/LuckyJet';
import RoulettePage from './pages/Roulette';
import BonusPage from './pages/Bonus';
import RedirectPage from './pages/RedirectPage';
import ParticlesBackground from './components/ParticlesBackground.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/redirect" element={<RedirectPage />} />
      <Route path="/home" element={<MainPage />} />
            <Route path="/games" element={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <ParticlesBackground />
          <div>Игры скоро появятся</div>
        </div>
      } />
      <Route path="/lucky-jet"  element={<LuckyJet />} />
      <Route path="/bonus" element={<BonusPage />} />
                <Route path="/roulette" element={<RoulettePage />} />
    </Routes>
  );
}

export default App;
