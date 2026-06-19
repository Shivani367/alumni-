// src/CheckSupabaseMethod.js
import React, { useEffect } from 'react';
import supabase from './supabaseClient';

const CheckSupabaseMethod = () => {
  useEffect(() => {
    if (typeof supabase.auth.getSessionFromUrl === 'function') {
      console.log('getSessionFromUrl is available');
    } else {
      console.error('getSessionFromUrl is not available');
    }
  }, []);

  return (
    <div>
      <h1>Supabase Method Check</h1>
    </div>
  );
};

export default CheckSupabaseMethod;
