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
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("members");
  
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
      const [membersData, divisionsData] = await Promise.all([
        apiFetch("/members"),
        apiFetch("/divisions")
      ]);
      setMembers(membersData);
      setDivisions(divisionsData);
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

      <div className="members-hub-tabs">
        <button
          className={`members-hub-tab ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          <Users size={15} />
          Directory
          <span className="count-pill">{members.length}</span>
        </button>
      </div>

      {activeTab === "members" && (
        <MemberTable
          user={user}
          members={members}
          families={divisions}
          onView={setViewMember}
          onEdit={(m) => { setMemberModalData(m); setMemberModalOpen(true); }}
          onDelete={() => {}} 
          onApprove={handleApprove}
          onReject={handleReject}
          onAssignLeader={handleAssignLeader}
        />
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
                  <span style={{ color: 'var(--text-light)' }}>Division</span>
                  <strong>{divisions.find(d => d.id === viewMember.divisionId)?.name || 'None'}</strong>
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
