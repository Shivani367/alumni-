import React, { useState, useEffect } from 'react';
import { getSession } from '../../services/authService';
import { listContent, saveContent, deleteContent } from '../../services/contentService';

const Events = () => {
  const [events, setEvents] = useState([]); // Store all events for the current user
  const [title, setTitle] = useState(''); // New event title
  const [date, setDate] = useState(''); // New event date
  const [location, setLocation] = useState(''); // New event location
  const [description, setDescription] = useState(''); // New event description
  const [editEventId, setEditEventId] = useState(null); // Event being edited
  const [userEmail, setUserEmail] = useState(''); // Store logged-in user's email

  useEffect(() => {
    fetchUserEmail();
    fetchEvents();
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

  // Fetch all events for the current user
  const fetchEvents = async () => {
    if (!userEmail) return;
    try {
      const data = await listContent('events', userEmail);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Create a new event with the user's email_id
  const handleCreateEvent = async () => {
    try {
      await saveContent('events', { title, date, location, description, email_id: userEmail });
      setTitle('');
      setDate('');
      setLocation('');
      setDescription('');
      fetchEvents();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  // Edit an existing event
  const handleEditEvent = async () => {
    try {
      await saveContent('events', { title, date, location, description, email_id: userEmail }, editEventId);
      setTitle('');
      setDate('');
      setLocation('');
      setDescription('');
      setEditEventId(null);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  // Delete an event
  const handleDeleteEvent = async (id) => {
    try {
      await deleteContent('events', id);
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Load event for editing
  const handleLoadEvent = (event) => {
    setTitle(event.title);
    setDate(event.date);
    setLocation(event.location);
    setDescription(event.description);
    setEditEventId(event.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-800">Manage Events</h1>
      </div>
  
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 text-slate-700">
          {editEventId ? 'Edit Event Details' : 'Host a New Event'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
          />
        </div>
        <input
          type="text"
          placeholder="Venue / Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full mb-4 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
        />
        <textarea
          placeholder="Detailed Description"
          value={description}
          rows="4"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-4 p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
        />
        <button
          onClick={editEventId ? handleEditEvent : handleCreateEvent}
          className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 active:scale-[0.98] transition duration-200 shadow-sm"
        >
          {editEventId ? 'Update Event' : 'Create Event'}
        </button>
      </div>
  
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800">Your Scheduled Events</h2>
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{event.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mt-3 space-x-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-3 mb-6 line-clamp-3">{event.description}</p>
                </div>
                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleLoadEvent(event)}
                    className="flex-1 py-2 px-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-semibold hover:bg-amber-100 transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
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
            <p className="text-slate-400">No scheduled events found. Set up one above!</p>
          </div>
        )}
      </div>
    </div>
  );  
};

export default Events;
