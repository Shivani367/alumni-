import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession, onAuthChange } from '../services/authService';

const Header = () => {
  const [user, setUser] = useState(null); // Initialize as null for loading state

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

  return (
    <header className="bg-[#90d4c4] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <img
              src="https://i.pinimg.com/originals/28/59/ff/2859ffb6a79f7a1ed1408f125fa676e8.png"
              alt="Easwari Engineering College Logo"
              className="w-12 h-12"
            />
          </Link>
        </div>
        <nav className="flex flex-wrap justify-end gap-4 md:gap-6">
          <Link
            to="/blog"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            Blogs
          </Link>
          <Link
            to="/events"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            Events
          </Link>
          <Link
            to="/openings"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            Jobs
          </Link>
          <Link
            to="/ats-tracker"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            ATS Tracker
          </Link>
          {user ? (
            <Link
              to="/dashboard"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hover:text-gray-300 transition-colors duration-300"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
