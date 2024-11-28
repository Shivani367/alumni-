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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      {/* Sidebar */}
      <aside style={{
        width: '20%',
        backgroundColor: '#00695c',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '2rem', padding: '24px', fontWeight: 'bold' }}>Dashboard</h1>

        <nav style={{ flex: 1, padding: '24px' }}>
          <ul style={{ padding: 0, listStyleType: 'none' }}>
            {['blogs', 'events', 'jobOpenings', 'notifications', 'messaging'].map((item) => (
              <li key={item} style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => setSelectedComponent(item)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px',
                    fontSize: '1.1rem',
                    color: selectedComponent === item ? '#80cbc4' : '#cfd8dc',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                    borderRadius: '5px',
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#004d40'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1).replace('jobOpenings', 'Job Openings').replace('messaging', 'Chat Now')}
                </button>
              </li>
            ))}
            <li style={{ marginTop: 'auto', marginBottom: '16px' }}>
              <button
                onClick={handleLogout}
                style={{
                  color: '#cfd8dc',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Log Out
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{
        width: '80%',
        padding: '40px',
        backgroundColor: '#ffffff',
        borderRadius: '12px 0 0 12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '32px',
          color: '#333',
          fontFamily: 'Roboto, sans-serif'
        }}>
          Welcome, {tables[0]?.name}
        </h2>
        
        {/* Render selected component based on the selected option */}
        {selectedComponent === 'blogs' && <Blogs />}
        {selectedComponent === 'events' && <Events />}
        {selectedComponent === 'jobOpenings' && <JobOpenings />}
        {selectedComponent === 'notifications' && <Notifications />}
        {selectedComponent === 'messaging' && <Chat />}
      </main>
    </div>
  );
};

export default Dashboard;
