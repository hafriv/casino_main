import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LuckyJet from './pages/LuckyJet';
import RoulettePage from './pages/Roulette';
import SlotsPage from './pages/Slots';
import BonusPage from './pages/Bonus';
import RedirectPage from './pages/RedirectPage';
import ProtectedRoute from './components/ProtectedRoute';
import ParticlesBackground from './components/ParticlesBackground.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/redirect" element={<RedirectPage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/games" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <ParticlesBackground />
            <div>Игры скоро появятся</div>
          </div>
        </ProtectedRoute>
      } />
      <Route path="/lucky-jet" element={
        <ProtectedRoute>
          <LuckyJet />
        </ProtectedRoute>
      } />
      <Route path="/bonus" element={
        <ProtectedRoute>
          <BonusPage />
        </ProtectedRoute>
      } />
      <Route path="/roulette" element={
        <ProtectedRoute>
          <RoulettePage />
        </ProtectedRoute>
      } />
      <Route path="/slots" element={
        <ProtectedRoute>
          <SlotsPage />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
