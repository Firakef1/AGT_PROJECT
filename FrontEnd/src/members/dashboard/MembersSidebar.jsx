import React from "react";
import {
  LayoutDashboard,
  Users,
  UsersRound,
  CalendarCheck,
  CalendarDays,
  Bell,
  LogOut,
  ArrowLeft,
  Users2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ── Navigation items ──────────────────────────────────────────────────────────
const MENU_ITEMS = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    soon: false,
  },
  {
    id: "members",
    label: "Members",
    icon: Users,
    soon: false,
  },
  {
    id: "families",
    label: "Families / Groups",
    icon: UsersRound,
    soon: false,
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: CalendarCheck,
    soon: true,
  },
  {
    id: "events",
    label: "Events",
    icon: CalendarDays,
    soon: true,
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    soon: true,
  },
];

/**
 * MembersSidebar
 *
 * Props:
 *   activePage       {string}   – currently active page key
 *   setActivePage    {function} – navigate to a page
 *   collapsed        {boolean}  – whether the sidebar is in narrow mode
 *   setCollapsed     {function} – toggle collapsed state
 *   onLogout         {function} – called when user clicks Sign Out
 *   onNavigateToMain {function} – called when user wants to return to the
 *                                 main Administrative portal
 */
const MembersSidebar = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  onLogout,
  onNavigateToMain,
}) => {
  return (
    <aside className={`members-sidebar${collapsed ? " collapsed" : ""}`}>
      {/* ── Branding / Header ── */}
      <div className="members-sidebar-header">
        {!collapsed && (
          <div className="members-logo">
            <div className="members-logo-icon-wrap">
              <Users2 size={17} color="#fff" />
            </div>
            <div className="members-logo-text-group">
              <span className="members-logo-text">Members</span>
              <span className="members-logo-subtitle">Division Portal</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="members-logo-icon-wrap" style={{ margin: "0 auto" }}>
            <Users2 size={17} color="#fff" />
          </div>
        )}

        <button
          className="members-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* ── Main Navigation ── */}
      <nav className="members-sidebar-nav" aria-label="Members Division navigation">
        {!collapsed && (
          <div className="members-sidebar-section-label">Navigation</div>
        )}

        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              className={`members-nav-item${isActive ? " active" : ""}`}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="members-nav-icon">
                <Icon size={17} />
              </span>

              {!collapsed && (
                <>
                  <span className="members-nav-label">{item.label}</span>
                  {item.soon && (
                    <span className="members-nav-soon-pill">Soon</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer Actions ── */}
      <div className="members-sidebar-footer">
        {/* Back to main portal — only shown when a handler is provided */}
        {onNavigateToMain && (
          <button
            className="members-nav-item members-back-btn"
            onClick={onNavigateToMain}
            title={collapsed ? "Back to Main Portal" : undefined}
          >
            <span className="members-nav-icon">
              <ArrowLeft size={16} />
            </span>
            {!collapsed && (
              <span className="members-nav-label">Main Portal</span>
            )}
          </button>
        )}

        {/* Sign out */}
        <button
          className="members-nav-item members-logout"
          onClick={onLogout}
          title={collapsed ? "Sign Out" : undefined}
        >
          <span className="members-nav-icon">
            <LogOut size={16} />
          </span>
          {!collapsed && <span className="members-nav-label">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default MembersSidebar;
