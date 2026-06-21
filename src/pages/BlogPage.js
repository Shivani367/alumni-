// src/pages/BlogPage.js
import React, { useEffect, useState } from 'react';
import { listContent } from '../services/contentService';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await listContent('blogs');
        setBlogPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">Our Blog</h1>
          <p className="mt-3 text-lg text-slate-600">Insights, updates, and wisdom shared by our global alumni network</p>
          <div className="w-16 h-1 bg-teal-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
        ) : blogPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200/80 overflow-hidden flex flex-col justify-between transition-shadow duration-300">
                <div className="p-6 md:p-8">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-teal-600 mb-4 bg-teal-50 px-3 py-1 rounded-full w-max">
                    <span>Engineering & Career</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 hover:text-teal-700 transition duration-150">
                    <Link to={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-slate-400 text-xs font-semibold mt-2">
                    Published on {new Date(post.created_at || post.date).toLocaleDateString()}
                  </p>
                  <p className="mt-4 text-slate-600 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="px-6 md:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-450 font-medium">By {post.email_id || 'Alumni Member'}</span>
                  <Link to={`/blog/${post.id}`} className="inline-flex items-center text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline">
                    Read post
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto">
            <p className="text-slate-400 font-medium">No blog posts available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
