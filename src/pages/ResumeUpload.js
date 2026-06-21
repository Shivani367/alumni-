// src/pages/ResumeUpload.js
import React, { useState } from 'react';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Validation
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      setFile(null);
      return;
    }

    if (!selectedFile.name.endsWith('.pdf') && !selectedFile.name.endsWith('.doc') && !selectedFile.name.endsWith('.docx')) {
      setError('Only PDF, DOC, and DOCX formats are supported.');
      setFile(null);
      return;
    }

    setError('');
    setSuccess(false);
    setFile(selectedFile);
  };

  const uploadResume = () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError('');

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setSuccess(true);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center font-sans">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200/80">
        <div className="text-center mb-8">
          <span className="text-teal-600 text-xs font-extrabold uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Career Tools
          </span>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mt-3">Upload Your Resume</h2>
          <p className="mt-2 text-slate-500 text-sm">Upload your professional CV to allow senior alumni and recruiting partners to discover your profile.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold flex items-center space-x-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold flex items-center space-x-2 animate-bounce">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Resume uploaded and indexed successfully!</span>
          </div>
        )}

        {/* Drag-and-Drop Area */}
        <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50/50 relative">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept=".pdf,.doc,.docx"
          />
          <svg className="w-12 h-12 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {file ? (
            <div className="space-y-1">
              <p className="text-slate-800 font-bold text-sm truncate max-w-[280px]">{file.name}</p>
              <p className="text-xs text-slate-400 font-semibold">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p className="text-slate-700 font-bold text-sm">Drag and drop or click to browse</p>
              <p className="text-xs text-slate-400 font-semibold mt-1">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
            </div>
          )}
        </div>

        {uploading && (
          <div className="mt-8 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-500">
              <span>Uploading Resume...</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className="bg-teal-600 h-2 rounded-full transition-all duration-150" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        <button 
          onClick={uploadResume} 
          disabled={!file || uploading}
          className="w-full mt-8 py-3.5 px-6 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {uploading ? 'Processing file...' : 'Submit Resume'}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;