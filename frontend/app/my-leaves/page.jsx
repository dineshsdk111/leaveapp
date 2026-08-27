'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';

export default function MyLeavesPage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    fetchLeaves(JSON.parse(user).token);
  }, [router]);

  const fetchLeaves = async (token) => {
    try {
      const data = await api.getMyLeaves(token);
      setLeaves(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.deleteLeave(user.token, id);
      setLeaves(leaves.filter((l) => l._id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredLeaves = filter === 'all' ? leaves : leaves.filter((l) => l.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📋 My Leave Applications</h1>

        <div className="flex gap-2 mb-6">
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredLeaves.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeaves.map((leave) => (
              <div key={leave._id} className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">
                        {leave.type === 'on-duty' ? '🚶 On-Duty' : '📝 Leave'}
                      </span>
                      <StatusBadge status={leave.status} />
                    </div>
                    <p className="text-sm text-gray-600">
                      📅 {new Date(leave.fromDate).toLocaleDateString('en-GB', {day:'2-digit',month:'2-digit',year:'numeric'})} -{' '}
                      {new Date(leave.toDate).toLocaleDateString('en-GB', {day:'2-digit',month:'2-digit',year:'numeric'})}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{leave.reason}</p>
                    {leave.facultyRemark && (
                      <p className="text-sm text-blue-600 mt-2">
                        💬 Faculty: {leave.facultyRemark}
                      </p>
                    )}
                  </div>
                  {leave.status === 'pending' && (
                    <button
                      onClick={() => handleDelete(leave._id)}
                      className="text-red-500 hover:text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
