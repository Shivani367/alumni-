// src/components/AlumniStories.js
import React from 'react';

const AlumniStories = () => {
  const alumniData = [
    {
      name: 'John Doe',
      location: 'New York, USA',
      year: '2015',
      company: 'Google',
      role: 'Senior Software Engineer',
      story: 'After graduating from Easwari Engineering College, I joined Google. The strong foundations in algorithms and project work at EEC prepared me well for corporate engineering challenges.',
      avatarBg: 'bg-indigo-100 text-indigo-800'
    },
    {
      name: 'Jane Smith',
      location: 'London, UK',
      year: '2017',
      company: 'Arup Group',
      role: 'Project Architect',
      story: 'I pursued a career in structural systems and sustainability. EEC gave me excellent laboratory exposure and faculty mentoring that set my research foundations early on.',
      avatarBg: 'bg-emerald-100 text-emerald-800'
    },
    {
      name: 'Arun Kumar',
      location: 'Chennai, India',
      year: '2016',
      company: 'LaunchPad Tech',
      role: 'Founder & CEO',
      story: 'Being part of EEC’s entrepreneurship cell gave me the confidence to launch my startup. Today, we employ 40+ people in Chennai, and I regularly hire talent directly from campus.',
      avatarBg: 'bg-amber-100 text-amber-800'
    },
    {
      name: 'Emily Johnson',
      location: 'Sydney, Australia',
      year: '2014',
      company: 'Atlassian',
      role: 'Lead Data Scientist',
      story: 'My enthusiasm for data modeling started in my final year project. The hands-on computing labs and professional societies at college played a central role in my career direction.',
      avatarBg: 'bg-rose-100 text-rose-800'
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12 font-sans">
      <div className="text-center mb-12">
        <span className="text-teal-600 text-xs font-extrabold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mt-3">Alumni Success Stories</h2>
        <p className="mt-2 text-slate-500 font-medium max-w-lg mx-auto">Hear how our alumni carved their paths in international hubs and top tech organizations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {alumniData.map((alumni, index) => (
          <div key={index} className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-shadow duration-200">
            {/* Initial Avatar */}
            <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center font-black text-xl shadow-inner border border-slate-100 ${alumni.avatarBg}`}>
              {alumni.name.charAt(0)}
            </div>

            {/* Profile Info & Testimonial */}
            <div className="space-y-3 flex-grow">
              <div>
                <h3 className="text-lg font-bold text-slate-800">{alumni.name}</h3>
                <p className="text-xs font-semibold text-teal-650">{alumni.role} at {alumni.company}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{alumni.location} &bull; Class of {alumni.year}</p>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed italic">
                "{alumni.story}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniStories;
