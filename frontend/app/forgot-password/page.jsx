'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.forgotPassword(email);
      setMessage('OTP sent to your email!');
      setTimeout(() => router.push(`/reset-password?email=${email}`), 2000);
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/campus-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white text-3xl shadow-lg shadow-blue-500/30 mb-2">
            🔐
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Forgot Password?</h1>
          <p className="text-xs text-gray-500">Enter your official campus email to receive an OTP</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          {error && (
            <div className="bg-red-50/90 text-red-600 p-3 rounded-xl text-sm border border-red-100">{error}</div>
          )}

          {message && (
            <div className="bg-green-50/90 text-green-700 p-3 rounded-xl text-sm border border-green-100">{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 disabled:opacity-50 text-sm tracking-wide"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>

        <div className="pt-2 border-t border-gray-200/60 text-center">
          <Link href="/login" className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
