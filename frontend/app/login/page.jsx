'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
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

  const handleGoogleResponse = async (response) => {
    setError('');
    setLoading(true);
    try {
      const data = await api.googleLogin(response.credential);
      localStorage.setItem('user', JSON.stringify(data));
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const initGoogleAuth = () => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '736830783027-skb1ktbtf9bn6fhj7t3lmaqpvdqo34dh.apps.googleusercontent.com';
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
    }
  };

  const handleGoogleClick = () => {
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      initGoogleAuth();
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Render fallback standard Google button if OneTap is skipped
          const container = document.getElementById('googleHiddenBtn');
          if (container) {
            container.innerHTML = '';
            window.google.accounts.id.renderButton(container, {
              theme: 'outline',
              size: 'large',
              width: '100%',
            });
            const btn = container.querySelector('div[role=button]');
            if (btn) btn.click();
          }
        }
      });
    } else {
      setError('Google Sign-In script is loading. Please try again in a moment.');
    }
  };

  useEffect(() => {
    initGoogleAuth();
  }, []);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initGoogleAuth}
        strategy="lazyOnload"
      />
      <div 
        className="min-h-screen relative flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/campus-bg.jpg')" }}
      >
        {/* Dark overlay backdrop */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/50 space-y-5">
          
          {/* Header Section */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-24 h-24 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg shadow-blue-500/20 border border-white/80 mb-1 mx-auto">
              <img src="/logo.png" alt="Easwari Engineering College Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              IT Department Portal
            </h1>
            <p className="text-xs font-semibold text-blue-700 bg-blue-50/90 inline-block px-3 py-1 rounded-full border border-blue-100">
              SRM Easwari Engineering College
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
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
              <div className="bg-red-50/90 text-red-600 p-3 rounded-xl text-sm border border-red-100 flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
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

          {/* Divider */}
          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-gray-300/80"></div>
            <span className="px-3 text-xs text-gray-400 font-semibold uppercase tracking-wider">Or</span>
            <div className="flex-1 border-t border-gray-300/80"></div>
          </div>

          {/* Custom Continue with Google Button matching user image */}
          <div>
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50/90 text-gray-800 font-semibold py-3 px-4 border border-gray-300/80 rounded-2xl shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 text-sm"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>
            <div id="googleHiddenBtn" className="hidden"></div>
          </div>

          {/* Footer Info */}
          <div className="pt-2 border-t border-gray-200/60 text-center space-y-1">
            <p className="text-xs font-medium text-gray-600">
              Only <span className="text-blue-700 font-semibold">@eec.srmrmp.edu.in</span> accounts allowed
            </p>
            <p className="text-[11px] text-gray-400">
              Google Login verifies both campus domain & database authorization
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
