import React, { useState, useEffect } from 'react';
import { getSession } from '../../services/authService';
import { listContent, saveContent, deleteContent } from '../../services/contentService';

const JobOpenings = () => {
  const [jobs, setJobs] = useState([]); // Store all job openings for the current user
  const [title, setTitle] = useState(''); // New job title
  const [postedDate, setPostedDate] = useState(''); // New job posted date
  const [location, setLocation] = useState(''); // New job location
  const [description, setDescription] = useState(''); // New job description
  const [editJobId, setEditJobId] = useState(null); // Job being edited
  const [userEmail, setUserEmail] = useState(''); // Store logged-in user's email

  useEffect(() => {
    fetchUserEmail();
    fetchJobs();
  }, [userEmail]);

  // Fetch the logged-in user's email
  const fetchUserEmail = async () => {
    try {
      const session = await getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
    }
  };

  // Fetch all job openings for the current user
  const fetchJobs = async () => {
    if (!userEmail) return;
    try {
      const data = await listContent('job_openings', userEmail);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching job openings:', error);
    }
  };

  // Create a new job opening with the user's email_id
  const handleCreateJob = async () => {
    try {
      await saveContent('job_openings', { title, postedDate, location, description, email_id: userEmail });
      setTitle('');
      setPostedDate('');
      setLocation('');
      setDescription('');
      fetchJobs();
    } catch (error) {
      console.error('Error creating job opening:', error);
    }
  };

  // Edit an existing job opening
  const handleEditJob = async () => {
    try {
      await saveContent('job_openings', { title, postedDate, location, description, email_id: userEmail }, editJobId);
      setTitle('');
      setPostedDate('');
      setLocation('');
      setDescription('');
      setEditJobId(null);
      fetchJobs();
    } catch (error) {
      console.error('Error updating job opening:', error);
    }
  };

  // Delete a job opening
  const handleDeleteJob = async (id) => {
    try {
      await deleteContent('job_openings', id);
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job opening:', error);
    }
  };

  // Load job for editing
  const handleLoadJob = (job) => {
    setTitle(job.title);
    setPostedDate(new Date(job.postedDate).toISOString().split('T')[0]); // Convert date to YYYY-MM-DD
    setLocation(job.location);
    setDescription(job.description);
    setEditJobId(job.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-800">Manage Job Openings</h1>
      </div>
  
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 text-slate-700">
          {editJobId ? 'Edit Job Posting' : 'Post a New Job Opportunity'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Job Title (e.g. Software Engineer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
          />
          <input
            type="date"
            value={postedDate}
            onChange={(e) => setPostedDate(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
          />
        </div>
        <input
          type="text"
          placeholder="Location (e.g. Chennai, India / Remote)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-4 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
        />
        <textarea
          placeholder="Job Description, requirements, and how to apply..."
          value={description}
          rows="4"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
        />
        <button
          onClick={editJobId ? handleEditJob : handleCreateJob}
          className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 active:scale-[0.98] transition duration-200 shadow-sm"
        >
          {editJobId ? 'Update Posting' : 'Publish Job Opportunity'}
        </button>
      </div>
  
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800">Your Posted Jobs</h2>
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{job.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mt-3 space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(job.postedDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-3 mb-6 line-clamp-3">{job.description}</p>
                </div>
                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleLoadJob(job)}
                    className="flex-1 py-2 px-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-semibold hover:bg-amber-100 transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="flex-1 py-2 px-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold hover:bg-red-100 transition duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <p className="text-slate-400">No job postings found. Post one above!</p>
          </div>
        )}
      </div>
    </div>
  );  
};

export default JobOpenings;
