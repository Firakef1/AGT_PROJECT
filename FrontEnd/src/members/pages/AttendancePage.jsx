import React, { useState, useEffect } from "react";
import { ArrowLeft, Loader2, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { apiFetch } from "../../services/apiFetch";

const AttendancePage = ({ user, onNavigate }) => {
  const myDivisionId = user?.member?.divisionId ?? null;
  const [divisions, setDivisions] = useState([]);
  const [divisionId, setDivisionId] = useState(myDivisionId || "");
  const [events, setEvents] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [marking, setMarking] = useState(null);
  const [participationSummary, setParticipationSummary] = useState(null);

  const fetchDivisions = async () => {
    try {
      const data = await apiFetch("/divisions");
      setDivisions(Array.isArray(data) ? data : []);
    } catch {
      setDivisions([]);
    }
  };

  const fetchEventsAndMembers = async () => {
    if (!divisionId) {
      setEvents([]);
      setMembers([]);
      setLoading(false);
      return;
    }
    try {
      const [eventsRes, membersRes] = await Promise.all([
        apiFetch(`/events?divisionId=${encodeURIComponent(divisionId)}`),
        apiFetch("/members").then((list) =>
          Array.isArray(list)
            ? list.filter((m) => m.status === "APPROVED" && m.divisionId === divisionId)
            : []
        ),
      ]);
      setEvents(Array.isArray(eventsRes) ? eventsRes : []);
      setMembers(Array.isArray(membersRes) ? membersRes : []);
      if (!selectedEventId && eventsRes?.length) setSelectedEventId(eventsRes[0].id);
      else if (selectedEventId && !eventsRes?.some((e) => e.id === selectedEventId))
        setSelectedEventId(eventsRes?.length ? eventsRes[0].id : null);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipationSummary = async () => {
    if (!divisionId) {
      setParticipationSummary(null);
      return;
    }
    try {
      const data = await apiFetch(`/attendance/division/${divisionId}/summary`);
      setParticipationSummary(data);
    } catch {
      setParticipationSummary(null);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchEventsAndMembers();
  }, [divisionId]);

  useEffect(() => {
    fetchParticipationSummary();
  }, [divisionId]);

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
      const [updated, summary] = await Promise.all([
        apiFetch(`/attendance/event/${selectedEventId}`),
        divisionId ? apiFetch(`/attendance/division/${divisionId}/summary`) : null,
      ]);
      setAttendance(Array.isArray(updated) ? updated : []);
      if (summary) setParticipationSummary(summary);
    } catch (err) {
      alert(err.message || "Failed to mark attendance");
    } finally {
      setMarking(null);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—");

  if (loading) {
    return (
      <div className="members-loading">
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  const pctClass = (pct) =>
    pct >= 70 ? "attendance-pct-high" : pct >= 40 ? "attendance-pct-mid" : "attendance-pct-low";

  return (
    <div className="attendance-page">
      <div className="attendance-page-header">
        <h1>Attendance</h1>
        <p>Track attendance by event and view participation overview for your division.</p>
      </div>

      {divisions.length > 0 && (
        <div className="mem-form-group attendance-division-select-wrap">
          <label className="mem-form-label">Division</label>
          <select
            className="mem-form-select"
            value={divisionId}
            onChange={(e) => setDivisionId(e.target.value)}
          >
            <option value="">— Select division —</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      {participationSummary && (
        <div className="attendance-participation-card">
          <div className="attendance-participation-header">
            <TrendingUp size={18} color="var(--blue)" aria-hidden />
            <strong>Participation overview</strong>
            <span className="attendance-participation-badge">
              ({participationSummary.totalDivisionEvents} division events)
            </span>
          </div>
          <div className="attendance-table-wrap">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Present</th>
                  <th>Participation</th>
                </tr>
              </thead>
              <tbody>
                {participationSummary.members.map((row) => (
                  <tr key={row.memberId}>
                    <td>{row.fullName} <span className="attendance-secondary-text">({row.email})</span></td>
                    <td>{row.presentCount} / {row.totalEvents}</td>
                    <td>
                      <span className={pctClass(row.participationPercentage)}>
                        {row.participationPercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {participationSummary.members.length === 0 && (
            <p className="attendance-empty-cell">No members in this division yet.</p>
          )}
        </div>
      )}

      <div className="mem-form-group attendance-event-select-wrap">
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

      {!divisionId ? (
        <p className="members-hint-text">Select a division to see events and mark attendance.</p>
      ) : !selectedEventId ? (
        <p className="members-hint-text">Select an event to mark attendance.</p>
      ) : loadingAttendance ? (
        <div className="attendance-loading-row">
          <Loader2 size={20} className="spin" aria-hidden /> Loading attendance…
        </div>
      ) : (
        <div className="attendance-participation-card">
          <div className="attendance-table-wrap">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Status</th>
                  <th>Mark</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const status = getStatusForMember(m.id);
                  const busy = marking === m.id;
                  return (
                    <tr key={m.id}>
                      <td>{m.fullName} <span className="attendance-secondary-text">({m.email})</span></td>
                      <td>
                        {status === "PRESENT" && <span className="attendance-status-present">Present</span>}
                        {status === "ABSENT" && <span className="attendance-status-absent">Absent</span>}
                        {status === "EXCUSED" && <span className="attendance-status-excused">Excused</span>}
                        {!status && <span className="attendance-status-none">—</span>}
                      </td>
                      <td>
                        <div className="attendance-mark-buttons">
                          <button type="button" className="mem-modal-btn cancel" disabled={busy} onClick={() => mark(m.id, "PRESENT")}><CheckCircle size={14} aria-hidden /> Present</button>
                          <button type="button" className="mem-modal-btn cancel" disabled={busy} onClick={() => mark(m.id, "ABSENT")}><XCircle size={14} aria-hidden /> Absent</button>
                          <button type="button" className="mem-modal-btn cancel" disabled={busy} onClick={() => mark(m.id, "EXCUSED")}>Excused</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {members.length === 0 && (
            <p className="attendance-empty-cell">No approved members to show. Approve members first from the Members page.</p>
          )}
        </div>
      )}

      <div className="members-page-back">
        <button type="button" className="placeholder-btn-secondary" onClick={() => onNavigate("overview")}>
          <ArrowLeft size={14} /> Back to Overview
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
