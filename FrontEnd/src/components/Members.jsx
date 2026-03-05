import React, { useState, useEffect } from "react";
import {
  UserPlus,
  SlidersHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

// ── Division colour map ──────────────────────────────────────────────────────
const divisionColors = {
  Media: { color: "#1a56db", bg: "#e8f0fe" },
  Education: { color: "#16a34a", bg: "#dcfce7" },
  Charity: { color: "#d97706", bg: "#fff3cd" },
  Arts: { color: "#7c3aed", bg: "#f3e8ff" },
};

// ── Seed data (15 members so pagination is visible) ─────────────────────────
const seedMembers = [
  {
    id: 1,
    initials: "AK",
    name: "Abebe Kebede",
    dept: "Software Engineering",
    phone: "+251 911 223344",
    division: "Media",
    status: "Active",
  },
  {
    id: 2,
    initials: "ST",
    name: "Sara Tesfaye",
    dept: "Mechanical Engineering",
    phone: "+251 922 334455",
    division: "Education",
    status: "Active",
  },
  {
    id: 3,
    initials: "SY",
    name: "Samuel Yohannes",
    dept: "Civil Engineering",
    phone: "+251 933 445566",
    division: "Charity",
    status: "Inactive",
  },
  {
    id: 4,
    initials: "MB",
    name: "Martha Belay",
    dept: "Electrical Engineering",
    phone: "+251 944 556677",
    division: "Arts",
    status: "Active",
  },
  {
    id: 5,
    initials: "DT",
    name: "Daniel Tekle",
    dept: "Architecture",
    phone: "+251 955 667788",
    division: "Media",
    status: "Active",
  },
  {
    id: 6,
    initials: "FH",
    name: "Feven Hailu",
    dept: "Chemical Engineering",
    phone: "+251 966 778899",
    division: "Education",
    status: "Active",
  },
  {
    id: 7,
    initials: "BM",
    name: "Biruk Mekonnen",
    dept: "Computer Science",
    phone: "+251 977 889900",
    division: "Charity",
    status: "Active",
  },
  {
    id: 8,
    initials: "HT",
    name: "Helen Tadesse",
    dept: "Biomedical Engineering",
    phone: "+251 988 990011",
    division: "Arts",
    status: "Inactive",
  },
  {
    id: 9,
    initials: "YA",
    name: "Yonas Alemu",
    dept: "Industrial Engineering",
    phone: "+251 999 001122",
    division: "Media",
    status: "Active",
  },
  {
    id: 10,
    initials: "EM",
    name: "Eden Mulugeta",
    dept: "Environmental Engineering",
    phone: "+251 900 112233",
    division: "Education",
    status: "Active",
  },
  {
    id: 11,
    initials: "KG",
    name: "Kaleb Girma",
    dept: "Materials Engineering",
    phone: "+251 911 334400",
    division: "Charity",
    status: "Active",
  },
  {
    id: 12,
    initials: "NA",
    name: "Naomi Assefa",
    dept: "Textile Engineering",
    phone: "+251 922 445500",
    division: "Arts",
    status: "Active",
  },
  {
    id: 13,
    initials: "LB",
    name: "Liya Bekele",
    dept: "Mining Engineering",
    phone: "+251 933 556600",
    division: "Media",
    status: "Inactive",
  },
  {
    id: 14,
    initials: "TW",
    name: "Tsion Worku",
    dept: "Food Engineering",
    phone: "+251 944 667700",
    division: "Education",
    status: "Active",
  },
  {
    id: 15,
    initials: "MG",
    name: "Mikael Gebre",
    dept: "Water Resource Eng.",
    phone: "+251 955 778800",
    division: "Charity",
    status: "Active",
  },
];

const DIVISION_FILTERS = [
  "All Divisions",
  "Media",
  "Education",
  "Charity",
  "Arts",
];
const ROWS_PER_PAGE = 5;
const EMPTY_FORM = {
  name: "",
  dept: "",
  phone: "",
  division: "Media",
  status: "Active",
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const getInitials = (name) =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const avatarStyle = (division) => ({
  background: divisionColors[division]?.bg ?? "#f3f4f6",
  color: divisionColors[division]?.color ?? "#374151",
});

// ── Component ────────────────────────────────────────────────────────────────
const Members = () => {
  // core state
  const [members, setMembers] = useState(seedMembers);
  const [activeDivision, setActiveDivision] = useState("All Divisions");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // add / edit modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null); // null = add, id = edit
  const [formError, setFormError] = useState("");

  // view modal
  const [viewMember, setViewMember] = useState(null);

  // action menu — stores the id of the row whose menu is open
  const [actionMenu, setActionMenu] = useState(null);

  // more-filters dropdown
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  // ── Close action menu when clicking anywhere else ──
  useEffect(() => {
    if (actionMenu === null) return;
    const close = () => setActionMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [actionMenu]);

  // ── Close more-filters when clicking anywhere else ──
  useEffect(() => {
    if (!moreFiltersOpen) return;
    const close = () => setMoreFiltersOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [moreFiltersOpen]);

  // ── Derived / filtered data ──
  const filtered = members
    .filter(
      (m) =>
        activeDivision === "All Divisions" || m.division === activeDivision,
    )
    .filter((m) => statusFilter === "All" || m.status === statusFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );
  const startNum =
    filtered.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1;
  const endNum = Math.min(safePage * ROWS_PER_PAGE, filtered.length);

  // page numbers to show (always show max 5 around current)
  const pageNumbers = (() => {
    const pages = [];
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  })();

  // ── Filter handlers (reset page) ──
  const handleDivisionFilter = (div) => {
    setActiveDivision(div);
    setCurrentPage(1);
  };

  const handleStatusFilter = (s) => {
    setStatusFilter(s);
    setCurrentPage(1);
    setMoreFiltersOpen(false);
  };

  const clearAllFilters = () => {
    setActiveDivision("All Divisions");
    setStatusFilter("All");
    setCurrentPage(1);
    setMoreFiltersOpen(false);
  };

  // ── Add / Edit modal ──
  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormError("");
    setShowAddModal(true);
  };

  const openEditModal = (m) => {
    setForm({
      name: m.name,
      dept: m.dept,
      phone: m.phone,
      division: m.division,
      status: m.status,
    });
    setEditId(m.id);
    setFormError("");
    setActionMenu(null);
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormError("");
  };

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formError) setFormError("");
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setFormError("Full name is required.");
      return;
    }
    const entry = {
      id: editId ?? Date.now(),
      initials: getInitials(form.name),
      name: form.name.trim(),
      dept: form.dept.trim(),
      phone: form.phone.trim(),
      division: form.division,
      status: form.status,
    };
    if (editId !== null) {
      setMembers((prev) => prev.map((m) => (m.id === editId ? entry : m)));
    } else {
      setMembers((prev) => [...prev, entry]);
      setCurrentPage(1);
    }
    closeAddModal();
  };

  // ── View modal ──
  const openViewModal = (m) => {
    setViewMember(m);
    setActionMenu(null);
  };

  // ── Remove ──
  const handleRemove = (id) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setActionMenu(null);
    setCurrentPage(1);
  };

  // ── Export CSV ──
  const handleExport = () => {
    const header = "Name,Department,Phone,Division,Status";
    const rows = filtered.map((m) =>
      [m.name, m.dept, m.phone, m.division, m.status].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = statusFilter !== "All";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="page-v2">
      {/* ── Page header ── */}
      <div className="page-v2-header">
        <div>
          <h1>Member Directory</h1>
          <p>Manage and view all registered members of ASTU Gibi Gubae.</p>
        </div>
        <button className="btn-accent" onClick={openAddModal}>
          <UserPlus size={14} /> Add Member
        </button>
      </div>

      {/* ── Filters row ── */}
      <div className="members-filter-row">
        {/* Division pills */}
        <div className="division-pills">
          {DIVISION_FILTERS.map((div) => (
            <button
              key={div}
              className={`division-pill ${activeDivision === div ? "active" : ""}`}
              onClick={() => handleDivisionFilter(div)}
            >
              {div}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="card-header-actions">
          {/* More Filters */}
          <div
            className="mem-more-filters-wrap"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={`btn-icon-text ${hasActiveFilters ? "mem-filter-active" : ""}`}
              onClick={() => setMoreFiltersOpen((prev) => !prev)}
            >
              <SlidersHorizontal size={14} />
              More Filters
              {hasActiveFilters && <span className="mem-filter-dot" />}
            </button>

            {moreFiltersOpen && (
              <div className="mem-filters-dropdown">
                <div className="mem-filters-dropdown-title">
                  Filter by Status
                </div>
                {["All", "Active", "Inactive"].map((s) => (
                  <button
                    key={s}
                    className={`mem-filter-option ${statusFilter === s ? "selected" : ""}`}
                    onClick={() => handleStatusFilter(s)}
                  >
                    <span
                      className={`mem-filter-option-dot ${s.toLowerCase()}`}
                    />
                    {s === "All" ? "All Statuses" : s}
                    {statusFilter === s && (
                      <span className="mem-filter-check">✓</span>
                    )}
                  </button>
                ))}
                {hasActiveFilters && (
                  <>
                    <div className="mem-filters-divider" />
                    <button
                      className="mem-filter-clear"
                      onClick={clearAllFilters}
                    >
                      Clear all filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Export */}
          <button className="btn-icon-text" onClick={handleExport}>
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* ── Table card ── */}
      <div className="page-v2-card">
        {/* Horizontal-scroll wrapper */}
        <div className="members-table-scroll">
          <table className="v2-table members-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>DEPARTMENT</th>
                <th>PHONE</th>
                <th>DIVISION</th>
                <th>STATUS</th>
                <th style={{ textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="mem-empty-row">
                    No members match the current filters.
                  </td>
                </tr>
              ) : (
                paginated.map((m) => {
                  const dc = divisionColors[m.division] ?? {
                    color: "#374151",
                    bg: "#f3f4f6",
                  };
                  return (
                    <tr key={m.id}>
                      {/* Name */}
                      <td>
                        <div className="name-with-icon">
                          <div
                            className="member-avatar"
                            style={avatarStyle(m.division)}
                          >
                            {m.initials}
                          </div>
                          <strong
                            style={{
                              color: "var(--text-primary)",
                              fontSize: "0.88rem",
                            }}
                          >
                            {m.name}
                          </strong>
                        </div>
                      </td>

                      {/* Department */}
                      <td>{m.dept}</td>

                      {/* Phone */}
                      <td style={{ whiteSpace: "nowrap" }}>{m.phone}</td>

                      {/* Division */}
                      <td>
                        <span
                          className="division-tag"
                          style={{
                            color: dc.color,
                            background: dc.bg,
                            border: `1px solid ${dc.color}30`,
                          }}
                        >
                          {m.division}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`member-status ${m.status.toLowerCase()}`}
                        >
                          <span className="status-dot-sm" />
                          {m.status}
                        </span>
                      </td>

                      {/* Actions — three-dot menu */}
                      <td style={{ textAlign: "center" }}>
                        <div
                          className="mem-action-wrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            className="icon-btn"
                            title="Actions"
                            onClick={() =>
                              setActionMenu((prev) =>
                                prev === m.id ? null : m.id,
                              )
                            }
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {actionMenu === m.id && (
                            <div className="mem-action-menu">
                              <button
                                className="mem-action-item"
                                onClick={() => openViewModal(m)}
                              >
                                <Eye size={14} /> View
                              </button>
                              <button
                                className="mem-action-item"
                                onClick={() => openEditModal(m)}
                              >
                                <Pencil size={14} /> Edit
                              </button>
                              <div className="mem-action-divider" />
                              <button
                                className="mem-action-item danger"
                                onClick={() => handleRemove(m.id)}
                              >
                                <Trash2 size={14} /> Remove
                              </button>
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

        {/* ── Pagination footer ── */}
        <div className="table-footer">
          <span className="table-info">
            {filtered.length === 0 ? (
              "No results"
            ) : (
              <>
                Showing <strong>{startNum}</strong>–<strong>{endNum}</strong> of{" "}
                <strong>{filtered.length}</strong> members
              </>
            )}
          </span>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={14} />
            </button>
            {pageNumbers.map((n) => (
              <button
                key={n}
                className={`page-btn ${n === safePage ? "active" : ""}`}
                onClick={() => setCurrentPage(n)}
              >
                {n}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ADD / EDIT MEMBER MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {showAddModal && (
        <div className="mem-modal-overlay" onClick={closeAddModal}>
          <div className="mem-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="mem-modal-header">
              <div>
                <h3 className="mem-modal-title">
                  {editId !== null ? "Edit Member" : "Add New Member"}
                </h3>
                <p className="mem-modal-subtitle">
                  {editId !== null
                    ? "Update the member's information below."
                    : "Fill in the details to register a new member."}
                </p>
              </div>
              <button
                className="mem-modal-close"
                onClick={closeAddModal}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body — form */}
            <div className="mem-modal-body">
              {/* Full Name */}
              <div className="mem-form-group">
                <label className="mem-form-label">
                  Full Name <span className="mem-required">*</span>
                </label>
                <input
                  className={`mem-form-input ${formError ? "error" : ""}`}
                  type="text"
                  placeholder="e.g. Abebe Kebede"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  autoFocus
                />
                {formError && (
                  <span className="mem-form-error">{formError}</span>
                )}
              </div>

              {/* Department */}
              <div className="mem-form-group">
                <label className="mem-form-label">Department</label>
                <input
                  className="mem-form-input"
                  type="text"
                  placeholder="e.g. Software Engineering"
                  value={form.dept}
                  onChange={(e) => handleFormChange("dept", e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="mem-form-group">
                <label className="mem-form-label">Phone Number</label>
                <input
                  className="mem-form-input"
                  type="tel"
                  placeholder="+251 9__ ______"
                  value={form.phone}
                  onChange={(e) => handleFormChange("phone", e.target.value)}
                />
              </div>

              {/* Division + Status side by side */}
              <div className="mem-form-row">
                <div className="mem-form-group">
                  <label className="mem-form-label">Division</label>
                  <select
                    className="mem-form-select"
                    value={form.division}
                    onChange={(e) =>
                      handleFormChange("division", e.target.value)
                    }
                  >
                    {Object.keys(divisionColors).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mem-form-group">
                  <label className="mem-form-label">Status</label>
                  <select
                    className="mem-form-select"
                    value={form.status}
                    onChange={(e) => handleFormChange("status", e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mem-modal-footer">
              <button className="mem-modal-btn cancel" onClick={closeAddModal}>
                Cancel
              </button>
              <button className="mem-modal-btn submit" onClick={handleSubmit}>
                {editId !== null ? "Save Changes" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW MEMBER MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {viewMember && (
        <div className="mem-modal-overlay" onClick={() => setViewMember(null)}>
          <div
            className="mem-modal mem-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mem-modal-header">
              <h3 className="mem-modal-title">Member Details</h3>
              <button
                className="mem-modal-close"
                onClick={() => setViewMember(null)}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* Profile block */}
            <div className="mem-view-body">
              <div className="mem-view-top">
                <div
                  className="mem-view-avatar"
                  style={avatarStyle(viewMember.division)}
                >
                  {viewMember.initials}
                </div>
                <div className="mem-view-identity">
                  <h4 className="mem-view-name">{viewMember.name}</h4>
                  <div className="mem-view-tags">
                    {(() => {
                      const dc = divisionColors[viewMember.division] ?? {
                        color: "#374151",
                        bg: "#f3f4f6",
                      };
                      return (
                        <span
                          className="division-tag"
                          style={{
                            color: dc.color,
                            background: dc.bg,
                            border: `1px solid ${dc.color}30`,
                          }}
                        >
                          {viewMember.division}
                        </span>
                      );
                    })()}
                    <span
                      className={`member-status ${viewMember.status.toLowerCase()}`}
                    >
                      <span className="status-dot-sm" />
                      {viewMember.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail rows */}
              <div className="mem-view-details">
                <div className="mem-view-row">
                  <span className="mem-view-label">Department</span>
                  <span className="mem-view-value">
                    {viewMember.dept || "—"}
                  </span>
                </div>
                <div className="mem-view-row">
                  <span className="mem-view-label">Phone</span>
                  <span className="mem-view-value">
                    {viewMember.phone || "—"}
                  </span>
                </div>
                <div className="mem-view-row">
                  <span className="mem-view-label">Division</span>
                  <span className="mem-view-value">{viewMember.division}</span>
                </div>
                <div className="mem-view-row">
                  <span className="mem-view-label">Status</span>
                  <span className="mem-view-value">{viewMember.status}</span>
                </div>
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
                  openEditModal(viewMember);
                }}
              >
                Edit Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
