import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import EmailValidator from './components/EmailValidator.tsx';
import EmailExtractor from './components/EmailExtractor.tsx';
import SpamChecker from './components/SpamChecker.tsx';
import ListCleaner from './components/ListCleaner.tsx';
import DeveloperPage from './components/DeveloperPage.tsx';
import FullSetupPage from './components/FullSetupPage.tsx';
import TutorialsPage from './components/TutorialsPage.tsx';
import PremiumValidationPage from './components/PremiumValidationPage.tsx';
import { ViewType, EmailRecord } from './types.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('validate');
  const [results, setResults] = useState<EmailRecord[]>(() => {
    const saved = localStorage.getItem('verifyflow_results');
    return saved ? JSON.parse(saved) : [];
  });

  const [prefilledData, setPrefilledData] = useState<any[]>([]);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    localStorage.setItem('verifyflow_results', JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ViewType;
      if (['validate', 'extractor', 'spam-check', 'cleaner', 'developer', 'full-setup', 'tutorials', 'premium-validation'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleNavigateToValidate = (data: any[]) => {
    setPrefilledData(data);
    window.location.hash = 'validate';
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Sidebar currentView={currentView} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex-1 overflow-y-auto relative">
        <header className={`sticky top-0 z-20 glass-panel h-16 flex items-center justify-between px-8 border-b transition-colors duration-300 ${isDarkMode
          ? 'bg-slate-900/80 border-slate-800 text-slate-100'
          : 'bg-white/80 border-slate-200 text-slate-800'
          }`}>
          <h1 className="text-xl font-bold capitalize">
            {currentView.replace('-', ' ')}
          </h1>
          <div className="flex items-center gap-4">
            <span className={`text-sm hidden md:inline ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Welcome to Cleanmails
            </span>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {currentView === 'validate' && (
            <EmailValidator
              onComplete={setResults}
              isDarkMode={isDarkMode}
              initialData={prefilledData}
            />
          )}
          {currentView === 'extractor' && (
            <EmailExtractor
              isDarkMode={isDarkMode}
              onNavigateToValidate={handleNavigateToValidate}
            />
          )}
          {currentView === 'spam-check' && (
            <SpamChecker isDarkMode={isDarkMode} />
          )}
          {currentView === 'cleaner' && (
            <ListCleaner
              isDarkMode={isDarkMode}
              onNavigateToValidate={handleNavigateToValidate}
            />
          )}
          {currentView === 'developer' && (
            <DeveloperPage isDarkMode={isDarkMode} />
          )}
          {currentView === 'full-setup' && (
            <FullSetupPage isDarkMode={isDarkMode} />
          )}
          {currentView === 'tutorials' && (
            <TutorialsPage isDarkMode={isDarkMode} />
          )}
          {currentView === 'premium-validation' && (
            <PremiumValidationPage isDarkMode={isDarkMode} />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
