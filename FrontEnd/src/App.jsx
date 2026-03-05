import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import Dashboard from "./components/Dashboard";
import Divisions from "./components/Divisions";
import Members from "./components/Members";
import Finance from "./components/Finance";
import Inventory from "./components/Inventory";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import Login from "./components/Login";
import LandingPage from "./components/LandingPage";
import ComingSoon from "./components/ComingSoon";
import MembersDivisionDashboard from "./members/dashboard/MembersDivisionDashboard";

// ── Division → initial portal page map ────────────────────────────────────────
// When the user picks a division on the Login page and submits, handleLogin
// reads their choice and sets the first page they see inside the portal.
//
//   administrative → dashboard          (main portal — fully implemented)
//   members        → members-dashboard  (Members Division Dashboard)
//   education      → education          (ComingSoon placeholder)
//   arts           → arts               (ComingSoon placeholder)
//
// Any unknown value falls back to "dashboard" so existing behaviour is
// fully preserved if no division is passed.
const DIVISION_PAGE_MAP = {
  administrative: "dashboard",
  members: "members-dashboard",
  education: "education",
  arts: "arts",
};

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Accepts the division the user selected on the Login page.
  // Falls back to "dashboard" when called without an argument so the
  // existing onLogin() call signature keeps working unchanged.
  const handleLogin = (selectedDivision = "administrative") => {
    const initialPage = DIVISION_PAGE_MAP[selectedDivision] ?? "dashboard";
    setActivePage(initialPage);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowLanding(true);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} />;
      case "divisions":
        return <Divisions />;
      case "members":
        return <Members />;
      case "finance":
        return <Finance />;
      case "inventory":
        return <Inventory />;
      case "reports":
        return <Reports />;
      case "settings":
        return <Settings />;

      // ── Coming-soon division pages ──────────────────────────────────────────
      // Rendered when the user selects "Education" or "Arts" at login.
      // ComingSoon receives the division key for per-division copy/colours and
      // an onNavigate callback so the user can jump to any available section.
      case "education":
        return <ComingSoon division="education" onNavigate={setActivePage} />;
      case "arts":
        return <ComingSoon division="arts" onNavigate={setActivePage} />;

      default:
        return <Dashboard />;
    }
  };

  if (showLanding && !isLoggedIn) {
    return <LandingPage onLogin={() => setShowLanding(false)} />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // ── Members Division Dashboard ───────────────────────────────────────────
  // Rendered outside the main portal shell (no Sidebar / TopNav) so it can
  // provide its own dedicated layout, sidebar, and top navigation bar.
  if (activePage === "members-dashboard") {
    return (
      <MembersDivisionDashboard
        onLogout={handleLogout}
        onNavigateToMain={() => setActivePage("dashboard")}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />
      <div
        className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <TopNav onLogout={handleLogout} setActivePage={setActivePage} />
        <main className="page-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
