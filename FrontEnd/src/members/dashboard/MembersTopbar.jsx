import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  User,
  ChevronDown,
  LogOut,
  Settings,
  UserPlus,
  UsersRound,
  UserCheck,
  X,
  ArrowLeft,
} from "lucide-react";

// ── Page title map ────────────────────────────────────────────────────────────
const PAGE_TITLES = {
  overview:      "Overview",
  members:       "Members Management",
  families:      "Families & Groups",
  attendance:    "Attendance",
  events:        "Events",
  notifications: "Notifications",
};

// ── Sample notifications ──────────────────────────────────────────────────────
const INITIAL_NOTIFS = [
  {
    id: 1,
    icon: UserPlus,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
    title: "New Member Registered",
    message: "Hiwot Girma has been added to the fellowship.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    icon: UsersRound,
    iconBg: "#fef3e2",
    iconColor: "#d97706",
    title: "Family Group Updated",
    message: "Eben-ezer Group now has 5 members assigned.",
    time: "Yesterday",
    read: false,
  },
  {
    id: 3,
    icon: UserCheck,
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    title: "Member Status Changed",
    message: "3 members have been marked as Active after follow-up.",
    time: "2 days ago",
    read: false,
  },
  {
    id: 4,
    icon: UsersRound,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
    title: "New Group Created",
    message: "Zion Group was created with Kaleb Girma as leader.",
    time: "1 week ago",
    read: true,
  },
];

/**
 * MembersTopbar
 *
 * Top navigation bar for the Members Division Dashboard.
 *
 * Props:
 *   activePage {string}   – current page key (used to derive the title)
 *   onLogout   {function} – called when the user signs out
 */
const MembersTopbar = ({ user, activePage, onLogout, onBack, canGoBack }) => {
  const [notifs, setNotifs]           = useState(INITIAL_NOTIFS);
  const [notifOpen, setNotifOpen]     = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const pageTitle   = PAGE_TITLES[activePage] ?? "Members Division";

  // ── Close dropdowns when clicking outside ────────────────────────────────
  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  // ── Close on Escape ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // ── Notification helpers ──────────────────────────────────────────────────
  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const markOneRead = (id) =>
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const handleNotifToggle = () => {
    setNotifOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const handleProfileToggle = () => {
    setProfileOpen((prev) => !prev);
    setNotifOpen(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <header className="members-topbar">
      <div className="members-topbar-left">
        {canGoBack && (
          <button
            type="button"
            className="members-topbar-back"
            onClick={onBack}
            title="Back to previous page"
            aria-label="Back to previous page"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        )}
        <div className="members-topbar-breadcrumb-wrap">
          <div className="members-topbar-breadcrumb">
            <span className="members-topbar-division">Members Division</span>
            <span className="members-topbar-sep">/</span>
            <span className="members-topbar-page">{pageTitle}</span>
          </div>
          <h1 className="members-topbar-title">{pageTitle}</h1>
        </div>
      </div>

      {/* Right — actions */}
      <div className="members-topbar-right">

        {/* ── Notifications ── */}
        <div className="members-notif-wrap" ref={notifRef}>
          <button
            className={`members-notif-btn${notifOpen ? " active" : ""}`}
            onClick={handleNotifToggle}
            title="Notifications"
            aria-label={`${unreadCount} unread notifications`}
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="members-notif-badge">{unreadCount}</span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div className="members-notif-panel">
              <div className="members-notif-header">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="members-notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="members-notif-count">{unreadCount}</span>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {unreadCount > 0 && (
                    <button
                      className="members-notif-mark-all"
                      onClick={markAllRead}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setNotifOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--gray-400)",
                      display: "flex",
                      alignItems: "center",
                      padding: 0,
                    }}
                    title="Close"
                    aria-label="Close notifications"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <div className="members-notif-list">
                {notifs.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`members-notif-item${notif.read ? "" : " unread"}`}
                      onClick={() => markOneRead(notif.id)}
                    >
                      <div
                        className="members-notif-icon-wrap"
                        style={{ background: notif.iconBg }}
                      >
                        <Icon size={15} color={notif.iconColor} />
                      </div>

                      <div className="members-notif-content">
                        <p className="members-notif-item-title">{notif.title}</p>
                        <p className="members-notif-item-msg">{notif.message}</p>
                        <span className="members-notif-item-time">{notif.time}</span>
                      </div>

                      {!notif.read && (
                        <div className="members-notif-unread-dot" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* All-read state */}
              {unreadCount === 0 && notifs.every((n) => n.read) && (
                <div
                  style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    fontSize: "0.82rem",
                    color: "var(--text-light)",
                  }}
                >
                  You're all caught up!
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Profile ── */}
        <div className="members-profile-wrap" ref={profileRef}>
          <button
            className="members-profile-btn"
            onClick={handleProfileToggle}
            aria-haspopup="true"
            aria-expanded={profileOpen}
          >
            <div className="members-avatar">
              <User size={15} />
            </div>
            <div className="members-profile-info">
              <span className="members-profile-name">{user?.fullName || "Division Leader"}</span>
              <span className="members-profile-role">{user?.role?.replace('_', ' ') || "Members Division"}</span>
            </div>
            <ChevronDown
              size={13}
              className={`members-chevron${profileOpen ? " open" : ""}`}
            />
          </button>

          {/* Profile dropdown */}
          {profileOpen && (
            <div className="members-profile-dropdown">
              {/* Header */}
              <div className="members-dropdown-header">
                <div className="members-dropdown-avatar">
                  <User size={18} />
                </div>
                <div>
                  <p className="members-dropdown-name">{user?.fullName || "Division Leader"}</p>
                  <p className="members-dropdown-role">{user?.role?.replace('_', ' ') || "Members Division"}</p>
                </div>
              </div>

              <div className="members-dropdown-divider" />

              {/* Actions */}
              <button
                className="members-dropdown-item"
                onClick={() => setProfileOpen(false)}
              >
                <Settings size={14} />
                Account Settings
              </button>

              <div className="members-dropdown-divider" />

              <button
                className="members-dropdown-item danger"
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default MembersTopbar;
