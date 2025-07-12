'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not logged in, redirect to login
    if (!user) {
      router.push('/login');
    } else {
      router.push(user.isAdmin ? '/admin' : '/dashboard');
    }
  }, [user]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600 text-lg">Redirecting...</p>
    </main>
  );
}
