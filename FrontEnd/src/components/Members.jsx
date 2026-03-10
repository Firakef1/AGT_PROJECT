import React, { useState, useEffect, useMemo } from "react";
import {
  UsersRound,
  Users,
  UserCheck,
  UserX,
  X,
  CheckCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";

// ── Sub-components ────────────────────────────────────────────────────────────
import MemberTable from "./members/MemberTable";
import MemberFormModal from "./members/MemberFormModal";
import { apiFetch } from "../services/apiFetch.js";

const Members = ({ user }) => {
  const [members, setMembers] = useState([]);
  const [families, setFamilies] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  const [yearFilter, setYearFilter] = useState("All");
  
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberModalData, setMemberModalData] = useState(null);
  const [viewMember, setViewMember] = useState(null);
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [membersData, divisionsData, familiesData] = await Promise.all([
        apiFetch("/members"),
        apiFetch("/divisions"),
        apiFetch("/families").catch(() => []), 
      ]);
      setMembers(membersData);
      setDivisions(divisionsData);
      setFamilies(familiesData || []);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  const handleApprove = async (m) => {
    try {
      await apiFetch(`/members/${m.id}/approve`, { method: "POST" });
      showToast("Approved!", `${m.fullName} is now an approved member.`, "success");
      fetchData();
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const handleReject = async (m) => {
    try {
      await apiFetch(`/members/${m.id}/reject`, { method: "POST" });
      showToast("Rejected", `${m.fullName}'s request has been rejected.`, "warning");
      fetchData();
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const handleAssignLeader = async (m) => {
    if (!m.divisionId) {
      showToast("Error", "Member must belong to a division to be a leader.", "error");
      return;
    }
    try {
      await apiFetch(`/members/${m.id}/assign-leader`, { 
        method: "POST",
        body: JSON.stringify({ divisionId: m.divisionId })
      });
      showToast("Success", `${m.fullName} is now the leader of their division.`, "success");
      fetchData();
    } catch (err) {
      showToast("Error", err.message, "error");
    }
  };

  const handleAutoDistribute = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/families/auto-distribute", { method: "POST" });
      showToast("Success", res.message || "Members distributed evenly.", "success");
      fetchData();
    } catch (err) {
      showToast("Error", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const activeCount = members.filter(m => m.status === 'APPROVED').length;
  const pendingCount = members.filter(m => m.status === 'PENDING').length;
  const rejectedCount = members.filter(m => m.status === 'REJECTED').length;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader2 className="spin" size={48} />
    </div>
  );

  return (
    <div className="page-v2">
      <div className="page-v2-header">
        <div>
          <h1>Member Management</h1>
          <p>Review registration requests and manage internal directory.</p>
        </div>
      </div>

      <div className="page-v2-stats four-col">
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#e8f0fe" }}>
            <Users size={20} color="#1a56db" />
          </div>
          <div>
            <p className="page-stat-label">Total Registered</p>
            <h2 className="page-stat-value">{members.length}</h2>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#fff3cd" }}>
            <AlertTriangle size={20} color="#d97706" />
          </div>
          <div>
            <p className="page-stat-label">Pending Approval</p>
            <h2 className="page-stat-value" style={{ color: "#d97706" }}>{pendingCount}</h2>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#dcfce7" }}>
            <UserCheck size={20} color="#16a34a" />
          </div>
          <div>
            <p className="page-stat-label">Approved Members</p>
            <h2 className="page-stat-value" style={{ color: "#16a34a" }}>{activeCount}</h2>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: "#fef2f2" }}>
            <UserX size={20} color="#dc2626" />
          </div>
          <div>
            <p className="page-stat-label">Rejected</p>
            <h2 className="page-stat-value" style={{ color: "#dc2626" }}>{rejectedCount}</h2>
          </div>
        </div>
      </div>

      <div className="members-hub-tabs" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
            className={`members-hub-tab ${activeTab === "members" ? "active" : ""}`}
            onClick={() => setActiveTab("members")}
            >
            <Users size={15} />
            Directory
            <span className="count-pill">{members.length}</span>
            </button>
            <button
            className={`members-hub-tab ${activeTab === "families" ? "active" : ""}`}
            onClick={() => setActiveTab("families")}
            >
            <UsersRound size={15} />
            Families
            <span className="count-pill">{families.length}</span>
            </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {activeTab === "families" && (
                <button className="btn btn-primary" onClick={handleAutoDistribute} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   Auto-Distribute Unassigned
                </button>
            )}
            <select 
                className="form-input" 
                value={yearFilter} 
                onChange={(e) => setYearFilter(e.target.value)}
                style={{ width: '150px' }}
            >
                <option value="All">All Years</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
            </select>
        </div>
      </div>

      {activeTab === "members" && (
        <MemberTable
          user={user}
          members={members.filter(m => yearFilter === "All" ? true : new Date(m.createdAt).getFullYear().toString() === yearFilter)}
          families={families}
          onView={setViewMember}
          onEdit={(m) => { setMemberModalData(m); setMemberModalOpen(true); }}
          onDelete={() => {}} 
          onApprove={handleApprove}
          onReject={handleReject}
          onAssignLeader={handleAssignLeader}
        />
      )}

      {activeTab === "families" && (
          <div className="families-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
              {families.filter(f => yearFilter === "All" ? true : new Date(f.createdAt).getFullYear().toString() === yearFilter).map(family => (
                  <div key={family.id} className="card" style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h3 style={{ margin: '0 0 1rem 0' }}>{family.name}</h3>
                      <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                          Established: {new Date(family.createdAt).getFullYear()}
                      </p>
                      <div className="family-roles">
                          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-light)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Parents</h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0' }}>
                              {family.members?.filter(m => m.familyRole === 'MOTHER' || m.familyRole === 'FATHER').map(m => (
                                  <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                                      <span>{m.fullName}</span> 
                                      <span style={{ fontSize: '0.8rem', background: 'var(--bg-light)', padding: '2px 6px', borderRadius: '4px' }}>{m.familyRole}</span>
                                  </li>
                              )) || <li style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>None assigned</li>}
                          </ul>
                          
                          <h4 style={{ fontSize: '0.95rem', color: 'var(--text-light)', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Children</h4>
                          <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '150px', overflowY: 'auto' }}>
                              {family.members?.filter(m => m.familyRole === 'CHILD').map(m => (
                                  <li key={m.id} style={{ padding: '0.25rem 0', display: 'flex', justifyContent: 'space-between' }}>
                                      <span>{m.fullName}</span>
                                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{m.gender || 'Unknown'}</span>
                                  </li>
                              )) || <li style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>No children</li>}
                          </ul>
                      </div>
                  </div>
              ))}
              {families.length === 0 && (
                  <div style={{ padding: '3rem', textAlign: 'center', background: 'white', border: '1px dashed var(--border)', borderRadius: '12px', gridColumn: '1 / -1' }}>
                      <UsersRound size={48} color="var(--text-light)" style={{ marginBottom: '1rem' }} />
                      <h3>No Families Found</h3>
                      <p style={{ color: 'var(--text-light)' }}>Create families in the backend to start distributing members.</p>
                  </div>
              )}
          </div>
      )}

      {memberModalOpen && (
        <MemberFormModal
          isOpen={memberModalOpen}
          onClose={() => setMemberModalOpen(false)}
          onSubmit={async (data) => {
             setMemberModalOpen(false);
             fetchData();
          }}
          initialData={memberModalData}
          families={divisions}
        />
      )}

      {viewMember && (
        <div className="mem-modal-overlay" onClick={() => setViewMember(null)}>
          <div className="mem-modal mem-view-modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <h3 className="mem-modal-title">Member Profile</h3>
              <button className="mem-modal-close" onClick={() => setViewMember(null)}><X size={17} /></button>
            </div>
            <div className="mem-view-body" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, color: '#4338ca' }}>
                  {viewMember.fullName.charAt(0)}
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{viewMember.fullName}</h4>
                  <p style={{ margin: 0, color: 'var(--text-light)', fontSize: '0.9rem' }}>{viewMember.email}</p>
                </div>
              </div>
              <div className="mem-view-details">
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Student ID</span>
                  <strong>{viewMember.studentId}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Phone</span>
                  <strong>{viewMember.phone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Gender</span>
                  <strong>{viewMember.gender || 'Not specified'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Family</span>
                  {viewMember.familyId ? (
                      <strong>{families.find(f => f.id === viewMember.familyId)?.name || 'Unknown Family'}</strong>
                  ) : (
                      <strong style={{ color: '#dc2626', background: '#fef2f2', padding: '2px 8px', borderRadius: '12px', fontSize: '0.85rem' }}>Unassigned</strong>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Role</span>
                  <strong>{viewMember.role}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-light)' }}>Status</span>
                  <strong style={{ color: viewMember.status === 'APPROVED' ? '#16a34a' : viewMember.status === 'PENDING' ? '#d97706' : '#dc2626' }}>{viewMember.status}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className="toast-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
          <div className={`custom-toast toast-${toast.type}`} style={{ background: toast.type === 'success' ? '#dcfce7' : toast.type === 'error' ? '#fef2f2' : '#fef3e2', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div className="toast-content">
              <div className="toast-title" style={{ fontWeight: 700 }}>{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
