import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';

const Header = () => {
  const [user, setUser] = useState(null); // Initialize as null for loading state

  useEffect(() => {
    // Check initial user state
    const getCurrentUser = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
        setUser(null);
      } else if (session?.user) {
        setUser(session.user);
      }
    };

    getCurrentUser();

    // Subscribe to authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user); // User is logged in
        } else {
          setUser(null); // User is logged out
        }
      }
    );

    // Cleanup the listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="bg-[#90d4c4] text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/">
<<<<<<< HEAD
          <img 
            src={logo} 
            alt="Easwari Engineering College Logo" 
            className="w-32 h-30"
          />
=======
            <img
              src="https://i.pinimg.com/originals/28/59/ff/2859ffb6a79f7a1ed1408f125fa676e8.png"
              alt="Easwari Engineering College Logo"
              className="w-12 h-12"
            />
>>>>>>> 8bf558abf12f343c96467aaca933542bfba5dff6
          </Link>
        </div>
        <nav className="flex space-x-6">
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

export default Header;