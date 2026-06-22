// src/services/contentService.js

const API_URL = process.env.REACT_APP_API_URL || (window.location.port === '3000' ? 'http://localhost:5000' : '');
const TOKEN_KEY = 'alumni-connect-token';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const listContent = async (table, email) => {
  let url = `${API_URL}/api/content/${table}`;
  if (email) {
    url += `?email_id=${encodeURIComponent(email)}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to fetch ${table}`);
  }

  return response.json();
};

export const getContent = async (table, id) => {
  const response = await fetch(`${API_URL}/api/content/${table}/${id}`, {
    method: 'GET',
    headers: getHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to fetch item from ${table}`);
  }

  return response.json();
};

export const saveContent = async (table, values, id) => {
  const url = id 
    ? `${API_URL}/api/content/${table}/${id}`
    : `${API_URL}/api/content/${table}`;

  const method = id ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method: method,
    headers: getHeaders(),
    body: JSON.stringify(values)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to save item in ${table}`);
  }

  return response.json();
};

export const deleteContent = async (table, id) => {
  const response = await fetch(`${API_URL}/api/content/${table}/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `Failed to delete item from ${table}`);
  }

  return response.json();
};
