import React, { useState, useEffect } from "react";
import { CalendarDays, Plus, Pencil, Trash2, ArrowLeft, Loader2, X, MapPin, Calendar } from "lucide-react";
import { apiFetch } from "../../services/apiFetch";

const SCOPE_UPCOMING = "upcoming";
const SCOPE_PAST = "past";

const EventsPage = ({ user, onNavigate }) => {
  const myDivisionId = user?.member?.divisionId ?? null;
  const [events, setEvents] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [scope, setScope] = useState(SCOPE_UPCOMING);
  const [filterDivisionId, setFilterDivisionId] = useState(myDivisionId || "");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", startTime: "", endTime: "", location: "", divisionId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    try {
      setError(null);
      const params = new URLSearchParams();
      if (scope) params.set("scope", scope);
      if (filterDivisionId) params.set("divisionId", filterDivisionId);
      const url = params.toString() ? `/events?${params.toString()}` : "/events";
      const data = await apiFetch(url);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const fetchDivisions = async () => {
    try {
      const data = await apiFetch("/divisions");
      setDivisions(Array.isArray(data) ? data : []);
    } catch {
      setDivisions([]);
    }
  };

  useEffect(() => {
    fetchDivisions();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchEvents();
  }, [filterDivisionId, scope]);

  const openCreate = () => {
    setEditingEvent(null);
    setForm({
      title: "",
      description: "",
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      location: "",
      divisionId: myDivisionId || "",
    });
    setModalOpen(true);
  };

  const openEdit = (event) => {
    setEditingEvent(event);
    setForm({
      title: event.title || "",
      description: event.description || "",
      startTime: event.startTime ? new Date(event.startTime).toISOString().slice(0, 16) : "",
      endTime: event.endTime ? new Date(event.endTime).toISOString().slice(0, 16) : "",
      location: event.location || "",
      divisionId: event.divisionId || "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.startTime || !form.endTime) {
      alert("Title, start time, and end time are required.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        title: form.title,
        description: form.description || undefined,
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        location: form.location || undefined,
        divisionId: form.divisionId && form.divisionId.trim() ? form.divisionId.trim() : undefined,
      };
      if (editingEvent) {
        await apiFetch(`/events/${editingEvent.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await apiFetch("/events", { method: "POST", body: JSON.stringify(body) });
      }
      setModalOpen(false);
      await fetchEvents();
    } catch (err) {
      alert(err.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (event) => {
    setDeleteConfirm(event);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await apiFetch(`/events/${deleteConfirm.id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await fetchEvents();
    } catch (err) {
      alert(err.message || "Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—");
  const formatTime = (d) => (d ? new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "");

  if (loading) {
    return (
      <div className="members-loading">
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="members-page-header-row">
        <div>
          <h1 className="members-page-title">Events</h1>
          <p className="members-page-subtitle">
            Create division events; members get an email with an “Add to Google Calendar” link.
          </p>
        </div>
        <button type="button" className="btn-accent" onClick={openCreate} style={{ flexShrink: 0 }}>
          <Plus size={16} /> New Event
        </button>
      </div>

      <div className="events-toolbar">
        <div className="events-segmented">
          <button
            type="button"
            className={scope === SCOPE_UPCOMING ? "active" : ""}
            onClick={() => setScope(SCOPE_UPCOMING)}
          >
            Upcoming
          </button>
          <button
            type="button"
            className={scope === SCOPE_PAST ? "active" : ""}
            onClick={() => setScope(SCOPE_PAST)}
          >
            Past
          </button>
        </div>
        {divisions.length > 0 && (
          <select
            className="mem-form-select events-filter-select"
            value={filterDivisionId}
            onChange={(e) => setFilterDivisionId(e.target.value)}
          >
            <option value="">All divisions</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        )}
      </div>

      {error && <p className="members-error-text">{error}</p>}

      {events.length === 0 ? (
        <div className="members-empty-state">
          <CalendarDays size={40} color="var(--gray-400)" className="members-empty-icon" aria-hidden />
          <p className="members-empty-text">
            {scope === SCOPE_PAST ? "No past events." : "No upcoming events. Create one to get started."}
          </p>
          {scope === SCOPE_UPCOMING && (
            <button type="button" className="btn-accent members-empty-action" onClick={openCreate}>
              <Plus size={14} /> Create Event
            </button>
          )}
        </div>
      ) : (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id} className="event-card">
              <div className="event-card-content">
                <h3 className="event-card-title">{event.title}</h3>
                <div className="event-card-meta">
                  <span>
                    <Calendar size={12} aria-hidden /> {formatDate(event.startTime)} – {formatTime(event.endTime)}
                  </span>
                  {event.division?.name && (
                    <span style={{ color: "var(--blue)", fontWeight: 500 }}>{event.division.name}</span>
                  )}
                  {event.location && (
                    <span>
                      <MapPin size={12} aria-hidden /> {event.location}
                    </span>
                  )}
                </div>
                {event.description && (
                  <p className="event-card-desc">{event.description}</p>
                )}
              </div>
              <div className="event-card-actions">
                <button type="button" className="icon-btn" title="Edit event" onClick={() => openEdit(event)}>
                  <Pencil size={15} aria-hidden />
                </button>
                <button type="button" className="icon-btn danger" title="Delete event" onClick={() => openDeleteConfirm(event)}>
                  <Trash2 size={15} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="mem-modal-overlay" onClick={() => !deleting && setDeleteConfirm(null)}>
          <div className="mem-modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className="mem-modal-header">
              <h3 className="mem-modal-title">Delete event</h3>
              <button type="button" className="mem-modal-close" onClick={() => !deleting && setDeleteConfirm(null)} disabled={deleting} aria-label="Close">
                <X size={17} />
              </button>
            </div>
            <div className="mem-modal-body">
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>{deleteConfirm.title}</strong>? This cannot be undone.
              </p>
            </div>
            <div className="mem-modal-footer">
              <button type="button" className="mem-modal-btn cancel" onClick={() => !deleting && setDeleteConfirm(null)} disabled={deleting}>
                Cancel
              </button>
              <button type="button" className="mem-modal-btn submit" style={{ background: "var(--red)" }} onClick={handleDeleteConfirm} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="mem-modal-overlay" onClick={() => !submitting && setModalOpen(false)}>
          <div className="mem-modal" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="mem-modal-header">
              <h3 className="mem-modal-title">{editingEvent ? "Edit Event" : "New Event"}</h3>
              <button className="mem-modal-close" onClick={() => !submitting && setModalOpen(false)} disabled={submitting}><X size={17} /></button>
            </div>
            <form onSubmit={handleSubmit} className="mem-modal-body">
              <div className="mem-form-group">
                <label className="mem-form-label">Title *</label>
                <input className="mem-form-input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
              </div>
              <div className="mem-form-group">
                <label className="mem-form-label">Description</label>
                <textarea className="mem-form-input" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
              </div>
              <div className="mem-form-row">
                <div className="mem-form-group">
                  <label className="mem-form-label">Start *</label>
                  <input type="datetime-local" className="mem-form-input" value={form.startTime} onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))} required />
                </div>
                <div className="mem-form-group">
                  <label className="mem-form-label">End *</label>
                  <input type="datetime-local" className="mem-form-input" value={form.endTime} onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))} required />
                </div>
              </div>
              <div className="mem-form-group">
                <label className="mem-form-label">Location</label>
                <input className="mem-form-input" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
              </div>
              {divisions.length > 0 && (
                <div className="mem-form-group">
                  <label className="mem-form-label">Division (members of this division will receive an email)</label>
                  <select
                    className="mem-form-select"
                    value={form.divisionId}
                    onChange={(e) => setForm((p) => ({ ...p, divisionId: e.target.value }))}
                  >
                    <option value="">— No division —</option>
                    {divisions.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="mem-modal-footer">
                <button type="button" className="mem-modal-btn cancel" onClick={() => setModalOpen(false)} disabled={submitting}>Cancel</button>
                <button type="submit" className="mem-modal-btn submit" disabled={submitting}>{submitting ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </div>
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

export default EventsPage;
