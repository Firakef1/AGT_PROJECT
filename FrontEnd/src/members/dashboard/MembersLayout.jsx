import React, { useState } from "react";
import MembersSidebar from "./MembersSidebar";
import MembersTopbar from "./MembersTopbar";

/**
 * MembersLayout
 *
 * The root shell for the Members Division Dashboard.
 * Composes MembersSidebar + MembersTopbar + the scrollable content area.
 *
 * Props:
 *   activePage       {string}   – current page key (forwarded to sidebar + topbar)
 *   setActivePage    {function} – navigate between pages
 *   onLogout         {function} – sign-out handler (forwarded down to sidebar & topbar)
 *   onNavigateToMain {function} – return to the main Administrative portal
 *   children         {node}     – the active page component rendered in the content area
 */
const MembersLayout = ({
  activePage,
  setActivePage,
  onLogout,
  onNavigateToMain,
  children,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="members-app">
      {/* ── Left sidebar ── */}
      <MembersSidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onLogout={onLogout}
        onNavigateToMain={onNavigateToMain}
      />

      {/* ── Right: topbar + scrollable content ── */}
      <div className="members-main-content">
        <MembersTopbar
          activePage={activePage}
          onLogout={onLogout}
        />

        <main className="members-page-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MembersLayout;
