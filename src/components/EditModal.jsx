import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';
import ColorPalette from './ColorPalette';
import LabelSelector from './LabelSelector';
import ReminderPicker from './ReminderPicker';

export default function EditModal({
  note,
  isOpen,
  onClose,
  onUpdateNote,
  onDeleteNote,
  allLabels = ['Personal', 'Work', 'Inspiration'],
  onAddCustomLabel,
  onPinToggle = () => {},
  onToggleArchive,
}) {
  if (!isOpen || !note) return null;

  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');
  const [color, setColor] = useState(note.color || 'default');
  const [labels, setLabels] = useState(note.labels || []);
  const [reminder, setReminder] = useState(note.reminder || null);

  const [showPalette, setShowPalette] = useState(false);
  const [showLabelSelector, setShowLabelSelector] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
    setColor(note.color || 'default');
    setLabels(note.labels || []);
    setReminder(note.reminder || null);
  }, [note]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [content]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSaveAndClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [title, content, color, labels, reminder]);

  const handleSaveAndClose = () => {
    onUpdateNote({
      ...note,
      title: title.trim(),
      content: content.trim(),
      color: color || 'default',
      labels: labels,
      reminder: reminder,
      updatedAt: new Date().toISOString(),
    });
    setShowPalette(false);
    setShowLabelSelector(false);
    setShowReminderPicker(false);
    setShowMoreMenu(false);
    onClose();
  };

  const handleToggleLabel = (labelName) => {
    setLabels((prev) =>
      prev.includes(labelName)
        ? prev.filter((l) => l !== labelName)
        : [...prev, labelName]
    );
  };

  const handleRemoveLabel = (labelName) => {
    setLabels((prev) => prev.filter((l) => l !== labelName));
  };

  const handleDelete = () => {
    onDeleteNote(note.id);
    onClose();
  };

  const handlePin = (e) => {
    e.stopPropagation();
    onPinToggle(note.id);
  };

  const handleArchive = () => {
    onToggleArchive?.(note.id);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleSaveAndClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="modal-content"
        data-color={color}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title row with pin button */}
        <div className="note-creator-title-row">
          <input
            type="text"
            className="modal-title-input"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button
            type="button"
            className={`pin-btn ${note.isPinned ? 'active' : ''}`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
            aria-label={note.isPinned ? "Unpin note" : "Pin note"}
            onClick={handlePin}
          >
            <Icon name="push_pin" size={20} />
          </button>
        </div>

        {/* Note body */}
        <textarea
          ref={textareaRef}
          className="modal-body-textarea"
          placeholder="Note"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        {/* Reminder & Labels badges */}
        {(reminder || labels.length > 0) && (
          <div className="note-labels-badges">
            {reminder && (
              <span className="label-badge reminder-badge">
                <Icon name="schedule" size={13} />
                <span>{reminder}</span>
                <button
                  type="button"
                  className="label-remove-btn"
                  onClick={() => setReminder(null)}
                  title="Delete reminder"
                >
                  <Icon name="close" size={13} />
                </button>
              </span>
            )}
            {labels.map((lbl) => (
              <span key={lbl} className="label-badge">
                <span>{lbl}</span>
                <button
                  type="button"
                  className="label-remove-btn"
                  onClick={() => handleRemoveLabel(lbl)}
                  title={`Remove ${lbl}`}
                >
                  <Icon name="close" size={13} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Modal Toolbar & Close */}
        <div className="modal-footer">
          <div className="toolbar-icons">
            {/* Background options */}
            <div className="popover-container">
              <button
                type="button"
                className={`toolbar-btn ${showPalette ? 'active' : ''}`}
                title="Background options"
                aria-label="Background options"
                onClick={() => {
                  setShowPalette(!showPalette);
                  setShowLabelSelector(false);
                  setShowReminderPicker(false);
                  setShowMoreMenu(false);
                }}
              >
                <Icon name="palette" size={18} />
              </button>
              {showPalette && (
                <ColorPalette
                  selectedColor={color}
                  onSelectColor={(c) => setColor(c)}
                  onClose={() => setShowPalette(false)}
                />
              )}
            </div>

            {/* Remind me */}
            <div className="popover-container">
              <button
                type="button"
                className={`toolbar-btn ${showReminderPicker ? 'active' : ''}`}
                title="Remind me"
                aria-label="Remind me"
                onClick={() => {
                  setShowReminderPicker(!showReminderPicker);
                  setShowPalette(false);
                  setShowLabelSelector(false);
                  setShowMoreMenu(false);
                }}
              >
                <Icon name="add_alert" size={18} />
              </button>
              {showReminderPicker && (
                <ReminderPicker
                  currentReminder={reminder}
                  onSelectReminder={(rem) => setReminder(rem)}
                  onRemoveReminder={() => setReminder(null)}
                  onClose={() => setShowReminderPicker(false)}
                />
              )}
            </div>

            {/* Collaborator */}
            <button type="button" className="toolbar-btn" title="Collaborator" aria-label="Collaborator">
              <Icon name="person_add" size={18} />
            </button>

            {/* Add image */}
            <button type="button" className="toolbar-btn" title="Add image" aria-label="Add image">
              <Icon name="image" size={18} />
            </button>

            {/* Archive / Unarchive */}
            <button
              type="button"
              className="toolbar-btn"
              title={note.isArchived ? "Unarchive" : "Archive"}
              aria-label={note.isArchived ? "Unarchive" : "Archive"}
              onClick={handleArchive}
            >
              <Icon name={note.isArchived ? "unarchive" : "archive"} size={18} />
            </button>

            {/* More options */}
            <div className="popover-container">
              <button
                type="button"
                className={`toolbar-btn ${showMoreMenu || showLabelSelector ? 'active' : ''}`}
                title="More"
                aria-label="More options"
                onClick={() => {
                  setShowMoreMenu(!showMoreMenu);
                  setShowPalette(false);
                  setShowReminderPicker(false);
                  setShowLabelSelector(false);
                }}
              >
                <Icon name="more_vert" size={18} />
              </button>

              {showMoreMenu && (
                <div
                  className="popover-dropdown label-selector-menu"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="label-selector-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoreMenu(false);
                      setShowLabelSelector(true);
                    }}
                  >
                    <Icon name="label" size={16} />
                    <span>Add label</span>
                  </div>
                  <div
                    className="label-selector-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoreMenu(false);
                      handleDelete();
                    }}
                  >
                    <Icon name="delete" size={16} />
                    <span>Delete note</span>
                  </div>
                </div>
              )}

              {showLabelSelector && (
                <LabelSelector
                  allLabels={allLabels}
                  selectedLabels={labels}
                  onToggleLabel={handleToggleLabel}
                  onAddCustomLabel={onAddCustomLabel}
                  onClose={() => setShowLabelSelector(false)}
                />
              )}
            </div>

            {/* Undo */}
            <button type="button" className="toolbar-btn" title="Undo" aria-label="Undo">
              <Icon name="undo" size={18} />
            </button>

            {/* Redo */}
            <button type="button" className="toolbar-btn" title="Redo" aria-label="Redo">
              <Icon name="redo" size={18} />
            </button>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={handleSaveAndClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
