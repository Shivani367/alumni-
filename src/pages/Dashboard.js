import React, { useEffect, useState } from 'react';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Blogs from '../components/dashboard/blog';
import Events from '../components/dashboard/events';
import JobOpenings from '../components/dashboard/jobOpenings';
import Notifications from '../components/dashboard/notifications';
import Chat from '../components/chat/Chat';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState('notifications');
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error fetching session:', error);
        return;
      }

      if (session?.user) {
        setUser(session.user);
      } else {
        navigate('/');
      }
    };

    checkUser();
  }, [navigate]);

  useEffect(() => {
    const fetchTables = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id);

        if (error) {
          console.error('Error fetching data:', error);
        } else {
          setTables(data);
        }
      }
    };

    fetchTables();
  }, [user]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      navigate('/');
    }
  };

  const getTabLabel = (item) => {
    switch (item) {
      case 'jobOpenings': return 'Job Openings';
      case 'messaging': return 'Messages';
      default: return item.charAt(0).toUpperCase() + item.slice(1);
    }
  };

  const getTabIcon = (item) => {
    switch (item) {
      case 'blogs':
        return (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 012 2v8a2 2 0 01-2 2h-3m-6 0a1 1 0 001-1V7a1 1 0 00-1-1H3M9 9h6m-6 4h6m-6 4h5" />
          </svg>
        );
      case 'events':
        return (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'jobOpenings':
        return (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'notifications':
        return (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        );
      case 'messaging':
        return (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#004d40] text-white flex flex-col shadow-xl z-10">
        <div className="p-6 border-b border-teal-800">
          <h1 className="text-2xl font-bold tracking-wide">EEC Portal</h1>
          <p className="text-xs text-teal-300 mt-1">Alumni Connect Dashboard</p>
        </div>

        <nav className="flex-grow p-4 mt-4">
          <ul className="space-y-2">
            {['notifications', 'messaging', 'blogs', 'events', 'jobOpenings'].map((item) => {
              const isActive = selectedComponent === item;
              return (
                <li key={item}>
                  <button
                    onClick={() => setSelectedComponent(item)}
                    className={`w-full flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-teal-700 text-white shadow-md'
                        : 'text-teal-100 hover:bg-teal-800/60 hover:text-white'
                    }`}
                  >
                    {getTabIcon(item)}
                    {getTabLabel(item)}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-teal-850">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-semibold text-teal-200 hover:text-white hover:bg-teal-800/40 rounded-xl transition duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <h2 className="text-xl font-bold text-slate-800">
            Welcome back, {tables[0]?.name || 'User'}
          </h2>
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
              {tables[0]?.status || 'Member'}
            </span>
          </div>
        </header>

        {/* Dynamic component content pane */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {selectedComponent === 'blogs' && <Blogs />}
            {selectedComponent === 'events' && <Events />}
            {selectedComponent === 'jobOpenings' && <JobOpenings />}
            {selectedComponent === 'notifications' && <Notifications />}
            {selectedComponent === 'messaging' && <Chat />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
