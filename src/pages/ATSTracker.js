import React, { useMemo, useState } from 'react';

const stopWords = new Set([
  'about', 'after', 'also', 'and', 'are', 'been', 'but', 'can', 'for', 'from',
  'have', 'into', 'job', 'our', 'that', 'the', 'their', 'this', 'to', 'with', 'you',
]);

const tokenize = (text) => (
  text.toLowerCase().match(/[a-z][a-z0-9+#.-]{2,}/g) || []
).filter((word) => !stopWords.has(word));

const unique = (items) => [...new Set(items)];

function ATSTracker() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [fileMessage, setFileMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const analysis = useMemo(() => {
    const resumeWords = new Set(tokenize(resume));
    const jobWords = unique(tokenize(jobDescription));
    const matched = jobWords.filter((word) => resumeWords.has(word));
    const missing = jobWords.filter((word) => !resumeWords.has(word));
    const score = jobWords.length ? Math.round((matched.length / jobWords.length) * 100) : 0;
    return { matched, missing, score };
  }, [resume, jobDescription]);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/\.(txt|md|rtf)$/i.test(file.name)) {
      setFileMessage('For reliable browser-only analysis, paste PDF/DOCX resume text below or upload TXT, MD, or RTF.');
      return;
    }
    setResume(await file.text());
    setFileMessage(`${file.name} loaded successfully.`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const ready = resume.trim().length >= 30 && jobDescription.trim().length >= 30;

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="mx-auto max-w-5xl bg-white shadow-lg rounded-xl p-6 md:p-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Smart ATS Resume Matcher</h1>
        <p className="text-gray-600 text-center mt-2 mb-8">
          Compare your resume with a job description locally—your text never leaves this browser.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <section>
            <label htmlFor="resume" className="block font-semibold text-gray-700 mb-2">Resume text</label>
            <input type="file" accept=".txt,.md,.rtf,.pdf,.doc,.docx" onChange={handleFile} className="block w-full mb-2 text-sm" />
            {fileMessage && <p className="text-sm text-blue-700 mb-2">{fileMessage}</p>}
            <textarea
              id="resume"
              value={resume}
              onChange={(event) => setResume(event.target.value)}
              placeholder="Paste your resume text here…"
              className="w-full h-72 p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </section>
          <section>
            <label htmlFor="job-description" className="block font-semibold text-gray-700 mb-2">Job description</label>
            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the complete job description here…"
              className="w-full h-80 p-3 border rounded-lg focus:ring-2 focus:ring-teal-500"
              required
            />
          </section>
          <button
            type="submit"
            disabled={!ready}
            className="md:col-span-2 bg-teal-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg hover:bg-teal-700"
          >
            Analyze resume
          </button>
        </form>

        {submitted && ready && (
          <section className="mt-8 border-t pt-8" aria-live="polite">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <div className="w-36 h-36 rounded-full border-8 border-teal-500 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-gray-800">{analysis.score}%</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">ATS match result</h2>
                <p className="text-gray-600 mb-5">
                  {analysis.score >= 70
                    ? 'Strong match. Tailor your achievements to the role before applying.'
                    : 'Add relevant missing terms naturally where your real experience supports them.'}
                </p>
                <h3 className="font-semibold text-green-700">Matched keywords</h3>
                <p className="text-gray-700 mb-4">{analysis.matched.slice(0, 20).join(', ') || 'No clear matches yet.'}</p>
                <h3 className="font-semibold text-amber-700">Important missing keywords</h3>
                <p className="text-gray-700">{analysis.missing.slice(0, 20).join(', ') || 'None detected.'}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ATSTracker;
