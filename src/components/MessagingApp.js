import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

const MessagingApp = ({ userId, otherUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async (userId, otherUserId) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true });
  
    if (error) console.error('Error fetching messages:', error);
    return data;
  };
  

  const sendMessage = async (senderId, receiverId, content) => {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }]);
  
    if (error) console.error('Error sending message:', error);
    return data;
  };
  

  useEffect(() => {
    // Fetch initial messages when component mounts
    fetchMessages();

    // Subscribe to real-time updates for new messages
    const messageSubscription = supabase
      .from('messages')
      .on('INSERT', (payload) => {
        const newMessage = payload.new;
        if (
          (newMessage.sender_id === userId && newMessage.receiver_id === otherUserId) ||
          (newMessage.sender_id === otherUserId && newMessage.receiver_id === userId)
        ) {
          setMessages((messages) => [...messages, newMessage]);
        }
      })
      .subscribe();

    return () => {
      // Cleanup subscription on component unmount
      supabase.removeSubscription(messageSubscription);
    };
  }, [userId, otherUserId]);

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Chat with {otherUserId}</h1>

      <div className="bg-white p-4 rounded shadow-md max-h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.sender_id === userId ? 'text-right' : 'text-left'}`}>
            <p className="p-2 inline-block rounded bg-blue-500 text-white">
              {msg.content}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleTimeString()}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={sendMessage}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessagingApp;
