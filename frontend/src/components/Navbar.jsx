import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold">
            🌾 Kisaan Mandi
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-primary-200 transition">
              {t('home')}
            </Link>
            <Link to="/farms" className="hover:text-primary-200 transition">
              {t('farms')}
            </Link>
            <Link to="/heatmap" className="hover:text-primary-200 transition">
              {t('heatmap')}
            </Link>
            <Link to="/crops" className="hover:text-primary-200 transition">
              {t('crops')}
            </Link>
            <Link to="/ai-prediction" className="hover:text-primary-200 transition">
              AI Prediction
            </Link>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-primary-700 text-white px-3 py-1 rounded border border-primary-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

