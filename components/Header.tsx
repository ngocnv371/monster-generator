
import React from 'react';
import { SparklesIcon } from './icons';
import Spinner from './Spinner';

interface HeaderProps {
  onGenerate: () => void;
  isGenerating: boolean;
}

const Header: React.FC<HeaderProps> = ({ onGenerate, isGenerating }) => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 border-b border-purple-500/30 shadow-lg shadow-purple-900/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wider">
          AI Beastiary
        </h1>
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 shadow-md"
        >
          {isGenerating ? (
            <>
              <Spinner className="w-5 h-5 mr-2" />
              Generating...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate New Monster
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
