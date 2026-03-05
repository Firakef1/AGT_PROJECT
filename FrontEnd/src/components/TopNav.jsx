import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  X,
  Users,
  Building2,
  Wallet,
  PackageCheck,
  FileBarChart,
  UserPlus,
  ClipboardCheck,
  AlertTriangle,
  Camera,
  Upload,
} from "lucide-react";

// ── Static searchable data (replace with API calls when backend is ready) ──
const searchData = [
  {
    type: "member",
    label: "Abebe Kebede",
    sub: "Member · Gospel Division",
    page: "members",
  },
  {
    type: "member",
    label: "Tigist Alemu",
    sub: "Member · Media Division",
    page: "members",
  },
  {
    type: "member",
    label: "Dawit Haile",
    sub: "Member · Worship Division",
    page: "members",
  },
  {
    type: "member",
    label: "Selam Tesfaye",
    sub: "Member · Youth Division",
    page: "members",
  },
  {
    type: "division",
    label: "Gospel Division",
    sub: "Division · 45 members",
    page: "divisions",
  },
  {
    type: "division",
    label: "Media Team",
    sub: "Division · 12 members",
    page: "divisions",
  },
  {
    type: "division",
    label: "Worship Division",
    sub: "Division · 30 members",
    page: "divisions",
  },
  {
    type: "division",
    label: "Youth Division",
    sub: "Division · 28 members",
    page: "divisions",
  },
  {
    type: "finance",
    label: "Monthly Budget Report",
    sub: "Finance · June 2025",
    page: "finance",
  },
  {
    type: "finance",
    label: "Q3 Income Statement",
    sub: "Finance · 2025",
    page: "finance",
  },
  {
    type: "finance",
    label: "Media Team Expense",
    sub: "Finance · 12,000 ETB",
    page: "finance",
  },
  {
    type: "inventory",
    label: "Sound System Cables",
    sub: "Inventory · Low stock",
    page: "inventory",
  },
  {
    type: "inventory",
    label: "Projector Set",
    sub: "Inventory · In stock",
    page: "inventory",
  },
  {
    type: "inventory",
    label: "Microphone Stand",
    sub: "Inventory · In stock",
    page: "inventory",
  },
  {
    type: "report",
    label: "Q3 Quarterly Report",
    sub: "Reports · 2025",
    page: "reports",
  },
  {
    type: "report",
    label: "Annual Budget Summary",
    sub: "Reports · 2025",
    page: "reports",
  },
];

// ── Type → color map ──
const typeColor = {
  member: "#1a56db",
  division: "#d97706",
  finance: "#16a34a",
  inventory: "#dc2626",
  report: "#7c3aed",
  alert: "#d97706",
};

// ── Notification type -> destination page ──
const typeToPage = {
  member: "members",
  finance: "finance",
  inventory: "inventory",
  report: "reports",
  alert: "inventory",
  division: "divisions",
};

// ── Type → icon map ──
const typeIconMap = {
  member: Users,
  division: Building2,
  finance: Wallet,
  inventory: PackageCheck,
  report: FileBarChart,
};

// ── Static notifications (replace with API when backend is ready) ──
const initialNotifications = [
  {
    id: 1,
    type: "member",
    title: "New Member Joined",
    message: "Abebe Kebede joined Gospel Division.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "finance",
    title: "Budget Approved",
    message: "Monthly budget for Media team has been finalized.",
    time: "Yesterday",
    read: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Low Inventory Alert",
    message: "Sound system cables are running low and need replacement.",
    time: "3 days ago",
    read: true,
  },
  {
    id: 4,
    type: "report",
    title: "Quarterly Report Ready",
    message: "Q3 management report is ready for review.",
    time: "4 days ago",
    read: true,
  },
];

const TopNav = ({ onLogout, setActivePage }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifications);

  // ── Profile photo state ──
  const [profileImage, setProfileImage] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const fileInputRef = useRef(null);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const filteredResults =
    searchQuery.trim().length > 1
      ? searchData.filter(
          (item) =>
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.sub.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
        setProfileOpen(false);
        setShowUploadModal(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchOpen(true);
    setNotifOpen(false);
    setProfileOpen(false);
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleResultClick = (page) => {
    if (setActivePage) setActivePage(page);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const handleNotifToggle = () => {
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
    setSearchOpen(false);
  };

  const handleProfileToggle = () => {
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
    setSearchOpen(false);
  };

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markOneRead = (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleProfileNav = (page) => {
    if (setActivePage) setActivePage(page);
    setProfileOpen(false);
  };

  // ── Profile photo upload handlers ──
  const openUploadModal = () => {
    setPreviewImage(profileImage);
    setShowUploadModal(true);
    setProfileOpen(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSavePhoto = () => {
    setProfileImage(previewImage);
    setShowUploadModal(false);
  };

  const handleCancelUpload = () => {
    setPreviewImage(null);
    setShowUploadModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
    setPreviewImage(null);
    setShowUploadModal(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <header className="top-nav">
      {/* ── Search ── */}
      <div className="nav-left">
        <div className="search-wrapper" ref={searchRef}>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search members, transactions..."
            className="top-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => searchQuery.trim().length > 1 && setSearchOpen(true)}
            autoComplete="off"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={handleSearchClear}
              title="Clear search"
            >
              <X size={13} />
            </button>
          )}

          {/* Search dropdown */}
          {searchOpen && (
            <div className="search-dropdown">
              {filteredResults.length > 0 ? (
                <>
                  <div className="search-dropdown-label">Results</div>
                  {filteredResults.map((item, idx) => {
                    const Icon = typeIconMap[item.type] || Search;
                    return (
                      <button
                        key={idx}
                        className="search-result-item"
                        onClick={() => handleResultClick(item.page)}
                      >
                        <span
                          className="search-result-icon-wrap"
                          style={{ background: typeColor[item.type] + "18" }}
                        >
                          <Icon size={13} color={typeColor[item.type]} />
                        </span>
                        <div className="search-result-text">
                          <span className="search-result-label">
                            {item.label}
                          </span>
                          <span className="search-result-sub">{item.sub}</span>
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : searchQuery.trim().length > 1 ? (
                <div className="search-no-results">
                  No results for <strong>"{searchQuery}"</strong>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* ── Right side ── */}
      <div className="nav-right">
        {/* Notifications */}
        <div className="nav-notifications" ref={notifRef}>
          <button
            className={`notification-btn ${notifOpen ? "active" : ""}`}
            onClick={handleNotifToggle}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">
                <div className="notif-header-left">
                  <span className="notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="notif-count-pill">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>

              <div className="notif-list">
                {notifs.map((n) => {
                  const color = typeColor[n.type] || "#6b7280";
                  const Icon = typeIconMap[n.type] || Bell;
                  return (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? "unread" : ""}`}
                      onClick={() => {
                        markOneRead(n.id);
                        if (setActivePage && typeToPage[n.type]) {
                          setActivePage(typeToPage[n.type]);
                        }
                        setNotifOpen(false);
                      }}
                    >
                      <span
                        className="notif-item-icon"
                        style={{ background: color + "18" }}
                      >
                        <Icon size={14} color={color} />
                      </span>
                      <div className="notif-item-content">
                        <span className="notif-item-title">{n.title}</span>
                        <span className="notif-item-msg">{n.message}</span>
                        <span className="notif-item-time">{n.time}</span>
                      </div>
                      {!n.read && <span className="notif-unread-dot" />}
                    </div>
                  );
                })}
              </div>

              {notifs.every((n) => n.read) && (
                <div className="notif-all-read">
                  <Bell size={20} color="var(--gray-300)" />
                  <span>You're all caught up</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── User Profile ── */}
        <div
          className={`user-profile ${profileOpen ? "active" : ""}`}
          ref={profileRef}
          onClick={handleProfileToggle}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Super Admin</span>
          </div>

          {/* Avatar — shows uploaded photo or initials fallback */}
          <div className="user-avatar">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="avatar-img" />
            ) : (
              <span>AU</span>
            )}
          </div>

          <ChevronDown
            size={14}
            color="var(--gray-400)"
            className={`profile-chevron ${profileOpen ? "open" : ""}`}
          />

          {profileOpen && (
            <div
              className="profile-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dropdown header — also shows uploaded photo */}
              <div className="profile-dropdown-top">
                <div className="profile-dropdown-avatar">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="avatar-img"
                    />
                  ) : (
                    "AU"
                  )}
                </div>
                <div className="profile-dropdown-info">
                  <span className="profile-dropdown-name">Admin User</span>
                  <span className="profile-dropdown-role">Super Admin</span>
                </div>
              </div>

              <div className="profile-dropdown-divider" />

              {/* Change Photo */}
              <button
                className="profile-dropdown-item"
                onClick={openUploadModal}
              >
                <Camera size={15} />
                Change Photo
              </button>

              <div className="profile-dropdown-divider" />

              <button
                className="profile-dropdown-item"
                onClick={() => handleProfileNav("settings")}
              >
                <Settings size={15} />
                Settings
              </button>

              <div className="profile-dropdown-divider" />

              <button
                className="profile-dropdown-item danger"
                onClick={onLogout}
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Profile Photo Upload Modal ── */}
      {showUploadModal && (
        <div className="avatar-upload-overlay" onClick={handleCancelUpload}>
          <div
            className="avatar-upload-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="avatar-upload-header">
              <span className="avatar-upload-title">Change Profile Photo</span>
              <button
                className="avatar-upload-close"
                onClick={handleCancelUpload}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* Modal body */}
            <div className="avatar-upload-body">
              {/* Current / preview image */}
              <div className="avatar-upload-current">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="avatar-upload-img"
                  />
                ) : (
                  <div className="avatar-upload-placeholder">
                    <span>AU</span>
                  </div>
                )}
                {previewImage && (
                  <span className="avatar-upload-preview-label">Preview</span>
                )}
              </div>

              {/* Drop / click zone */}
              <div
                className="avatar-upload-zone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Upload size={20} color="var(--gray-400)" />
                <span className="avatar-upload-zone-text">
                  {previewImage
                    ? "Click to choose a different photo"
                    : "Click to browse or drag a photo here"}
                </span>
                <small className="avatar-upload-zone-hint">
                  JPG, PNG or GIF · Max 5 MB
                </small>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="avatar-file-input"
                onChange={handleFileSelect}
              />
            </div>

            {/* Modal footer */}
            <div className="avatar-upload-footer">
              {profileImage && (
                <button
                  className="avatar-upload-btn remove"
                  onClick={handleRemovePhoto}
                >
                  Remove Photo
                </button>
              )}
              <div className="avatar-upload-footer-right">
                <button
                  className="avatar-upload-btn cancel"
                  onClick={handleCancelUpload}
                >
                  Cancel
                </button>
                <button
                  className="avatar-upload-btn save"
                  onClick={handleSavePhoto}
                  disabled={!previewImage || previewImage === profileImage}
                >
                  Save Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopNav;
