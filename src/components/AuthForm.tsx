import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Tv, Loader2 } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 text-emerald-500">
          <Tv size={48} />
        </div>
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          {mode === 'login' ? 'Welcome back!' : 'Create your account'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {mode === 'login' 
            ? "Track your favorite shows" 
            : "Start tracking your shows today"}
        </p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-4 rounded-md">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full rounded-lg border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="relative block w-full rounded-lg border-0 p-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full justify-center rounded-lg bg-emerald-500 px-3 py-3 text-sm font-semibold text-white hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : mode === 'login' ? (
            'Sign in'
          ) : (
            'Sign up'
          )}
        </button>
      </form>
    </div>
  );
}