import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
      } else {
        setNotifications(data); // Set initial notifications
      }
    };

    fetchNotifications();

    // Set up a real-time subscription in Supabase v2.x
    const channel = supabase
      .channel('public:notifications')  // Create a real-time channel
      .on(
        'postgres_changes',  // Listening for PostgreSQL changes
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        (payload) => {
          setNotifications((prevNotifications) => [payload.new, ...prevNotifications]);
        }
      )
      .subscribe();

    // Cleanup the subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-8 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">Notifications</h1>
  
      {notifications.length > 0 ? (
        <div className="space-y-6">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-6 border border-gray-200 rounded-xl shadow-lg bg-white"
            >
              <h2 className="text-xl font-semibold text-gray-800">{notification.title}</h2>
              <p className="text-gray-600 mt-2">{notification.message}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(notification.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No notifications found.</p>
      )}
    </div>
  );
  
};

export default Notifications;
