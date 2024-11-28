import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseClient';

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
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error fetching user session:', error);
    } else if (session?.user) {
      setUserEmail(session.user.email); // Set user email from session
    }
  };

  const fetchBlogs = async () => {
    if (!userEmail) return;
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('email_id', userEmail)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching blogs:', error);
    else setBlogs(data);
  };

  const handleCreateBlog = async () => {
    const { error } = await supabase
      .from('blogs')
      .insert([{ title, excerpt, content, email_id: userEmail }]);

    if (error) console.error('Error creating blog:', error);
    else {
      setTitle('');
      setExcerpt('');
      setContent('');
      fetchBlogs();
    }
  };

  const handleEditBlog = async () => {
    const { error } = await supabase
      .from('blogs')
      .update({ title, excerpt, content })
      .eq('id', editBlogId)
      .eq('email_id', userEmail);

    if (error) console.error('Error updating blog:', error);
    else {
      setTitle('');
      setExcerpt('');
      setContent('');
      setEditBlogId(null);
      fetchBlogs();
    }
  };

  const handleDeleteBlog = async (id) => {
    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id)
      .eq('email_id', userEmail);

    if (error) console.error('Error deleting blog:', error);
    else fetchBlogs();
  };

  const handleLoadBlog = (blog) => {
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setEditBlogId(blog.id);
  };

  return (
    <div className="p-8 bg-gradient-to-b from-gray-100 to-gray-300 min-h-screen">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-800">Blogs</h1>
  
      <div className="bg-white shadow-xl rounded-xl p-8 mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          {editBlogId ? 'Edit Blog' : 'Create Blog'}
        </h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          placeholder="Excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={editBlogId ? handleEditBlog : handleCreateBlog}
          className="w-full py-2 px-4 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition duration-300 ease-in-out"
        >
          {editBlogId ? 'Update Blog' : 'Create Blog'}
        </button>
      </div>
  
      <div>
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Your Blogs</h2>
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog.id} className="mb-6 p-6 bg-white rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800">{blog.title}</h3>
              <p className="text-gray-600 mt-2 mb-5">{blog.excerpt}</p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLoadBlog(blog)}
                  className="py-2 px-4 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition duration-300 ease-in-out"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog.id)}
                  className="py-2 px-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300 ease-in-out"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No blogs found.</p>
        )}
      </div>
    </div>
  );  
};

export default Blogs;
