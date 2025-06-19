'use client';

import { useState } from 'react';

/**
 * Simple Switch/Toggle component
 * @param {Object} props
 * @param {boolean} props.checked - Whether the switch is checked
 * @param {function} props.onCheckedChange - Callback when switch state changes
 * @param {boolean} props.disabled - Whether the switch is disabled
 * @param {string} props.id - HTML id attribute
 * @param {string} props.className - Additional CSS classes
 */
export function Switch({ 
  checked = false, 
  onCheckedChange, 
  disabled = false, 
  id, 
  className = "" 
}) {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    if (disabled) return;
    
    const newChecked = !isChecked;
    setIsChecked(newChecked);
    onCheckedChange?.(newChecked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      id={id}
      onClick={handleToggle}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
        ${isChecked 
          ? 'bg-blue-600 focus:ring-blue-600' 
          : 'bg-gray-200 focus:ring-gray-300'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2'
        }
        ${className}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
          ${isChecked ? 'translate-x-6' : 'translate-x-1'}
          ${disabled ? '' : 'shadow-lg'}
        `}
      />
    </button>
  );
}
