import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getSession } from '../utils/SessionManager.js';
import { getBlogById, deleteBlog } from '../utils/BlogStorage.js';
import { getAvatar } from '../utils/AvatarUtil.js';

export default function ReadBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    const found = getBlogById(id);

    if (!found) {
      setNotFound(true);
      return;
    }

    setBlog(found);
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
            <Link
              to="/blogs"
              className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Blogs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const isAdmin = session.role === 'admin';
  const isOwner = blog.author.username === session.username;
  const canEditOrDelete = isAdmin || isOwner;

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

  function formatDateTime(dateString) {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  }

  function handleDelete() {
    const result = deleteBlog(id);

    if (result.success) {
      navigate('/blogs', { replace: true });
    }
  }

  function handleCancelDelete() {
    setShowDeleteConfirm(false);
  }

  function handleConfirmDelete() {
    setShowDeleteConfirm(true);
  }

  const wasEdited =
    blog.updatedAt &&
    blog.createdAt &&
    blog.updatedAt !== blog.createdAt;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/blogs"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </Link>
        </div>

        {/* Blog Post */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Author info */}
          <div className="flex items-center space-x-3 mb-6">
            {getAvatar(blog.author.role, 'md')}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.author.displayName}
              </p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-500">
                  {formatDate(blog.createdAt)}
                </p>
                <span className="text-xs text-gray-400 capitalize">
                  • {blog.author.role}
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {blog.title}
          </h1>

          {/* Edited indicator */}
          {wasEdited && (
            <p className="text-xs text-gray-400 mb-6">
              Last edited {formatDateTime(blog.updatedAt)}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </p>
          </div>

          {/* Actions */}
          {canEditOrDelete && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end space-x-3">
              <Link
                to={`/edit/${blog.id}`}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                Edit Post
              </Link>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete Post
              </button>
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