import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

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
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching user session:', error);
    } else if (session?.user) {
      setUserEmail(session.user.email); // Set user email from session
    }
  };

  // Fetch all job openings for the current user
  const fetchJobs = async () => {
    if (!userEmail) return; // Don't fetch until userEmail is available
    const { data, error } = await supabase
      .from('job_openings')
      .select('*')
      .eq('email_id', userEmail) // Query only job openings related to the logged-in user's email
      .order('postedDate', { ascending: false });

    if (error) console.error('Error fetching job openings:', error);
    else setJobs(data);
  };

  // Create a new job opening with the user's email_id
  const handleCreateJob = async () => {
    const { error } = await supabase
      .from('job_openings')
      .insert([{ title, postedDate, location, description, email_id: userEmail }]); // Insert job with email_id

    if (error) console.error('Error creating job opening:', error);
    else {
      setTitle('');
      setPostedDate('');
      setLocation('');
      setDescription('');
      fetchJobs(); // Refresh job list
    }
  };

  // Edit an existing job opening
  const handleEditJob = async () => {
    const { error } = await supabase
      .from('job_openings')
      .update({ title, postedDate, location, description })
      .eq('id', editJobId)
      .eq('email_id', userEmail); // Ensure that the logged-in user can only edit their own job opening

    if (error) console.error('Error updating job opening:', error);
    else {
      setTitle('');
      setPostedDate('');
      setLocation('');
      setDescription('');
      setEditJobId(null);
      fetchJobs(); // Refresh job list
    }
  };

  // Delete a job opening
  const handleDeleteJob = async (id) => {
    const { error } = await supabase
      .from('job_openings')
      .delete()
      .eq('id', id)
      .eq('email_id', userEmail); // Ensure that the logged-in user can only delete their own job opening

    if (error) console.error('Error deleting job opening:', error);
    else fetchJobs(); // Refresh job list
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
    <div className="p-8 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">Job Openings</h1>
  
      <div className="bg-white shadow-xl rounded-xl p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          {editJobId ? 'Edit Job' : 'Create Job'}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="date"
          value={postedDate}
          onChange={(e) => setPostedDate(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={editJobId ? handleEditJob : handleCreateJob}
          className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition duration-300 ease-in-out"
        >
          {editJobId ? 'Update Job' : 'Create Job'}
        </button>
      </div>
  
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Your Job Openings</h2>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="mb-6 p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
              <p className="text-gray-600 mt-2">{new Date(job.postedDate).toLocaleDateString()}</p>
              <p className="text-gray-500 mt-1">{job.location}</p>
              <p className="text-gray-500 mt-1 mb-5">{job.description}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLoadJob(job)}
                  className="py-2 px-4 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition duration-300 ease-in-out"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteJob(job.id)}
                  className="py-2 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No job openings found.</p>
        )}
      </div>
    </div>
  );  

};

export default JobOpenings;
