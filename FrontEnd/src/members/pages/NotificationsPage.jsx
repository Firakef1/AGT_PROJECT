import React, { useState, useEffect } from "react";
import { Bell, ArrowLeft, Loader2 } from "lucide-react";
import { apiFetch } from "../../services/apiFetch";

/**
 * NotificationsPage — lists notifications from API (stub returns [] until backend implements).
 */
const NotificationsPage = ({ onNavigate }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/notifications")
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  return (
    <div className="notifications-page" style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Notifications</h1>
        <p style={{ margin: "0.25rem 0 0", color: "var(--text-light)", fontSize: "0.9rem" }}>
          Announcements and reminders (when available).
        </p>
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
          <Bell size={48} color="var(--text-light)" style={{ marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-light)" }}>No notifications at the moment.</p>
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {list.map((item) => (
            <li
              key={item.id || item.createdAt}
              style={{
                padding: "1rem 1.25rem",
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                marginBottom: "0.75rem",
              }}
            >
              <strong>{item.title}</strong>
              {item.body && <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>{item.body}</p>}
              {item.createdAt && <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>{new Date(item.createdAt).toLocaleString()}</span>}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <button type="button" className="placeholder-btn-secondary" onClick={() => onNavigate("overview")}>
          <ArrowLeft size={14} /> Back to Overview
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
