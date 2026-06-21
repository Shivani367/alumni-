import React, { useState, useEffect } from 'react';
import { getSession } from '../../services/authService';
import { listContent, saveContent, deleteContent } from '../../services/contentService';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]); // Store all blogs for the current user
  const [title, setTitle] = useState(''); // New blog title
  const [excerpt, setExcerpt] = useState(''); // New blog excerpt
  const [content, setContent] = useState(''); // New blog content
  const [editBlogId, setEditBlogId] = useState(null); // Blog being edited
  const [userEmail, setUserEmail] = useState(''); // Store logged-in user's email

  useEffect(() => {
    fetchUserEmail();
    fetchBlogs();
  }, [userEmail]);

  const fetchUserEmail = async () => {
    try {
      const session = await getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
    }
  };

  const fetchBlogs = async () => {
    if (!userEmail) return;
    try {
      const data = await listContent('blogs', userEmail);
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleCreateBlog = async () => {
    try {
      await saveContent('blogs', { title, excerpt, content, email_id: userEmail });
      setTitle('');
      setExcerpt('');
      setContent('');
      fetchBlogs();
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleEditBlog = async () => {
    try {
      await saveContent('blogs', { title, excerpt, content, email_id: userEmail }, editBlogId);
      setTitle('');
      setExcerpt('');
      setContent('');
      setEditBlogId(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await deleteContent('blogs', id);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleLoadBlog = (blog) => {
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setEditBlogId(blog.id);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-slate-800">Manage Blogs</h1>
      </div>
  
      <div className="bg-white shadow-sm border border-slate-200 rounded-2xl p-6">
        <h2 className="text-lg font-bold mb-4 text-slate-700">
          {editBlogId ? 'Edit Blog Post' : 'Write a New Blog Post'}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150"
          />
          <input
            type="text"
            placeholder="Short Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150"
          />
          <textarea
            placeholder="Write your content here..."
            value={content}
            rows="5"
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-150"
          />
          <button
            onClick={editBlogId ? handleEditBlog : handleCreateBlog}
            className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 active:scale-[0.98] transition duration-200 shadow-sm"
          >
            {editBlogId ? 'Update Post' : 'Publish Post'}
          </button>
        </div>
      </div>
  
      <div>
        <h2 className="text-xl font-bold mb-4 text-slate-800">Your Published Blogs</h2>
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-2">{blog.title}</h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-3 mb-6">{blog.excerpt}</p>
                </div>
                <div className="flex space-x-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleLoadBlog(blog)}
                    className="flex-1 py-2 px-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-semibold hover:bg-amber-100 transition duration-150"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBlog(blog.id)}
                    className="flex-1 py-2 px-3 bg-red-50 text-red-600 border border-red-100 rounded-xl font-semibold hover:bg-red-100 transition duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl">
            <p className="text-slate-400">No blog posts found. Write your first post above!</p>
          </div>
        )}
      </div>
    </div>
  );  
};

export default Blogs;
