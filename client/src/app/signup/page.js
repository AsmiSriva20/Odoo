'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', form);
      alert('Signup successful! Please log in.');
      router.push('/login');
    } catch (err) {
      alert(err.response.data.msg || 'Signup failed');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Signup</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border" />
        <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" className="w-full p-2 border" />
        <button type="submit" className="w-full bg-green-600 text-white p-2">Signup</button>
      </form>
    </div>
  );
}
