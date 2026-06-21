import React, { useEffect, useState, useRef } from 'react';
import supabase from '../../supabaseClient';
import { getSession, authMode } from '../../services/authService';
import UserList from './UserList';

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
      if (authMode === 'supabase') {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', receiverId)
          .single();
        
        if (!error) {
          setReceiverProfile(data);
        }
      } else {
        const accounts = JSON.parse(localStorage.getItem('alumni-connect-accounts') || '[]');
        const acc = accounts.find((a) => a.id === receiverId);
        if (acc) {
          setReceiverProfile({ id: acc.id, name: acc.profile?.name, status: acc.profile?.status });
        }
      }
    };
    fetchReceiverProfile();
  }, [receiverId]);

  const fetchMessages = async () => {
    if (!user?.id || !receiverId) return;

    if (authMode === 'supabase') {
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
          .eq('is_read', false);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    } else {
      const allLocalMessages = JSON.parse(localStorage.getItem('alumni-connect-messages') || '[]');
      const filtered = allLocalMessages.filter(
        (m) =>
          (m.sender_id === user.id && m.receiver_id === receiverId) ||
          (m.sender_id === receiverId && m.receiver_id === user.id)
      );

      setMessages(filtered);
      setIsChatEmpty(filtered.length === 0);

      // Local mark as read
      let updated = false;
      const updatedMessages = allLocalMessages.map((m) => {
        if (m.sender_id === receiverId && m.receiver_id === user.id && !m.is_read) {
          updated = true;
          return { ...m, is_read: true };
        }
        return m;
      });
      if (updated) {
        localStorage.setItem('alumni-connect-messages', JSON.stringify(updatedMessages));
        window.dispatchEvent(new Event('storage'));
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    if (!user?.id || !receiverId) return;

    if (authMode === 'supabase') {
      // Real-time subscription to the messages table
      const channel = supabase
        .channel(`public:messages:${user.id}:${receiverId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            const newMsg = payload.new;
            // Check if message is between these two users
            if (
              (newMsg.sender_id === user.id && newMsg.receiver_id === receiverId) ||
              (newMsg.sender_id === receiverId && newMsg.receiver_id === user.id)
            ) {
              setMessages((prev) => {
                // Avoid duplicates
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              setIsChatEmpty(false);

              // If we received a message from the active chat, mark it as read immediately
              if (newMsg.sender_id === receiverId) {
                supabase
                  .from('messages')
                  .update({ is_read: true })
                  .eq('id', newMsg.id)
                  .then();
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      const handleStorageChange = () => {
        fetchMessages();
      };
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [user?.id, receiverId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !user || !user.id || !receiverId) return;

    const messageContent = newMessage;
    setNewMessage(''); // optimistic UI: clear immediately

    if (authMode === 'supabase') {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: user.id,
            receiver_id: receiverId,
            content: messageContent,
            is_read: false,
          },
        ]);

      if (error) {
        console.error('Error sending message:', error);
        // Revert if error
        setNewMessage(messageContent);
        return;
      }
    } else {
      const allLocalMessages = JSON.parse(localStorage.getItem('alumni-connect-messages') || '[]');
      const newMsg = {
        id: crypto.randomUUID(),
        sender_id: user.id,
        receiver_id: receiverId,
        content: messageContent,
        is_read: false,
        created_at: new Date().toISOString(),
      };
      allLocalMessages.push(newMsg);
      localStorage.setItem('alumni-connect-messages', JSON.stringify(allLocalMessages));
      setMessages((prev) => [...prev, newMsg]);
      setIsChatEmpty(false);
      window.dispatchEvent(new Event('storage'));
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
