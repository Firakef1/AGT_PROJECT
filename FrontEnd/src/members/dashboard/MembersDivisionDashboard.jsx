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
const MembersDivisionDashboard = ({ user, onLogout, onNavigateToMain }) => {
  const [history, setHistory] = useState(["overview"]);
  const activePage = history[history.length - 1];

  const navigateTo = (page) => {
    setHistory((prev) => [...prev, page]);
  };

  const goBack = () => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const canGoBack = history.length > 1;

  const renderPage = () => {
    switch (activePage) {
      case "overview":
        return <MembersOverview user={user} onNavigate={navigateTo} />;

      case "members":
        return (
          <div className="members-page-host">
            <Members user={user} />
          </div>
        );

      case "families":
        return <FamiliesPage onNavigate={navigateTo} />;

      case "attendance":
        return <AttendancePage onNavigate={navigateTo} />;

      case "events":
        return <EventsPage onNavigate={navigateTo} />;

      case "notifications":
        return <NotificationsPage onNavigate={navigateTo} />;

      default:
        return <MembersOverview user={user} onNavigate={navigateTo} />;
    }
  };

  return (
    <MembersLayout
      user={user}
      activePage={activePage}
      setActivePage={navigateTo}
      onLogout={onLogout}
      onNavigateToMain={onNavigateToMain}
      onBack={goBack}
      canGoBack={canGoBack}
    >
      {renderPage()}
    </MembersLayout>
  );
};

export default MembersDivisionDashboard;
