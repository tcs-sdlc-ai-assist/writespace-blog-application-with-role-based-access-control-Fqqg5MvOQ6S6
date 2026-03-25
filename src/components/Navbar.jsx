import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSession, logout } from '../utils/SessionManager.js';
import { getAvatar } from '../utils/AvatarUtil.js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const session = getSession();

  if (!session) return null;

  const isAdmin = session.role === 'admin';

  const navLinks = [
    { to: '/blogs', label: 'All Blogs' },
    { to: '/write', label: 'Write' },
  ];

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Dashboard' });
    navLinks.push({ to: '/users', label: 'Users' });
  }

  function isActive(path) {
    return location.pathname === path;
  }

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  }

  function handleToggleMobile() {
    setMobileMenuOpen((prev) => !prev);
    setDropdownOpen(false);
  }

  function handleToggleDropdown() {
    setDropdownOpen((prev) => !prev);
  }

  function handleNavClick() {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link
            to="/blogs"
            className="flex items-center space-x-2 text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            onClick={handleNavClick}
          >
            <span className="text-2xl">✍️</span>
            <span>WriteSpace</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Avatar Chip + Dropdown */}
          <div className="hidden md:flex items-center relative">
            <button
              onClick={handleToggleDropdown}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
              aria-label="User menu"
            >
              {getAvatar(session.role, 'sm')}
              <span className="text-sm font-medium text-gray-700">
                {session.displayName}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  dropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {session.displayName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {session.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={handleToggleMobile}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-200 px-4 py-3">
            <div className="flex items-center space-x-3 mb-3">
              {getAvatar(session.role, 'sm')}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {session.displayName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {session.role}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}