import React from 'react';

const AVATAR_CONFIG = {
  admin: {
    emoji: '👑',
    bg: 'bg-violet-500',
    label: 'Admin',
  },
  viewer: {
    emoji: '📖',
    bg: 'bg-indigo-500',
    label: 'Viewer',
  },
};

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-14 h-14 text-2xl',
};

export function getAvatar(role, size = 'md') {
  const config = AVATAR_CONFIG[role] || {
    emoji: '👤',
    bg: 'bg-gray-500',
    label: 'User',
  };

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  return (
    <span
      className={`${config.bg} ${sizeClass} inline-flex items-center justify-center rounded-full text-white select-none`}
      aria-label={`${config.label} avatar`}
      role="img"
    >
      {config.emoji}
    </span>
  );
}