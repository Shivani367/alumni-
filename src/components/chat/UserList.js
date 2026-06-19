import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

function UserList({ setReceiverId, currentUser }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersWithUnreadCount = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, name');

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      // Filter out the current user
      const filteredUsers = data.filter((user) => user.id !== currentUser?.id);

      // Fetch unread message count for each user
      const usersWithUnreadCount = await Promise.all(
        filteredUsers.map(async (user) => {
          const { count, error: unreadError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('sender_id', user.id)
            .eq('receiver_id', currentUser.id)
            .eq('is_read', false);

          if (unreadError) {
            console.error(`Error fetching unread count for user ${user.id}:`, unreadError);
          }

          return {
            ...user,
            unread_count: count || 0, // Default to 0 if there's an error or no unread messages
          };
        })
      );

      setUsers(usersWithUnreadCount);
    };

    fetchUsersWithUnreadCount();
  }, [currentUser]);

  return (
    <div className="w-1/4 bg-gray-800 border-r border-gray-700 flex flex-col">
      <h3 className="text-lg font-semibold p-4">Users</h3>
      <div className="flex-grow overflow-y-auto p-4 space-y-2">
        {users.map((user) => (
          <button
            key={user.id}
            onClick={() => setReceiverId(user.id)}
            className="w-full text-left p-2 rounded-lg bg-gray-700 hover:bg-gray-600 relative flex items-center"
          >
            {user.name}
            {user.unread_count > 0 && (
              <span
                className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
                style={{ marginLeft: 'auto' }}
              >
                {user.unread_count}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UserList;
