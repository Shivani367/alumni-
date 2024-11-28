import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

const SingleOpeningsPage = () => {
  const { id } = useParams(); // Get job ID from URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_openings')
        .select('*')
        .eq('id', id)
        .single(); // Fetch job based on ID

      if (error) {
        console.error('Error fetching job:', error.message);
      } else {
        setJob(data);
      }
      setLoading(false);
    };

    fetchJob();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!job) return <p className="text-center">Job not found.</p>;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {job.location} &bull; {new Date(job.postedDate).toLocaleDateString()}
        </p>
        <div className="text-gray-800 text-lg leading-relaxed">
          <p>{job.description}</p>
        </div>
      </div>
    </section>
  );
};

export default SingleOpeningsPage;
