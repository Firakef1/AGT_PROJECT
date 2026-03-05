import React, { useState } from "react";
import MembersLayout from "./MembersLayout";
import MembersOverview from "../pages/MembersOverview";
import FamiliesPage from "../pages/FamiliesPage";
import AttendancePage from "../pages/AttendancePage";
import EventsPage from "../pages/EventsPage";
import NotificationsPage from "../pages/NotificationsPage";
import Members from "../../components/Members";
import "../members-dashboard.css";

/**
 * MembersDivisionDashboard
 *
 * Root component for the Members Division portal.
 * Manages internal page routing (overview → members → families → …)
 * and renders the full MembersLayout shell.
 *
 * Props:
 *   onLogout         {function} – propagated from App.jsx; signs the user out
 *   onNavigateToMain {function} – returns the user to the main Administrative
 *                                 portal (sets App.jsx activePage → "dashboard")
 */
const MembersDivisionDashboard = ({ onLogout, onNavigateToMain }) => {
  const [activePage, setActivePage] = useState("overview");

  // ── Page renderer ─────────────────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <MembersOverview onNavigate={setActivePage} />;

      // Embed the existing Members management component as-is.
      // It already ships with its own Members + Families tab navigation,
      // search, add/edit/delete, and CSV export — nothing is rewritten.
      case "members":
        return (
          <div className="members-page-host">
            <Members />
          </div>
        );

      case "families":
        return <FamiliesPage />;

      case "attendance":
        return <AttendancePage onNavigate={setActivePage} />;

      case "events":
        return <EventsPage onNavigate={setActivePage} />;

      case "notifications":
        return <NotificationsPage onNavigate={setActivePage} />;

      default:
        return <MembersOverview onNavigate={setActivePage} />;
    }
  };

  return (
    <MembersLayout
      activePage={activePage}
      setActivePage={setActivePage}
      onLogout={onLogout}
      onNavigateToMain={onNavigateToMain}
    >
      {renderPage()}
    </MembersLayout>
  );
};

export default MembersDivisionDashboard;
