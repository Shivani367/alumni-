import React, { useEffect, useState } from 'react';
import  supabase  from '../supabaseClient';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching blog posts:', error);
      } else {
        setBlogPosts(data);
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Blog</h1>
      <div className="space-y-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-500 text-sm">{post.date}</p>
            <p className="mt-4 text-gray-700">{post.content}</p>
            <Link to={`/blog/${post.id}`} className="text-blue-600 hover:underline mt-4 block">
            Read more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
