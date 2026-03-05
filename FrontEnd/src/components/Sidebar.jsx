import React from 'react'
import {
  LayoutDashboard,
  Building2,
  Users,
  Wallet,
  PackageCheck,
  FileBarChart,
  Settings,
  LogOut,
} from 'lucide-react'

const Sidebar = ({ activePage, setActivePage, collapsed, setCollapsed, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'divisions', label: 'Divisions', icon: Building2 },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'finance', label: 'Finance', icon: Wallet },
    { id: 'inventory', label: 'Inventory', icon: PackageCheck },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ]

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
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
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon"><Icon size={18} /></span>
              {!collapsed && <span className="nav-label">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-item"
          onClick={() => setActivePage('settings')}
        >
          <span className="nav-icon"><Settings size={18} /></span>
          {!collapsed && <span className="nav-label">Settings</span>}
        </button>
        <button className="nav-item logout" onClick={onLogout}>
          <span className="nav-icon"><LogOut size={18} /></span>
          {!collapsed && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar