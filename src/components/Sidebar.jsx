import React from 'react';
import Icon from './Icon';

export default function Sidebar({
  isExpanded,
  isMobileOpen,
  onCloseMobile,
  activeFilter,
  onSelectFilter,
  labels = ['Personal', 'Work', 'Inspiration'],
  onOpenEditLabels,
}) {
  const isNotesActive = activeFilter.type === 'notes';
  const isArchiveActive = activeFilter.type === 'archive';
  const isTrashActive = activeFilter.type === 'trash';
  const isRemindersActive = activeFilter.type === 'reminders';

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      <div
        className={`sidebar-mobile-backdrop ${isMobileOpen ? 'open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <aside
        className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'} ${
          isMobileOpen ? 'mobile-open' : ''
        }`}
      >
        <div className="sidebar-inner">
          <nav className="sidebar-nav">
            {/* Notes */}
            <div
              className={`sidebar-item ${isNotesActive ? 'active' : ''}`}
              onClick={() => {
                onSelectFilter({ type: 'notes' });
                onCloseMobile();
              }}
              title="Notes"
            >
              <div className="sidebar-item-icon">
                <Icon name="lightbulb" size={24} />
              </div>
              <span className="sidebar-item-label">Notes</span>
            </div>

            {/* Reminders */}
            <div
              className={`sidebar-item ${isRemindersActive ? 'active' : ''}`}
              onClick={() => {
                onSelectFilter({ type: 'reminders' });
                onCloseMobile();
              }}
              title="Reminders"
            >
              <div className="sidebar-item-icon">
                <Icon name="notifications" size={24} />
              </div>
              <span className="sidebar-item-label">Reminders</span>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section-title">Labels</div>

            {/* Dynamic Labels */}
            {labels.map((lbl) => {
              const isLabelActive =
                activeFilter.type === 'label' && activeFilter.label === lbl;
              return (
                <div
                  key={lbl}
                  className={`sidebar-item ${isLabelActive ? 'active' : ''}`}
                  onClick={() => {
                    onSelectFilter({ type: 'label', label: lbl });
                    onCloseMobile();
                  }}
                  title={lbl}
                >
                  <div className="sidebar-item-icon">
                    <Icon name="label" size={22} />
                  </div>
                  <span className="sidebar-item-label">{lbl}</span>
                </div>
              );
            })}

            {/* Edit labels */}
            <div
              className="sidebar-item"
              onClick={() => {
                onCloseMobile();
                onOpenEditLabels?.();
              }}
              title="Edit labels"
            >
              <div className="sidebar-item-icon">
                <Icon name="edit" size={22} />
              </div>
              <span className="sidebar-item-label">Edit labels</span>
            </div>

            <div className="sidebar-divider" />

            {/* Archive */}
            <div
              className={`sidebar-item ${isArchiveActive ? 'active' : ''}`}
              onClick={() => {
                onSelectFilter({ type: 'archive' });
                onCloseMobile();
              }}
              title="Archive"
            >
              <div className="sidebar-item-icon">
                <Icon name="archive" size={22} />
              </div>
              <span className="sidebar-item-label">Archive</span>
            </div>

            {/* Trash */}
            <div
              className={`sidebar-item ${isTrashActive ? 'active' : ''}`}
              onClick={() => {
                onSelectFilter({ type: 'trash' });
                onCloseMobile();
              }}
              title="Trash"
            >
              <div className="sidebar-item-icon">
                <Icon name="delete" size={22} />
              </div>
              <span className="sidebar-item-label">Trash</span>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
