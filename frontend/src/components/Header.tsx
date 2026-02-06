
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Eventic</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Explore</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Creators</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Help</a>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2">Sign In</button>
          <button className="bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-sm">
            List Your Event
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
