import React, { useState, useEffect } from "react";
import { UsersRound, Users, UserCheck, Plus, X, Loader2 } from "lucide-react";
import FamilyCard from "../../components/members/FamilyCard";
import FamilyModal from "../../components/members/FamilyModal";
import FamilyMembersManager from "../../components/members/FamilyMembersManager";
import { apiFetch } from "../../services/apiFetch";

/**
 * FamiliesPage — Families & Groups management. Data from API: families and members.
 */
const FamiliesPage = () => {
  const [members, setMembers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [familyModalOpen, setFamilyModalOpen] = useState(false);
  const [familyModalData, setFamilyModalData] = useState(null);

  const [fmmOpen, setFmmOpen] = useState(false);
  const [fmmFamily, setFmmFamily] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [membersRes, familiesRes] = await Promise.all([
        apiFetch("/members"),
        apiFetch("/families").catch(() => []),
      ]);
      setMembers(membersRes || []);
      setFamilies(familiesRes || []);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalGroups = families.length;
  const assignedCount = members.filter((m) => m.familyId != null).length;
  const unassignedCount = members.length - assignedCount;

  const openCreate = () => {
    setFamilyModalData(null);
    setFamilyModalOpen(true);
  };

  const openEdit = (family) => {
    setFamilyModalData(family);
    setFamilyModalOpen(true);
  };

  const handleFamilySubmit = async (data) => {
    try {
      const isEdit = data.id && typeof data.id === "string";
      if (isEdit) {
        await apiFetch(`/families/${data.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: data.name, description: data.description || "" }),
        });
      } else {
        await apiFetch("/families", {
          method: "POST",
          body: JSON.stringify({ name: data.name, description: data.description || "" }),
        });
      }
      setFamilyModalOpen(false);
      await fetchData();
    } catch (err) {
      alert(err.message || "Failed to save family");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId == null) return;
    try {
      await apiFetch(`/families/${deleteId}`, { method: "DELETE" });
      setDeleteId(null);
      await fetchData();
    } catch (err) {
      alert(err.message || "Failed to delete family");
    }
  };

  const openFamilyManager = (family) => {
    setFmmFamily(family);
    setFmmOpen(true);
  };

  const syncedFmmFamily =
    fmmOpen && fmmFamily
      ? families.find((f) => f.id === fmmFamily.id) ?? fmmFamily
      : fmmFamily;

  const handleUpdateMemberFamily = async (memberId, familyId) => {
    try {
      await apiFetch(`/members/${memberId}`, {
        method: "PUT",
        body: JSON.stringify({ familyId: familyId || null }),
      });
      await fetchData();
    } catch (err) {
      alert(err.message || "Failed to update member");
    }
  };

  if (loading) {
    return (
      <div className="families-page" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <Loader2 size={32} className="spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="families-page" style={{ padding: "2rem", textAlign: "center", color: "var(--red)" }}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="families-page">
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

      <div className="families-page-stats">
        <div className="families-stat-card">
          <div className="families-stat-icon" style={{ background: "#e8f0fe" }}>
            <UsersRound size={20} color="#1a56db" />
          </div>
          <div className="families-stat-info">
            <p>Total Groups</p>
            <h3>{totalGroups}</h3>
          </div>
        </div>
        <div className="families-stat-card">
          <div className="families-stat-icon" style={{ background: "#dcfce7" }}>
            <UserCheck size={20} color="#16a34a" />
          </div>
          <div className="families-stat-info">
            <p>Assigned Members</p>
            <h3>{assignedCount}</h3>
          </div>
        </div>
        <div className="families-stat-card">
          <div className="families-stat-icon" style={{ background: "#fef3e2" }}>
            <Users size={20} color="#d97706" />
          </div>
          <div className="families-stat-info">
            <p>Unassigned Members</p>
            <h3>{unassignedCount}</h3>
          </div>
        </div>
      </div>

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
          <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.4rem" }}>
            No groups yet
          </h3>
          <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>
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

      {deleteId != null && (
        <div className="mem-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="mem-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div>
                <h3 className="mem-modal-title">Delete Group</h3>
                <p className="mem-modal-subtitle">This action cannot be undone.</p>
              </div>
              <button className="mem-modal-close" onClick={() => setDeleteId(null)} title="Cancel">
                <X size={17} />
              </button>
            </div>
            <div className="mem-modal-body">
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                Are you sure you want to delete{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {families.find((f) => f.id === deleteId)?.name ?? "this group"}
                </strong>
                ? All members assigned to this group will become unassigned.
              </p>
            </div>
            <div className="mem-modal-footer">
              <button className="mem-modal-btn cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="mem-modal-btn submit" style={{ background: "var(--red)" }} onClick={handleDeleteConfirm}>
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
