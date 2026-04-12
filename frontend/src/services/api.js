const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/$/,
  ''
);

export function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export async function apiRequest(path, options = {}) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const url = `${BASE}${p}`;
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}
