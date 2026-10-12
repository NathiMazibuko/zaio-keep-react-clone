import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export default function LabelSelector({
  allLabels = ['Personal', 'Work', 'Inspiration'],
  selectedLabels = [],
  onToggleLabel,
  onAddCustomLabel,
  onClose,
}) {
  const [newLabelText, setNewLabelText] = useState('');
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

  const handleCreate = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const trimmed = newLabelText.trim();
    if (trimmed) {
      onAddCustomLabel?.(trimmed);
      if (!selectedLabels.includes(trimmed)) {
        onToggleLabel(trimmed);
      }
      setNewLabelText('');
    }
  };

  return (
    <div
      ref={popoverRef}
      className="popover-dropdown label-selector-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="label-selector-header">Label note</div>
      <div className="label-selector-list">
        {allLabels.map((lbl) => {
          const isChecked = selectedLabels.includes(lbl);
          return (
            <div
              key={lbl}
              className="label-selector-item"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLabel(lbl);
              }}
            >
              <div className={`label-selector-checkbox ${isChecked ? 'checked' : ''}`}>
                {isChecked && <Icon name="check" size={14} style={{ color: '#ffffff' }} />}
              </div>
              <span className="label-selector-name">{lbl}</span>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleCreate} className="label-create-input-row">
        <input
          type="text"
          className="label-create-input"
          placeholder="Create new label..."
          value={newLabelText}
          onChange={(e) => setNewLabelText(e.target.value)}
          onClick={(e) => e.stopPropagation()}
        />
        {newLabelText.trim() && (
          <button type="submit" className="label-create-btn" title="Create label">
            <Icon name="add" size={16} />
          </button>
        )}
      </form>
    </div>
  );
}
