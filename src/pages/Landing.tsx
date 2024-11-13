import React, { useState } from 'react';
import { Tv, MonitorPlay, BookMarked, Users, Play, Star, TrendingUp } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

export function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-900 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-900 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-900 rounded-full mix-blend-screen filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative">
          <nav className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-2 rounded-lg">
                  <Tv size={32} className="text-gray-900" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                  ShowTracker
                </span>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => handleAuthClick('login')}
                  className="px-6 py-2 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-gray-100 rounded-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-colors shadow-lg shadow-emerald-900/50"
                >
                  Get started
                </button>
              </div>
            </div>
          </nav>

          <main className="container mx-auto px-6 pt-16 pb-24">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent">
                Track Your Shows,{' '}
                <span className="block">Never Miss a Beat</span>
              </h1>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Keep track of your favorite shows, mark episodes as watched, and never forget where you left off. 
                Your personal TV show companion that makes binge-watching smarter.
              </p>
              <button
                onClick={() => handleAuthClick('register')}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-gray-100 rounded-lg text-lg font-medium hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-lg shadow-emerald-900/50 hover:shadow-emerald-900/60 transform hover:-translate-y-0.5"
              >
                Start tracking now
                <Play size={20} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-gray-800 p-8 rounded-lg shadow-xl">
                  <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <BookMarked size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-100">Smart Tracking</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Automatically track your progress across multiple shows and seasons with our intuitive interface.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-gray-800 p-8 rounded-lg shadow-xl">
                  <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <Star size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-100">Personal Notes</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Add personal notes to episodes, mark favorites, and keep track of key moments and thoughts.
                  </p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg blur opacity-25 group-hover:opacity-50 transition-all"></div>
                <div className="relative bg-gray-800 p-8 rounded-lg shadow-xl">
                  <div className="w-14 h-14 bg-gray-900 rounded-lg flex items-center justify-center mb-6">
                    <TrendingUp size={24} className="text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-100">Progress Insights</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Get insights into your watching habits and track completion rates across your shows.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}