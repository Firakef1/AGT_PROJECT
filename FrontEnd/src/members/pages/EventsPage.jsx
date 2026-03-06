import React from "react";
import { CalendarDays, Clock, Sparkles, ArrowLeft } from "lucide-react";

const FEATURES = [
  "Upcoming events calendar and scheduling",
  "Event registration and member sign-ups",
  "Recurring events and series management",
  "Event announcements and reminders",
  "Attendance tracking per event",
  "Post-event reports and summaries",
];

/**
 * EventsPage
 *
 * Placeholder page for the Events module.
 * Communicates what is planned and lets the user navigate back.
 *
 * Props:
 *   onNavigate {function} – navigate to another dashboard page
 */
const EventsPage = ({ onNavigate }) => {
  const accentColor  = "#7c3aed";
  const accentBg     = "#f3e8ff";
  const accentBorder = "#e9d5ff";

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
        <CalendarDays size={40} color={accentColor} />
      </div>

      {/* Headline block */}
      <div className="placeholder-content">
        <h1>Events</h1>
        <p
          className="placeholder-tagline"
          style={{ color: accentColor }}
        >
          Plan, schedule, and manage all division events in one place.
        </p>
        <p>
          The Events module is currently under development. Once live, it will
          allow division leaders to schedule fellowship events, manage
          registrations, send announcements, and track participation across
          the congregation.
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
        replaced once the Events module is fully launched.
      </p>
    </div>
  );
};

export default EventsPage;
