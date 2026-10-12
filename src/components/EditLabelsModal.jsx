import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export default function EditLabelsModal({
  isOpen,
  onClose,
  labels = [],
  onAddLabel,
  onRenameLabel,
  onDeleteLabel,
}) {
  const [newLabelText, setNewLabelText] = useState('');
  const [editingLabels, setEditingLabels] = useState({});
  const [hoveredLabel, setHoveredLabel] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setNewLabelText('');
      setEditingLabels({});
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCreate = (e) => {
    e.preventDefault();
    const trimmed = newLabelText.trim();
    if (trimmed) {
      onAddLabel(trimmed);
      setNewLabelText('');
    }
  };

  const handleStartEdit = (lbl) => {
    setEditingLabels((prev) => ({ ...prev, [lbl]: lbl }));
  };

  const handleNameChange = (lbl, val) => {
    setEditingLabels((prev) => ({ ...prev, [lbl]: val }));
  };

  const handleSaveEdit = (oldName) => {
    const newName = (editingLabels[oldName] || '').trim();
    if (newName && newName !== oldName) {
      onRenameLabel(oldName, newName);
    }
    setEditingLabels((prev) => {
      const copy = { ...prev };
      delete copy[oldName];
      return copy;
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div
        className="modal-content edit-labels-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="edit-labels-header">
          <h3>Edit labels</h3>
        </div>

        {/* Create new label input row */}
        <form onSubmit={handleCreate} className="edit-labels-row create-row">
          <button
            type="button"
            className="edit-labels-action-btn"
            title={newLabelText ? "Cancel" : "Create label"}
            onClick={() => setNewLabelText('')}
          >
            <Icon name={newLabelText ? "close" : "add"} size={20} />
          </button>
          <input
            ref={inputRef}
            type="text"
            className="edit-labels-input"
            placeholder="Create new label"
            value={newLabelText}
            onChange={(e) => setNewLabelText(e.target.value)}
          />
          {newLabelText.trim() && (
            <button
              type="submit"
              className="edit-labels-action-btn submit-btn"
              title="Save label"
            >
              <Icon name="check" size={20} />
            </button>
          )}
        </form>

        {/* Existing labels list */}
        <div className="edit-labels-list">
          {labels.map((lbl) => {
            const isEditing = lbl in editingLabels;
            const currentVal = isEditing ? editingLabels[lbl] : lbl;

            return (
              <div
                key={lbl}
                className="edit-labels-row"
                onMouseEnter={() => setHoveredLabel(lbl)}
                onMouseLeave={() => setHoveredLabel(null)}
              >
                {/* Trash button to delete */}
                <button
                  type="button"
                  className="edit-labels-action-btn delete-btn"
                  title="Delete label"
                  onClick={() => onDeleteLabel(lbl)}
                >
                  <Icon
                    name={hoveredLabel === lbl ? "delete" : "label"}
                    size={20}
                  />
                </button>

                {/* Edit input */}
                <input
                  type="text"
                  className="edit-labels-input"
                  value={currentVal}
                  onFocus={() => handleStartEdit(lbl)}
                  onChange={(e) => handleNameChange(lbl, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveEdit(lbl);
                    }
                  }}
                  onBlur={() => handleSaveEdit(lbl)}
                />

                {/* Edit / Check icon */}
                <button
                  type="button"
                  className="edit-labels-action-btn"
                  title={isEditing ? "Save name" : "Rename label"}
                  onClick={() => {
                    if (isEditing) {
                      handleSaveEdit(lbl);
                    } else {
                      handleStartEdit(lbl);
                    }
                  }}
                >
                  <Icon name={isEditing ? "check" : "edit"} size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Done button */}
        <div className="edit-labels-footer">
          <button type="button" className="close-btn" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
