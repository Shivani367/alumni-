import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../supabaseClient';

const SingleBlogPage = () => {
  const { id } = useParams(); // Get the blog post ID from the URL parameters
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      let { data: blog, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single(); // Fetch a single blog post based on the ID

      if (error) {
        console.error('Error fetching blog post:', error.message);
      } else {
        setBlogPost(blog);
      }
      setLoading(false);
    };

    fetchBlogPost();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!blogPost) return <p className="text-center">Blog post not found.</p>;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
        <p className="text-gray-500 text-sm mb-6">
          {new Date(blogPost.created_at).toLocaleDateString()}
        </p>
        <div className="text-gray-800 text-lg leading-relaxed">
          <p>{blogPost.content}</p>
        </div>
      </div>
    </section>
  );
};

export default SingleBlogPage;
