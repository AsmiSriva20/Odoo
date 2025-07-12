'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext'; // ✅

import api from '../../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token);
      router.push(res.data.user.isAdmin ? '/admin' : '/landing');
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border" />
        <button type="submit" className="w-full bg-green-600 text-white p-2">Login</button>
        <p className="text-sm mt-4">
  Don't have an account? <span onClick={() => router.push('/signup')} className="text-blue-600 underline cursor-pointer">Sign up</span>
</p>

      </form>
    </div>
  );
}
