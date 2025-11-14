'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';

export default function Login() {
  const [name, setName] = useState(''); // UBAH DARI 'username'
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Kirim 'name' bukan 'username'
      const response = await authApi.login({ name, password }); 
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Simpan info pengguna untuk ditampilkan (opsional tapi bagus)
        localStorage.setItem('user', JSON.stringify(response.data.user)); 
        
        router.push('/'); // Redirect ke halaman utama
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name" // UBAH DARI 'Username'
            value={name} // UBAH DARI 'username'
            onChange={(e) => setName(e.target.value)} // UBAH DARI 'setUsername'
            className="w-full border rounded-md px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>
        {/* Kita bisa biarkan link ini ke /register, atau hapus. Mari kita biarkan dulu. */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}