import React, { useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import ColorPalette from './ColorPalette';
import LabelSelector from './LabelSelector';
import ReminderPicker from './ReminderPicker';

export default function NoteCreator({
  onAddNote,
  allLabels = ['Personal', 'Work', 'Inspiration'],
  onAddCustomLabel,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('default');
  const [labels, setLabels] = useState([]);
  const [isPinned, setIsPinned] = useState(false);
  const [reminder, setReminder] = useState(null);

  const [showPalette, setShowPalette] = useState(false);
  const [showLabelSelector, setShowLabelSelector] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.max(46, textareaRef.current.scrollHeight)}px`;
    }
  }, [content, isExpanded]);

  // Save note helper
  const handleSave = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle || trimmedContent) {
      const newNote = {
        id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: trimmedTitle,
        content: trimmedContent,
        color: color || 'default',
        labels: labels,
        isPinned: isPinned,
        reminder: reminder,
        isArchived: false,
        isDeleted: false,
        updatedAt: new Date().toISOString(),
      };
      onAddNote(newNote);
    }

    // Reset state
    setTitle('');
    setContent('');
    setColor('default');
    setLabels([]);
    setIsPinned(false);
    setReminder(null);
    setShowPalette(false);
    setShowLabelSelector(false);
    setShowReminderPicker(false);
    setShowMoreMenu(false);
    setIsExpanded(false);
  };

  // Outside click auto-save
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isExpanded &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        handleSave();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded, title, content, color, labels, isPinned, reminder]);

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

  const handlePinClick = (e) => {
    e.stopPropagation();
    setIsPinned((prev) => !prev);
  };

  return (
    <div className="note-creator-wrapper" ref={containerRef}>
      <div
        className={`note-creator ${isExpanded ? 'expanded' : ''}`}
        data-color={color}
      >
        {!isExpanded ? (
          /* B. Collapsed Note Creator */
          <div
            className="note-creator-collapsed"
            onClick={() => setIsExpanded(true)}
          >
            <span className="note-creator-collapsed-text">Take a note...</span>
            <div className="note-creator-collapsed-actions">
              <button
                type="button"
                className="toolbar-btn"
                title="New list"
                aria-label="New list"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
              >
                <Icon name="check_box" size={20} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="New note with drawing"
                aria-label="New note with drawing"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
              >
                <Icon name="brush" size={20} />
              </button>
              <button
                type="button"
                className="toolbar-btn"
                title="New note with image"
                aria-label="New note with image"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(true);
                }}
              >
                <Icon name="image" size={20} />
              </button>
            </div>
          </div>
        ) : (
          /* C. Expanded Note Creator */
          <div className="note-creator-expanded">
            {/* Title Row */}
            <div className="note-creator-title-row">
              <input
                type="text"
                className="note-creator-title"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className={`pin-btn ${isPinned ? 'active' : ''}`}
                title={isPinned ? 'Unpin note' : 'Pin note'}
                aria-label={isPinned ? 'Unpin note' : 'Pin note'}
                onClick={handlePinClick}
              >
                <Icon name="push_pin" size={20} />
              </button>
            </div>

            {/* Body: Auto-resizing textarea */}
            <textarea
              ref={textareaRef}
              className="note-creator-content"
              placeholder="Take a note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
            />

            {/* Chips: Reminder & Label Badges */}
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

            {/* Bottom Toolbar */}
            <div className="note-creator-toolbar">
              <div className="toolbar-icons">
                {/* 1. Text formatting */}
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Text formatting"
                  aria-label="Text formatting"
                  onClick={() => {}}
                >
                  <Icon name="text_format" size={18} />
                </button>

                {/* 2. Background options */}
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

                {/* 3. Remind me */}
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

                {/* 4. Collaborator */}
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Collaborator"
                  aria-label="Collaborator"
                  onClick={() => {}}
                >
                  <Icon name="person_add" size={18} />
                </button>

                {/* 5. Add image */}
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Add image"
                  aria-label="Add image"
                  onClick={() => {}}
                >
                  <Icon name="image" size={18} />
                </button>

                {/* 6. More options */}
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
                        onClick={() => setShowMoreMenu(false)}
                      >
                        <Icon name="check_box" size={16} />
                        <span>Show checkboxes</span>
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

                {/* 7. Undo */}
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Undo"
                  aria-label="Undo"
                  onClick={() => {}}
                >
                  <Icon name="undo" size={18} />
                </button>

                {/* 8. Redo */}
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Redo"
                  aria-label="Redo"
                  onClick={() => {}}
                >
                  <Icon name="redo" size={18} />
                </button>
              </div>

              {/* 9. Right-aligned Close button */}
              <button
                type="button"
                className="close-btn"
                onClick={handleSave}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
