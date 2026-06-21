// src/pages/EventsPage.js
import React, { useEffect, useState } from 'react';
import { listContent } from '../services/contentService';
import { Link } from 'react-router-dom'; 

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await listContent('events');
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">Upcoming Events</h1>
          <p className="mt-3 text-lg text-slate-600">Stay connected and participate in our upcoming workshops, reunions, and seminars</p>
          <div className="w-16 h-1 bg-teal-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200/80 overflow-hidden flex flex-col justify-between transition-shadow duration-300">
                <div className="p-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 mb-4">
                    Community Event
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 hover:text-teal-700 transition duration-155 line-clamp-1">
                    {event.title}
                  </h2>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-slate-500 text-sm">
                      <svg className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <svg className="w-4 h-4 mr-2 text-teal-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium truncate">{event.location}</span>
                    </div>
                  </div>

                  <p className="mt-4 text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                  <span className="text-xs text-slate-450 font-medium truncate max-w-[130px]">By {event.email_id || 'Organizer'}</span>
                  <Link to={`/event/${event.id}`} className="inline-flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline">
                    View details
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <p className="text-slate-400 font-medium">No upcoming events scheduled right now.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
