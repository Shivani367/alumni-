import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import supabase from '../supabaseClient';

const OpeningsSection = () => {
  const [jobOpenings, setJobOpenings] = useState([]);

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
      }
    };

    fetchJobOpenings();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Job Openings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobOpenings.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-500 text-sm">{job.location}</p>
              <p className="text-gray-500 text-sm">{new Date(job.postedDate).toLocaleDateString()}</p>
              <p className="mt-4 text-gray-700">{job.description}</p>
              <Link to={`/openings/${job.id}`} className="text-blue-600 hover:underline mt-4 block">
                Learn more
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OpeningsSection;
