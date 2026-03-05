import React, { useState, useMemo } from "react";
import {
  UserPlus,
  UsersRound,
  Users,
  UserCheck,
  UserX,
  Plus,
  X,
  Crown,
} from "lucide-react";

// ── Sub-components ────────────────────────────────────────────────────────────
import MemberTable from "./members/MemberTable";
import MemberFormModal from "./members/MemberFormModal";
import FamilyCard from "./members/FamilyCard";
import FamilyModal from "./members/FamilyModal";
import FamilyMembersManager from "./members/FamilyMembersManager";

// ── Shared mock data + helpers ────────────────────────────────────────────────
import {
  initialMembers,
  initialFamilies,
  getInitials,
  getAvatarStyle,
  roleColors,
} from "./members/mockData";

// ── Small local helpers ───────────────────────────────────────────────────────

/** Format ISO date string to readable label */
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/** Inline avatar for the view profile modal */
const ProfileAvatar = ({ member, size = 68 }) => {
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
          border: "3px solid var(--border)",
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
        fontSize: size > 50 ? "1.3rem" : "0.85rem",
        fontWeight: 700,
        flexShrink: 0,
        border: "3px solid var(--border)",
      }}
    >
      {getInitials(member.fullName)}
    </div>
  );
};

// ── Detail row used inside the View Profile modal ─────────────────────────────
const DetailRow = ({ label, value }) => (
  <div className="mem-view-row">
    <span className="mem-view-label">{label}</span>
    <span className="mem-view-value">{value || "—"}</span>
  </div>
);

// ═════════════════════════════════════════════════════════════════════════════
//  Members Hub — main exported component
// =============================================================================
const Members = () => {
  // ── Shared state: members + families ────────────────────────────────────────
  const [members, setMembers] = useState(initialMembers);
  const [families, setFamilies] = useState(initialFamilies);

  // ── Tab navigation ───────────────────────────────────────────────────────────
  // "members" | "families"
  const [activeTab, setActiveTab] = useState("members");

  // ── Member form modal ────────────────────────────────────────────────────────
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberModalData, setMemberModalData] = useState(null); // null = add mode

  // ── View Profile modal ────────────────────────────────────────────────────────
  const [viewMember, setViewMember] = useState(null);

  // ── Family form modal ─────────────────────────────────────────────────────────
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [familyModalData, setFamilyModalData] = useState(null); // null = add mode

  // ── Family Members Manager modal ──────────────────────────────────────────────
  const [fmmOpen, setFmmOpen] = useState(false);
  const [fmmFamily, setFmmFamily] = useState(null);

  // ── Delete confirmation (inline — no separate modal needed) ──────────────────
  const [deleteMemberId, setDeleteMemberId] = useState(null);
  const [deleteFamilyId, setDeleteFamilyId] = useState(null);

  // ── Derived stats ─────────────────────────────────────────────────────────────
  const activeCount = useMemo(
    () => members.filter((m) => m.status === "Active").length,
    [members],
  );
  const inactiveCount = useMemo(
    () => members.filter((m) => m.status === "Inactive").length,
    [members],
  );
  const assignedCount = useMemo(
    () => members.filter((m) => m.familyId !== null).length,
    [members],
  );
  const unassignedCount = useMemo(
    () => members.filter((m) => m.familyId === null).length,
    [members],
  );

  // ═══════════════════════════════════════════════════════════════════════════
  //  Member CRUD handlers
  // ═══════════════════════════════════════════════════════════════════════════

  const openAddMember = () => {
    setMemberModalData(null);
    setMemberModalOpen(true);
  };

  const openEditMember = (member) => {
    setMemberModalData(member);
    setMemberModalOpen(true);
  };

  const handleMemberSubmit = (data) => {
    setMembers((prev) => {
      const exists = prev.some((m) => m.id === data.id);
      return exists
        ? prev.map((m) => (m.id === data.id ? data : m))
        : [...prev, data];
    });
    setMemberModalOpen(false);
  };

  const handleDeleteMember = (id) => {
    // Remove member and unlink them as a family leader if needed
    setMembers((prev) => prev.filter((m) => m.id !== id));
    // If this member was a family leader, clear that leader reference
    setFamilies((prev) =>
      prev.map((f) => (f.leaderId === id ? { ...f, leaderId: null } : f)),
    );
    setDeleteMemberId(null);
  };

  const openViewMember = (member) => {
    setViewMember(member);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  Family CRUD handlers
  // ═══════════════════════════════════════════════════════════════════════════

  const openCreateFamily = () => {
    setFamilyModalData(null);
    setFamilyModalOpen(true);
  };

  const openEditFamily = (family) => {
    setFamilyModalData(family);
    setFamilyModalOpen(true);
  };

  const handleFamilySubmit = (data) => {
    setFamilies((prev) => {
      const exists = prev.some((f) => f.id === data.id);
      return exists
        ? prev.map((f) => (f.id === data.id ? data : f))
        : [...prev, data];
    });
    setFamilyModalOpen(false);
  };

  const handleDeleteFamily = (id) => {
    // Remove family and unassign all members that belonged to it
    setFamilies((prev) => prev.filter((f) => f.id !== id));
    setMembers((prev) =>
      prev.map((m) => (m.familyId === id ? { ...m, familyId: null } : m)),
    );
    setDeleteFamilyId(null);
  };

  // ── Open the "Manage Members" panel ─────────────────────────────────────────
  const openFamilyManager = (family) => {
    setFmmFamily(family);
    setFmmOpen(true);
  };

  // ── Called by FamilyMembersManager when a member is added/removed ────────────
  const handleUpdateMemberFamily = (memberId, newFamilyId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, familyId: newFamilyId } : m,
      ),
    );
  };

  // ── When the FMM panel is open, keep its family reference in sync ─────────────
  const syncedFmmFamily = fmmFamily
    ? (families.find((f) => f.id === fmmFamily.id) ?? fmmFamily)
    : null;

  // ── Lookup helper: get family name from id ────────────────────────────────────
  const getFamilyName = (familyId) => {
    if (!familyId) return null;
    return families.find((f) => f.id === familyId)?.name ?? null;
  };

  // ═══════════════════════════════════════════════════════════════════════════
  //  Render
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <div className="page-v2">
      {/* ── Page Header ── */}
      <div className="page-v2-header">
        <div>
          <h1>Member Management</h1>
          <p>Manage all registered members and fellowship family groups.</p>
        </div>

        {/* Context-sensitive primary action */}
        {activeTab === "members" ? (
          <button className="btn-accent" onClick={openAddMember}>
            <UserPlus size={14} /> Add Member
          </button>
        ) : (
          <button className="btn-accent" onClick={openCreateFamily}>
            <Plus size={14} /> Create Group
          </button>
        )}
      </div>

      {/* ── Summary Stat Cards ── */}
      <div className="page-v2-stats four-col">
        {/* Total members */}
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#e8f0fe" }}>
            <Users size={20} color="#1a56db" />
          </div>
          <div>
            <p className="page-stat-label">Total Members</p>
            <h2 className="page-stat-value">{members.length}</h2>
          </div>
        </div>

        {/* Active */}
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#dcfce7" }}>
            <UserCheck size={20} color="#16a34a" />
          </div>
          <div>
            <p className="page-stat-label">Active</p>
            <h2 className="page-stat-value">{activeCount}</h2>
          </div>
        </div>

        {/* Inactive */}
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#fef2f2" }}>
            <UserX size={20} color="#dc2626" />
          </div>
          <div>
            <p className="page-stat-label">Inactive</p>
            <h2 className="page-stat-value">{inactiveCount}</h2>
          </div>
        </div>

        {/* Family groups */}
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#fff3cd" }}>
            <UsersRound size={20} color="#d97706" />
          </div>
          <div>
            <p className="page-stat-label">Family Groups</p>
            <h2 className="page-stat-value">{families.length}</h2>
          </div>
        </div>
      </div>

      {/* ── Tab Bar ── */}
      <div className="members-hub-tabs">
        <button
          className={`members-hub-tab ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <Users size={15} />
          Members
          <span
            style={{
              marginLeft: "0.35rem",
              background:
                activeTab === "members" ? "var(--navy)" : "var(--gray-200)",
              color: activeTab === "members" ? "#fff" : "var(--text-secondary)",
              borderRadius: "20px",
              padding: "0.05rem 0.5rem",
              fontSize: "0.72rem",
              fontWeight: 600,
            }}
          >
            {members.length}
          </span>
        </button>

        <button
          className={`members-hub-tab ${activeTab === "families" ? "active" : ""}`}
          onClick={() => setActiveTab("families")}
        >
          <UsersRound size={15} />
          Family Groups
          <span
            style={{
              marginLeft: "0.35rem",
              background:
                activeTab === "families" ? "var(--navy)" : "var(--gray-200)",
              color:
                activeTab === "families" ? "#fff" : "var(--text-secondary)",
              borderRadius: "20px",
              padding: "0.05rem 0.5rem",
              fontSize: "0.72rem",
              fontWeight: 600,
            }}
          >
            {families.length}
          </span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          TAB CONTENT — Members
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "members" && (
        <MemberTable
          members={members}
          families={families}
          onView={openViewMember}
          onEdit={openEditMember}
          onDelete={(id) => setDeleteMemberId(id)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB CONTENT — Family Groups
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === "families" && (
        <div>
          {/* Sub-header row: description + unassigned members badge */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)" }}>
              {assignedCount} of {members.length} members assigned to a group
              {unassignedCount > 0 && (
                <span
                  style={{
                    marginLeft: "0.6rem",
                    background: "var(--orange-bg)",
                    color: "var(--orange)",
                    padding: "0.15rem 0.55rem",
                    borderRadius: "20px",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    border: "1px solid #d97706 30",
                  }}
                >
                  {unassignedCount} unassigned
                </span>
              )}
            </p>
          </div>

          {families.length === 0 ? (
            /* Empty state when no families exist */
            <div
              style={{
                background: "var(--white)",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius)",
                padding: "4rem 2rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  background: "var(--gray-100)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem",
                }}
              >
                <UsersRound size={28} color="var(--gray-400)" />
              </div>
              <h3
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                No family groups yet
              </h3>
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  marginBottom: "1.25rem",
                }}
              >
                Create fellowship groups and assign members to build community.
              </p>
              <button className="btn-accent" onClick={openCreateFamily}>
                <Plus size={14} /> Create First Group
              </button>
            </div>
          ) : (
            /* Family cards grid */
            <div className="families-grid">
              {families.map((family) => (
                <FamilyCard
                  key={family.id}
                  family={family}
                  members={members}
                  onEdit={openEditFamily}
                  onDelete={(id) => setDeleteFamilyId(id)}
                  onManageMembers={openFamilyManager}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
          ══════════════════════════════════════════════════════════════════════ */}

      {/* Add / Edit Member
          key changes whenever the modal opens with different data, forcing
          React to remount MemberFormModal with fresh local state.           */}
      <MemberFormModal
        key={
          memberModalOpen
            ? `member-${memberModalData?.id ?? "new"}`
            : "member-closed"
        }
        isOpen={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        onSubmit={handleMemberSubmit}
        initialData={memberModalData}
        families={families}
      />

      {/* Create / Edit Family
          key changes whenever the modal opens with different data, forcing
          React to remount FamilyModal with fresh local state.               */}
      <FamilyModal
        key={
          familyModalOpen
            ? `family-${familyModalData?.id ?? "new"}`
            : "family-closed"
        }
        isOpen={familyModalOpen}
        onClose={() => setFamilyModalOpen(false)}
        onSubmit={handleFamilySubmit}
        initialData={familyModalData}
        members={members}
      />

      {/* Family Members Manager
          key changes whenever a different family is opened, so search fields
          reset cleanly on each open.                                         */}
      <FamilyMembersManager
        key={fmmOpen ? `fmm-${fmmFamily?.id ?? "none"}` : "fmm-closed"}
        isOpen={fmmOpen}
        onClose={() => {
          setFmmOpen(false);
          setFmmFamily(null);
        }}
        family={syncedFmmFamily}
        allMembers={members}
        onUpdateMembers={handleUpdateMemberFamily}
      />

      {/* ── View Member Profile Modal ── */}
      {viewMember &&
        (() => {
          const rc = roleColors[viewMember.role] ?? {
            color: "#6b7280",
            bg: "#f3f4f6",
          };
          const fName = getFamilyName(viewMember.familyId);
          return (
            <div
              className="mem-modal-overlay"
              onClick={() => setViewMember(null)}
            >
              <div
                className="mem-modal mem-view-modal"
                style={{ maxWidth: 520 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="mem-modal-header">
                  <h3 className="mem-modal-title">Member Profile</h3>
                  <button
                    className="mem-modal-close"
                    onClick={() => setViewMember(null)}
                    title="Close"
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="mem-view-body">
                  {/* Profile block */}
                  <div className="mem-view-top">
                    <ProfileAvatar member={viewMember} size={68} />

                    <div className="mem-view-identity">
                      <h4 className="mem-view-name">{viewMember.fullName}</h4>
                      <div className="mem-view-tags">
                        {/* Role pill */}
                        <span
                          className="mem-role-tag"
                          style={{
                            color: rc.color,
                            background: rc.bg,
                            border: `1px solid ${rc.color}22`,
                          }}
                        >
                          {viewMember.role}
                        </span>

                        {/* Status */}
                        <span
                          className={`member-status ${viewMember.status.toLowerCase()}`}
                        >
                          <span className="status-dot-sm" />
                          {viewMember.status}
                        </span>

                        {/* Family badge */}
                        {fName && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.25rem",
                              fontSize: "0.78rem",
                              fontWeight: 500,
                              color: "var(--blue)",
                              background: "var(--blue-light)",
                              padding: "0.15rem 0.55rem",
                              borderRadius: "4px",
                            }}
                          >
                            <Crown size={10} color="var(--gold)" />
                            {fName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Detail rows */}
                  <div className="mem-view-details">
                    <DetailRow label="Gender" value={viewMember.gender} />
                    <DetailRow label="Phone" value={viewMember.phone} />
                    <DetailRow label="Email" value={viewMember.email} />
                    <DetailRow label="Address" value={viewMember.address} />
                    <DetailRow
                      label="Date of Birth"
                      value={formatDate(viewMember.birthday)}
                    />
                    <DetailRow
                      label="Join Date"
                      value={formatDate(viewMember.joinDate)}
                    />
                    <DetailRow
                      label="Family / Group"
                      value={fName ?? "Unassigned"}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="mem-modal-footer">
                  <button
                    className="mem-modal-btn cancel"
                    onClick={() => setViewMember(null)}
                  >
                    Close
                  </button>
                  <button
                    className="mem-modal-btn submit"
                    onClick={() => {
                      setViewMember(null);
                      openEditMember(viewMember);
                    }}
                  >
                    Edit Member
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Delete Member Confirmation ── */}
      {deleteMemberId &&
        (() => {
          const target = members.find((m) => m.id === deleteMemberId);
          return (
            <div
              className="mem-modal-overlay"
              onClick={() => setDeleteMemberId(null)}
            >
              <div
                className="mem-modal"
                style={{ maxWidth: 420 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mem-modal-header">
                  <div>
                    <h3 className="mem-modal-title">Delete Member</h3>
                    <p className="mem-modal-subtitle">
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    className="mem-modal-close"
                    onClick={() => setDeleteMemberId(null)}
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="mem-modal-body">
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    Are you sure you want to permanently remove{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {target?.fullName}
                    </strong>{" "}
                    from the directory? They will also be removed from their
                    family group.
                  </p>
                </div>

                <div className="mem-modal-footer">
                  <button
                    className="mem-modal-btn cancel"
                    onClick={() => setDeleteMemberId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="mem-modal-btn"
                    style={{
                      background: "var(--red)",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => handleDeleteMember(deleteMemberId)}
                  >
                    Delete Member
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ── Delete Family Confirmation ── */}
      {deleteFamilyId &&
        (() => {
          const target = families.find((f) => f.id === deleteFamilyId);
          const memberCount = members.filter(
            (m) => m.familyId === deleteFamilyId,
          ).length;
          return (
            <div
              className="mem-modal-overlay"
              onClick={() => setDeleteFamilyId(null)}
            >
              <div
                className="mem-modal"
                style={{ maxWidth: 420 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mem-modal-header">
                  <div>
                    <h3 className="mem-modal-title">Delete Family Group</h3>
                    <p className="mem-modal-subtitle">
                      This action cannot be undone.
                    </p>
                  </div>
                  <button
                    className="mem-modal-close"
                    onClick={() => setDeleteFamilyId(null)}
                  >
                    <X size={17} />
                  </button>
                </div>

                <div className="mem-modal-body">
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    Are you sure you want to delete{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {target?.name}
                    </strong>
                    ?
                    {memberCount > 0 && (
                      <>
                        {" "}
                        <strong style={{ color: "var(--orange)" }}>
                          {memberCount} member{memberCount !== 1 ? "s" : ""}
                        </strong>{" "}
                        will become unassigned.
                      </>
                    )}
                  </p>
                </div>

                <div className="mem-modal-footer">
                  <button
                    className="mem-modal-btn cancel"
                    onClick={() => setDeleteFamilyId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="mem-modal-btn"
                    style={{
                      background: "var(--red)",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={() => handleDeleteFamily(deleteFamilyId)}
                  >
                    Delete Group
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};

export default Members;
