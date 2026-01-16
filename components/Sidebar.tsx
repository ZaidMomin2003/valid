import React, { useState } from 'react';
import { ShieldCheck, MailCheck, Sun, Moon, FileText, ShieldAlert, FileSpreadsheet, ExternalLink, Instagram, Linkedin, Code2, Rocket, AlertTriangle, X, BookOpen, Zap } from 'lucide-react';
import { ViewType } from '../types.ts';

interface SidebarProps {
  currentView: ViewType;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, isDarkMode, toggleDarkMode }) => {
  const [showWarning, setShowWarning] = useState(false);

  const toolItems = [
    { id: 'validate', label: 'Email Validation', icon: <MailCheck size={20} />, hash: '#validate' },
    { id: 'extractor', label: 'Email Extractor', icon: <FileText size={20} />, hash: '#extractor' },
    { id: 'cleaner', label: 'List Cleaner', icon: <FileSpreadsheet size={20} />, hash: '#cleaner' },
    { id: 'spam-check', label: 'Spam Analysis', icon: <ShieldAlert size={20} />, hash: '#spam-check' },
  ];

  const infoItems = [
    { id: 'full-setup', label: 'Full Email Setup', icon: <Rocket size={20} />, hash: '#full-setup' },
    { id: 'premium-validation', label: 'Premium Validation', icon: <Zap size={20} />, hash: '#premium-validation' },
    { id: 'tutorials', label: 'Tutorials', icon: <BookOpen size={20} />, hash: '#tutorials' },
  ];

  const NavLink = ({ item }: { item: typeof toolItems[0], key?: string }) => (
    <a
      href={item.hash}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${currentView === item.id
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
        : isDarkMode
          ? 'hover:bg-slate-800 hover:text-white text-slate-400'
          : 'hover:bg-slate-100 hover:text-blue-600 text-slate-500'
        }`}
    >
      <span className={`${currentView === item.id ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
        {item.icon}
      </span>
      <span className="font-medium">{item.label}</span>
    </a>
  );

  return (
    <>
      <aside className={`w-64 h-full flex flex-col shrink-0 z-30 transition-all duration-300 border-r ${isDarkMode
        ? 'bg-slate-900 text-slate-300 border-slate-800'
        : 'bg-white text-slate-600 border-slate-200'
        }`}>
        <div className="p-6">
          <a
            href="https://cleanmails.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-900/40 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/favicon.png" alt="Cleanmails Logo" className="w-full h-full object-cover p-1.5" />
            </div>
            <span className={`text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Cleanmails</span>
          </a>
        </div>

        <nav className="flex-1 px-4 mt-4 space-y-8 overflow-y-auto custom-scrollbar">
          <div>
            <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 opacity-60">Primary Tools</p>
            <div className="space-y-1">
              {toolItems.map((item) => <NavLink key={item.id} item={item} />)}
            </div>
          </div>

          <div>
            <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 opacity-60">Information & Support</p>
            <div className="space-y-1">
              {infoItems.map((item) => <NavLink key={item.id} item={item} />)}
            </div>
          </div>
        </nav>

        <div className="px-4 py-4 mt-auto space-y-4">
          <div
            onClick={() => window.location.hash = '#developer'}
            className={`cursor-pointer p-4 rounded-xl border shadow-lg relative overflow-hidden group transition-all ${isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 hover:border-blue-500/50'
              : 'bg-gradient-to-br from-slate-50 via-white to-slate-50 border-slate-200 hover:border-blue-400'
              }`}
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
              <Code2 size={48} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg">
                  <Code2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-blue-400">Developer Page</p>
                  <h3 className={`font-bold text-lg leading-tight transition-colors ${isDarkMode ? 'text-white group-hover:text-blue-200' : 'text-slate-900 group-hover:text-blue-600'}`}>Zaid</h3>
                </div>
              </div>

              <div className={`flex items-center gap-2 pt-2 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-slate-200'}`}>
                <a
                  href="https://www.instagram.com/fallen_zaid/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-pink-600 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-pink-500 hover:text-white'}`}
                  title="Instagram"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href="https://www.linkedin.com/in/arshad-momin-a3139b21b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`p-1.5 rounded-lg transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white'}`}
                  title="LinkedIn"
                >
                  <Linkedin size={14} />
                </a>
                <div className={`ml-auto text-xs flex items-center gap-1 transition-colors ${isDarkMode ? 'text-slate-500 group-hover:text-blue-400' : 'text-slate-400 group-hover:text-blue-600'}`}>
                  View Profile <ExternalLink size={10} />
                </div>
              </div>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'
            }`}>
            <button
              onClick={() => setShowWarning(true)}
              className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
              title="Legal Disclaimer"
            >
              <AlertTriangle size={16} />
            </button>
            <div className="flex-1 flex items-center justify-between ml-1">
              <div className="flex items-center gap-2">
                {isDarkMode ? <Moon size={16} className="text-blue-400" /> : <Sun size={16} className="text-amber-500" />}
                <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>Theme</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${isDarkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-[22px]' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {showWarning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border animate-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'}`}>
            <button
              onClick={() => setShowWarning(false)}
              className="absolute top-4 right-4 p-2 rounded-xl transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-2xl font-black mb-4 tracking-tight">Legal Notice & Disclaimer</h2>
            <div className="space-y-4 text-sm leading-relaxed opacity-80 font-medium">
              <p>
                Pirating or unauthorized distribution of this product is a direct violation of international copyright laws. Such actions may lead to rigorous <span className="text-rose-500 font-bold">legal proceedings</span> and heavy financial penalties.
              </p>
              <p>
                Resell of this software is strictly prohibited. This license is granted solely to the original purchaser and is non-transferable.
              </p>
              <p>
                Any attempt to bypass licensing or modify the core functionality for redistribution will result in permanent blacklisting and reported to relevant authorities.
              </p>
            </div>

            <button
              onClick={() => setShowWarning(false)}
              className="w-full mt-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
