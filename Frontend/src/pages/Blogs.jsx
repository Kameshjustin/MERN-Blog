import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/post/getposts", {
          params: {
            startIndex: 0, // Fetch from the start
            limit: 9,      // Limit to 9 posts
          },
        });
        setPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        setError("Failed to load posts");
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-semibold mb-8 text-center text-gray-800">Latest Blogs</h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <div className="spinner-border animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative">
                {/* Display image from post data */}
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                  <h2 className="text-2xl font-semibold">{post.title}</h2>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600 mb-4">
                  Published on {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 mb-4">
                  {post.content.slice(0, 150)}...
                </p>
                <Link
                  to={`/post/${post.slug}`}
                  className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-800 transition-all duration-300"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
