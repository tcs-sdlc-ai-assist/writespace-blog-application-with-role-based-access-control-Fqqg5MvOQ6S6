import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/SessionManager.js';
import { getAllBlogs } from '../utils/BlogStorage.js';
import { getAvatar } from '../utils/AvatarUtil.js';

export default function LandingPage() {
  const navigate = useNavigate();
  const session = getSession();
  const allBlogs = getAllBlogs();
  const latestPosts = allBlogs.slice(0, 3);

  function handlePostClick(blogId) {
    if (session) {
      navigate(`/blog/${blogId}`);
    } else {
      navigate('/login');
    }
  }

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span className="text-2xl">✍️</span>
              <span>WriteSpace</span>
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/blogs"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  {getAvatar(session.role, 'sm')}
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                    {session.displayName}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                Your Space to{' '}
                <span className="text-yellow-300">Write</span>,{' '}
                <span className="text-pink-200">Share</span> &{' '}
                <span className="text-green-200">Inspire</span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-indigo-100 max-w-lg">
                WriteSpace is a simple, beautiful blogging platform where ideas come to life. Create, manage, and share your stories with the world.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                {session ? (
                  <>
                    <Link
                      to="/write"
                      className="px-8 py-3 text-base font-semibold text-indigo-600 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Write a Post
                    </Link>
                    <Link
                      to="/blogs"
                      className="px-8 py-3 text-base font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Browse Blogs
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="px-8 py-3 text-base font-semibold text-indigo-600 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      to="/login"
                      className="px-8 py-3 text-base font-semibold text-white border-2 border-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Floating Cards Animation */}
            <div className="hidden lg:flex justify-center relative">
              <div className="animate-float w-72 bg-white/20 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/30">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-lg">
                    ✍️
                  </div>
                  <div>
                    <div className="h-3 w-24 bg-white/50 rounded"></div>
                    <div className="h-2 w-16 bg-white/30 rounded mt-2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/30 rounded"></div>
                  <div className="h-2 w-5/6 bg-white/30 rounded"></div>
                  <div className="h-2 w-4/6 bg-white/30 rounded"></div>
                </div>
              </div>

              <div className="animate-float-delayed absolute top-32 -right-4 w-56 bg-white/15 backdrop-blur-md rounded-2xl p-5 shadow-xl border border-white/20">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-pink-400 rounded-full flex items-center justify-center text-sm">
                    📖
                  </div>
                  <div>
                    <div className="h-2.5 w-20 bg-white/50 rounded"></div>
                    <div className="h-2 w-12 bg-white/30 rounded mt-1.5"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 w-full bg-white/25 rounded"></div>
                  <div className="h-2 w-3/4 bg-white/25 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why WriteSpace?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to start writing and sharing your ideas, all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                ✏️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Easy Writing
              </h3>
              <p className="text-gray-600 leading-relaxed">
                A clean, distraction-free writing experience. Just focus on your words and let your creativity flow.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                🔐
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Role-Based Access
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Admins manage everything while viewers create and manage their own content. Simple and secure.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center text-2xl mb-6">
                🚀
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Instant & Local
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No servers, no waiting. Your data stays in your browser with instant load times and zero setup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Latest Posts
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Check out what the community has been writing about recently.
            </p>
          </div>

          {latestPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                Be the first to share your thoughts on WriteSpace!
              </p>
              {!session && (
                <Link
                  to="/register"
                  className="inline-block px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get Started
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="text-left bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {getAvatar(post.author.role, 'sm')}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {post.author.displayName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {post.content}
                  </p>
                </button>
              ))}
            </div>
          )}

          {latestPosts.length > 0 && (
            <div className="text-center mt-12">
              {session ? (
                <Link
                  to="/blogs"
                  className="inline-block px-6 py-3 text-sm font-semibold text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View All Posts
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="inline-block px-6 py-3 text-sm font-semibold text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  Sign In to Read More
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 text-xl font-bold text-white mb-4">
                <span className="text-2xl">✍️</span>
                <span>WriteSpace</span>
              </div>
              <p className="text-sm leading-relaxed">
                A simple, beautiful blogging platform for sharing your ideas with the world.
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <p className="text-sm leading-relaxed">
                WriteSpace is a demo project built with React, Tailwind CSS, and localStorage. All data stays in your browser.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} WriteSpace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}