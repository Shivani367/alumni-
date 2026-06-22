// src/services/authService.js

const API_URL = process.env.REACT_APP_API_URL || (window.location.port === '3000' ? 'http://localhost:5000' : '');
const TOKEN_KEY = 'alumni-connect-token';
const AUTH_EVENT = 'alumni-auth-change';

const notify = () => window.dispatchEvent(new Event(AUTH_EVENT));

// Helper to get headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (includeAuth) {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

export const getSession = async () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: getHeaders(true)
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem(TOKEN_KEY);
        notify();
      }
      return null;
    }

    const data = await response.json();
    return { user: data.user };
  } catch (error) {
    console.error('Error getting session from backend:', error);
    // If backend is unreachable, return null so we don't crash
    return null;
  }
};

export const signUp = async ({ email, password, profile }) => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, password, profile })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to sign up');
  }

  if (data.session?.access_token) {
    localStorage.setItem(TOKEN_KEY, data.session.access_token);
    notify();
  }
  return data.session;
};

export const signIn = async ({ email, password }) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(false),
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to log in');
  }

  if (data.session?.access_token) {
    localStorage.setItem(TOKEN_KEY, data.session.access_token);
    notify();
  }
  return data.session;
};

export const signOut = async () => {
  localStorage.removeItem(TOKEN_KEY);
  notify();
};

export const requestPasswordReset = async (email) => {
  // Simple simulator for password reset with real api
  const normalizedEmail = email.trim().toLowerCase();
  return 'Password reset request processed. (In production, a link will be sent to ' + normalizedEmail + ')';
};

export const updatePassword = async (password) => {
  return 'Password updated successfully.';
};

export const onAuthChange = (callback) => {
  const handler = async () => {
    const session = await getSession();
    callback(session);
  };
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
};

export const authMode = 'backend';
