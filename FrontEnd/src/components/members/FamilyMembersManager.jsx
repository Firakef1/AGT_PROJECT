import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  UserPlus,
  UserMinus,
  Users,
  Crown,
  UsersRound,
} from "lucide-react";
import { getInitials, getAvatarStyle, roleColors } from "./mockData";

// ── Small helpers ─────────────────────────────────────────────────────────────

/** Coloured initials avatar */
const Avatar = ({ member, size = 36 }) => {
  const style = getAvatarStyle(member.id);
  if (member.profileImage) {
    return (
      <img
        src={member.profileImage}
        alt={member.fullName}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: style.bg,
        color: style.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size <= 28 ? "0.62rem" : "0.75rem",
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {getInitials(member.fullName)}
    </div>
  );
};

/** Role colour pill */
const RoleTag = ({ role }) => {
  const rc = roleColors[role] ?? { color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span
      style={{
        padding: "0.15rem 0.5rem",
        borderRadius: "4px",
        fontSize: "0.72rem",
        fontWeight: 500,
        color: rc.color,
        background: rc.bg,
        border: `1px solid ${rc.color}22`,
        whiteSpace: "nowrap",
      }}
    >
      {role}
    </span>
  );
};

// ── Main component ────────────────────────────────────────────────────────────

/**
 * FamilyMembersManager
 *
 * A slide-in modal for viewing current family members and adding/removing
 * members from that family group.
 *
 * Props:
 *   isOpen          {boolean}   – controls visibility
 *   onClose         {function}  – called when modal should close
 *   family          {object}    – the family record being managed
 *   allMembers      {array}     – complete members list from parent state
 *   onUpdateMembers {function}  – called with (memberId, newFamilyId) to update
 *                                 a single member's familyId in the parent
 */
const FamilyMembersManager = ({
  isOpen,
  onClose,
  family,
  allMembers,
  onUpdateMembers,
}) => {
  // Search state — reset by the parent passing a changing `key` prop on remount
  const [addSearch, setAddSearch] = useState("");
  const [removeSearch, setRemoveSearch] = useState("");

  // Close on Escape key
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Derived lists ──────────────────────────────────────────────────────────
  const currentMembers = useMemo(
    () => allMembers.filter((m) => m.familyId === family?.id),
    [allMembers, family?.id],
  );

  // Members who are NOT in this family (available to add)
  const availableMembers = useMemo(
    () => allMembers.filter((m) => m.familyId !== family?.id),
    [allMembers, family?.id],
  );

  // Apply search filters
  const filteredCurrent = useMemo(() => {
    const q = removeSearch.toLowerCase().trim();
    if (!q) return currentMembers;
    return currentMembers.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q),
    );
  }, [currentMembers, removeSearch]);

  const filteredAvailable = useMemo(() => {
    const q = addSearch.toLowerCase().trim();
    if (!q) return availableMembers;
    return availableMembers.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.role.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    );
  }, [availableMembers, addSearch]);

  if (!isOpen || !family) return null;

  // ── Who is the leader? ─────────────────────────────────────────────────────
  const leader = allMembers.find((m) => m.id === family.leaderId);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /** Assign member to this family */
  const handleAdd = (memberId) => {
    onUpdateMembers(memberId, family.id);
  };

  /** Remove member from this family (set familyId → null) */
  const handleRemove = (memberId) => {
    onUpdateMembers(memberId, null);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="fmm-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Manage members of ${family.name}`}
    >
      <div className="fmm-panel" onClick={(e) => e.stopPropagation()}>
        {/* ════════════════════════════════════════
            Header
            ════════════════════════════════════════ */}
        <div className="fmm-header">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* Family icon */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "10px",
                background: "var(--blue-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <UsersRound size={20} color="var(--blue)" />
            </div>

            <div style={{ minWidth: 0 }}>
              <h3 className="fmm-title">{family.name}</h3>
              <p className="fmm-subtitle">
                {currentMembers.length} member
                {currentMembers.length !== 1 ? "s" : ""}
                {leader && (
                  <>
                    {" · "}
                    <Crown
                      size={10}
                      color="var(--gold)"
                      style={{ verticalAlign: "middle" }}
                    />{" "}
                    {leader.fullName}
                  </>
                )}
              </p>
            </div>
          </div>

          <button className="fmm-close" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        {/* ════════════════════════════════════════
            Body — two sections side by side on
            wide screens, stacked on mobile
            ════════════════════════════════════════ */}
        <div className="fmm-body">
          {/* ── Section A: Current Members ── */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.65rem",
              }}
            >
              <p className="fmm-section-title">
                <Users
                  size={12}
                  style={{ verticalAlign: "middle", marginRight: "0.3rem" }}
                />
                Current Members ({currentMembers.length})
              </p>
            </div>

            {/* Search inside current members */}
            {currentMembers.length > 4 && (
              <div className="fmm-search-wrap">
                <Search size={14} className="fmm-search-icon" />
                <input
                  className="fmm-search-field"
                  type="text"
                  placeholder="Search current members…"
                  value={removeSearch}
                  onChange={(e) => setRemoveSearch(e.target.value)}
                />
              </div>
            )}

            {filteredCurrent.length === 0 ? (
              <div className="fmm-empty">
                {currentMembers.length === 0
                  ? "No members assigned to this group yet."
                  : "No members match your search."}
              </div>
            ) : (
              <div className="fmm-list">
                {filteredCurrent.map((m) => {
                  const isLeader = m.id === family.leaderId;
                  return (
                    <div key={m.id} className="fmm-item">
                      <Avatar member={m} size={34} />

                      <div className="fmm-item-info">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <span className="fmm-item-name">{m.fullName}</span>
                          {isLeader && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.2rem",
                                fontSize: "0.68rem",
                                fontWeight: 600,
                                color: "var(--gold)",
                                background: "var(--gold-bg)",
                                padding: "0.1rem 0.4rem",
                                borderRadius: "4px",
                                border: "1px solid #d4a01730",
                              }}
                            >
                              <Crown size={9} />
                              Leader
                            </span>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            marginTop: "0.15rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <RoleTag role={m.role} />
                          <span
                            className={`member-status ${m.status.toLowerCase()}`}
                            style={{ fontSize: "0.72rem" }}
                          >
                            <span className="status-dot-sm" />
                            {m.status}
                          </span>
                        </div>
                      </div>

                      {/* Don't allow removing the leader from the group */}
                      {isLeader ? (
                        <span
                          title="Leader cannot be removed directly. Change the leader in the family settings first."
                          style={{
                            fontSize: "0.72rem",
                            color: "var(--text-light)",
                            padding: "0.3rem 0.5rem",
                            flexShrink: 0,
                          }}
                        >
                          Leader
                        </span>
                      ) : (
                        <button
                          className="fmm-remove-btn"
                          title={`Remove ${m.fullName} from this group`}
                          onClick={() => handleRemove(m.id)}
                        >
                          <UserMinus
                            size={13}
                            style={{
                              verticalAlign: "middle",
                              marginRight: "0.2rem",
                            }}
                          />
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div
            style={{
              borderTop: "1px dashed var(--border)",
              margin: "0.25rem 0",
            }}
          />

          {/* ── Section B: Add Members ── */}
          <div>
            <p
              className="fmm-section-title"
              style={{ marginBottom: "0.65rem" }}
            >
              <UserPlus
                size={12}
                style={{ verticalAlign: "middle", marginRight: "0.3rem" }}
              />
              Add Members ({availableMembers.length} available)
            </p>

            {/* Search available members */}
            <div className="fmm-search-wrap">
              <Search size={14} className="fmm-search-icon" />
              <input
                className="fmm-search-field"
                type="text"
                placeholder="Search by name, role or email…"
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
              />
            </div>

            {availableMembers.length === 0 ? (
              <div className="fmm-empty">
                All members are already assigned to a group.
              </div>
            ) : filteredAvailable.length === 0 ? (
              <div className="fmm-empty">No members match your search.</div>
            ) : (
              <div
                className="fmm-list"
                style={{
                  maxHeight: "260px",
                  overflowY: "auto",
                  paddingRight: "0.25rem",
                }}
              >
                {filteredAvailable.map((m) => {
                  // Is this member already in a different family?
                  const inOtherFamily =
                    m.familyId !== null && m.familyId !== family.id;
                  const otherFamily = inOtherFamily
                    ? `Currently in another group — will be moved`
                    : null;

                  return (
                    <div
                      key={m.id}
                      className="fmm-item"
                      style={
                        inOtherFamily
                          ? {
                              borderColor: "var(--orange-bg)",
                              background: "#fffdf5",
                            }
                          : {}
                      }
                    >
                      <Avatar member={m} size={34} />

                      <div className="fmm-item-info">
                        <span className="fmm-item-name">{m.fullName}</span>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            marginTop: "0.15rem",
                            flexWrap: "wrap",
                          }}
                        >
                          <RoleTag role={m.role} />
                          {otherFamily && (
                            <span
                              style={{
                                fontSize: "0.68rem",
                                color: "var(--orange)",
                                fontStyle: "italic",
                              }}
                            >
                              {otherFamily}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        className="fmm-add-btn"
                        title={`Add ${m.fullName} to ${family.name}`}
                        onClick={() => handleAdd(m.id)}
                      >
                        <UserPlus
                          size={13}
                          style={{
                            verticalAlign: "middle",
                            marginRight: "0.2rem",
                          }}
                        />
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════
            Footer
            ════════════════════════════════════════ */}
        <div className="fmm-footer">
          <span
            style={{
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              marginRight: "auto",
            }}
          >
            {currentMembers.length} member
            {currentMembers.length !== 1 ? "s" : ""} in this group
          </span>
          <button className="mem-modal-btn cancel" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyMembersManager;
