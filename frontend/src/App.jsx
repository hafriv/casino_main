import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/games" element={<div className="min-h-screen bg-black text-white flex items-center justify-center">Игры скоро появятся</div>} />
    </Routes>
  );
}

export default App;
