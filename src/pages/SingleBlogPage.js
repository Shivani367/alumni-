// src/pages/SingleBlogPage.js
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getContent } from '../services/contentService';

const SingleBlogPage = () => {
  const { id } = useParams();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      try {
        const data = await getContent('blogs', id);
        setBlogPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="text-center py-20 bg-slate-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-bold mb-4">Blog post not found.</p>
          <Link to="/blog" className="text-teal-600 font-bold hover:underline">Back to Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <Link to="/blog" className="inline-flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 mb-8 hover:underline">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all blogs
        </Link>

        <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200/80">
          <header className="mb-8 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-100 mb-4">
              Insights & Advice
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 leading-tight mb-4">
              {blogPost.title}
            </h1>
            <div className="flex items-center space-x-3 text-sm text-slate-500 font-medium">
              <span>By {blogPost.email_id}</span>
              <span>&bull;</span>
              <span>{new Date(blogPost.created_at || blogPost.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </header>

          <div className="text-slate-700 text-lg leading-relaxed space-y-6 whitespace-pre-line">
            {blogPost.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlogPage;
