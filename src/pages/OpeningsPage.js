import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { Link } from 'react-router-dom';

const OpeningsPage = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);

  useEffect(() => {
    const fetchJobOpenings = async () => {
      console.log('Fetching job openings from Supabase...');
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .order('postedDate', { ascending: false });

      if (error) {
        console.error('Error fetching job openings:', error.message);
      } else {
        setJobOpenings(data);
        setFilteredJobs(data); // Initially set filtered jobs to all openings
      }
    };

    fetchJobOpenings();
  }, []);

  // Update filtered jobs based on search term
  useEffect(() => {
    const results = jobOpenings.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchTerm, jobOpenings]);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Current Job Openings</h1>
      
      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          className="border rounded-lg p-2 w-full max-w-md"
          placeholder="Search by title or location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Job Openings List */}
      <div className="space-y-8">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-500 text-sm">
              {job.location} &bull; {new Date(job.postedDate).toLocaleDateString()}
            </p>
            <p className="mt-4 text-gray-700">{job.description}</p>
            <Link to={`/openings/${job.id}`} className="text-blue-600 hover:underline mt-4 block">
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredJobs.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No job openings found for your search.</p>
      )}
    </div>
  );
};

export default OpeningsPage;
