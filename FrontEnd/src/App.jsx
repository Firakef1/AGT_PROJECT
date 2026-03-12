import { useState, useEffect } from "react";
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

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setShowLanding(false);
      // Determine initial page based on role
      determineInitialPage(parsedUser);
    }
  }, []);

  const determineInitialPage = (userObj) => {
    if (userObj.role === "MEMBERS_MANAGER") {
      setActivePage("members-dashboard");
    } else if (userObj.role === "DIVISION_HEAD") {
      // If they are a division head, maybe they go to their specific division or a specific page
      // For now, default to dashboard or a specific view
      setActivePage("dashboard");
    } else {
      setActivePage("dashboard");
    }
  };

  const handleLogin = (userObj) => {
    setUser(userObj);
    setIsLoggedIn(true);
    determineInitialPage(userObj);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    setShowLanding(true);
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard setActivePage={setActivePage} />;
      case "divisions":
        return <Divisions user={user} />;
      case "members":
        return <Members user={user} />;
      case "finance":
        return <Finance user={user} />;
      case "inventory":
        return <Inventory user={user} />;
      case "reports":
        return <Reports user={user} />;
      case "settings":
        return <Settings user={user} />;
      case "education":
        return <ComingSoon division="education" onNavigate={setActivePage} />;
      case "arts":
        return <ComingSoon division="arts" onNavigate={setActivePage} />;
      default:
        return <Dashboard setActivePage={setActivePage} />;
    }
  };

  if (showLanding && !isLoggedIn) {
    return <LandingPage onLogin={() => setShowLanding(false)} />;
  }

  if (!isLoggedIn) {
    return (
      <Login
        onLogin={handleLogin}
        onBackToLanding={() => setShowLanding(true)}
      />
    );
  }

  // ── Division leaders only see the Members portal (never the main admin app) ──
  const isDivisionLeaderOnly = user?.role === "MEMBERS_MANAGER" || user?.role === "DIVISION_HEAD";
  if (isDivisionLeaderOnly) {
    return (
      <MembersDivisionDashboard
        user={user}
        onLogout={handleLogout}
        onNavigateToMain={null}
      />
    );
  }

  // ── Admin: show Members portal when they choose it, otherwise main app ─────
  if (activePage === "members-dashboard") {
    return (
      <MembersDivisionDashboard
        user={user}
        onLogout={handleLogout}
        onNavigateToMain={() => setActivePage("dashboard")}
      />
    );
  }

  return (
    <div className="app">
      <Sidebar
        user={user}
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        onLogout={handleLogout}
      />
      <div
        className={`main-content ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}
      >
        <TopNav user={user} onLogout={handleLogout} setActivePage={setActivePage} />
        <main className="page-content">{renderPage()}</main>
      </div>
    </div>
  );
}

export default App;
