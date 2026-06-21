// src/pages/OpeningsPage.js
import React, { useEffect, useState } from 'react';
import { listContent } from '../services/contentService';
import { Link } from 'react-router-dom';

const OpeningsPage = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobOpenings = async () => {
      try {
        const data = await listContent('job_openings');
        setJobOpenings(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching job openings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobOpenings();
  }, []);

  // Update filtered jobs based on search term
  useEffect(() => {
    const results = jobOpenings.filter(job =>
      (job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (job.location?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    );
    setFilteredJobs(results);
  }, [searchTerm, jobOpenings]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">Job Opportunities</h1>
          <p className="mt-3 text-lg text-slate-600">Exclusive career opportunities shared directly by our alumni community</p>
          <div className="w-16 h-1 bg-teal-600 mx-auto mt-6 rounded-full"></div>
        </div>
        
        {/* Search Input */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-lg shadow-sm rounded-2xl overflow-hidden border border-slate-200">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              className="pl-12 pr-4 py-3.5 w-full bg-white text-slate-700 outline-none text-base focus:ring-2 focus:ring-teal-500 transition duration-150"
              placeholder="Search by title, keywords, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                      Full-time
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {job.location}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 hover:text-teal-700 transition duration-150">
                    {job.title}
                  </h2>
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold">
                    Posted on {new Date(job.postedDate || job.created_at).toLocaleDateString()} &bull; By {job.email_id || 'Alumni Referrer'}
                  </p>
                </div>
                <div className="w-full md:w-auto flex-shrink-0">
                  <Link to={`/openings/${job.id}`} className="w-full md:w-auto text-center inline-block py-3 px-6 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition duration-150 shadow-sm active:scale-[0.98]">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <p className="text-slate-400 font-semibold">No job openings found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpeningsPage;
