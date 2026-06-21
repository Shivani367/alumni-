import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';
import { authMode } from '../../services/authService';
import { listContent } from '../../services/contentService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await listContent('notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();

    let channel;
    if (authMode === 'supabase') {
      // Set up a real-time subscription in Supabase v2.x
      channel = supabase
        .channel('public:notifications')  // Create a real-time channel
        .on(
          'postgres_changes',  // Listening for PostgreSQL changes
          { event: 'INSERT', schema: 'public', table: 'notifications' },
          (payload) => {
            setNotifications((prevNotifications) => [payload.new, ...prevNotifications]);
          }
        )
        .subscribe();
    }

    // Cleanup the subscription when the component unmounts
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-800">Notifications</h1>
      </div>
  
      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-6 border border-slate-200 rounded-2xl shadow-sm bg-white hover:shadow-md transition-shadow duration-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                  <h2 className="text-lg font-bold text-slate-800">{notification.title}</h2>
                </div>
                <p className="text-slate-600 text-sm">{notification.message}</p>
              </div>
              <div className="text-xs text-slate-400 font-semibold whitespace-nowrap bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                {new Date(notification.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-400">No new notifications.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
