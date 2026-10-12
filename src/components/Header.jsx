import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export default function Header({
  onToggleSidebar,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  onRefresh,
  viewMode = 'grid',
  onToggleViewMode,
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const settingsRef = useRef(null);
  const appsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
      if (appsRef.current && !appsRef.current.contains(e.target)) {
        setShowAppsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh?.();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const googleApps = [
    { name: 'Search', icon: 'search' },
    { name: 'Maps', icon: 'location_on' },
    { name: 'YouTube', icon: 'smart_display' },
    { name: 'Play', icon: 'play_arrow' },
    { name: 'Gmail', icon: 'mail' },
    { name: 'Meet', icon: 'videocam' },
    { name: 'Drive', icon: 'add_to_drive' },
    { name: 'Calendar', icon: 'calendar_month' },
    { name: 'Keep', icon: 'lightbulb' },
  ];

  return (
    <header className={`keep-header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Left: Menu button, Logo, Brand title */}
      <div className="header-left">
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleSidebar}
          aria-label="Main menu"
          title="Main menu"
        >
          <Icon name="menu" size={24} />
        </button>

        <div className="header-brand">
          <img
            src="/keep-logo-light.png"
            alt="Keep Logo"
            className="keep-logo-img"
          />
          <span className="header-title">Keep</span>
        </div>
      </div>

      {/* Center: Search bar with search icon and clear button */}
      <div className="header-center">
        <div className="search-box">
          <div className="search-icon">
            <Icon name="search" size={22} />
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search"
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              title="Clear search"
            >
              <Icon name="close" size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Refresh, View mode, Settings, Apps, Profile */}
      <div className="header-right">
        {/* 1. Refresh */}
        <button
          type="button"
          className={`icon-btn ${isRefreshing ? 'refresh-spin' : ''}`}
          onClick={handleRefreshClick}
          title="Refresh"
          aria-label="Refresh"
        >
          <Icon name="refresh" size={24} />
        </button>

        {/* 2. View Layout Toggle */}
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleViewMode}
          title={viewMode === 'grid' ? 'List view' : 'Grid view'}
          aria-label={viewMode === 'grid' ? 'List view' : 'Grid view'}
        >
          <Icon name={viewMode === 'grid' ? 'view_agenda' : 'grid_view'} size={24} />
        </button>

        {/* 3. Settings */}
        <div className="popover-container" ref={settingsRef}>
          <button
            type="button"
            className={`icon-btn ${showSettingsMenu ? 'active' : ''}`}
            onClick={() => {
              setShowSettingsMenu((prev) => !prev);
              setShowAppsMenu(false);
            }}
            title="Settings"
            aria-label="Settings"
          >
            <Icon name="settings" size={24} />
          </button>

          {showSettingsMenu && (
            <div className="popover-dropdown settings-dropdown" onClick={(e) => e.stopPropagation()}>
              <div
                className="settings-menu-item"
                onClick={() => {
                  onToggleTheme();
                  setShowSettingsMenu(false);
                }}
              >
                <span>{theme === 'light' ? 'Enable dark theme' : 'Disable dark theme'}</span>
              </div>
              <div className="settings-menu-item" onClick={() => setShowSettingsMenu(false)}>
                <span>Settings</span>
              </div>
              <div className="settings-menu-item" onClick={() => setShowSettingsMenu(false)}>
                <span>Send feedback</span>
              </div>
              <div className="settings-menu-item" onClick={() => setShowSettingsMenu(false)}>
                <span>Help</span>
              </div>
              <div className="settings-menu-item" onClick={() => setShowSettingsMenu(false)}>
                <span>Keyboard shortcuts</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Google Apps */}
        <div className="popover-container" ref={appsRef}>
          <button
            type="button"
            className={`icon-btn ${showAppsMenu ? 'active' : ''}`}
            title="Google apps"
            aria-label="Google apps"
            onClick={() => {
              setShowAppsMenu((prev) => !prev);
              setShowSettingsMenu(false);
            }}
          >
            <Icon name="apps" size={24} />
          </button>

          {showAppsMenu && (
            <div className="popover-dropdown apps-grid-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="apps-grid">
                {googleApps.map((app) => (
                  <div
                    key={app.name}
                    className="app-item"
                    onClick={() => setShowAppsMenu(false)}
                    title={app.name}
                  >
                    <div className="app-item-icon">
                      <Icon name={app.icon} size={24} />
                    </div>
                    <span className="app-item-name">{app.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 5. User Profile Avatar */}
        <div className="account-profile-wrapper" title="Google Account">
          <img
            src="/account-image.png"
            alt="User profile"
            className="account-avatar"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <img
            src="/account-ring.png"
            alt=""
            className="account-ring"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>
    </header>
  );
}
