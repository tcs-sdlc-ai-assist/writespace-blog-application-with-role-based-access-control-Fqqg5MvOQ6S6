const BLOGS_KEY = 'ws_blogs';

function getStoredBlogs() {
  try {
    const raw = localStorage.getItem(BLOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveStoredBlogs(blogs) {
  try {
    localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs));
    return true;
  } catch {
    return false;
  }
}

export function getAllBlogs() {
  const blogs = getStoredBlogs();
  return blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function getBlogById(id) {
  if (!id) return null;
  const blogs = getStoredBlogs();
  return blogs.find((b) => b.id === id) || null;
}

export function createBlog(title, content, authorId, authorName, authorRole) {
  if (!title || !content || !authorId || !authorName || !authorRole) {
    return { success: false, error: 'All fields are required.' };
  }

  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle || !trimmedContent) {
    return { success: false, error: 'All fields are required.' };
  }

  if (trimmedTitle.length > 100) {
    return { success: false, error: 'Title must be 100 characters or less.' };
  }

  if (trimmedContent.length > 1000) {
    return { success: false, error: 'Content must be 1000 characters or less.' };
  }

  const now = new Date().toISOString();

  const newBlog = {
    id: crypto.randomUUID(),
    title: trimmedTitle,
    content: trimmedContent,
    author: {
      username: authorId,
      displayName: authorName,
      role: authorRole,
    },
    createdAt: now,
    updatedAt: now,
  };

  const blogs = getStoredBlogs();
  blogs.push(newBlog);

  const saved = saveStoredBlogs(blogs);
  if (!saved) {
    return { success: false, error: 'Failed to save blog post. localStorage may be unavailable.' };
  }

  return { success: true, blog: newBlog };
}

export function updateBlog(id, updates) {
  if (!id) {
    return { success: false, error: 'Blog ID is required.' };
  }

  const blogs = getStoredBlogs();
  const index = blogs.findIndex((b) => b.id === id);

  if (index === -1) {
    return { success: false, error: 'Post not found.' };
  }

  if (updates.title !== undefined) {
    const trimmedTitle = updates.title.trim();
    if (!trimmedTitle) {
      return { success: false, error: 'Title is required.' };
    }
    if (trimmedTitle.length > 100) {
      return { success: false, error: 'Title must be 100 characters or less.' };
    }
    updates.title = trimmedTitle;
  }

  if (updates.content !== undefined) {
    const trimmedContent = updates.content.trim();
    if (!trimmedContent) {
      return { success: false, error: 'Content is required.' };
    }
    if (trimmedContent.length > 1000) {
      return { success: false, error: 'Content must be 1000 characters or less.' };
    }
    updates.content = trimmedContent;
  }

  blogs[index] = {
    ...blogs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const saved = saveStoredBlogs(blogs);
  if (!saved) {
    return { success: false, error: 'Failed to update blog post. localStorage may be unavailable.' };
  }

  return { success: true, blog: blogs[index] };
}

export function deleteBlog(id) {
  if (!id) {
    return { success: false, error: 'Blog ID is required.' };
  }

  const blogs = getStoredBlogs();
  const index = blogs.findIndex((b) => b.id === id);

  if (index === -1) {
    return { success: false, error: 'Post not found.' };
  }

  blogs.splice(index, 1);

  const saved = saveStoredBlogs(blogs);
  if (!saved) {
    return { success: false, error: 'Failed to delete blog post. localStorage may be unavailable.' };
  }

  return { success: true };
}