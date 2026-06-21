// src/components/Gallery.js
import React from 'react';

const Gallery = () => {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
      title: 'Graduation Day Ceremonies'
    },
    {
      url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop',
      title: 'Global Alumni Homecoming'
    },
    {
      url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600&auto=format&fit=crop',
      title: 'Student Hackathon & Innovation'
    },
    {
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop',
      title: 'Mentorship Circles & Seminars'
    },
    {
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=600&auto=format&fit=crop',
      title: 'Professional Networking Summit'
    },
    {
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
      title: 'Entrepreneurship & Startups'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 font-sans border-t border-slate-200">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-12">
          <span className="text-teal-600 text-xs font-extrabold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Gallery</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">Campus & Alumni Life</h2>
          <p className="mt-2 text-slate-500 font-medium max-w-md mx-auto">Capturing the memorable moments, interactive workshops, and achievements of our community</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-3xl shadow-sm border border-slate-200 bg-white aspect-[4/3] cursor-pointer">
              {/* Cover Image */}
              <img 
                loading="lazy" 
                src={image.url} 
                alt={image.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-350" 
              />
              
              {/* Elegant Gradient Info Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <h4 className="font-extrabold text-base tracking-wide">{image.title}</h4>
                  <p className="text-[10px] text-teal-350 font-bold uppercase tracking-wider mt-1">EEC Community</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
