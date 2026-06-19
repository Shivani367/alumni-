import React, { useEffect, useState } from 'react';
import { listContent } from '../services/contentService';
import { Link } from 'react-router-dom';

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try { setBlogPosts(await listContent('blogs')); }
      catch (error) { console.error('Error fetching blog posts:', error); }
    };

    fetchBlogPosts();
  }, []);

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Latest Blog Posts</h2>
        {blogPosts.length === 0 ? (
          <p className="text-center text-gray-500">No blog posts available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <p className="mt-4 text-gray-700">{post.excerpt}</p>
                <Link to={`/blog/${post.id}`} className="text-blue-600 hover:underline mt-4 block">
  Read more
</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
