import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Dock } from './components/Dock';
import { CourseMap } from './components/CourseMap';
import { LandingPage } from './pages/LandingPage';
import { ModulePage } from './pages/ModulePage';
import { useStore } from './store';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useStore();

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       // Default to dark if system is dark, unless manually overridden
       if (!document.documentElement.classList.contains('dark')) {
         document.documentElement.classList.add('dark');
       }
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen w-full text-slate-900 dark:text-slate-100">
      <Dock />
      <CourseMap />
      <main className="flex-1 ml-20 md:ml-24 p-6 md:p-8 relative z-10 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/module/:id" element={<ModulePage />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'liquid-glass text-sm font-medium',
          style: {
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(20px)',
            color: '#333',
          },
        }}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;