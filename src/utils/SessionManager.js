const SESSION_KEY = 'ws_session';

import { findUserByUsername } from './UserManager.js';

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  if (!user || !user.id || !user.username || !user.role || !user.displayName) {
    return false;
  }

  const session = {
    userId: user.id,
    username: user.username,
    role: user.role,
    displayName: user.displayName,
    loginTime: Date.now(),
  };

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // Ignore localStorage errors on clear
  }
}

export function getCurrentUser() {
  const session = getSession();
  if (!session || !session.username) return null;

  const user = findUserByUsername(session.username);
  if (!user) return null;

  return user;
}

export function isAdmin() {
  const session = getSession();
  if (!session) return false;
  return session.role === 'admin';
}

export function isAuthenticated() {
  return getSession() !== null;
}

export function logout() {
  clearSession();
}