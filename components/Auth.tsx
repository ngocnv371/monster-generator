
import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import Spinner from './Spinner';

const Auth: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Registration successful! Please check your email to confirm your account.');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
      // On success, the onAuthStateChange listener in App.tsx will handle the state change
    }
    setLoading(false);
  };
  
  const inputStyles = "w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors text-white";
  const buttonStyles = "w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-300";

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl border border-purple-500/30">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 tracking-wider mb-2">
          AI Beastiary
        </h1>
        <p className="text-center text-gray-400 mb-8">
          {isSignUp ? 'Create an account to begin' : 'Sign in to your beastiary'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputStyles}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={inputStyles}
              placeholder="••••••••"
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>
          <button type="submit" disabled={loading} className={buttonStyles}>
            {loading ? <Spinner className="w-6 h-6" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>
        
        {error && <p className="mt-4 text-center text-red-400 bg-red-900/50 p-3 rounded-md">{error}</p>}
        {message && <p className="mt-4 text-center text-green-400 bg-green-900/50 p-3 rounded-md">{message}</p>}

        <p className="mt-6 text-center text-sm text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }} 
            className="font-medium text-purple-400 hover:text-purple-300"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

      </div>
       <footer className="text-center mt-8 text-gray-600">
            <p>Powered by Gemini and Supabase</p>
        </footer>
    </div>
  );
};

export default Auth;
