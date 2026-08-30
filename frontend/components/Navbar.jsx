'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        fetchNotifications(parsed.token);
      }
    } catch (e) {
      console.error('Navbar init error:', e);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const stored = localStorage.getItem('user');
        if (stored) {
          const parsed = JSON.parse(stored);
          fetchNotifications(parsed.token);
        }
      } catch (e) {}
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async (token) => {
    try {
      const [notifs, count] = await Promise.all([
        api.getNotifications(token),
        api.getUnreadCount(token)
      ]);
      if (Array.isArray(notifs)) setNotifications(notifs);
      if (count && typeof count.count === 'number') setUnreadCount(count.count);
    } catch (error) {
      console.error('Notification fetch error:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const token = JSON.parse(stored).token;
        await api.markAsRead(token, id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (e) {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const token = JSON.parse(stored).token;
        await api.markAllAsRead(token);
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (e) {}
  };

  const logout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'leave_applied': return '📝';
      case 'leave_approved': return '✅';
      case 'leave_rejected': return '❌';
      default: return '🔔';
    }
  };

  if (!user) return null;

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white p-1 rounded-full flex items-center justify-center shadow">
            <img src="/logo.png" alt="Easwari Engineering College Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold">IT Leave Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          {user.role === 'student' && (
            <>
              <Link href="/apply" className="hover:text-blue-200">Apply</Link>
              <Link href="/my-leaves" className="hover:text-blue-200">My Leaves</Link>
            </>
          )}
          {user.role === 'faculty' && (
            <Link href="/faculty" className="hover:text-blue-200">Review Leaves</Link>
          )}

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotif(!showNotif)}
              className="relative p-2 hover:bg-blue-700 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white text-gray-800 rounded-xl shadow-xl border z-50 max-h-96 overflow-hidden">
                <div className="flex justify-between items-center p-3 border-b bg-gray-50 rounded-t-xl">
                  <h3 className="font-semibold">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="overflow-y-auto max-h-72">
                  {!Array.isArray(notifications) || notifications.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center text-sm">No notifications</p>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif._id}
                        onClick={() => !notif.read && handleMarkAsRead(notif._id)}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${
                          !notif.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">{getNotifIcon(notif.type)}</span>
                          <div className="flex-1">
                            <p className={`text-sm ${!notif.read ? 'font-medium' : ''}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notif.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-l pl-4 border-blue-600">
            <span className="text-sm text-blue-200">{user.name}</span>
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
