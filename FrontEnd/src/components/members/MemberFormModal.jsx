import React, { useState, useEffect } from "react";
import { X, User } from "lucide-react";
import {
  EMPTY_MEMBER_FORM,
  ALL_ROLES,
  ALL_STATUSES,
  ALL_GENDERS,
  LANGUAGE_OPTIONS,
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
  const [form, setForm] = useState(() =>
    initialData ? { ...EMPTY_MEMBER_FORM, ...initialData } : EMPTY_MEMBER_FORM,
  );
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const errs = validate(form);
    if (!form.studentId?.trim()) errs.studentId = "Student ID is required.";
    const languageValue = getLanguageValue();
    if (!languageValue) errs.language = "Select at least one language.";
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const sectionNum = form.section != null && form.section !== "" ? Number(form.section) : null;
    onSubmit({
      ...form,
      id: initialData?.id,
      fullName: form.fullName.trim(),
      studentId: form.studentId.trim(),
      familyId: form.divisionId ? form.divisionId : null,
      familyRole: form.familyRole || "CHILD",
      divisionId: null,
      section: Number.isInteger(sectionNum) ? sectionNum : null,
      language: languageValue,
    });
  };

  const getLanguageValue = () => {
    const afan = form.language === "AFAN_OROMO" || form.language === "BOTH";
    const amharic = form.language === "AMHARIC" || form.language === "BOTH";
    if (afan && amharic) return "BOTH";
    if (afan) return "AFAN_OROMO";
    if (amharic) return "AMHARIC";
    return null;
  };

  const handleLanguageCheck = (value) => {
    const afan = form.language === "AFAN_OROMO" || form.language === "BOTH";
    const amharic = form.language === "AMHARIC" || form.language === "BOTH";
    if (value === "AFAN_OROMO") {
      const newAfan = !afan;
      handleChange("language", newAfan && amharic ? "BOTH" : newAfan ? "AFAN_OROMO" : amharic ? "AMHARIC" : null);
    } else {
      const newAmharic = !amharic;
      handleChange("language", newAmharic && afan ? "BOTH" : newAmharic ? "AMHARIC" : afan ? "AFAN_OROMO" : null);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="mem-modal-overlay" onClick={onClose}>
      <div className="mem-modal" style={{ maxWidth: 580 }} onClick={(e) => e.stopPropagation()}>
        <div className="mem-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <AvatarPreview form={form} memberId={initialData?.id} />
            <div>
              <h3 className="mem-modal-title">{isEditing ? "Edit Member" : "Add New Member"}</h3>
              <p className="mem-modal-subtitle">
                {isEditing ? "Update the member's information below." : "Fill in the details to register a new member."}
              </p>
            </div>
          </div>
          <button className="mem-modal-close" onClick={onClose} title="Close"><X size={17} /></button>
        </div>

        <div className="mem-modal-body">
          <div className="mem-form-row">
            <div className="mem-form-group" style={{ flex: 2 }}>
              <label className="mem-form-label">Full Name <span className="mem-required">*</span></label>
              <input className={`mem-form-input ${errors.fullName ? "error" : ""}`} type="text" value={form.fullName} onChange={(e) => handleChange("fullName", e.target.value)} autoFocus />
              {errors.fullName && <span className="mem-form-error">{errors.fullName}</span>}
            </div>
            <div className="mem-form-group" style={{ flex: 1 }}>
              <label className="mem-form-label">Student ID <span className="mem-required">*</span></label>
              <input className={`mem-form-input ${errors.studentId ? "error" : ""}`} type="text" value={form.studentId} onChange={(e) => handleChange("studentId", e.target.value)} />
              {errors.studentId && <span className="mem-form-error">{errors.studentId}</span>}
            </div>
          </div>

          <div className="mem-form-row">
            <div className="mem-form-group">
              <label className="mem-form-label">Gender</label>
              <select className="mem-form-select" value={form.gender} onChange={(e) => handleChange("gender", e.target.value)}>
                {ALL_GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
              </select>
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Phone Number</label>
              <input className={`mem-form-input ${errors.phone ? "error" : ""}`} type="tel" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>
          </div>

          <div className="mem-form-row">
            <div className="mem-form-group">
              <label className="mem-form-label">Section</label>
              <input className="mem-form-input" type="number" min={1} value={form.section ?? ""} onChange={(e) => handleChange("section", e.target.value === "" ? null : e.target.value)} placeholder="e.g. 1" />
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Language <span className="mem-required">*</span></label>
              <p style={{ fontSize: "0.8rem", color: "var(--text-light)", marginBottom: "0.25rem" }}>Select at least one (you can check both).</p>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                {LANGUAGE_OPTIONS.map((opt) => (
                  <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.language === opt.value || form.language === "BOTH"}
                      onChange={() => handleLanguageCheck(opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.language && <span className="mem-form-error">{errors.language}</span>}
            </div>
          </div>

          <div className="mem-form-row">
            <div className="mem-form-group">
              <label className="mem-form-label">Email Address</label>
              <input className={`mem-form-input ${errors.email ? "error" : ""}`} type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} />
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Division</label>
              <select className="mem-form-select" value={form.divisionId ?? ""} onChange={(e) => handleChange("divisionId", e.target.value === "" ? null : e.target.value)}>
                <option value="">— Unassigned —</option>
                {families.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Family Role</label>
              <select className="mem-form-select" value={form.familyRole} onChange={(e) => handleChange("familyRole", e.target.value)}>
                <option value="CHILD">Child</option>
                <option value="MOTHER">Mother</option>
                <option value="FATHER">Father</option>
              </select>
            </div>
          </div>

          <div className="mem-form-row">
            <div className="mem-form-group">
              <label className="mem-form-label">Role</label>
              <select className="mem-form-select" value={form.role} onChange={(e) => handleChange("role", e.target.value)}>
                {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="mem-form-group">
              <label className="mem-form-label">Status</label>
              <select className="mem-form-select" value={form.status} onChange={(e) => handleChange("status", e.target.value)}>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="mem-form-group">
            <label className="mem-form-label">Address</label>
            <input className="mem-form-input" type="text" value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
          </div>
        </div>

        <div className="mem-modal-footer">
          <button className="mem-modal-btn cancel" onClick={onClose}>Cancel</button>
          <button className="mem-modal-btn submit" onClick={handleSubmit}>{isEditing ? "Save Changes" : "Add Member"}</button>
        </div>
      </div>
    </div>
  );
};

export default MemberFormModal;
