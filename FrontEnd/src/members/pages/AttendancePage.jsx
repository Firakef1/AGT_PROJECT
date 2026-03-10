import React, { useState, useEffect } from "react";
import { CalendarCheck, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { apiFetch } from "../../services/apiFetch";

const AttendancePage = ({ onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [marking, setMarking] = useState(null);

  const fetchEventsAndMembers = async () => {
    try {
      const [eventsRes, membersRes] = await Promise.all([
        apiFetch("/events"),
        apiFetch("/members"),
      ]);
      setEvents(Array.isArray(eventsRes) ? eventsRes : []);
      setMembers(Array.isArray(membersRes) ? membersRes.filter((m) => m.status === "APPROVED") : []);
      if (!selectedEventId && eventsRes?.length) setSelectedEventId(eventsRes[0].id);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsAndMembers();
  }, []);

  useEffect(() => {
    if (!selectedEventId) {
      setAttendance([]);
      return;
    }
    let cancelled = false;
    setLoadingAttendance(true);
    apiFetch(`/attendance/event/${selectedEventId}`)
      .then((data) => { if (!cancelled) setAttendance(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setAttendance([]); })
      .finally(() => { if (!cancelled) setLoadingAttendance(false); });
    return () => { cancelled = true; };
  }, [selectedEventId]);

  const getStatusForMember = (memberId) => {
    const record = attendance.find((a) => a.memberId === memberId);
    return record?.status || null;
  };

  const mark = async (memberId, status) => {
    if (!selectedEventId) return;
    setMarking(memberId);
    try {
      await apiFetch("/attendance", {
        method: "POST",
        body: JSON.stringify({ memberId, eventId: selectedEventId, status }),
      });
      const updated = await apiFetch(`/attendance/event/${selectedEventId}`);
      setAttendance(Array.isArray(updated) ? updated : []);
    } catch (err) {
      alert(err.message || "Failed to mark attendance");
    } finally {
      setMarking(null);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—");

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  return (
    <div className="attendance-page" style={{ padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Attendance</h1>
        <p style={{ margin: "0.25rem 0 0", color: "var(--text-light)", fontSize: "0.9rem" }}>
          Mark and view attendance by event.
        </p>
      </div>

      <div className="mem-form-group" style={{ marginBottom: "1.5rem" }}>
        <label className="mem-form-label">Select Event</label>
        <select
          className="mem-form-select"
          value={selectedEventId || ""}
          onChange={(e) => setSelectedEventId(e.target.value || null)}
        >
          <option value="">— Select event —</option>
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.title} — {formatDate(ev.startTime)}</option>
          ))}
        </select>
      </div>

      {!selectedEventId ? (
        <p style={{ color: "var(--text-light)" }}>Select an event to mark attendance.</p>
      ) : loadingAttendance ? (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-light)" }}>
          <Loader2 size={20} className="spin" /> Loading attendance…
        </div>
      ) : (
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Member</th>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Status</th>
                <th style={{ textAlign: "left", padding: "0.75rem 1rem" }}>Mark</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const status = getStatusForMember(m.id);
                const busy = marking === m.id;
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "0.75rem 1rem" }}>{m.fullName} <span style={{ color: "var(--text-light)", fontSize: "0.85rem" }}>({m.email})</span></td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      {status === "PRESENT" && <span style={{ color: "#16a34a" }}>Present</span>}
                      {status === "ABSENT" && <span style={{ color: "#dc2626" }}>Absent</span>}
                      {status === "EXCUSED" && <span style={{ color: "#d97706" }}>Excused</span>}
                      {!status && <span style={{ color: "var(--text-light)" }}>—</span>}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <button type="button" className="mem-modal-btn cancel" size="small" disabled={busy} onClick={() => mark(m.id, "PRESENT")}><CheckCircle size={14} /> Present</button>
                      {" "}
                      <button type="button" className="mem-modal-btn cancel" size="small" disabled={busy} onClick={() => mark(m.id, "ABSENT")}><XCircle size={14} /> Absent</button>
                      {" "}
                      <button type="button" className="mem-modal-btn cancel" size="small" disabled={busy} onClick={() => mark(m.id, "EXCUSED")}>Excused</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {members.length === 0 && (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-light)" }}>No approved members to show. Approve members first from the Members page.</p>
          )}
        </div>
      )}

      <div style={{ marginTop: "1.5rem" }}>
        <button type="button" className="placeholder-btn-secondary" onClick={() => onNavigate("overview")}>
          <ArrowLeft size={14} /> Back to Overview
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
