import React, { useState, useEffect } from "react";
import { X, UsersRound } from "lucide-react";
import { EMPTY_FAMILY_FORM, getInitials, getAvatarStyle } from "./mockData";

// ── Validation ────────────────────────────────────────────────────────────────
const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Family / group name is required.";
  return errors;
};

/**
 * FamilyModal
 *
 * Props:
 *   isOpen      {boolean}   – controls visibility
 *   onClose     {function}  – called when the modal should close
 *   onSubmit    {function}  – called with the complete family object
 *   initialData {object}    – pre-filled values for edit mode (null → add mode)
 *   members     {array}     – full members list used to populate leader selector
 */
const FamilyModal = ({ isOpen, onClose, onSubmit, initialData, members }) => {
  const isEditing = Boolean(initialData);

  // ── Form state — initialised from props each time the component mounts ──────
  // The parent passes a changing `key` prop so React remounts this component
  // fresh whenever the modal opens with different data (create vs. edit).
  const [form, setForm] = useState(() =>
    initialData
      ? {
          name: initialData.name ?? "",
          leaderId: initialData.leaderId ?? null,
          description: initialData.description ?? "",
        }
      : { ...EMPTY_FAMILY_FORM },
  );
  const [errors, setErrors] = useState({});

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit({
      id: initialData?.id ?? Date.now(),
      name: form.name.trim(),
      leaderId: form.leaderId && String(form.leaderId).trim() ? String(form.leaderId).trim() : null,
      description: form.description.trim(),
      // Preserve original creation date when editing; set today for new families
      createdAt:
        initialData?.createdAt ?? new Date().toISOString().slice(0, 10),
    });
  };

  if (!isOpen) return null;

  // ── Selected leader preview (leader options = approved members only) ─────────
  const leaderIdStr = form.leaderId != null ? String(form.leaderId) : "";
  const selectedLeader = members.find((m) => String(m.id) === leaderIdStr);
  const leaderStyle = selectedLeader ? getAvatarStyle(selectedLeader.id) : null;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="mem-modal-overlay" onClick={onClose}>
      <div
        className="mem-modal"
        style={{ maxWidth: 500 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="mem-modal-header">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
          >
            {/* Family icon bubble */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "10px",
                background: "var(--blue-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <UsersRound size={22} color="var(--blue)" />
            </div>

            <div>
              <h3 className="mem-modal-title">
                {isEditing ? "Edit Family / Group" : "Create Family / Group"}
              </h3>
              <p className="mem-modal-subtitle">
                {isEditing
                  ? "Update the group's details and leader below."
                  : "Set up a new fellowship group and assign a leader."}
              </p>
            </div>
          </div>

          <button className="mem-modal-close" onClick={onClose} title="Close">
            <X size={17} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="mem-modal-body">
          {/* Group Name */}
          <div className="mem-form-group">
            <label className="mem-form-label">
              Group Name <span className="mem-required">*</span>
            </label>
            <input
              className={`mem-form-input ${errors.name ? "error" : ""}`}
              type="text"
              placeholder="e.g. Lior Group"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              autoFocus
            />
            {errors.name && (
              <span className="mem-form-error">{errors.name}</span>
            )}
          </div>

          {/* Leader Selector */}
          <div className="mem-form-group">
            <label className="mem-form-label">Group Leader</label>

            {/* Leader preview — shown when a leader is selected */}
            {selectedLeader && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.6rem 0.85rem",
                  background: "var(--gray-50)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: leaderStyle.bg,
                    color: leaderStyle.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(selectedLeader.fullName)}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                    }}
                  >
                    {selectedLeader.fullName}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selectedLeader.role} · {selectedLeader.status}
                  </div>
                </div>
              </div>
            )}

            {/* Dropdown */}
            <select
              className="mem-form-select"
              value={leaderIdStr}
              onChange={(e) =>
                handleChange(
                  "leaderId",
                  e.target.value === "" ? null : e.target.value,
                )
              }
            >
              <option value="">— No leader assigned —</option>
              {/* Only approved members can be chosen as group leader */}
              {members
                .filter((m) => m.status === "APPROVED")
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.role})
                  </option>
                ))}
            </select>

            <p
              style={{
                fontSize: "0.77rem",
                color: "var(--text-light)",
                marginTop: "0.35rem",
              }}
            >
              Only approved members are available for selection as group leader.
            </p>
          </div>

          {/* Description */}
          <div className="mem-form-group">
            <label className="mem-form-label">Description</label>
            <textarea
              className="mem-form-input"
              rows={3}
              placeholder="Brief description of this fellowship group's purpose…"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              style={{
                resize: "vertical",
                minHeight: "72px",
                fontFamily: "inherit",
                lineHeight: "1.5",
              }}
            />
          </div>
        </div>
        {/* end mem-modal-body */}

        {/* ── Footer ── */}
        <div className="mem-modal-footer">
          <button className="mem-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="mem-modal-btn submit" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyModal;
