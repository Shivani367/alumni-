import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';
import UserList from './UserList';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const [user, setUser] = useState(null);
  const [isChatEmpty, setIsChatEmpty] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const fetchMessages = async () => {
    if (!user?.id || !receiverId) return;

    try {
      const { data: sentMessages, error: sentError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', user.id)
        .eq('receiver_id', receiverId)
        .order('created_at', { ascending: true });

      if (sentError) throw sentError;

      const { data: receivedMessages, error: receivedError } = await supabase
        .from('messages')
        .select('*')
        .eq('sender_id', receiverId)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: true });

      if (receivedError) throw receivedError;

      const allMessages = [...sentMessages, ...receivedMessages].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      setMessages(allMessages);
      setIsChatEmpty(allMessages.length === 0);

      // Mark received messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', receiverId)
        .eq('receiver_id', user.id)
        .eq('is_read', false); // Only update unread messages
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [user?.id, receiverId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user || !user.id || !receiverId) return;

    const { error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: user.id,
          receiver_id: receiverId,
          content: newMessage,
          is_read: false, // Ensure new messages are unread by default
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
    fetchMessages(); // Refresh messages after sending a new one
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <UserList setReceiverId={setReceiverId} currentUser={user} />
      <div className="flex flex-col flex-grow">
        {receiverId ? (
          <>
            <div className="flex-grow p-4 overflow-y-auto bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Chat</h3>
              <div className="space-y-2">
                {isChatEmpty ? (
                  <p className="text-gray-500 text-center">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_id === user.id
                          ? 'justify-end'
                          : 'justify-start'
                      }`}
                    >
                      <div
                        className={`${
                          msg.sender_id === user.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-white'
                        } p-2 rounded-lg max-w-xs`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="p-4 bg-gray-800 border-t border-gray-700 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-grow p-2 rounded-lg bg-gray-700 text-white mr-4 focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-grow text-gray-400">
            <p>Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
