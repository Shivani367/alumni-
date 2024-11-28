import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import ResumeUpload from './pages/ResumeUpload';
import LandingPage from './pages/LandingPage';
import BlogPage from './pages/BlogPage';
import Footer from './components/Footer';
import Header from './components/Header';
import OpeningsPage from './pages/OpeningsPage';
import EventsPage from './pages/EventsPage';
import AlumniMap from './pages/AlumniMap';
import ATSTracker from './pages/ATSTracker';
import SingleBlogPage from './pages/SingleBlogPage';
import SingleEventPage from './pages/SingleEventPage';
import SingleOpeningsPage from './pages/SingleOpeningsPage';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import UpdatePassword from './components/UpdatePassword';
import CheckSupabaseMethod from './CheckSupabaseMethod'; // Adjust the path as needed

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
      {/* <CheckSupabaseMethod /> */}
      <Header/>
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/alumini-maps" element={<AlumniMap />} />
            <Route path="/upload-resume" element={<ResumeUpload />} />
            <Route path="/blog" element={<BlogPage/>} />
            <Route path="/openings" element={<OpeningsPage/>} />
            <Route path="/events" element={<EventsPage/>} />
            <Route path="/ats-tracker" element={<ATSTracker/>} />
            <Route path="/blog/:id" element={<SingleBlogPage />} />
            <Route path="/event/:id" element={<SingleEventPage />} />
            <Route path="/openings/:id" element={<SingleOpeningsPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;