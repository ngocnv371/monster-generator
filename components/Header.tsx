
import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, ExportIcon, SettingsIcon, UserIcon } from './icons';
import Spinner from './Spinner';
import { type Session } from '@supabase/supabase-js';


interface HeaderProps {
  onGenerate: () => void;
  onExport: () => void;
  isGenerating: boolean;
  session: Session | null;
  onLogout: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGenerate, onExport, isGenerating, session, onLogout, onOpenSettings }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-purple-500/30 shadow-lg shadow-purple-900/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wider">
          AI Beastiary
        </h1>
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onExport}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 shadow-md"
            aria-label="Export collection"
          >
            <ExportIcon className="w-5 h-5 md:mr-2" />
            <span className="hidden md:inline">Export</span>
          </button>

          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 shadow-md order-last"
          >
            {isGenerating ? (
              <>
                <Spinner className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Generating...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 md:mr-2" />
                <span className="hidden md:inline">Generate New Monster</span>
                <span className="md:hidden">Generate</span>
              </>
            )}
          </button>

          <div className="hidden md:flex items-center gap-2 md:gap-4">
            <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                aria-label="Settings"
            >
                <SettingsIcon className="w-5 h-5 text-white" />
            </button>
            <div className="relative" ref={userMenuRef}>
                <button
                    onClick={() => setIsUserMenuOpen(prev => !prev)}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="Open user menu"
                >
                    <UserIcon className="w-5 h-5 text-white" />
                </button>
                {isUserMenuOpen && (
                    <div 
                        className="absolute right-0 mt-2 w-64 origin-top-right rounded-md bg-gray-800 shadow-2xl ring-1 ring-purple-500/30 focus:outline-none z-20"
                        role="menu" aria-orientation="vertical" tabIndex={-1}
                    >
                        <div className="py-1" role="none">
                            <div className="px-4 py-3 border-b border-gray-700">
                                <p className="text-sm text-gray-400" role="none">Signed in as</p>
                                <p className="text-sm font-medium text-gray-100 truncate" role="none">{session?.user?.email}</p>
                            </div>
                            <button
                                onClick={onLogout}
                                className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                role="menuitem"
                                tabIndex={-1}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
