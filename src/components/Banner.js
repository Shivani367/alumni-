import React from 'react';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div 
      className="relative h-96 w-full bg-cover bg-center" 
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2626&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}
    >
      {/* Light black overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      {/* Content inside the banner */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
          Top cities where our alumni live
        </h1>
        {/* Transparent Button */}
        <Link 
          to="/alumini-maps" 
          className="mt-4 inline-block px-6 py-3 border border-white text-white font-semibold rounded-md 
                     bg-transparent hover:bg-white hover:text-black transition-colors duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="View Alumni Map"
        >
          View Alumni Map
        </Link>
      </div>
    </div>
  );
};

export default Banner;