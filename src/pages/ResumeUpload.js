import React, { useState } from 'react';
import supabase from '../supabaseClient';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);

  const uploadResume = async () => {
    if (!file) return;

    const { data, error } = await supabase.storage.from('resumes').upload(`public/${file.name}`, file);

    if (error) {
      console.error('Error uploading resume:', error);
    } else {
      console.log('Resume uploaded successfully!', data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Upload Your Resume</h2>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button onClick={uploadResume} className="bg-blue-500 text-white p-2 rounded">Upload Resume</button>
    </div>
  );
};

export default ResumeUpload;