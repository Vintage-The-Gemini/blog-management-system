import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Layout, 
  LayoutGrid, 
  FilePen, 
  Image as ImageIcon, 
  Trash2,
  Edit,
  Plus,
  Home
} from "lucide-react";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: "" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    publishedPosts: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    // Simulated stats - replace with real data
    setStats({
      totalPosts: posts.length,
      totalViews: posts.length * 123,
      publishedPosts: posts.length,
    });
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/admin/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = newPost.image;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);

        const uploadResponse = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) throw new Error('Failed to upload image');

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.imageUrl;
      }

      const response = await fetch("http://localhost:5000/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPost,
          image: imageUrl
        }),
      });

      if (!response.ok) throw new Error("Failed to create post");

      const createdPost = await response.json();
      setPosts([...posts, createdPost]);
      setNewPost({ title: "", content: "", image: "" });
      setSelectedFile(null);
      setImagePreview(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
      setPosts(posts.filter((post) => post._id !== id));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2 className="text-xl font-bold">Blog Admin</h2>
        </div>
        <nav>
          <a href="#" className="nav-link active">
            <LayoutGrid size={20} />
            Dashboard
          </a>
          <a href="#" className="nav-link">
            <FilePen size={20} />
            Posts
          </a>
          <a href="#" className="nav-link">
            <ImageIcon size={20} />
            Media
          </a>
          <a href="/" className="nav-link">
            <Home size={20} />
            View Site
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="text-lg font-semibold text-gray-600">Total Posts</h3>
            <p className="text-3xl font-bold">{stats.totalPosts}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-lg font-semibold text-gray-600">Total Views</h3>
            <p className="text-3xl font-bold">{stats.totalViews}</p>
          </div>
          <div className="stat-card">
            <h3 className="text-lg font-semibold text-gray-600">Published Posts</h3>
            <p className="text-3xl font-bold">{stats.publishedPosts}</p>
          </div>
        </div>

        {/* Create Post Form */}
        <div className="create-post-form">
          <h2 className="text-xl font-semibold mb-4">Create New Post</h2>
          <form onSubmit={handleCreatePost}>
            <div className="mb-4">
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Post Title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            
            <div className="mb-4">
              <textarea
                className="w-full p-2 border border-gray-300 rounded h-32 focus:outline-none focus:border-blue-500"
                placeholder="Post Content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
            </div>

            <div className="mb-4">
              <label className="custom-file-upload">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <ImageIcon size={20} className="inline mr-2" />
                Choose Image
              </label>

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
            >
              {loading ? (
                <div className="loading-spinner mr-2" />
              ) : (
                <Plus size={20} className="mr-2" />
              )}
              Create Post
            </button>
          </form>
        </div>

        {/* Posts Grid */}
        <div className="post-grid">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-image-container">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="post-image"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
              <div className="post-content">
                <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">
                  {post.content.substring(0, 100)}...
                </p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => navigate(`/admin/edit/${post._id}`)}
                    className="text-blue-500 hover:text-blue-700 flex items-center"
                  >
                    <Edit size={18} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <Trash2 size={18} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
            {error}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;