// src/components/chat/Chat.js
import React, { useEffect, useState, useRef } from 'react';
import { getSession } from '../../services/authService';
import UserList from './UserList';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const TOKEN_KEY = 'alumni-connect-token';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const [receiverProfile, setReceiverProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [isChatEmpty, setIsChatEmpty] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, []);

  // Fetch receiver profile when receiverId changes
  useEffect(() => {
    const fetchReceiverProfile = async () => {
      if (!receiverId) return;
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return;

      try {
        // Fetch user from /api/users to find receiver info
        const response = await fetch(`${API_URL}/api/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const usersList = await response.json();
          const found = usersList.find(u => u.id === receiverId);
          if (found) {
            setReceiverProfile({ id: found.id, name: found.name, status: found.status });
          }
        }
      } catch (err) {
        console.error('Error fetching receiver profile:', err);
      }
    };
    fetchReceiverProfile();
  }, [receiverId]);

  const fetchMessages = async () => {
    if (!user?.id || !receiverId) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/messages?receiverId=${receiverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setIsChatEmpty(data.length === 0);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!user?.id || !receiverId) return;

    // Poll for new messages every 3 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => clearInterval(interval);
  }, [user?.id, receiverId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user || !user.id || !receiverId) return;
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    const messageContent = newMessage;
    setNewMessage(''); // optimistic UI: clear immediately

    try {
      const response = await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId,
          content: messageContent
        })
      });

      if (response.ok) {
        const sentMsg = await response.json();
        setMessages((prev) => [...prev, sentMsg]);
        setIsChatEmpty(false);
      } else {
        // Revert message back to input if sending failed
        setNewMessage(messageContent);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setNewMessage(messageContent);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-170px)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <UserList setReceiverId={setReceiverId} currentUser={user} selectedReceiverId={receiverId} />
      
      <div className="flex flex-col flex-grow bg-slate-50">
        {receiverId ? (
          <>
            {/* Header info */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center shadow-sm z-10">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold mr-3 shadow-inner">
                {receiverProfile?.name ? receiverProfile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{receiverProfile?.name || 'Loading user...'}</h3>
                <p className="text-xs text-slate-400 font-semibold">{receiverProfile?.status || 'Member'}</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow p-6 overflow-y-auto space-y-4">
              {isChatEmpty ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <svg className="w-12 h-12 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="font-semibold text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelf = msg.sender_id === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs md:max-w-md p-4 rounded-2xl shadow-sm ${
                        isSelf
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                      }`}>
                        <p className="text-[15px] leading-relaxed break-words">{msg.content}</p>
                        <p className={`text-[10px] font-semibold mt-1 text-right ${
                          isSelf ? 'text-teal-200' : 'text-slate-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="Type a message..."
                className="flex-grow p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 transition duration-150"
              />
              <button
                onClick={handleSendMessage}
                className="bg-teal-600 hover:bg-teal-700 active:scale-[0.97] text-white p-3 rounded-xl shadow-sm hover:shadow transition duration-150 flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow text-slate-400 space-y-3 bg-slate-50">
            <svg className="w-16 h-16 text-slate-350" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-semibold text-sm">Select a user from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
