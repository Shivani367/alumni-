// src/pages/SingleOpeningsPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContent } from '../services/contentService';

const SingleOpeningsPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      try {
        const data = await getContent('job_openings', id);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 bg-slate-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-bold mb-4">Job opening not found.</p>
          <Link to="/openings" className="text-teal-600 font-bold hover:underline">Back to Job Openings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/openings" className="inline-flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 mb-8 hover:underline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all openings
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/80">
          <header className="mb-8 border-b border-slate-100 pb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100">
                Full-time Referral
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                {job.location}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-4">
              {job.title}
            </h1>
            <div className="text-sm text-slate-500 font-medium">
              <span>Posted on {new Date(job.postedDate || job.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="mx-2">&bull;</span>
              <span>Referral by {job.email_id}</span>
            </div>
          </header>

          <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-line space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Job Description & Requirements</h3>
            <p>{job.description}</p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-slate-700">Interested in this opportunity?</p>
              <p className="text-xs text-slate-400 font-semibold">Contact the alumni referrer directly via chat or email.</p>
            </div>
            <Link 
              to={`/dashboard`} 
              className="py-3 px-6 text-center bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition duration-150 shadow-sm active:scale-[0.98]"
            >
              Contact Referrer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOpeningsPage;
