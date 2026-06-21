// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Info */}
          <div className="space-y-4">
            <h3 className="text-white font-extrabold text-lg tracking-wide">EEC Alumni Connect</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering alumni and student networking across batches, departments, and continents.
            </p>
          </div>
          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-sm">
              <Link to="/blog" className="hover:text-teal-400 transition-colors">Alumni Blog</Link>
              <Link to="/events" className="hover:text-teal-400 transition-colors">Upcoming Events</Link>
              <Link to="/openings" className="hover:text-teal-400 transition-colors">Job Referral Board</Link>
              <Link to="/ats-tracker" className="hover:text-teal-400 transition-colors">ATS Resume Checker</Link>
            </div>
          </div>
          {/* Column 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Contact & Support</h4>
            <p className="text-sm text-slate-400">
              Easwari Engineering College<br />
              Bharathi Salai, Ramapuram,<br />
              Chennai, Tamil Nadu 600089
            </p>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500 font-semibold flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Easwari Engineering College Alumni Association. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="https://srmeaswari.ac.in/" target="_blank" rel="noopener noreferrer" className="hover:underline">Official Site</a>
            <span>&bull;</span>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;