import React from "react";
import {
  Users,
  Crown,
  Calendar,
  Pencil,
  Trash2,
  UserCog,
  UsersRound,
} from "lucide-react";
import { getInitials, getAvatarStyle } from "./mockData";

// ── Formats ISO date string to a readable label ──────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

// ── Colour palette cycled by family id for the icon background ───────────────
const familyPalette = [
  { color: "#1a56db", bg: "#e8f0fe" },
  { color: "#16a34a", bg: "#dcfce7" },
  { color: "#d97706", bg: "#fff3cd" },
  { color: "#7c3aed", bg: "#f3e8ff" },
  { color: "#dc2626", bg: "#fef2f2" },
  { color: "#0891b2", bg: "#e0f2fe" },
];

const getFamilyPalette = (id) => familyPalette[(id - 1) % familyPalette.length];

/**
 * FamilyCard
 *
 * Props:
 *   family          {object}   – the family record { id, name, leaderId, description, createdAt }
 *   members         {array}    – full members list (used to look up leader + count)
 *   onEdit          {function} – called with family object
 *   onDelete        {function} – called with family id
 *   onManageMembers {function} – called with family object
 */
const FamilyCard = ({ family, members, onEdit, onDelete, onManageMembers }) => {
  const palette     = getFamilyPalette(family.id);
  const memberCount = members.filter((m) => m.familyId === family.id).length;
  const leader      = members.find((m) => m.id === family.leaderId);
  const leaderName  = leader ? leader.fullName : "No leader assigned";

  // Leader avatar style
  const leaderStyle = leader ? getAvatarStyle(leader.id) : { color: "#6b7280", bg: "#f3f4f6" };
  const leaderInitials = leader ? getInitials(leader.fullName) : "—";

  return (
    <div className="family-card">

      {/* ── Card Header: icon + name + action icon buttons ── */}
      <div className="family-card-header">
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", flex: 1, minWidth: 0 }}>
          {/* Family icon bubble */}
          <div
            className="family-card-icon-wrap"
            style={{ background: palette.bg, flexShrink: 0 }}
          >
            <UsersRound size={20} color={palette.color} />
          </div>

          {/* Name + leader row */}
          <div style={{ minWidth: 0 }}>
            <div className="family-card-title">{family.name}</div>

            {/* Leader row */}
            <div className="family-card-leader">
              <Crown size={11} color="var(--gold)" />
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: leaderStyle.bg,
                  color: leaderStyle.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {leaderInitials}
              </div>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "140px",
                }}
              >
                {leaderName}
              </span>
            </div>
          </div>
        </div>

        {/* Quick action icon buttons (edit + delete) */}
        <div className="family-card-actions">
          <button
            className="icon-btn"
            title="Edit family"
            onClick={() => onEdit(family)}
          >
            <Pencil size={14} />
          </button>
          <button
            className="icon-btn danger"
            title="Delete family"
            onClick={() => onDelete(family.id)}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Description ── */}
      {family.description && (
        <p className="family-card-desc">{family.description}</p>
      )}

      {/* ── Meta row: member count + creation date ── */}
      <div className="family-card-meta">
        {/* Member count badge */}
        <div className="family-card-count">
          <Users size={13} color={palette.color} />
          <span>
            <strong style={{ color: "var(--text-primary)" }}>{memberCount}</strong>
            {" "}member{memberCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Creation date */}
        <div className="family-card-date" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <Calendar size={11} color="var(--text-light)" />
          <span>{formatDate(family.createdAt)}</span>
        </div>
      </div>

      {/* ── Footer: Manage Members primary button ── */}
      <div className="family-card-footer">
        <button
          className="btn-icon-text"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={() => onManageMembers(family)}
        >
          <UserCog size={14} />
          Manage Members
        </button>
      </div>

    </div>
  );
};

export default FamilyCard;
