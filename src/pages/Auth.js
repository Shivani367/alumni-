import React, { useState, useEffect } from 'react';
import { signIn, signUp, authMode } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


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
      setError(err.message);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
          {isSignUp ? 'Sign Up' : 'Login'}
        </h2>
        
        {authMode === 'local' && <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded mb-4">Demo mode: accounts are saved only in this browser.</p>}
        {error && <p role="alert" className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
        
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Student">Student</option>
              <option value="Alumni">Alumni</option>
            </select>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Country</option>
              {countries.map((countryName) => (
                <option key={countryName} value={countryName}>
                  {countryName}
                </option>
              ))}
            </select>
          </>
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mb-6 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        
        <Link to="/forgot-password" className="text-blue-500 hover:underline mb-4 block text-center">
          Forgot Password?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out mb-4"
        >
          {loading ? 'Please wait…' : isSignUp ? 'Sign Up' : 'Login'}
        </button>
        </form>
        
        <button
          onClick={() => setIsSignUp((value) => !value)}
          className="text-blue-500 hover:underline"
        >
          {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
