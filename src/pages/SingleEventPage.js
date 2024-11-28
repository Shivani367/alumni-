import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

const SingleEventPage = () => {
  const { id } = useParams(); // Get event ID from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single(); // Fetch the event based on ID

      if (error) {
        console.error('Error fetching event:', error.message);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!event) return <p className="text-center">Event not found.</p>;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {new Date(event.date).toLocaleDateString()} - {event.location}
        </p>
        <div className="text-gray-800 text-lg leading-relaxed">
          <p>{event.description}</p>
        </div>
      </div>
    </section>
  );
};

export default SingleEventPage;
