import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BackendStatus from './components/BackendStatus';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Farms from './pages/Farms';
import Heatmap from './pages/Heatmap';
import CropStats from './pages/CropStats';
import Chat from './pages/Chat';
import AIPrediction from './pages/AIPrediction';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 pt-4">
              <BackendStatus />
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/farms" element={<Farms />} />
              <Route path="/heatmap" element={<Heatmap />} />
              <Route path="/crops" element={<CropStats />} />
              <Route path="/ai-prediction" element={<AIPrediction />} />
              <Route path="/chat/:buyerId/:farmId" element={<Chat />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;

