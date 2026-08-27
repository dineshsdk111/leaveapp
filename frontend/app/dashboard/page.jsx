'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async (token, role) => {
    setLoading(true);
    setError('');
    try {
      const result = await api.getDashboard(token, role);
      setData(result);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Unable to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored) {
        router.push('/login');
        return;
      }
      const parsed = JSON.parse(stored);
      setUser(parsed);
      fetchDashboard(parsed.token, parsed.role);
    } catch (e) {
      console.error('Dashboard init error:', e);
      setError('Failed to load user session');
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    if (user) {
      fetchDashboard(user.token, user.role);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-2 font-medium">Something went wrong</p>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Retry
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Login Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No data available</p>
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Return to login
          </button>
        </div>
      </div>
    );
  }

  const isStudent = user.role === 'student';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {user.name}!
          </h1>
          <p className="text-gray-500">
            {isStudent ? `Roll: ${user.rollNumber} | Section: ${user.section}` : 'Faculty Panel'}
          </p>
        </div>

        {isStudent ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard title="Total Applied" value={data.stats.totalLeaves} color="blue" />
              <StatCard title="Pending" value={data.stats.pendingLeaves} color="yellow" />
              <StatCard title="Approved" value={data.stats.approvedLeaves} color="green" />
              <StatCard title="Rejected" value={data.stats.rejectedLeaves} color="red" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Applications</h2>
              {!data.recentLeaves || data.recentLeaves.length === 0 ? (
                <p className="text-gray-500">No applications yet</p>
              ) : (
                <div className="space-y-3">
                  {data.recentLeaves.map((leave) => (
                    <LeaveCard key={leave._id} leave={leave} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard title="Total Students" value={data.stats.totalStudents} color="blue" />
              <StatCard title="Pending Reviews" value={data.stats.pendingLeaves} color="yellow" />
              <StatCard title="On Leave Today" value={data.stats.todayLeavesCount} color="green" />
            </div>

            {data.leavesByDate && Object.keys(data.leavesByDate).length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                <h2 className="text-lg font-semibold mb-4">Leave Calendar - By Date</h2>
                <div className="space-y-4">
                  {Object.entries(data.leavesByDate)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([date, students]) => {
                      const todayStr = new Date().toLocaleDateString('en-CA');
                      const isToday = date === todayStr;
                      const isPast = date < todayStr;
                      return (
                        <div key={date} className={`border rounded-lg overflow-hidden ${isPast ? 'opacity-50' : ''}`}>
                          <div className={`px-4 py-2 font-medium flex justify-between items-center ${
                            isToday
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            <span>
                              {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                              {isToday && (
                                <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">TODAY</span>
                              )}
                            </span>
                            <span className="text-sm">{students.length} student{students.length > 1 ? 's' : ''}</span>
                          </div>
                          <div className="divide-y">
                            {students.map((s, i) => (
                              <div key={i} className="px-4 py-2 flex items-center justify-between hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium">{s.name}</span>
                                  <span className="text-xs text-gray-500">({s.rollNumber})</span>
                                  <span className="text-xs text-gray-400">Sec {s.section}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    s.type === 'on-duty' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                  }`}>
                                    {s.type === 'on-duty' ? 'OD' : 'Leave'}
                                  </span>
                                  <span className="text-xs text-gray-400 max-w-[150px] truncate">{s.reason}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Recent Leave Applications</h2>
              {!data.recentLeaves || data.recentLeaves.length === 0 ? (
                <p className="text-gray-500">No applications yet</p>
              ) : (
                <div className="space-y-3">
                  {data.recentLeaves.map((leave) => (
                    <LeaveCard key={leave._id} leave={leave} showStudent />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={`p-4 rounded-xl ${colors[color]}`}>
      <p className="text-sm opacity-75">{title}</p>
      <p className="text-3xl font-bold">{value ?? 0}</p>
    </div>
  );
}

function LeaveCard({ leave, showStudent }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div>
        {showStudent && leave.applicant && (
          <p className="font-medium">{leave.applicant.name} ({leave.applicant.rollNumber})</p>
        )}
        <p className="text-sm text-gray-600">
          {leave.type === 'on-duty' ? 'On-Duty' : 'Leave'} |{' '}
          {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">{leave.reason}</p>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[leave.status]}`}>
        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
      </span>
    </div>
  );
}
