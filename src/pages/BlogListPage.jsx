import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/SessionManager.js';
import { getAllBlogs } from '../utils/BlogStorage.js';
import { getAvatar } from '../utils/AvatarUtil.js';

export default function BlogListPage() {
  const navigate = useNavigate();
  const session = getSession();
  const blogs = getAllBlogs();

  const isAdmin = session && session.role === 'admin';

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

  function truncateContent(content, maxLength = 150) {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength).trimEnd() + '…';
  }

  function canEdit(blog) {
    if (!session) return false;
    if (isAdmin) return true;
    return blog.author.username === session.username;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Blogs</h1>
            <p className="mt-1 text-sm text-gray-600">
              {blogs.length === 0
                ? 'No posts yet. Be the first to share your thoughts!'
                : `${blogs.length} post${blogs.length === 1 ? '' : 's'} published`}
            </p>
          </div>
          <Link
            to="/write"
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Write a Post
          </Link>
        </div>

        {/* Empty State */}
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No posts yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start sharing your ideas with the world!
            </p>
            <Link
              to="/write"
              className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          /* Blog Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
              >
                <button
                  onClick={() => navigate(`/blog/${blog.id}`)}
                  className="text-left p-6 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-t-xl"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {getAvatar(blog.author.role, 'sm')}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {blog.author.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {truncateContent(blog.content)}
                  </p>
                </button>

                {/* Footer with edit action */}
                <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 capitalize">
                    {blog.author.role}
                  </span>
                  {canEdit(blog) && (
                    <Link
                      to={`/edit/${blog.id}`}
                      className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}