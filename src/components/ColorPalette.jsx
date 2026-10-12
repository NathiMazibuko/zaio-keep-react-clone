import React, { useEffect, useRef } from 'react';
import Icon from './Icon';

export const NOTE_COLORS = [
  { id: 'default', name: 'Default' },
  { id: 'coral', name: 'Coral' },
  { id: 'peach', name: 'Peach' },
  { id: 'sand', name: 'Sand' },
  { id: 'mint', name: 'Mint' },
  { id: 'sage', name: 'Sage' },
  { id: 'fog', name: 'Fog' },
  { id: 'storm', name: 'Storm' },
];

export default function ColorPalette({ selectedColor = 'default', onSelectColor, onClose }) {
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        onClose?.();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={popoverRef}
      className="popover-dropdown color-palette-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="color-palette-grid">
        {NOTE_COLORS.map((c) => {
          const isSelected = selectedColor === c.id;
          return (
            <button
              key={c.id}
              type="button"
              className={`color-swatch-btn swatch-${c.id} ${isSelected ? 'selected' : ''}`}
              title={c.name}
              onClick={(e) => {
                e.stopPropagation();
                onSelectColor(c.id);
                onClose?.();
              }}
            >
              {c.id === 'default' ? (
                isSelected ? (
                  <Icon name="check" size={16} />
                ) : (
                  <Icon name="format_color_reset" size={14} style={{ opacity: 0.6 }} />
                )
              ) : (
                isSelected && <Icon name="check" size={16} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
