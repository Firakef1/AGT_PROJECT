import React from 'react'

const Settings = () => {
  const settingsSections = [
    {
      title: 'General Settings',
      items: [
        { label: 'Church Information', description: 'Update church name, address, and contact details' },
        { label: 'System Preferences', description: 'Configure language, timezone, and display options' },
        { label: 'Notification Settings', description: 'Manage email and system notifications' },
      ]
    },
    {
      title: 'User Management',
      items: [
        { label: 'User Roles', description: 'Define roles and permissions for different user types' },
        { label: 'Access Control', description: 'Manage user access to different system features' },
        { label: 'Password Policy', description: 'Set password requirements and security policies' },
      ]
    },
    {
      title: 'Data Management',
      items: [
        { label: 'Backup & Restore', description: 'Create backups and restore system data' },
        { label: 'Data Export', description: 'Export member and financial data' },
        { label: 'Data Privacy', description: 'Configure data retention and privacy settings' },
      ]
    }
  ]

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>System Settings</h2>
      </div>

      <div className="settings-container">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="settings-section">
            <h3>{section.title}</h3>
            <div className="settings-items">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="settings-item">
                  <div className="item-content">
                    <h4>{item.label}</h4>
                    <p>{item.description}</p>
                  </div>
                  <button className="btn-outline">Configure</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="system-info">
        <div className="info-card">
          <h4>System Information</h4>
          <div className="info-details">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Last Updated:</strong> February 25, 2026</p>
            <p><strong>Database:</strong> Healthy</p>
            <p><strong>Server Status:</strong> Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings