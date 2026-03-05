import React from "react";
import {
  Settings2,
  Shield,
  Database,
  Building2,
  Monitor,
  Bell,
  Users,
  Lock,
  KeyRound,
  HardDrive,
  Download,
  EyeOff,
  Activity,
  CheckCircle2,
  GitCommitHorizontal,
  CalendarDays,
} from "lucide-react";

// ── Section metadata: icon + accent colour ────────────────────────────────────
const SECTION_META = [
  {
    icon: Settings2,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
  },
  {
    icon: Shield,
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
  },
  {
    icon: Database,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
  },
];

// ── Per-item icons ────────────────────────────────────────────────────────────
const ITEM_ICONS = [
  // General Settings
  [
    { icon: Building2, bg: "#e8f0fe", color: "#1a56db" },
    { icon: Monitor, bg: "#fef3e2", color: "#d97706" },
    { icon: Bell, bg: "#fef2f2", color: "#dc2626" },
  ],
  // User Management
  [
    { icon: Users, bg: "#dcfce7", color: "#16a34a" },
    { icon: Lock, bg: "#e8f0fe", color: "#1a56db" },
    { icon: KeyRound, bg: "#fef3e2", color: "#d97706" },
  ],
  // Data Management
  [
    { icon: HardDrive, bg: "#f3e8ff", color: "#7c3aed" },
    { icon: Download, bg: "#dcfce7", color: "#16a34a" },
    { icon: EyeOff, bg: "#fef2f2", color: "#dc2626" },
  ],
];

// ── System-info entries ───────────────────────────────────────────────────────
const SYSTEM_INFO = [
  {
    icon: GitCommitHorizontal,
    label: "Version",
    value: "1.0.0",
    bg: "#e8f0fe",
    color: "#1a56db",
  },
  {
    icon: CalendarDays,
    label: "Last Updated",
    value: "February 25, 2026",
    bg: "#fef3e2",
    color: "#d97706",
  },
  {
    icon: Database,
    label: "Database",
    value: "Healthy",
    bg: "#dcfce7",
    color: "#16a34a",
  },
  {
    icon: Activity,
    label: "Server Status",
    value: "Online",
    bg: "#dcfce7",
    color: "#16a34a",
  },
];

// ── Settings data ─────────────────────────────────────────────────────────────
const settingsSections = [
  {
    title: "General Settings",
    items: [
      {
        label: "Church Information",
        description: "Update church name, address, and contact details",
      },
      {
        label: "System Preferences",
        description: "Configure language, timezone, and display options",
      },
      {
        label: "Notification Settings",
        description: "Manage email and system notifications",
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        label: "User Roles",
        description: "Define roles and permissions for different user types",
      },
      {
        label: "Access Control",
        description: "Manage user access to different system features",
      },
      {
        label: "Password Policy",
        description: "Set password requirements and security policies",
      },
    ],
  },
  {
    title: "Data Management",
    items: [
      {
        label: "Backup & Restore",
        description: "Create backups and restore system data",
      },
      {
        label: "Data Export",
        description: "Export member and financial data",
      },
      {
        label: "Data Privacy",
        description: "Configure data retention and privacy settings",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const Settings = () => {
  return (
    <div className="page-v2 settings-page">
      {/* ── Page header ── */}
      <div className="page-v2-header">
        <div>
          <h1>System Settings</h1>
          <p>Configure portal preferences, user access, and data management.</p>
        </div>
      </div>

      {/* ── Settings sections ── */}
      <div className="settings-container">
        {settingsSections.map((section, sectionIdx) => {
          const SectionIcon = SECTION_META[sectionIdx].icon;
          const sectionMeta = SECTION_META[sectionIdx];

          return (
            <div key={sectionIdx} className="settings-section page-v2-card">
              {/* Section header with icon */}
              <div className="settings-section-header">
                <div
                  className="settings-section-icon"
                  style={{
                    background: sectionMeta.iconBg,
                  }}
                >
                  <SectionIcon size={17} color={sectionMeta.iconColor} />
                </div>
                <div>
                  <h3 className="settings-section-title">{section.title}</h3>
                </div>
              </div>

              {/* Items */}
              <div className="settings-items">
                {section.items.map((item, itemIdx) => {
                  const itemMeta = ITEM_ICONS[sectionIdx][itemIdx];
                  const ItemIcon = itemMeta.icon;

                  return (
                    <div key={itemIdx} className="settings-item">
                      {/* Item icon bubble */}
                      <div
                        className="settings-item-icon"
                        style={{ background: itemMeta.bg }}
                      >
                        <ItemIcon size={15} color={itemMeta.color} />
                      </div>

                      {/* Text content */}
                      <div className="settings-item-content">
                        <h4>{item.label}</h4>
                        <p>{item.description}</p>
                      </div>

                      <button className="btn-outline">Configure</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── System info card ── */}
      <div className="system-info">
        <div className="info-card page-v2-card">
          {/* Card header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.65rem",
              marginBottom: "1.1rem",
              paddingBottom: "0.85rem",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "#e8f0fe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CheckCircle2 size={17} color="#1a56db" />
            </div>
            <h4
              style={{
                margin: 0,
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              System Information
            </h4>
          </div>

          {/* Info grid */}
          <div className="system-info-grid">
            {SYSTEM_INFO.map((info, idx) => {
              const InfoIcon = info.icon;
              return (
                <div key={idx} className="system-info-item">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      marginBottom: "0.3rem",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        background: info.bg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <InfoIcon size={12} color={info.color} />
                    </div>
                    <span className="system-info-label">{info.label}</span>
                  </div>
                  <span className="system-info-value">{info.value}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
