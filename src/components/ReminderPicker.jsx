import React, { useEffect, useRef } from 'react';
import Icon from './Icon';

export default function ReminderPicker({
  currentReminder,
  onSelectReminder,
  onRemoveReminder,
  onClose,
}) {
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

  const presetReminders = [
    { label: 'Later today', time: '8:00 PM' },
    { label: 'Tomorrow', time: '8:00 AM' },
    { label: 'Next week', time: 'Mon, 8:00 AM' },
  ];

  return (
    <div
      ref={popoverRef}
      className="popover-dropdown reminder-picker-dropdown"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="label-selector-header">Reminder:</div>
      <div className="reminder-picker-list">
        {presetReminders.map((preset) => {
          const reminderString = `${preset.label}, ${preset.time}`;
          const isSelected = currentReminder === reminderString;
          return (
            <div
              key={preset.label}
              className={`reminder-picker-item ${isSelected ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectReminder(reminderString);
                onClose?.();
              }}
            >
              <div className="reminder-item-text">
                <span className="reminder-item-label">{preset.label}</span>
                <span className="reminder-item-time">{preset.time}</span>
              </div>
            </div>
          );
        })}

        {currentReminder && (
          <div
            className="reminder-picker-item remove-reminder"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveReminder();
              onClose?.();
            }}
          >
            <Icon name="delete" size={16} />
            <span>Delete reminder</span>
          </div>
        )}
      </div>
    </div>
  );
}
