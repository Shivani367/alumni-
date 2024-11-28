import React from 'react';

const AlumniStats = () => {
  const alumniData = [
    { city: 'Mumbai', alumniCount: 8240 },
    { city: 'Bengaluru', alumniCount: 4756 },
    { city: 'India', alumniCount: 4399 }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 mt-8">
      {alumniData.map((alumni, index) => (
        <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center w-64">
          <h2 className="text-2xl font-bold text-yellow-600 mb-2">{alumni.city}</h2>
          <p className="text-lg">{alumni.alumniCount} alumni</p>
        </div>
      ))}
    </div>
  );
};

export default AlumniStats;