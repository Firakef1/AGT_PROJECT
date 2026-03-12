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
      <div className="members-loading">
        <Loader2 size={32} className="spin" aria-hidden />
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="members-page-header-row">
        <div>
          <h1 className="members-page-title">Notifications</h1>
          <p className="members-page-subtitle">
            Announcements and reminders (when available).
          </p>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="members-empty-state">
          <Bell size={48} color="var(--gray-400)" className="members-empty-icon" aria-hidden />
          <p className="members-empty-text">No notifications at the moment.</p>
        </div>
      ) : (
        <ul className="notifications-list">
          {list.map((item) => (
            <li key={item.id || item.createdAt}>
              <strong>{item.title}</strong>
              {item.body && <p>{item.body}</p>}
              {item.createdAt && <span>{new Date(item.createdAt).toLocaleString()}</span>}
            </li>
          ))}
        </ul>
      )}

      <div className="members-page-back">
        <button type="button" className="placeholder-btn-secondary" onClick={() => onNavigate("overview")}>
          <ArrowLeft size={14} /> Back to Overview
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;
