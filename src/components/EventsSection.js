import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // use Link if you have a route for /events
import supabase from '../supabaseClient';

const EventsSection = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log('Fetching events for section from Supabase...');
      let { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error.message);
      } else {
        console.log('Fetched events for section:', eventsData);
        setEvents(eventsData);
      }
    };

    fetchEvents();
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
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
    </section>
  );
};

export default EventsSection;
