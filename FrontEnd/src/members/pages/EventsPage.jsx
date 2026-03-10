import React, { useState, useEffect } from "react";
import { CalendarDays, Plus, Pencil, Trash2, ArrowLeft, Loader2, X } from "lucide-react";
import { apiFetch } from "../../services/apiFetch";

const EventsPage = ({ user, onNavigate }) => {
  const myDivisionId = user?.member?.divisionId ?? null;
  const [events, setEvents] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [filterDivisionId, setFilterDivisionId] = useState(myDivisionId || "");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", startTime: "", endTime: "", location: "", divisionId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      const url = filterDivisionId
        ? `/events?divisionId=${encodeURIComponent(filterDivisionId)}`
        : "/events";
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
  }, [filterDivisionId]);

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

  const handleDelete = async (id) => {
    if (!confirm("Delete this event?")) return;
    try {
      await apiFetch(`/events/${id}`, { method: "DELETE" });
      await fetchEvents();
    } catch (err) {
      alert(err.message || "Failed to delete event");
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
    <div className="events-page" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Events</h1>
          <p style={{ margin: "0.25rem 0 0", color: "var(--text-light)", fontSize: "0.9rem" }}>
            Plan and manage division events. Division members receive an email with an option to add the event to Google Calendar.
          </p>
        </div>
        <button className="btn-accent" onClick={openCreate}>
          <Plus size={16} /> New Event
        </button>
      </div>

      {divisions.length > 0 && (
        <div className="mem-form-group" style={{ marginBottom: "1rem" }}>
          <label className="mem-form-label">Division filter</label>
          <select
            className="mem-form-select"
            value={filterDivisionId}
            onChange={(e) => setFilterDivisionId(e.target.value)}
            style={{ maxWidth: 280 }}
          >
            <option value="">All divisions</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}

      {error && <p style={{ color: "var(--red)", marginBottom: "1rem" }}>{error}</p>}

      {events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem", background: "var(--white)", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
          <CalendarDays size={48} color="var(--text-light)" style={{ marginBottom: "1rem" }} />
          <p style={{ color: "var(--text-light)" }}>No events yet. Create one to get started.</p>
          <button className="btn-accent" onClick={openCreate} style={{ marginTop: "1rem" }}>Create Event</button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                padding: "1rem 1.25rem",
                background: "var(--white)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{event.title}</h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", color: "var(--text-light)" }}>
                  {formatDate(event.startTime)} – {formatDate(event.endTime)}
                </p>
                {event.division?.name && (
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.8rem", color: "var(--blue)" }}>{event.division.name}</p>
                )}
                {event.location && <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem" }}>{event.location}</p>}
                {event.description && <p style={{ margin: "0.5rem 0 0", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{event.description}</p>}
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button type="button" className="mem-modal-btn cancel" onClick={() => openEdit(event)}><Pencil size={14} /> Edit</button>
                <button type="button" className="mem-modal-btn submit" style={{ background: "var(--red)" }} onClick={() => handleDelete(event.id)}><Trash2 size={14} /> Delete</button>
              </div>
            </div>
          ))}
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

      <div style={{ marginTop: "1.5rem" }}>
        <button type="button" className="placeholder-btn-secondary" onClick={() => onNavigate("overview")}>
          <ArrowLeft size={14} /> Back to Overview
        </button>
      </div>
    </div>
  );
};

export default EventsPage;
