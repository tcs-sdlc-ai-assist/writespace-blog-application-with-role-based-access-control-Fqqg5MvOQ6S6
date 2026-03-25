import { findUserByUsername, saveUser } from './UserManager.js';
import { saveSession, getCurrentUser } from './SessionManager.js';

export function loginUser(username, password) {
  if (!username || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  const trimmedUsername = username.trim().toLowerCase();

  if (!trimmedUsername) {
    return { success: false, error: 'All fields are required.' };
  }

  const user = findUserByUsername(trimmedUsername);

  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid username or password.' };
  }

  const saved = saveSession(user);
  if (!saved) {
    return { success: false, error: 'Failed to create session. localStorage may be unavailable.' };
  }

  return { success: true, user };
}

export function registerUser(displayName, username, password, confirmPassword) {
  if (!displayName || !username || !password || !confirmPassword) {
    return { success: false, error: 'All fields are required.' };
  }

  const trimmedDisplayName = displayName.trim();
  const trimmedUsername = username.trim().toLowerCase();

  if (!trimmedDisplayName || !trimmedUsername) {
    return { success: false, error: 'All fields are required.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  const newUser = {
    id: crypto.randomUUID(),
    displayName: trimmedDisplayName,
    username: trimmedUsername,
    password: password,
    role: 'viewer',
  };

  const result = saveUser(newUser);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const saved = saveSession(result.user);
  if (!saved) {
    return { success: false, error: 'Failed to create session. localStorage may be unavailable.' };
  }

  return { success: true, user: result.user };
}