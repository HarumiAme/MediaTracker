import React, { useState } from 'react';
import { Tv, MonitorPlay, BookMarked, Users } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';

export function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2 text-emerald-600">
            <Tv size={32} />
            <span className="text-xl font-bold">ShowTracker</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => handleAuthClick('login')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Sign in
            </button>
            <button
              onClick={() => handleAuthClick('register')}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              Get started
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Never lose track of your favorite shows again
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Keep track of what you're watching, save your progress, and never forget where you left off.
          </p>
          <button
            onClick={() => handleAuthClick('register')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-lg font-semibold"
          >
            Start tracking now
            <MonitorPlay size={20} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-24">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BookMarked size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-gray-600">
              Keep track of episodes you've watched and where you left off
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multiple Users</h3>
            <p className="text-gray-600">
              Create accounts for different family members or media types
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MonitorPlay size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Episode Notes</h3>
            <p className="text-gray-600">
              Add personal notes to remember key moments and thoughts
            </p>
          </div>
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