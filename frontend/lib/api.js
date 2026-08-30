const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 120000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Request timed out');
    throw err;
  }
};

export const api = {
  async login(email, password) {
    const res = await fetchWithTimeout(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getProfile(token) {
    const res = await fetchWithTimeout(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
  },

  async getDashboard(token, role) {
    const endpoint = role === 'faculty' ? '/dashboard/faculty' : '/dashboard/student';
    const res = await fetchWithTimeout(`${API_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to load dashboard');
    return data;
  },

  async applyLeave(token, leaveData) {
    const res = await fetchWithTimeout(`${API_URL}/leaves/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(leaveData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getMyLeaves(token) {
    const res = await fetchWithTimeout(`${API_URL}/leaves/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load leaves');
    return res.json();
  },

  async getPendingLeaves(token) {
    const res = await fetchWithTimeout(`${API_URL}/leaves/pending`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load pending leaves');
    return res.json();
  },

  async getAllLeaves(token) {
    const res = await fetchWithTimeout(`${API_URL}/leaves/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to load leaves');
    return res.json();
  },

  async actionLeave(token, id, status, remark) {
    const res = await fetchWithTimeout(`${API_URL}/leaves/${id}/action`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, remark }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async deleteLeave(token, id) {
    const res = await fetchWithTimeout(`${API_URL}/leaves/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to delete');
    return res.json();
  },

  async getNotifications(token) {
    const res = await fetchWithTimeout(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getUnreadCount(token) {
    const res = await fetchWithTimeout(`${API_URL}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { count: 0 };
    return res.json();
  },

  async markAsRead(token, id) {
    const res = await fetchWithTimeout(`${API_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  async markAllAsRead(token) {
    const res = await fetchWithTimeout(`${API_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed');
    return res.json();
  },

  async forgotPassword(email) {
    const res = await fetchWithTimeout(`${API_URL}/password/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async resetPassword(email, otp, newPassword) {
    const res = await fetchWithTimeout(`${API_URL}/password/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};
