import React from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  PackageCheck,
  FileBarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  onLogout,
}) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "divisions", label: "Divisions", icon: Building2 },
    { id: "members", label: "Members", icon: Users },
    { id: "finance", label: "Finance", icon: Wallet },
    { id: "inventory", label: "Inventory", icon: PackageCheck },
    { id: "reports", label: "Reports", icon: FileBarChart },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* ── Header / branding ── */}
      <div className="sidebar-header">
        {/* Logo — hidden when collapsed */}
        <div className="logo">
          <div className="logo-icon-wrap">
            <Building2 size={18} color="#fff" />
          </div>
          {!collapsed && (
            <div className="logo-text-group">
              <span className="logo-text">GubaeTech</span>
              <span className="logo-subtitle">ASTU Gibi Gubae</span>
            </div>
          )}
        </div>

        {/* Collapse toggle button */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* ── Main navigation ── */}
      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-section-label">Navigation</div>}

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="nav-icon">
                <Icon size={18} />
              </span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* ── Footer actions ── */}
      <div className="sidebar-footer">
        {!collapsed && <div className="sidebar-section-label">System</div>}

        <button
          className={`nav-item ${activePage === "settings" ? "active" : ""}`}
          onClick={() => setActivePage("settings")}
          title={collapsed ? "Settings" : undefined}
          aria-current={activePage === "settings" ? "page" : undefined}
        >
          <span className="nav-icon">
            <Settings size={18} />
          </span>
          {!collapsed && <span className="nav-label">Settings</span>}
        </button>

        <button
          className="nav-item logout"
          onClick={onLogout}
          title={collapsed ? "Sign Out" : undefined}
        >
          <span className="nav-icon">
            <LogOut size={18} />
          </span>
          {!collapsed && <span className="nav-label">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
