import React from 'react';

const AlumniStories = () => {
  const alumniData = [
    {
      name: 'John Doe',
      location: 'New York, USA',
      year: '2015',
      story: 'After graduating from Easwari Engineering College, I joined Google as a software engineer. It’s been an amazing journey full of learning and growth!',
    },
    {
      name: 'Jane Smith',
      location: 'London, UK',
      year: '2017',
      story: 'I pursued a career in civil engineering and now work on sustainable architecture projects. I am forever grateful to my time at Easwari for shaping my skills!',
    },
    {
      name: 'Arun Kumar',
      location: 'Chennai, India',
      year: '2016',
      story: 'Being part of Easwari’s alumni helped me connect with industry leaders. Today, I run my own tech startup in Chennai, and I love giving back to the community.',
    },
    {
      name: 'Emily Johnson',
      location: 'Sydney, Australia',
      year: '2014',
      story: 'I work as a data scientist now, but the foundation for my love for data was laid back at Easwari Engineering College. It was the best start to my career!',
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Alumni Stories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alumniData.map((alumni, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">{alumni.name}</h3>
            <p className="text-gray-500">{alumni.location} &bull; Class of {alumni.year}</p>
            <p className="mt-4 text-gray-700">{alumni.story}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniStories;
