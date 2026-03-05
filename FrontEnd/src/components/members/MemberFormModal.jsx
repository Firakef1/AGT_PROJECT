import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import {
  EMPTY_MEMBER_FORM,
  ALL_ROLES,
  ALL_STATUSES,
  ALL_GENDERS,
  getInitials,
  getAvatarStyle,
} from "./mockData";

// ── Validation ────────────────────────────────────────────────────────────────
const validate = (form) => {
  const errors = {};
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (form.phone && !/^\+?[\d\s\-()]{7,}$/.test(form.phone))
    errors.phone = "Enter a valid phone number.";
  return errors;
};

// ── Avatar preview shown in the modal header ──────────────────────────────────
const AvatarPreview = ({ form, memberId }) => {
  const previewId = memberId ?? 1;
  const style = getAvatarStyle(previewId);
  const initials = getInitials(form.fullName) || <User size={20} />;

  if (form.profileImage) {
    return (
      <img
        src={form.profileImage}
        alt="preview"
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--border)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: style.bg,
        color: style.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1rem",
        fontWeight: 700,
        flexShrink: 0,
        border: "2px solid var(--border)",
      }}
    >
      {initials}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
/**
 * MemberFormModal
 *
 * Props:
 *   isOpen       {boolean}   – controls visibility
 *   onClose      {function}  – called when modal should close
 *   onSubmit     {function}  – called with the complete member object
 *   initialData  {object}    – pre-filled values for edit mode (null → add mode)
 *   families     {array}     – list of family objects for the family selector
 */
const MemberFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  families,
}) => {
  const isEditing = Boolean(initialData);

  // ── Form state — initialised from props each time the component mounts ──────
  // The parent passes a changing `key` prop so React remounts this component
  // fresh whenever the modal opens with different data (add vs. edit).
  const [form, setForm] = useState(() =>
    initialData ? { ...EMPTY_MEMBER_FORM, ...initialData } : EMPTY_MEMBER_FORM,
  );
  const [errors, setErrors] = useState({});

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear the error for this field as the user types
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSubmit({
      // Preserve the original id when editing, generate a new one when adding
      id: initialData?.id ?? Date.now(),
      fullName: form.fullName.trim(),
      gender: form.gender,
      phone: form.phone.trim(),
      email: form.email.trim(),
      birthday: form.birthday,
      joinDate: form.joinDate,
      address: form.address.trim(),
      familyId: form.familyId ? Number(form.familyId) : null,
      role: form.role,
      status: form.status,
      profileImage: form.profileImage ?? null,
    });
  };

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="mem-modal-overlay" onClick={onClose}>
      <div
        className="mem-modal"
        style={{ maxWidth: 580 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="mem-modal-header">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
          >
            <AvatarPreview form={form} memberId={initialData?.id} />
            <div>
              <h3 className="mem-modal-title">
                {isEditing ? "Edit Member" : "Add New Member"}
              </h3>
              <p className="mem-modal-subtitle">
                {isEditing
                  ? "Update the member's information below."
                  : "Fill in the details to register a new member."}
              </p>
            </div>
          </div>
          <button className="mem-modal-close" onClick={onClose} title="Close">
            <X size={17} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="mem-modal-body">
          {/* Row 1 — Full Name + Gender */}
          <div className="mem-form-row">
            {/* Full Name */}
            <div className="mem-form-group" style={{ flex: 2 }}>
              <label className="mem-form-label">
                Full Name <span className="mem-required">*</span>
              </label>
              <input
                className={`mem-form-input ${errors.fullName ? "error" : ""}`}
                type="text"
                placeholder="e.g. Abebe Kebede"
                value={form.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                autoFocus
              />
              {errors.fullName && (
                <span className="mem-form-error">{errors.fullName}</span>
              )}
            </div>

            {/* Gender */}
            <div className="mem-form-group" style={{ flex: 1 }}>
              <label className="mem-form-label">Gender</label>
              <select
                className="mem-form-select"
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                {ALL_GENDERS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2 — Phone + Email */}
          <div className="mem-form-row">
            <div className="mem-form-group">
              <label className="mem-form-label">Phone Number</label>
              <input
                className={`mem-form-input ${errors.phone ? "error" : ""}`}
                type="tel"
                placeholder="+251 9__ ______"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              {errors.phone && (
                <span className="mem-form-error">{errors.phone}</span>
              )}
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Email Address</label>
              <input
                className={`mem-form-input ${errors.email ? "error" : ""}`}
                type="email"
                placeholder="member@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && (
                <span className="mem-form-error">{errors.email}</span>
              )}
            </div>
          </div>

          {/* Row 3 — Birthday + Join Date */}
          <div className="mem-form-row">
            <div className="mem-form-group">
              <label className="mem-form-label">Date of Birth</label>
              <input
                className="mem-form-input"
                type="date"
                value={form.birthday}
                onChange={(e) => handleChange("birthday", e.target.value)}
              />
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Join Date</label>
              <input
                className="mem-form-input"
                type="date"
                value={form.joinDate}
                onChange={(e) => handleChange("joinDate", e.target.value)}
              />
            </div>
          </div>

          {/* Row 4 — Address (full-width) */}
          <div className="mem-form-group">
            <label className="mem-form-label">Address</label>
            <input
              className="mem-form-input"
              type="text"
              placeholder="e.g. Adama, Oromia"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          {/* Row 5 — Role + Family */}
          <div className="mem-form-row">
            <div className="mem-form-group">
              <label className="mem-form-label">Role / Team</label>
              <select
                className="mem-form-select"
                value={form.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                {ALL_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Family / Group</label>
              <select
                className="mem-form-select"
                value={form.familyId ?? ""}
                onChange={(e) =>
                  handleChange(
                    "familyId",
                    e.target.value === "" ? null : e.target.value,
                  )
                }
              >
                <option value="">— Unassigned —</option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 6 — Status */}
          <div className="mem-form-group">
            <label className="mem-form-label">Membership Status</label>
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "0.25rem",
              }}
            >
              {ALL_STATUSES.map((s) => {
                const isActive = form.status === s;
                const dotColor =
                  s === "Active" ? "var(--green)" : "var(--gray-300)";
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleChange("status", s)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.45rem",
                      padding: "0.45rem 1rem",
                      borderRadius: "var(--radius-sm)",
                      border: isActive
                        ? `2px solid ${s === "Active" ? "var(--green)" : "var(--gray-400)"}`
                        : "2px solid var(--border)",
                      background: isActive
                        ? s === "Active"
                          ? "var(--green-bg)"
                          : "var(--gray-100)"
                        : "var(--white)",
                      color: isActive
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                      fontWeight: isActive ? 600 : 400,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: dotColor,
                        flexShrink: 0,
                      }}
                    />
                    {s}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* end mem-modal-body */}

        {/* ── Footer ── */}
        <div className="mem-modal-footer">
          <button className="mem-modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="mem-modal-btn submit" onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberFormModal;
