// src/pages/Auth.js
import React, { useState, useEffect } from 'react';
import { signIn, signUp } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('Student');
  const [country, setCountry] = useState('');
  const countries = ['Australia', 'Canada', 'France', 'Germany', 'India', 'Japan', 'Singapore', 'United Arab Emirates', 'United Kingdom', 'United States'];
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError('');
  }, [isSignUp]);

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    if (isSignUp && (!name || !phoneNumber || !country)) {
      setError('Name, phone number, and country are required for sign-up.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await signUp({ email, password, profile: { name, phone_number: phoneNumber, status, country } });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      await signIn({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200/80">
        
        {/* Left Panel: Branding / Visuals */}
        <div className="md:w-1/2 bg-gradient-to-br from-teal-800 via-teal-900 to-slate-900 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle backgrounds shapes */}
          <div className="absolute top-[-20%] left-[-20%] w-72 h-72 rounded-full bg-teal-700/25 blur-3xl"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-72 h-72 rounded-full bg-slate-700/20 blur-3xl"></div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center space-x-2">
              <span className="text-2xl font-black tracking-wider text-teal-350">EEC Portal</span>
            </Link>
          </div>

          <div className="my-12 relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Connect. Inspire. Empower.
            </h2>
            <p className="text-teal-100 text-base leading-relaxed">
              Join the official alumni community of Easwari Engineering College. Collaborate, find job referrals, schedule reunions, and unlock mentorship networks worldwide.
            </p>
          </div>

          <div className="relative z-10 border-t border-teal-700/60 pt-6">
            <p className="text-xs text-teal-300 font-semibold uppercase tracking-wider">Managed by EEC Alumni Association</p>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-800">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {isSignUp ? 'Get started by filling out the details' : 'Enter your credentials to continue'}
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50 hover:bg-slate-50 transition duration-150"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone Number (e.g. +91 98401 23456)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50 hover:bg-slate-50 transition duration-150"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50 hover:bg-slate-50 transition duration-150 cursor-pointer font-medium"
                    >
                      <option value="Student">Student</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50 hover:bg-slate-50 transition duration-150 cursor-pointer font-medium"
                    >
                      <option value="">Country</option>
                      {countries.map((countryName) => (
                        <option key={countryName} value={countryName}>
                          {countryName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50 hover:bg-slate-50 transition duration-150"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50 hover:bg-slate-50 transition duration-150"
              />
            </div>

            {!isSignUp && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white p-3.5 rounded-xl font-bold transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 mt-4"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  <span>Processing...</span>
                </span>
              ) : isSignUp ? (
                'Sign Up'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsSignUp((value) => !value)}
              className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline focus:outline-none"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
