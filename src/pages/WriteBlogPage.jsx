import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../utils/SessionManager.js';
import { createBlog } from '../utils/BlogStorage.js';

export default function WriteBlogPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const session = getSession();

  if (!session) {
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const result = createBlog(
      title,
      content,
      session.username,
      session.displayName,
      session.role
    );

    if (result.success) {
      navigate(`/blog/${result.blog.id}`, { replace: true });
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
          <h1 className="text-3xl font-bold text-gray-900">Write a Post</h1>
          <p className="mt-1 text-sm text-gray-600">
            Share your thoughts with the world.
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
                Publish Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}