import { useEffect, useState } from "react";
import "./Home.css"; // Import the custom CSS file if additional styles are needed

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="home-container bg-black min-h-screen text-white">
      {/* Hero Section */}
      <div className="hero-section text-center py-10">
        <h1 className="text-5xl font-extrabold mb-2">Welcome to the Blog!</h1>
        <p className="text-xl">Explore the latest posts and stories.</p>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="post-card bg-gray-800 p-4 rounded shadow-lg hover:bg-gray-700 transition"
            >
              {/* Post Image */}
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="post-image w-full h-40 object-cover rounded mb-4"
                />
              )}

              {/* Post Title */}
              <h2 className="post-title text-xl font-bold mb-2">{post.title}</h2>

              {/* Post Content */}
              <p className="post-content text-gray-300">
                {post.content.length > 100
                  ? `${post.content.substring(0, 100)}...`
                  : post.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
