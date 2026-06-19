import React from 'react';

const Gallery = () => {
  const images = [
    'https://d23qowwaqkh3fj.cloudfront.net/wp-content/uploads/2022/03/Economic-Scholarships-for-International-Students-at-SRM-Institute-of-Science-and-Technology-India-e1646799112358.jpg',  // Placeholder images; replace with actual URLs
    'https://media.istockphoto.com/id/916430298/photo/multi-ethnic-college-students-discussing-project-together.jpg?s=1024x1024&w=is&k=20&c=0It4wrNwIcy_HmwAX63X_ncYDB9xfJsfCuqsyifGHfg=',
    'https://images.unsplash.com/photo-1620989983305-be972a0e290e?q=80&w=2453&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1648183185045-7a5592e66e9c?q=80&w=2488&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://plus.unsplash.com/premium_photo-1723489348868-aa41e1ecac89?q=80&w=2878&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://images.unsplash.com/photo-1551731409-43eb3e517a1a?q=80&w=2944&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  return (
    <section className="py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md">
              <img loading="lazy" src={image} alt={`Gallery ${index}`} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
