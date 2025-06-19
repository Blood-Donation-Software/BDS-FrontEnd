'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * Avatar component with fallback support
 * @param {Object} props
 * @param {string} props.src - Avatar image URL
 * @param {string} props.name - User name for fallback
 * @param {string} props.email - User email for fallback
 * @param {number} props.size - Avatar size in pixels (default: 40)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.showBorder - Whether to show border (default: true)
 * @param {function} props.onClick - Click handler
 */
export default function Avatar({ 
  src, 
  name, 
  email, 
  size = 40, 
  className = "", 
  showBorder = true,
  onClick 
}) {
  const [imageError, setImageError] = useState(false);
  
  // Get fallback text (first letter of name or email)
  const getFallbackText = () => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };

  // Generate gradient colors based on name/email
  const getGradientColors = () => {
    const text = name || email || 'User';
    const colors = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600',
      'from-purple-500 to-pink-600',
      'from-yellow-500 to-red-600',
      'from-indigo-500 to-purple-600',
      'from-pink-500 to-rose-600',
      'from-cyan-500 to-blue-600',
      'from-emerald-500 to-teal-600'
    ];
    
    // Use the first character code to select a gradient
    const index = text.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const baseClasses = `
    rounded-full object-cover cursor-pointer transition-all duration-200 hover:scale-105
    ${showBorder ? 'border-2 border-gray-200' : ''}
    ${className}
  `;

  if (src && !imageError) {
    return (
      <Image
        src={src}
        alt={`${name || email || 'User'} avatar`}
        width={size}
        height={size}
        className={baseClasses}
        onClick={onClick}
        onError={() => setImageError(true)}
        style={{ width: size, height: size }}
      />
    );
  }

  // Fallback avatar
  return (
    <div
      className={`
        flex items-center justify-center text-white font-semibold
        bg-gradient-to-br ${getGradientColors()}
        ${baseClasses}
      `}
      style={{ 
        width: size, 
        height: size,
        fontSize: size * 0.4 // Font size scales with avatar size
      }}
      onClick={onClick}
    >
      {getFallbackText()}
    </div>
  );
}

/**
 * Avatar with status indicator
 */
export function AvatarWithStatus({ 
  status = 'offline', // 'online', 'offline', 'away', 'busy'
  statusSize = 12,
  ...props 
}) {
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500'
  };

  return (
    <div className="relative inline-block">
      <Avatar {...props} />
      <div 
        className={`
          absolute bottom-0 right-0 rounded-full border-2 border-white
          ${statusColors[status]}
        `}
        style={{ 
          width: statusSize, 
          height: statusSize,
          transform: 'translate(25%, 25%)'
        }}
      />
    </div>
  );
}

/**
 * Group of avatars (stack)
 */
export function AvatarGroup({ 
  users = [], 
  max = 3, 
  size = 32,
  className = "" 
}) {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  return (
    <div className={`flex ${className}`}>
      {visibleUsers.map((user, index) => (
        <div
          key={user.id || index}
          className="relative"
          style={{ 
            marginLeft: index > 0 ? `-${size * 0.25}px` : '0',
            zIndex: visibleUsers.length - index 
          }}
        >
          <Avatar
            src={user.avatar}
            name={user.name}
            email={user.email}
            size={size}
            showBorder={true}
            className="ring-2 ring-white"
          />
        </div>
      ))}
      
      {remainingCount > 0 && (
        <div
          className="
            flex items-center justify-center rounded-full
            bg-gray-100 border-2 border-white text-gray-600 text-xs font-medium
          "
          style={{ 
            width: size, 
            height: size,
            marginLeft: `-${size * 0.25}px`,
            zIndex: 0
          }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}
