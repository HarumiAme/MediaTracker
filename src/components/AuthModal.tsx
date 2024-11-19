import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Tv, Loader2, X } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
}

const getErrorMessage = (error: FirebaseError) => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { signIn, signUp } = useAuthStore();

  useEffect(() => {
    setMode(initialMode);
    setEmail('');
    setPassword('');
    setErrorMessage('');
  }, [initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (error) {
      if (error instanceof FirebaseError) {
        setErrorMessage(getErrorMessage(error));
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    const newMode = mode === 'login' ? 'register' : 'login';
    setMode(newMode);
    setErrorMessage('');
    setEmail('');
    setPassword('');
  };

  const modalContent = {
    login: {
      title: 'Welcome back!',
      subtitle: 'Sign in to continue tracking your shows',
      buttonText: 'Sign in',
      switchText: "Don't have an account? Sign up",
    },
    register: {
      title: 'Create your account',
      subtitle: 'Join MediaTracker and start organizing your watchlist',
      buttonText: 'Create account',
      switchText: 'Already have an account? Sign in',
    },
  };

  const content = modalContent[mode];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md p-8 relative border border-gray-800 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-emerald-400 flex items-center justify-center">
            <Tv size={48} />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-100">
            {content.title}
          </h2>
          <p className="mt-2 text-sm text-gray-400">{content.subtitle}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm border border-red-500/20">
              {errorMessage}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base placeholder-gray-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-700 bg-gray-800 text-gray-100 px-4 py-3 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base placeholder-gray-500 transition-colors"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-gray-900 bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors focus:ring-offset-gray-900"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              content.buttonText
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleModeSwitch}
              className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {content.switchText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}