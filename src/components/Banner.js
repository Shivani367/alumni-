// src/components/Banner.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../services/authService';

const Banner = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      const session = await getSession();
      setIsLoggedIn(!!session?.user);
    };
    checkLogin();
  }, []);

  return (
    <div 
      className="relative min-h-[500px] w-full bg-cover bg-center flex items-center justify-center font-sans overflow-hidden" 
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2670&auto=format&fit=crop)' }}
    >
      {/* Premium dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-950/80 via-slate-900/75 to-transparent"></div>

      {/* Grid container to prevent flat look */}
      <div className="container mx-auto px-6 relative z-10 max-w-6xl py-16 flex flex-col md:flex-row justify-between items-center gap-12">
        
        {/* Left: Text Content */}
        <div className="max-w-2xl text-white space-y-6 text-center md:text-left">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 tracking-wider uppercase">
            Official Alumni Network
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            Easwari Engineering <br className="hidden sm:inline" />
            <span className="text-teal-400">College Connect</span>
          </h1>
          <p className="text-slate-200 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
            Reconnecting past graduates, empowering future graduates. Collaborate on job referrals, share tech insights, host community meetups, and converse in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 pt-4">
            {isLoggedIn ? (
              <Link 
                to="/dashboard" 
                className="py-3.5 px-8 bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/25 transition duration-150 text-center"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link 
                to="/auth" 
                className="py-3.5 px-8 bg-teal-500 hover:bg-teal-600 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg hover:shadow-teal-500/25 transition duration-150 text-center"
              >
                Join the Network
              </Link>
            )}
            <Link 
              to="/alumini-maps" 
              className="py-3.5 px-8 bg-transparent hover:bg-white/10 active:scale-[0.98] text-white font-bold rounded-xl border border-white/50 hover:border-white transition duration-150 text-center"
            >
              Explore Alumni Map
            </Link>
          </div>
        </div>

        {/* Right: Decorative Card Info Box (to avoid whitespace on widescreen) */}
        <div className="hidden lg:block w-80 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl text-white">
          <h3 className="font-extrabold text-lg text-teal-300">EEC Global Directory</h3>
          <p className="text-xs text-slate-300 mt-1 font-semibold">Our community is spread across 20+ countries and top technological hubs.</p>
          
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl">
              <span className="text-2xl">🌍</span>
              <div>
                <h4 className="font-bold text-sm">Worldwide Members</h4>
                <p className="text-[10px] text-slate-350">12,500+ Registered Alumni</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl">
              <span className="text-2xl">💼</span>
              <div>
                <h4 className="font-bold text-sm">Industry Referrals</h4>
                <p className="text-[10px] text-slate-350">Direct links to Top Tech & Engineering firms</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;