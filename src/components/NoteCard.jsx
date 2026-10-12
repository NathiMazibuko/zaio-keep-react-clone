import React, { useState } from 'react';
import Icon from './Icon';
import ColorPalette from './ColorPalette';
import LabelSelector from './LabelSelector';
import ReminderPicker from './ReminderPicker';

export default function NoteCard({
  note,
  onOpenEdit,
  onChangeColor,
  onToggleLabel,
  onRemoveLabel,
  onDeleteNote,
  allLabels = ['Personal', 'Work', 'Inspiration'],
  onAddCustomLabel,
  onPinToggle = () => {},
  onToggleArchive,
  onRestoreNote,
  onSetReminder,
  isTrashView = false,
}) {
  const [showPalette, setShowPalette] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const hasAnyPopover = showPalette || showLabels || showReminderPicker || showMoreMenu;

  const handlePin = (e) => {
    e.stopPropagation();
    onPinToggle(note.id);
  };

  const handleCheck = (e) => {
    e.stopPropagation();
    setIsSelected((prev) => !prev);
  };

  return (
    <div
      className={`note-card ${hasAnyPopover ? 'active-popover' : ''} ${isSelected ? 'selected-card' : ''} ${isTrashView ? 'trash-card' : ''}`}
      data-color={note.color || 'default'}
      onClick={() => {
        if (!isTrashView) {
          onOpenEdit(note);
        }
      }}
    >
      {/* Selection checkbox (active when not in trash) */}
      {!isTrashView && (
        <button
          type="button"
          className={`card-select-badge ${isSelected ? 'checked' : ''}`}
          title="Select note"
          aria-label="Select note"
          onClick={handleCheck}
        >
          <Icon name="check" size={16} />
        </button>
      )}

      {/* Pin button (active when not in trash) */}
      {!isTrashView && (
        <button
          type="button"
          className={`card-pin-btn ${note.isPinned ? 'active' : ''}`}
          title={note.isPinned ? 'Unpin note' : 'Pin note'}
          aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
          onClick={handlePin}
        >
          <Icon name="push_pin" size={20} />
        </button>
      )}

      {/* Title */}
      {note.title && <div className="note-card-title">{note.title}</div>}

      {/* Content */}
      {note.content && <div className="note-card-body">{note.content}</div>}

      {/* Reminder & Label Chips */}
      {((note.reminder && !isTrashView) || (note.labels && note.labels.length > 0)) && (
        <div className="note-labels-badges">
          {note.reminder && !isTrashView && (
            <span
              className="label-badge reminder-badge"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="schedule" size={13} />
              <span>{note.reminder}</span>
              <button
                type="button"
                className="label-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetReminder?.(note.id, null);
                }}
                title="Delete reminder"
              >
                <Icon name="close" size={13} />
              </button>
            </span>
          )}
          {note.labels && note.labels.map((lbl) => (
            <span
              key={lbl}
              className="label-badge"
              onClick={(e) => e.stopPropagation()}
            >
              <span>{lbl}</span>
              {!isTrashView && (
                <button
                  type="button"
                  className="label-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveLabel(note.id, lbl);
                  }}
                  title={`Remove ${lbl}`}
                >
                  <Icon name="close" size={13} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer Toolbar */}
      <div className="note-card-footer" onClick={(e) => e.stopPropagation()}>
        {isTrashView ? (
          /* Trash View Actions: Delete forever & Restore note */
          <div className="trash-card-actions">
            <button
              type="button"
              className="toolbar-btn"
              title="Delete forever"
              aria-label="Delete forever"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNote(note.id);
              }}
            >
              <Icon name="delete_forever" size={18} />
            </button>
            <button
              type="button"
              className="toolbar-btn"
              title="Restore"
              aria-label="Restore"
              onClick={(e) => {
                e.stopPropagation();
                onRestoreNote?.(note.id);
              }}
            >
              <Icon name="restore_from_trash" size={18} />
            </button>
          </div>
        ) : (
          /* Normal View Actions */
          <div className="note-card-actions">
            {/* 1. Background options */}
            <div className="popover-container">
              <button
                type="button"
                className={`toolbar-btn ${showPalette ? 'active' : ''}`}
                title="Background options"
                aria-label="Background options"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPalette(!showPalette);
                  setShowLabels(false);
                  setShowReminderPicker(false);
                  setShowMoreMenu(false);
                }}
              >
                <Icon name="palette" size={17} />
              </button>
              {showPalette && (
                <ColorPalette
                  selectedColor={note.color || 'default'}
                  onSelectColor={(c) => onChangeColor(note.id, c)}
                  onClose={() => setShowPalette(false)}
                />
              )}
            </div>

            {/* 2. Remind me */}
            <div className="popover-container">
              <button
                type="button"
                className={`toolbar-btn ${showReminderPicker ? 'active' : ''}`}
                title="Remind me"
                aria-label="Remind me"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReminderPicker(!showReminderPicker);
                  setShowPalette(false);
                  setShowLabels(false);
                  setShowMoreMenu(false);
                }}
              >
                <Icon name="add_alert" size={17} />
              </button>
              {showReminderPicker && (
                <ReminderPicker
                  currentReminder={note.reminder}
                  onSelectReminder={(rem) => onSetReminder?.(note.id, rem)}
                  onRemoveReminder={() => onSetReminder?.(note.id, null)}
                  onClose={() => setShowReminderPicker(false)}
                />
              )}
            </div>

            {/* 3. Collaborator */}
            <button
              type="button"
              className="toolbar-btn"
              title="Collaborator"
              aria-label="Collaborator"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="person_add" size={17} />
            </button>

            {/* 4. Add image */}
            <button
              type="button"
              className="toolbar-btn"
              title="Add image"
              aria-label="Add image"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon name="image" size={17} />
            </button>

            {/* 5. Archive / Unarchive */}
            <button
              type="button"
              className="toolbar-btn"
              title={note.isArchived ? "Unarchive" : "Archive"}
              aria-label={note.isArchived ? "Unarchive" : "Archive"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleArchive?.(note.id);
              }}
            >
              <Icon name={note.isArchived ? "unarchive" : "archive"} size={17} />
            </button>

            {/* 6. More options */}
            <div className="popover-container">
              <button
                type="button"
                className={`toolbar-btn ${showMoreMenu || showLabels ? 'active' : ''}`}
                title="More"
                aria-label="More options"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreMenu(!showMoreMenu);
                  setShowPalette(false);
                  setShowReminderPicker(false);
                  setShowLabels(false);
                }}
              >
                <Icon name="more_vert" size={17} />
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
                      setShowLabels(true);
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
                      onDeleteNote(note.id);
                    }}
                  >
                    <Icon name="delete" size={16} />
                    <span>Delete note</span>
                  </div>
                </div>
              )}

              {showLabels && (
                <LabelSelector
                  allLabels={allLabels}
                  selectedLabels={note.labels || []}
                  onToggleLabel={(lbl) => onToggleLabel(note.id, lbl)}
                  onAddCustomLabel={onAddCustomLabel}
                  onClose={() => setShowLabels(false)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
