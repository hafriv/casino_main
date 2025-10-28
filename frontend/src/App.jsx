import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LuckyJet from './pages/LuckyJet';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/games" element={<div className="min-h-screen bg-black text-white flex items-center justify-center">Игры скоро появятся</div>} />
        <Route path="/lucky-jet"  element={<LuckyJet />} />
        <Route path="/roulette" element={<div className="min-h-screen bg-black text-white flex items-center justify-center">рулетка</div>} />
    </Routes>
  );
}

export default App;
