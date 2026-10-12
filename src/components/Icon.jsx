import React from 'react';

export default function Icon({ name, size = 20, className = '', style = {} }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: `${size}px`, width: `${size}px`, height: `${size}px`, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
