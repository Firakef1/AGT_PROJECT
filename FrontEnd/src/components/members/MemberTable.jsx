import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  SlidersHorizontal,
  Download,
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Users,
  CheckCircle,
  XCircle,
  Crown
} from "lucide-react";

// ── Role colors ──
const roleColors = {
  ADMIN: { color: "#1e40af", bg: "#dbeafe" },
  MEMBERS_MANAGER: { color: "#7c3aed", bg: "#f5f3ff" },
  DIVISION_HEAD: { color: "#0891b2", bg: "#ecfeff" },
  MEMBER: { color: "#4b5563", bg: "#f3f4f6" },
};

// ── Status colors ──
const statusStyles = {
  PENDING: { color: "#d97706", bg: "#fef3e2", label: "Pending Approval" },
  APPROVED: { color: "#16a34a", bg: "#dcfce7", label: "Approved" },
  REJECTED: { color: "#dc2626", bg: "#fef2f2", label: "Rejected" },
  Active: { color: "#16a34a", bg: "#dcfce7", label: "Active" },
  Inactive: { color: "#4b5563", bg: "#f3f4f6", label: "Inactive" },
};

const ROWS_PER_PAGE = 8;

const RoleTag = ({ role }) => {
  const rc = roleColors[role] ?? { color: "#6b7280", bg: "#f3f4f6" };
  return (
    <span
      className="mem-role-tag"
      style={{
        color: rc.color,
        background: rc.bg,
        border: `1px solid ${rc.color}22`,
      }}
    >
      {role}
    </span>
  );
};

const Avatar = ({ member }) => {
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };
  
  if (member.profileImage) {
    return (
      <img
        src={member.profileImage}
        alt={member.fullName}
        className="member-avatar"
        style={{ objectFit: "cover" }}
      />
    );
  }
  return (
    <div
      className="member-avatar"
      style={{ background: "#e0e7ff", color: "#4338ca" }}
    >
      {getInitials(member.fullName)}
    </div>
  );
};

const MemberTable = ({ user, members, families, onView, onEdit, onDelete, onApprove, onReject, onAssignLeader }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [familyFilter, setFamilyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null);

  useEffect(() => {
    if (!filtersOpen && actionMenu === null) return;
    const close = () => {
      setFiltersOpen(false);
      setActionMenu(null);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [filtersOpen, actionMenu]);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      const matchesSearch =
        !q ||
        m.fullName.toLowerCase().includes(q) ||
        (m.phone && m.phone.toLowerCase().includes(q)) ||
        m.email.toLowerCase().includes(q) ||
        (m.studentId && m.studentId.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "All" || m.status === statusFilter;
      const matchesFamily =
        familyFilter === "All" ||
        (familyFilter === "Unassigned" && !m.divisionId) ||
        String(m.divisionId) === familyFilter;

      return matchesSearch && matchesStatus && matchesFamily;
    });
  }, [members, search, statusFilter, familyFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );
  const startNum = filtered.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1;
  const endNum = Math.min(safePage * ROWS_PER_PAGE, filtered.length);

  const getDivisionName = (divisionId) => {
    if (!divisionId) return null;
    const f = families.find((f) => f.id === divisionId);
    return f ? f.name : null;
  };

  const handleExport = () => {
    const header = "Student ID,Full Name,Phone,Email,Role,Division,Status";
    const rows = filtered.map((m) =>
      [
        m.studentId,
        m.fullName,
        m.phone,
        m.email,
        m.role,
        getDivisionName(m.divisionId) ?? "Unassigned",
        m.status
      ].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members_export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isAdminOrManager = user?.role === "ADMIN" || user?.role === "MEMBERS_MANAGER";

  return (
    <>
      <div className="mem-toolbar">
        <div className="mem-search-wrap">
          <Search size={15} className="mem-search-icon" />
          <input
            className="mem-search-field"
            type="text"
            placeholder="Search by name, ID, phone or email…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {search && (
            <button
              className="search-clear-btn"
              onClick={() => handleSearchChange("")}
              title="Clear search"
              style={{ right: "0.5rem" }}
            >
              ×
            </button>
          )}
        </div>

        <div style={{ flex: 1 }} />

        <div className="mem-more-filters-wrap" onClick={(e) => e.stopPropagation()}>
          <button
            className={`btn-icon-text ${statusFilter !== "All" || familyFilter !== "All" ? "mem-filter-active" : ""}`}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal size={14} />
            Filters
            {(statusFilter !== "All" || familyFilter !== "All") && <span className="mem-filter-dot" />}
          </button>

          {filtersOpen && (
            <div className="mem-filters-dropdown" style={{ minWidth: "220px" }}>
              <div className="mem-filters-dropdown-title">Status</div>
              {["All", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                <button
                  key={s}
                  className={`mem-filter-option ${statusFilter === s ? "selected" : ""}`}
                  onClick={() => setStatusFilter(s)}
                >
                  <span className={`mem-filter-option-dot ${s.toLowerCase()}`} />
                  {s === "All" ? "All Statuses" : statusStyles[s]?.label || s}
                </button>
              ))}

              <div className="mem-filters-divider" />
              <div className="mem-filters-dropdown-title">Division</div>
              <button
                className={`mem-filter-option ${familyFilter === "All" ? "selected" : ""}`}
                onClick={() => setFamilyFilter("All")}
              >
                All Divisions
              </button>
              {families.map((f) => (
                <button
                  key={f.id}
                  className={`mem-filter-option ${familyFilter === String(f.id) ? "selected" : ""}`}
                  onClick={() => setFamilyFilter(String(f.id))}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="btn-icon-text" onClick={handleExport}>
          <Download size={14} /> Export
        </button>
      </div>

      <div className="page-v2-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="members-table-scroll">
          <table className="v2-table members-table">
            <thead>
              <tr>
                <th>MEMBER</th>
                <th>STUDENT ID</th>
                <th>DIVISION</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th style={{ textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="mem-empty-row">
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "2rem 0" }}>
                      <Users size={32} color="var(--gray-300)" />
                      <span>No members found.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((m) => {
                  const divisionName = getDivisionName(m.divisionId);
                  const statusInfo = statusStyles[m.status] || { color: "#6b7280", label: m.status };
                  
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="name-with-icon">
                          <Avatar member={m} />
                          <div>
                            <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.88rem" }}>{m.fullName}</div>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{m.studentId}</td>
                      <td>
                        {divisionName ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.82rem", fontWeight: 500, color: "var(--blue)", background: "var(--blue-light)", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>
                            {divisionName}
                          </span>
                        ) : (
                          <span className="mem-unassigned-tag">Unassigned</span>
                        )}
                      </td>
                      <td><RoleTag role={m.role} /></td>
                      <td>
                        <span className={`member-status-pill`} style={{ 
                          background: statusInfo.bg, 
                          color: statusInfo.color,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusInfo.color }} />
                          {statusInfo.label}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div className="mem-action-wrap" onClick={(e) => e.stopPropagation()}>
                          <button className="icon-btn" onClick={() => setActionMenu(prev => prev === m.id ? null : m.id)}>
                            <MoreHorizontal size={16} />
                          </button>

                          {actionMenu === m.id && (
                            <div className="mem-action-menu">
                              <button className="mem-action-item" onClick={() => onView(m)}><Eye size={14} /> View Profile</button>
                              
                              {isAdminOrManager && m.status === 'PENDING' && (
                                <>
                                  <div className="mem-action-divider" />
                                  <button className="mem-action-item" style={{ color: '#16a34a' }} onClick={() => onApprove(m)}>
                                    <CheckCircle size={14} /> Approve
                                  </button>
                                  <button className="mem-action-item danger" onClick={() => onReject(m)}>
                                    <XCircle size={14} /> Reject
                                  </button>
                                </>
                              )}

                              {user?.role === "ADMIN" && m.status === 'APPROVED' && m.role !== 'ADMIN' && (
                                <>
                                  <div className="mem-action-divider" />
                                  <button className="mem-action-item" style={{ color: 'var(--gold)' }} onClick={() => onAssignLeader(m)}>
                                    <Crown size={14} /> Assign as Leader
                                  </button>
                                </>
                              )}

                              <div className="mem-action-divider" />
                              <button className="mem-action-item" onClick={() => onEdit(m)}><Pencil size={14} /> Edit</button>
                              <button className="mem-action-item danger" onClick={() => onDelete(m.id)}><Trash2 size={14} /> Delete</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer" style={{ padding: "0.85rem 1.5rem" }}>
          <span className="table-info">
            Showing <strong>{startNum}</strong>–<strong>{endNum}</strong> of <strong>{filtered.length}</strong> members
          </span>
          <div className="pagination">
            <button className="page-btn" disabled={safePage === 1} onClick={() => setCurrentPage(p => p - 1)}>
              <ChevronLeft size={14} />
            </button>
            {pageNumbers.map(n => (
              <button key={n} className={`page-btn ${n === safePage ? "active" : ""}`} onClick={() => setCurrentPage(n)}>{n}</button>
            ))}
            <button className="page-btn" disabled={safePage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberTable;
