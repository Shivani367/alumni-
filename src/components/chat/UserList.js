// src/components/chat/UserList.js
import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || (window.location.port === '3000' ? 'http://localhost:5000' : '');
const TOKEN_KEY = 'alumni-connect-token';

function UserList({ setReceiverId, currentUser, selectedReceiverId }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsersWithUnreadCount = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token || !currentUser) return;

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersWithUnreadCount();

    // Instant update when unread notifications are pushed via WebSockets
    const handleUnreadEvent = (event) => {
      fetchUsersWithUnreadCount();
    };

    window.addEventListener('alumni-chat-unread', handleUnreadEvent);

    // Relaxed background polling interval for user lists (15s instead of 3s)
    const interval = setInterval(() => {
      fetchUsersWithUnreadCount();
    }, 15000);

    return () => {
      window.removeEventListener('alumni-chat-unread', handleUnreadEvent);
      clearInterval(interval);
    };
  }, [currentUser]);

  const getAvatarColor = (name) => {
    const colors = [
      'bg-red-100 text-red-800 border-red-200',
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-emerald-100 text-emerald-800 border-emerald-200',
      'bg-amber-100 text-amber-850 border-amber-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-rose-100 text-rose-800 border-rose-200',
      'bg-teal-100 text-teal-800 border-teal-200',
    ];
    if (!name) return colors[0];
    const codeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[codeSum % colors.length];
  };

  return (
    <div className="w-1/3 max-w-xs bg-slate-50 border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 bg-white">
        <h3 className="text-lg font-bold text-slate-800">Messages</h3>
        <p className="text-xs text-slate-400 font-semibold mt-1">Connect with Alumni & Students</p>
      </div>
      <div className="flex-grow overflow-y-auto p-3 space-y-1">
        {loading && users.length === 0 ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500"></div>
          </div>
        ) : users.length > 0 ? (
          users.map((user) => {
            const isSelected = selectedReceiverId === user.id;
            const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';
            const colorClass = getAvatarColor(user.name);

            return (
              <button
                key={user.id}
                onClick={() => setReceiverId(user.id)}
                className={`w-full text-left p-3 rounded-xl flex items-center transition-all duration-150 border ${
                  isSelected
                    ? 'bg-teal-55 text-teal-900 border-teal-150 shadow-sm'
                    : 'bg-transparent text-slate-700 border-transparent hover:bg-slate-200/50 hover:text-slate-900'
                }`}
              >
                {/* Avatar Initial */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold mr-3 border shadow-sm ${colorClass}`}>
                  {initials}
                </div>

                {/* User Details */}
                <div className="flex-grow overflow-hidden pr-2">
                  <h4 className="font-bold text-sm truncate">{user.name || user.email}</h4>
                  <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">{user.status || 'Member'}</p>
                </div>

                {/* Unread count badge */}
                {user.unread_count > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                    {user.unread_count}
                  </span>
                )}
              </button>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            No other users found.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserList;
