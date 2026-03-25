import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/SessionManager.js';
import { getAllBlogs, deleteBlog } from '../utils/BlogStorage.js';
import { getAllUsers } from '../utils/UserManager.js';
import { getAvatar } from '../utils/AvatarUtil.js';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    setBlogs(getAllBlogs());
    setUsers(getAllUsers());
  }, [navigate, session]);

  if (!session || session.role !== 'admin') {
    return null;
  }

  const totalPosts = blogs.length;
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const viewerCount = users.filter((u) => u.role === 'viewer').length;
  const recentPosts = blogs.slice(0, 5);

  function formatDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  }

  function truncateContent(content, maxLength = 80) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trimEnd() + '…';
  }

  function handleConfirmDelete(blogId) {
    setShowDeleteConfirm(blogId);
  }

  function handleCancelDelete() {
    setShowDeleteConfirm(null);
  }

  function handleDelete() {
    if (!showDeleteConfirm) return;

    const result = deleteBlog(showDeleteConfirm);

    if (result.success) {
      setBlogs(getAllBlogs());
    }

    setShowDeleteConfirm(null);
  }

  const stats = [
    {
      label: 'Total Posts',
      value: totalPosts,
      emoji: '📝',
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
    },
    {
      label: 'Total Users',
      value: totalUsers,
      emoji: '👥',
      bg: 'bg-purple-100',
      text: 'text-purple-600',
    },
    {
      label: 'Admins',
      value: adminCount,
      emoji: '👑',
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
    },
    {
      label: 'Viewers',
      value: viewerCount,
      emoji: '📖',
      bg: 'bg-pink-100',
      text: 'text-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Banner Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            {getAvatar(session.role, 'lg')}
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome back, {session.displayName}
              </h1>
              <p className="mt-1 text-indigo-100">
                Here's what's happening on WriteSpace today.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl`}
                >
                  {stat.emoji}
                </div>
                <span className={`text-3xl font-bold ${stat.text}`}>
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Write a Post
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center px-6 py-3 text-sm font-semibold text-indigo-600 bg-white border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
            {blogs.length > 0 && (
              <Link
                to="/blogs"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View All →
              </Link>
            )}
          </div>

          {recentPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start creating content for your blog!
              </p>
              <Link
                to="/write"
                className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Write Your First Post
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {recentPosts.map((blog) => (
                  <div
                    key={blog.id}
                    className="p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <button
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      className="flex items-center space-x-4 flex-1 min-w-0 text-left focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-lg"
                    >
                      {getAvatar(blog.author.role, 'sm')}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {truncateContent(blog.content)}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-400">
                            {blog.author.displayName}
                          </span>
                          <span className="text-xs text-gray-300">•</span>
                          <span className="text-xs text-gray-400">
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      <Link
                        to={`/edit/${blog.id}`}
                        className="p-2 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        aria-label={`Edit ${blog.title}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(blog.id)}
                        className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                        aria-label={`Delete ${blog.title}`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelDelete}
          ></div>
          <div className="relative bg-white rounded-xl shadow-lg border border-gray-200 p-6 w-full max-w-sm mx-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🗑️</div>
              <h2 className="text-lg font-bold text-gray-900">Delete Post</h2>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}