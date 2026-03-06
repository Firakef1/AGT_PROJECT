import React from "react";
import { CalendarCheck, Clock, Sparkles, ArrowLeft } from "lucide-react";

const FEATURES = [
  "Weekly & monthly attendance tracking",
  "Member check-in and check-out records",
  "Attendance reports and trend charts",
  "Absence alerts and follow-up reminders",
  "Family group attendance summaries",
  "Export attendance data to CSV / PDF",
];

/**
 * AttendancePage
 *
 * Placeholder page for the Attendance module.
 * Communicates what is planned and lets the user navigate back.
 *
 * Props:
 *   onNavigate {function} – navigate to another dashboard page
 */
const AttendancePage = ({ onNavigate }) => {
  const accentColor  = "#1a56db";
  const accentBg     = "#e8f0fe";
  const accentBorder = "#bfdbfe";

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
        <CalendarCheck size={40} color={accentColor} />
      </div>

      {/* Headline block */}
      <div className="placeholder-content">
        <h1>Attendance</h1>
        <p
          className="placeholder-tagline"
          style={{ color: accentColor }}
        >
          Track presence, spot patterns, follow up on absences.
        </p>
        <p>
          The Attendance module is currently under development. Once live, it
          will let division leaders record and review member attendance across
          all meetings, services, and fellowship events.
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
        replaced once the Attendance module is fully launched.
      </p>
    </div>
  );
};

export default AttendancePage;
