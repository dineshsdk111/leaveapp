'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

export default function FacultyPage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    const parsed = JSON.parse(user);
    if (parsed.role !== 'faculty') {
      router.push('/dashboard');
      return;
    }
    fetchLeaves(parsed.token);
  }, [router, tab]);

  const fetchLeaves = async (token) => {
    setLoading(true);
    try {
      const data = tab === 'pending'
        ? await api.getPendingLeaves(token)
        : await api.getAllLeaves(token);
      setLeaves(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status, remark = '') => {
    setActionLoading(id);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.actionLeave(user.token, id, status, remark);
      setLeaves(leaves.filter((l) => l._id !== id));
    } catch (error) {
      alert(error.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">👨‍🏫 Faculty Panel</h1>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'pending'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Pending ({leaves.length})
          </button>
          <button
            onClick={() => setTab('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              tab === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Applications
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : leaves.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {leaves.map((leave) => (
              <LeaveCard
                key={leave._id}
                leave={leave}
                onAction={handleAction}
                loading={actionLoading === leave._id}
                showActions={tab === 'pending'}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function LeaveCard({ leave, onAction, loading, showActions }) {
  const [remark, setRemark] = useState('');
  const [showRemark, setShowRemark] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{leave.applicant?.name}</h3>
          <p className="text-sm text-gray-500">
            Roll: {leave.applicant?.rollNumber} | Section: {leave.applicant?.section}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[leave.status]}`}>
          {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="text-gray-500">Type:</span>{' '}
          <span className="font-medium">{leave.type === 'on-duty' ? 'On-Duty' : 'Leave'}</span>
        </div>
        <div>
          <span className="text-gray-500">Dates:</span>{' '}
          <span className="font-medium">
            {new Date(leave.fromDate).toLocaleDateString('en-GB', {day:'2-digit',month:'2-digit',year:'numeric'})} -{' '}
            {new Date(leave.toDate).toLocaleDateString('en-GB', {day:'2-digit',month:'2-digit',year:'numeric'})}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <span className="text-gray-500 text-sm">Reason:</span>
        <p className="text-sm mt-1">{leave.reason}</p>
      </div>

      {leave.facultyRemark && (
        <div className="bg-blue-50 p-2 rounded text-sm mb-3">
          <span className="font-medium">Your remark:</span> {leave.facultyRemark}
        </div>
      )}

      {showActions && leave.status === 'pending' && (
        <div className="border-t pt-3 mt-3">
          {showRemark ? (
            <div className="space-y-3">
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Add your remark (optional)..."
                rows={2}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onAction(leave._id, 'approved', remark)}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Processing...' : '✅ Approve'}
                </button>
                <button
                  onClick={() => onAction(leave._id, 'rejected', remark)}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {loading ? 'Processing...' : '❌ Reject'}
                </button>
                <button
                  onClick={() => setShowRemark(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => onAction(leave._id, 'approved')}
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => onAction(leave._id, 'rejected')}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                Reject
              </button>
              <button
                onClick={() => setShowRemark(true)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
              >
                With Remark
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
