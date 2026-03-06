import React from "react";
import { Bell, Clock, Sparkles, ArrowLeft } from "lucide-react";

const FEATURES = [
  "Division-wide announcements and broadcasts",
  "Automated birthday and anniversary reminders",
  "Absence follow-up notification workflows",
  "Event reminders and RSVP nudges",
  "SMS and email notification channels",
  "Notification history and read receipts",
];

/**
 * NotificationsPage
 *
 * Placeholder page for the Notifications module.
 * Communicates what is planned and lets the user navigate back.
 *
 * Props:
 *   onNavigate {function} – navigate to another dashboard page
 */
const NotificationsPage = ({ onNavigate }) => {
  const accentColor  = "#d97706";
  const accentBg     = "#fef3e2";
  const accentBorder = "#fde68a";

  return (
    <div className="placeholder-page">

      {/* Icon bubble */}
      <div
        className="placeholder-icon-wrap"
        style={{
          background:  accentBg,
          border:      `2px solid ${accentBorder}`,
          boxShadow:   `0 8px 28px ${accentColor}22`,
        }}
      >
        <Bell size={40} color={accentColor} />
      </div>

      {/* Headline block */}
      <div className="placeholder-content">
        <h1>Notifications</h1>
        <p
          className="placeholder-tagline"
          style={{ color: accentColor }}
        >
          Keep every member informed, reminded, and engaged.
        </p>
        <p>
          The Notifications module is currently under development. Once live,
          division leaders will be able to send targeted announcements,
          configure automated reminders, and manage communication channels
          across the entire congregation.
        </p>
      </div>

      {/* "Coming Soon" badge */}
      <div
        className="placeholder-badge"
        style={{
          background:  accentBg,
          color:       accentColor,
          borderColor: accentBorder,
        }}
      >
        <Clock size={13} />
        Coming Soon
      </div>

      {/* Planned features card */}
      <div className="placeholder-features-card">
        <div className="placeholder-features-header">
          <Sparkles size={14} color={accentColor} />
          <span className="placeholder-features-label">Planned Features</span>
        </div>

        <ul className="placeholder-feature-list">
          {FEATURES.map((feature, idx) => (
            <li key={idx} className="placeholder-feature-item">
              <span
                className="placeholder-feature-dot"
                style={{ background: accentColor }}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Action buttons */}
      <div className="placeholder-actions">
        <button
          className="placeholder-btn-primary"
          style={{
            background: accentColor,
            color:      "#fff",
          }}
          onClick={() => onNavigate("overview")}
        >
          <ArrowLeft size={14} />
          Back to Overview
        </button>

        <button
          className="placeholder-btn-secondary"
          onClick={() => onNavigate("members")}
        >
          Go to Members
        </button>
      </div>

      {/* Footer note */}
      <p className="placeholder-footer-note">
        Use the sidebar to navigate to any available section. This page will be
        replaced once the Notifications module is fully launched.
      </p>
    </div>
  );
};

export default NotificationsPage;
