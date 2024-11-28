import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { Link } from 'react-router-dom'; 

const EventsPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Fetching events from Supabase...');
      let { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        console.log('Fetched events:', eventsData);
        setEvents(eventsData);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Upcoming Events</h1>
      <div className="space-y-8">
        {events.map((event, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
            <p className="text-gray-500">{event.location}</p>
            <p className="mt-4 text-gray-700">{event.description}</p>
            <Link to={`/event/${event.id}`} className="text-blue-600 hover:underline mt-4 block">
  Learn more
</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
