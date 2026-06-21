// src/pages/SingleEventPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContent } from '../services/contentService';

const SingleEventPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const data = await getContent('events', id);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 bg-slate-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-bold mb-4">Event not found.</p>
          <Link to="/events" className="text-teal-600 font-bold hover:underline">Back to Events</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/events" className="inline-flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 mb-8 hover:underline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all events
        </Link>

        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/80">
          <header className="mb-8 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100 mb-4">
              Community Gathering
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-4">
              {event.title}
            </h1>
            <div className="flex items-center space-x-3 text-sm text-slate-500 font-medium">
              <span>Organized by {event.email_id}</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-200/60">
            <div className="flex items-center space-x-3 text-slate-700">
              <svg className="w-6 h-6 text-teal-650 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Date & Time</p>
                <p className="font-semibold text-sm">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-slate-700">
              <svg className="w-6 h-6 text-teal-650 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Location / Venue</p>
                <p className="font-semibold text-sm">{event.location}</p>
              </div>
            </div>
          </div>

          <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-line space-y-6">
            <h3 className="text-xl font-bold text-slate-800">Event Description</h3>
            <p>{event.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEventPage;
