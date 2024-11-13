import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { useAuthStore } from '../store/useAuthStore';

export function Auth() {
  const location = useLocation();
  const { user, loading } = useAuthStore();
  
  const isLogin = location.pathname === '/login';

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <AuthForm mode={isLogin ? 'login' : 'register'} />
    </div>
  );
}