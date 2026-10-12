import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NoteCreator from './components/NoteCreator';
import NoteCard from './components/NoteCard';
import EditModal from './components/EditModal';
import EditLabelsModal from './components/EditLabelsModal';
import Icon from './components/Icon';

const INITIAL_SEED_NOTES = [
  {
    id: 'seed-1',
    title: 'Grocery & Weekend Shopping',
    content: '• Organic oat milk\n• Fresh avocados\n• Sourdough bread\n• Dark roast coffee beans\n• Greek yogurt',
    color: 'mint',
    labels: ['Personal'],
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    reminder: null,
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Q4 Product Roadmap Kickoff',
    content: 'Review sprint deliverables with design and engineering teams.\n- Finalize Google Keep clone MVP\n- Integrate color palette swatches\n- Verify responsive layout tokens\n- Test Material Symbols Outlined icons and grid layout',
    color: 'sand',
    labels: ['Work'],
    isPinned: true,
    isArchived: false,
    isDeleted: false,
    reminder: 'Tomorrow, 8:00 AM',
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Minimalist Architecture Idea',
    content: '"Simplicity is about subtracting the obvious and adding the meaningful."\nExplore clean UI patterns, fluid micro-interactions, and harmonic pastel contrasts across cards.',
    color: 'storm',
    labels: ['Inspiration'],
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    reminder: null,
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'seed-4',
    title: 'Quick Brainstorm Notes',
    content: 'Create notes with custom labels and filter them instantly using the sidebar rail.\nClick any card to open the rich modal editor and update colors or notes on the fly!',
    color: 'coral',
    labels: ['Work', 'Inspiration'],
    isPinned: false,
    isArchived: false,
    isDeleted: false,
    reminder: null,
    updatedAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

const INITIAL_LABELS = ['Personal', 'Work', 'Inspiration'];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('keep_theme') || 'light';
  });

  // View mode: 'grid' or 'list'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('keep_view_mode') || 'grid';
  });

  // Notes state
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('keep_notes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notes', e);
      }
    }
    return INITIAL_SEED_NOTES;
  });

  // Category labels state
  const [labels, setLabels] = useState(() => {
    const saved = localStorage.getItem('keep_labels');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved labels', e);
      }
    }
    return INITIAL_LABELS;
  });

  // Navigation filter state
  const [activeFilter, setActiveFilter] = useState({ type: 'notes' });

  // Search query
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar expansion & mobile drawer
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Edit Modal note
  const [editingNote, setEditingNote] = useState(null);

  // Edit Labels Modal state
  const [isEditLabelsOpen, setIsEditLabelsOpen] = useState(false);

  // Synchronize theme with <html> attribute and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('keep_theme', theme);
  }, [theme]);

  // Persist view mode
  useEffect(() => {
    localStorage.setItem('keep_view_mode', viewMode);
  }, [viewMode]);

  // Persist notes
  useEffect(() => {
    localStorage.setItem('keep_notes', JSON.stringify(notes));
  }, [notes]);

  // Persist labels
  useEffect(() => {
    localStorage.setItem('keep_labels', JSON.stringify(labels));
  }, [labels]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsMobileSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarExpanded((prev) => !prev);
    }
  };

  // Add custom label
  const handleAddCustomLabel = (newLabel) => {
    const trimmed = newLabel.trim();
    if (trimmed && !labels.includes(trimmed)) {
      setLabels((prev) => [...prev, trimmed]);
    }
  };

  // Rename label
  const handleRenameLabel = (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) return;

    setLabels((prev) => prev.map((l) => (l === oldName ? trimmed : l)));

    // Update label on all notes
    setNotes((prev) =>
      prev.map((n) => {
        if (!n.labels || !n.labels.includes(oldName)) return n;
        return {
          ...n,
          labels: n.labels.map((l) => (l === oldName ? trimmed : l)),
        };
      })
    );

    // Update active filter if current view was this label
    if (activeFilter.type === 'label' && activeFilter.label === oldName) {
      setActiveFilter({ type: 'label', label: trimmed });
    }
  };

  // Delete label
  const handleDeleteLabel = (labelToDelete) => {
    setLabels((prev) => prev.filter((l) => l !== labelToDelete));

    // Remove label from all notes
    setNotes((prev) =>
      prev.map((n) => {
        if (!n.labels || !n.labels.includes(labelToDelete)) return n;
        return {
          ...n,
          labels: n.labels.filter((l) => l !== labelToDelete),
        };
      })
    );

    // If currently filtered by this label, reset to notes view
    if (activeFilter.type === 'label' && activeFilter.label === labelToDelete) {
      setActiveFilter({ type: 'notes' });
    }
  };

  // Create note
  const handleAddNote = (newNote) => {
    setNotes((prev) => [newNote, ...prev]);
  };

  // Update note
  const handleUpdateNote = (updatedNote) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === updatedNote.id ? updatedNote : n))
    );
    if (editingNote && editingNote.id === updatedNote.id) {
      setEditingNote(updatedNote);
    }
  };

  // Soft Delete note (moves to trash)
  const handleSoftDeleteNote = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isDeleted: true } : n))
    );
    if (editingNote && editingNote.id === noteId) {
      setEditingNote(null);
    }
  };

  // Restore note from trash
  const handleRestoreNote = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, isDeleted: false } : n))
    );
  };

  // Permanently delete note
  const handlePermanentDeleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (editingNote && editingNote.id === noteId) {
      setEditingNote(null);
    }
  };

  // Empty trash
  const handleEmptyTrash = () => {
    setNotes((prev) => prev.filter((n) => !n.isDeleted));
  };

  // Change color
  const handleChangeColor = (noteId, color) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, color } : n))
    );
    if (editingNote && editingNote.id === noteId) {
      setEditingNote((prev) => ({ ...prev, color }));
    }
  };

  // Toggle label on a note
  const handleToggleLabel = (noteId, labelName) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        const noteLabels = n.labels || [];
        const updated = noteLabels.includes(labelName)
          ? noteLabels.filter((l) => l !== labelName)
          : [...noteLabels, labelName];
        return { ...n, labels: updated };
      })
    );
    if (editingNote && editingNote.id === noteId) {
      setEditingNote((prev) => {
        const noteLabels = prev.labels || [];
        const updated = noteLabels.includes(labelName)
          ? noteLabels.filter((l) => l !== labelName)
          : [...noteLabels, labelName];
        return { ...prev, labels: updated };
      });
    }
  };

  // Remove single label
  const handleRemoveLabel = (noteId, labelName) => {
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        return {
          ...n,
          labels: (n.labels || []).filter((l) => l !== labelName),
        };
      })
    );
    if (editingNote && editingNote.id === noteId) {
      setEditingNote((prev) => ({
        ...prev,
        labels: (prev.labels || []).filter((l) => l !== labelName),
      }));
    }
  };

  // Toggle Pin/Unpin a note
  const handleTogglePin = (noteId) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
      )
    );
    if (editingNote && editingNote.id === noteId) {
      setEditingNote((prev) => ({ ...prev, isPinned: !prev.isPinned }));
    }
  };

  // Toggle Archive
  const handleToggleArchive = (noteId) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
      )
    );
    if (editingNote && editingNote.id === noteId) {
      setEditingNote(null);
    }
  };

  // Set Reminder
  const handleSetReminder = (noteId, reminderText) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, reminder: reminderText } : note
      )
    );
    if (editingNote && editingNote.id === noteId) {
      setEditingNote((prev) => ({ ...prev, reminder: reminderText }));
    }
  };

  // Filter notes based on active view and search query
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // 1. View Type filtering
      if (activeFilter.type === 'trash') {
        if (!n.isDeleted) return false;
      } else if (activeFilter.type === 'archive') {
        if (n.isDeleted || !n.isArchived) return false;
      } else if (activeFilter.type === 'reminders') {
        if (n.isDeleted || n.isArchived || !n.reminder) return false;
      } else {
        // Standard view or Label view
        if (n.isDeleted || n.isArchived) return false;
        if (activeFilter.type === 'label') {
          if (!n.labels || !n.labels.includes(activeFilter.label)) {
            return false;
          }
        }
      }

      // 2. Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = (n.title || '').toLowerCase().includes(query);
        const bodyMatch = (n.content || '').toLowerCase().includes(query);
        const labelMatch = (n.labels || []).some((l) => l.toLowerCase().includes(query));
        return titleMatch || bodyMatch || labelMatch;
      }

      return true;
    });
  }, [notes, activeFilter, searchQuery]);

  // Separate pinned and unpinned notes (Trash view does not separate)
  const isTrash = activeFilter.type === 'trash';
  const pinnedNotes = useMemo(() => {
    if (isTrash) return [];
    return filteredNotes.filter((n) => Boolean(n.isPinned));
  }, [filteredNotes, isTrash]);

  const otherNotes = useMemo(() => {
    if (isTrash) return filteredNotes;
    return filteredNotes.filter((n) => !n.isPinned);
  }, [filteredNotes, isTrash]);

  return (
    <div className="app-container">
      {/* Sticky Header */}
      <Header
        onToggleSidebar={handleToggleSidebar}
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={() => {}}
        viewMode={viewMode}
        onToggleViewMode={toggleViewMode}
      />

      {/* Main Body */}
      <div className="app-body">
        {/* Sidebar */}
        <Sidebar
          isExpanded={isSidebarExpanded}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          labels={labels}
          onOpenEditLabels={() => setIsEditLabelsOpen(true)}
        />

        {/* Main Content Area */}
        <main className="main-content">
          {/* Active Label Banner */}
          {activeFilter.type === 'label' && (
            <div className="filter-active-banner">
              <div>
                Showing notes with label: <strong>{activeFilter.label}</strong>
              </div>
              <button
                type="button"
                className="filter-clear-link"
                onClick={() => setActiveFilter({ type: 'notes' })}
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Active Trash Banner */}
          {activeFilter.type === 'trash' && (
            <div className="filter-active-banner">
              <div>Notes in Trash are deleted after 7 days.</div>
              {filteredNotes.length > 0 && (
                <button
                  type="button"
                  className="filter-clear-link"
                  onClick={handleEmptyTrash}
                >
                  Empty Trash
                </button>
              )}
            </div>
          )}

          {/* Note Creator only on standard Notes view or Label view */}
          {activeFilter.type !== 'trash' && activeFilter.type !== 'archive' && (
            <NoteCreator
              onAddNote={handleAddNote}
              allLabels={labels}
              onAddCustomLabel={handleAddCustomLabel}
            />
          )}

          {/* Notes Grid / List View */}
          {filteredNotes.length > 0 ? (
            <div className="notes-sections-wrapper">
              {/* PINNED SECTION */}
              {pinnedNotes.length > 0 && (
                <section className="notes-section">
                  <h2 className="section-title">PINNED</h2>
                  <div className={`notes-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                    {pinnedNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onOpenEdit={setEditingNote}
                        onChangeColor={handleChangeColor}
                        onToggleLabel={handleToggleLabel}
                        onRemoveLabel={handleRemoveLabel}
                        onDeleteNote={handleSoftDeleteNote}
                        allLabels={labels}
                        onAddCustomLabel={handleAddCustomLabel}
                        onPinToggle={handleTogglePin}
                        onToggleArchive={handleToggleArchive}
                        onRestoreNote={handleRestoreNote}
                        onSetReminder={handleSetReminder}
                        isTrashView={false}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* OTHERS / MAIN SECTION */}
              {otherNotes.length > 0 && (
                <section className="notes-section">
                  {pinnedNotes.length > 0 && (
                    <h2 className="section-title">OTHERS</h2>
                  )}
                  <div className={`notes-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                    {otherNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onOpenEdit={setEditingNote}
                        onChangeColor={handleChangeColor}
                        onToggleLabel={handleToggleLabel}
                        onRemoveLabel={handleRemoveLabel}
                        onDeleteNote={
                          isTrash
                            ? handlePermanentDeleteNote
                            : handleSoftDeleteNote
                        }
                        allLabels={labels}
                        onAddCustomLabel={handleAddCustomLabel}
                        onPinToggle={handleTogglePin}
                        onToggleArchive={handleToggleArchive}
                        onRestoreNote={handleRestoreNote}
                        onSetReminder={handleSetReminder}
                        isTrashView={isTrash}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="empty-state">
              {activeFilter.type === 'trash' ? (
                <>
                  <Icon name="delete" className="empty-state-icon" />
                  <div className="empty-state-title">No notes in Trash</div>
                </>
              ) : activeFilter.type === 'archive' ? (
                <>
                  <Icon name="archive" className="empty-state-icon" />
                  <div className="empty-state-title">Your archived notes appear here</div>
                </>
              ) : activeFilter.type === 'reminders' ? (
                <>
                  <Icon name="notifications" className="empty-state-icon" />
                  <div className="empty-state-title">Notes with upcoming reminders appear here</div>
                </>
              ) : searchQuery ? (
                <>
                  <Icon name="search" className="empty-state-icon" />
                  <div className="empty-state-title">No matching results</div>
                  <div className="empty-state-desc">
                    Try searching for different keywords or check spelling.
                  </div>
                </>
              ) : activeFilter.type === 'label' ? (
                <>
                  <Icon name="label" className="empty-state-icon" />
                  <div className="empty-state-title">No notes with this label yet</div>
                  <div className="empty-state-desc">
                    Add notes above or tag existing notes with "{activeFilter.label}".
                  </div>
                </>
              ) : (
                <>
                  <Icon name="lightbulb" className="empty-state-icon" />
                  <div className="empty-state-title">Notes you add appear here</div>
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Centered Edit Modal */}
      {editingNote && (
        <EditModal
          note={editingNote}
          isOpen={Boolean(editingNote)}
          onClose={() => setEditingNote(null)}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleSoftDeleteNote}
          allLabels={labels}
          onAddCustomLabel={handleAddCustomLabel}
          onPinToggle={handleTogglePin}
          onToggleArchive={handleToggleArchive}
        />
      )}

      {/* Edit Labels Modal */}
      <EditLabelsModal
        isOpen={isEditLabelsOpen}
        onClose={() => setIsEditLabelsOpen(false)}
        labels={labels}
        onAddLabel={handleAddCustomLabel}
        onRenameLabel={handleRenameLabel}
        onDeleteLabel={handleDeleteLabel}
      />
    </div>
  );
}
