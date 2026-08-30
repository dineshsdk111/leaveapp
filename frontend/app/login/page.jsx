'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/campus-bg.jpg')" }}
    >
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 space-y-6">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-3xl shadow-lg shadow-blue-500/30 mb-2">
            🎓
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            IT Department Portal
          </h1>
          <p className="text-sm font-medium text-blue-700 bg-blue-50/80 inline-block px-3 py-1 rounded-full border border-blue-100">
            SRM Easwari Engineering College
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rollnumber@eec.srmrmp.edu.in"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition duration-200 text-gray-800 placeholder-gray-400 text-sm"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-800 transition">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:bg-white outline-none transition duration-200 text-gray-800 placeholder-gray-400 text-sm"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50/90 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 disabled:opacity-50 text-sm tracking-wide"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Info */}
        <div className="pt-2 border-t border-gray-200/60 text-center space-y-1">
          <p className="text-xs font-medium text-gray-600">
            Only <span className="text-blue-700 font-semibold">@eec.srmrmp.edu.in</span> emails allowed
          </p>
          <p className="text-[11px] text-gray-400">
            Students: Roll number is default password
          </p>
        </div>

      </div>
    </div>
  );
}
