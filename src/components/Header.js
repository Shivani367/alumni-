// src/components/Header.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, onAuthChange, signOut } from '../services/authService';

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const session = await getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      }
    };

    getCurrentUser();

    return onAuthChange((session) => setUser(session?.user ?? null));
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-[#004d40] sticky top-0 z-50 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Brand/Logo Section */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center space-x-3 group">
            <img
              src="https://i.pinimg.com/originals/28/59/ff/2859ffb6a79f7a1ed1408f125fa676e8.png"
              alt="Easwari Engineering College Logo"
              className="w-10 h-10 group-hover:scale-105 transition-transform duration-255"
            />
            <span className="text-xl font-extrabold tracking-wide hidden sm:block hover:text-teal-200 transition-colors">
              EEC Alumni Connect
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6 text-sm font-semibold">
          <Link
            to="/blog"
            className="text-teal-50 hover:text-white hover:underline underline-offset-4 decoration-2 transition duration-150"
          >
            Blogs
          </Link>
          <Link
            to="/events"
            className="text-teal-50 hover:text-white hover:underline underline-offset-4 decoration-2 transition duration-150"
          >
            Events
          </Link>
          <Link
            to="/openings"
            className="text-teal-50 hover:text-white hover:underline underline-offset-4 decoration-2 transition duration-150"
          >
            Jobs
          </Link>
          <Link
            to="/ats-tracker"
            className="text-teal-50 hover:text-white hover:underline underline-offset-4 decoration-2 transition duration-150"
          >
            ATS Tracker
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4 border-l border-teal-800 pl-6">
              <Link
                to="/dashboard"
                className="py-2 px-4 bg-teal-700 hover:bg-teal-650 text-white font-bold rounded-lg transition duration-150 shadow-sm"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-teal-100 hover:text-white text-xs font-bold transition duration-150"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 border-l border-teal-800 pl-6">
              <Link
                to="/auth"
                className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition duration-150 shadow-sm"
              >
                Login / Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
