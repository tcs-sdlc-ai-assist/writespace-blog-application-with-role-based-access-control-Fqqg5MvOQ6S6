import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/SessionManager.js';
import { getBlogById, updateBlog } from '../utils/BlogStorage.js';

export default function EditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    const blog = getBlogById(id);

    if (!blog) {
      setNotFound(true);
      return;
    }

    const isAdmin = session.role === 'admin';
    const isOwner = blog.author.username === session.username;

    if (!isAdmin && !isOwner) {
      navigate('/blogs', { replace: true });
      return;
    }

    setTitle(blog.title);
    setContent(blog.content);
  }, [id, navigate, session]);

  if (!session) {
    return null;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Post not found
            </h2>
            <p className="text-gray-500 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/blogs')}
              className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const result = updateBlog(id, { title, content });

    if (result.success) {
      navigate(`/blog/${id}`, { replace: true });
    } else {
      setError(result.error);
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update your post details below.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                maxLength={100}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
              />
              <div className="mt-1 flex justify-end">
                <span
                  className={`text-xs ${
                    title.length > 100 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {title.length}/100
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                maxLength={1000}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors resize-vertical"
              />
              <div className="mt-1 flex justify-end">
                <span
                  className={`text-xs ${
                    content.length > 1000 ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {content.length}/1000
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}