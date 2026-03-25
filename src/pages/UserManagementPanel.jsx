import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession } from '../utils/SessionManager.js';
import { getAllUsers, saveUser, deleteUser, HARD_CODED_ADMIN } from '../utils/UserManager.js';
import { getAvatar } from '../utils/AvatarUtil.js';

export default function UserManagementPanel() {
  const navigate = useNavigate();
  const session = getSession();

  const [users, setUsers] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true });
      return;
    }

    if (session.role !== 'admin') {
      navigate('/blogs', { replace: true });
      return;
    }

    setUsers(getAllUsers());
  }, [navigate, session]);

  if (!session || session.role !== 'admin') {
    return null;
  }

  function handleCreateSubmit(e) {
    e.preventDefault();
    setError('');

    if (!displayName || !username || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedDisplayName || !trimmedUsername) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const newUser = {
      id: crypto.randomUUID(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: password,
      role: role,
    };

    const result = saveUser(newUser);

    if (result.success) {
      setUsers(getAllUsers());
      setDisplayName('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setRole('viewer');
      setShowCreateForm(false);
    } else {
      setError(result.error);
    }
  }

  function handleCancelCreate() {
    setDisplayName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setRole('viewer');
    setError('');
    setShowCreateForm(false);
  }

  function canDeleteUser(user) {
    if (user.id === HARD_CODED_ADMIN.id) return false;
    if (user.username === session.username) return false;
    return true;
  }

  function getDeleteTooltip(user) {
    if (user.id === HARD_CODED_ADMIN.id) return 'Cannot delete the default admin user.';
    if (user.username === session.username) return 'Cannot delete your own account.';
    return null;
  }

  function handleConfirmDelete(userId) {
    setShowDeleteConfirm(userId);
  }

  function handleCancelDelete() {
    setShowDeleteConfirm(null);
  }

  function handleDelete() {
    if (!showDeleteConfirm) return;

    const result = deleteUser(showDeleteConfirm);

    if (result.success) {
      setUsers(getAllUsers());
    }

    setShowDeleteConfirm(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Banner Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            {getAvatar(session.role, 'lg')}
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="mt-1 text-indigo-100">
                Manage all users on WriteSpace.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Users</h2>
            <p className="mt-1 text-sm text-gray-600">
              {users.length} user{users.length === 1 ? '' : 's'} registered
            </p>
          </div>
          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
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
              Create User
            </button>
          )}
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Create New User
            </h3>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-colors bg-white"
                >
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        {users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No users yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first user to get started!
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {getAvatar(user.role, 'sm')}
                          <span className="text-sm font-medium text-gray-900">
                            {user.displayName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {user.username}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            user.role === 'admin'
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              canDeleteUser(user)
                                ? handleConfirmDelete(user.id)
                                : null
                            }
                            onMouseEnter={() => {
                              const tip = getDeleteTooltip(user);
                              if (tip) setTooltip(user.id);
                            }}
                            onMouseLeave={() => setTooltip(null)}
                            className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${
                              canDeleteUser(user)
                                ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                : 'text-gray-300 cursor-not-allowed'
                            }`}
                            aria-label={`Delete ${user.displayName}`}
                            disabled={!canDeleteUser(user)}
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
                          {tooltip === user.id && getDeleteTooltip(user) && (
                            <div className="absolute right-0 bottom-full mb-2 w-56 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg z-10">
                              {getDeleteTooltip(user)}
                              <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getAvatar(user.role, 'sm')}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.displayName}
                        </p>
                        <p className="text-xs text-gray-500">{user.username}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.role === 'admin'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-end">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          canDeleteUser(user)
                            ? handleConfirmDelete(user.id)
                            : null
                        }
                        onMouseEnter={() => {
                          const tip = getDeleteTooltip(user);
                          if (tip) setTooltip(user.id);
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-300 ${
                          canDeleteUser(user)
                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            : 'text-gray-300 cursor-not-allowed'
                        }`}
                        aria-label={`Delete ${user.displayName}`}
                        disabled={!canDeleteUser(user)}
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
                      {tooltip === user.id && getDeleteTooltip(user) && (
                        <div className="absolute right-0 bottom-full mb-2 w-56 px-3 py-2 text-xs text-white bg-gray-900 rounded-lg shadow-lg z-10">
                          {getDeleteTooltip(user)}
                          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
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
              <h2 className="text-lg font-bold text-gray-900">Delete User</h2>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to delete this user? This action cannot be
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