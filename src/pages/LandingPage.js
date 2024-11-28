import React from 'react';
import AlumniStories from '../components/AlumniStories';
import Banner from '../components/Banner';
import BlogSection from '../components/BlogSection';
import Gallery from '../components/Gallery';
import OpeningsSection from '../components/OpeningsSection';
import EventsSection from '../components/EventsSection';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />

      {/* Alumni statistics section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <AlumniStories />
        </div>
      </section>

        {/* Blog Section */}
        <BlogSection />

        {/* Gallery Section */}
      <Gallery />

      {/* Job Openings Section */}
      <OpeningsSection />

            {/* Events Section */}
            <EventsSection />


    </div>
  );
};

export default LandingPage;