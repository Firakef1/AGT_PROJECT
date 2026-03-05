import React, { useState } from "react";
import { UsersRound, Users, UserCheck, Plus, X } from "lucide-react";
import FamilyCard from "../../components/members/FamilyCard";
import FamilyModal from "../../components/members/FamilyModal";
import FamilyMembersManager from "../../components/members/FamilyMembersManager";
import {
  initialMembers,
  initialFamilies,
} from "../../components/members/mockData";

/**
 * FamiliesPage
 *
 * Standalone Families & Groups management page for the Members Division
 * Dashboard. Reuses the existing FamilyCard, FamilyModal, and
 * FamilyMembersManager sub-components without modification.
 *
 * State is self-contained and seeded from the shared mock data — consistent
 * with the main Members component approach.
 */
const FamiliesPage = () => {
  // ── Shared state ─────────────────────────────────────────────────────────
  const [members, setMembers]   = useState(initialMembers);
  const [families, setFamilies] = useState(initialFamilies);

  // ── Family modal (create / edit) ─────────────────────────────────────────
  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [familyModalData, setFamilyModalData] = useState(null); // null → create mode

  // ── Family Members Manager panel ─────────────────────────────────────────
  const [fmmOpen, setFmmOpen]     = useState(false);
  const [fmmFamily, setFmmFamily] = useState(null);

  // ── Delete confirmation ──────────────────────────────────────────────────
  const [deleteId, setDeleteId] = useState(null);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalGroups      = families.length;
  const assignedCount    = members.filter((m) => m.familyId !== null).length;
  const unassignedCount  = members.length - assignedCount;

  // ── Handlers ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setFamilyModalData(null);
    setFamilyModalOpen(true);
  };

  const openEdit = (family) => {
    setFamilyModalData(family);
    setFamilyModalOpen(true);
  };

  const handleFamilySubmit = (data) => {
    setFamilies((prev) => {
      const exists = prev.find((f) => f.id === data.id);
      return exists
        ? prev.map((f) => (f.id === data.id ? data : f))
        : [...prev, data];
    });
    setFamilyModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deleteId === null) return;
    // Unassign any member who belongs to this family
    setMembers((prev) =>
      prev.map((m) =>
        m.familyId === deleteId ? { ...m, familyId: null } : m
      )
    );
    setFamilies((prev) => prev.filter((f) => f.id !== deleteId));
    setDeleteId(null);
  };

  const openFamilyManager = (family) => {
    setFmmFamily(family);
    setFmmOpen(true);
  };

  // Keep the FMM panel in sync when members change while it is open
  const syncedFmmFamily =
    fmmOpen && fmmFamily
      ? families.find((f) => f.id === fmmFamily.id) ?? fmmFamily
      : fmmFamily;

  const handleUpdateMemberFamily = (memberId, familyId) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId ? { ...m, familyId: familyId ?? null } : m
      )
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="families-page">

      {/* ── Page header ── */}
      <div className="families-page-header">
        <div className="families-page-header-text">
          <h1>Families &amp; Groups</h1>
          <p>
            Create and manage fellowship groups, assign leaders, and organise
            members into families.
          </p>
        </div>

        <button className="btn-accent" onClick={openCreate}>
          <Plus size={15} />
          New Group
        </button>
      </div>

      {/* ── Summary stat cards ── */}
      <div className="families-page-stats">
        <div className="families-stat-card">
          <div
            className="families-stat-icon"
            style={{ background: "#e8f0fe" }}
          >
            <UsersRound size={20} color="#1a56db" />
          </div>
          <div className="families-stat-info">
            <p>Total Groups</p>
            <h3>{totalGroups}</h3>
          </div>
        </div>

        <div className="families-stat-card">
          <div
            className="families-stat-icon"
            style={{ background: "#dcfce7" }}
          >
            <UserCheck size={20} color="#16a34a" />
          </div>
          <div className="families-stat-info">
            <p>Assigned Members</p>
            <h3>{assignedCount}</h3>
          </div>
        </div>

        <div className="families-stat-card">
          <div
            className="families-stat-icon"
            style={{ background: "#fef3e2" }}
          >
            <Users size={20} color="#d97706" />
          </div>
          <div className="families-stat-info">
            <p>Unassigned Members</p>
            <h3>{unassignedCount}</h3>
          </div>
        </div>
      </div>

      {/* ── Family cards grid ── */}
      {families.length === 0 ? (
        <div
          style={{
            background: "var(--white)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            padding: "3.5rem 2rem",
            textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#e8f0fe",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <UsersRound size={28} color="#1a56db" />
          </div>
          <h3
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "0.4rem",
            }}
          >
            No groups yet
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            Create your first fellowship group to start organising members.
          </p>
          <button className="btn-accent" onClick={openCreate}>
            <Plus size={14} />
            Create First Group
          </button>
        </div>
      ) : (
        <div className="families-grid">
          {families.map((family) => (
            <FamilyCard
              key={family.id}
              family={family}
              members={members}
              onEdit={openEdit}
              onDelete={(id) => setDeleteId(id)}
              onManageMembers={openFamilyManager}
            />
          ))}
        </div>
      )}

      {/* ── Create / Edit family modal ── */}
      {familyModalOpen && (
        <FamilyModal
          key={familyModalData ? `edit-${familyModalData.id}` : "create"}
          isOpen={familyModalOpen}
          onClose={() => setFamilyModalOpen(false)}
          onSubmit={handleFamilySubmit}
          initialData={familyModalData}
          members={members}
        />
      )}

      {/* ── Family Members Manager side panel ── */}
      {fmmOpen && syncedFmmFamily && (
        <FamilyMembersManager
          isOpen={fmmOpen}
          onClose={() => setFmmOpen(false)}
          family={syncedFmmFamily}
          members={members}
          families={families}
          onUpdateMemberFamily={handleUpdateMemberFamily}
        />
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteId !== null && (
        <div
          className="mem-modal-overlay"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="mem-modal"
            style={{ maxWidth: 420 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mem-modal-header">
              <div>
                <h3 className="mem-modal-title">Delete Group</h3>
                <p className="mem-modal-subtitle">
                  This action cannot be undone.
                </p>
              </div>
              <button
                className="mem-modal-close"
                onClick={() => setDeleteId(null)}
                title="Cancel"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="mem-modal-body">
              <p
                style={{
                  fontSize: "0.88rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                Are you sure you want to delete{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {families.find((f) => f.id === deleteId)?.name ?? "this group"}
                </strong>
                ? All members assigned to this group will become unassigned.
              </p>
            </div>

            {/* Footer */}
            <div className="mem-modal-footer">
              <button
                className="mem-modal-btn cancel"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                className="mem-modal-btn submit"
                style={{ background: "var(--red)" }}
                onClick={handleDeleteConfirm}
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamiliesPage;
