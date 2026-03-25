const USERS_KEY = 'ws_users';

const HARD_CODED_ADMIN = {
  id: 'admin',
  displayName: 'Admin',
  username: 'admin',
  password: 'admin',
  role: 'admin',
};

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveStoredUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  } catch {
    return false;
  }
}

export function getAllUsers() {
  const stored = getStoredUsers();
  return [HARD_CODED_ADMIN, ...stored];
}

export function findUserByUsername(username) {
  if (!username) return null;
  const trimmed = username.trim().toLowerCase();
  if (HARD_CODED_ADMIN.username === trimmed) return HARD_CODED_ADMIN;
  const stored = getStoredUsers();
  return stored.find((u) => u.username.toLowerCase() === trimmed) || null;
}

export function isUsernameTaken(username) {
  if (!username) return false;
  return findUserByUsername(username) !== null;
}

export function saveUser(user) {
  if (!user || !user.username || !user.displayName || !user.password) {
    return { success: false, error: 'All fields are required.' };
  }

  const trimmedUsername = user.username.trim();
  const trimmedDisplayName = user.displayName.trim();

  if (!trimmedUsername || !trimmedDisplayName) {
    return { success: false, error: 'All fields are required.' };
  }

  if (isUsernameTaken(trimmedUsername)) {
    return { success: false, error: 'Username already exists.' };
  }

  const newUser = {
    id: user.id || crypto.randomUUID(),
    displayName: trimmedDisplayName,
    username: trimmedUsername,
    password: user.password,
    role: user.role || 'viewer',
  };

  const stored = getStoredUsers();
  stored.push(newUser);

  const saved = saveStoredUsers(stored);
  if (!saved) {
    return { success: false, error: 'Failed to save user. localStorage may be unavailable.' };
  }

  return { success: true, user: newUser };
}

export function deleteUser(userId) {
  if (!userId) {
    return { success: false, error: 'User ID is required.' };
  }

  if (userId === HARD_CODED_ADMIN.id) {
    return { success: false, error: 'Cannot delete the default admin user.' };
  }

  const stored = getStoredUsers();
  const index = stored.findIndex((u) => u.id === userId);

  if (index === -1) {
    return { success: false, error: 'User not found.' };
  }

  stored.splice(index, 1);

  const saved = saveStoredUsers(stored);
  if (!saved) {
    return { success: false, error: 'Failed to delete user. localStorage may be unavailable.' };
  }

  return { success: true };
}

export { HARD_CODED_ADMIN };