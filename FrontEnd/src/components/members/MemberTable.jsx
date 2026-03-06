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
} from "lucide-react";
import { getInitials, getAvatarStyle, roleColors } from "./mockData";

// ── Constants ────────────────────────────────────────────────────────────────
const ROWS_PER_PAGE = 8;

// ── Small helper: renders the coloured role pill ─────────────────────────────
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

// ── Avatar: shows profile image if available, otherwise coloured initials ────
const Avatar = ({ member }) => {
  const style = getAvatarStyle(member.id);
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
      style={{ background: style.bg, color: style.color }}
    >
      {getInitials(member.fullName)}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────────────────────
const MemberTable = ({ members, families, onView, onEdit, onDelete }) => {
  // ── Filter / search state ──────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [familyFilter, setFamilyFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Dropdown visibility
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [actionMenu, setActionMenu] = useState(null); // stores the member id whose menu is open

  // ── Close menus when clicking outside ────────────────────────────────────
  useEffect(() => {
    if (!filtersOpen && actionMenu === null) return;
    const close = () => {
      setFiltersOpen(false);
      setActionMenu(null);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [filtersOpen, actionMenu]);

  // ── Helpers: change a filter AND reset to page 1 ─────────────────────────
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleFamilyFilterChange = (value) => {
    setFamilyFilter(value);
    setCurrentPage(1);
  };

  // ── Derived: filtered + searched members ─────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return members.filter((m) => {
      // Text search across name, phone, email
      const matchesSearch =
        !q ||
        m.fullName.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);

      // Status filter
      const matchesStatus = statusFilter === "All" || m.status === statusFilter;

      // Family filter
      const matchesFamily =
        familyFilter === "All" ||
        (familyFilter === "Unassigned" && !m.familyId) ||
        String(m.familyId) === familyFilter;

      return matchesSearch && matchesStatus && matchesFamily;
    });
  }, [members, search, statusFilter, familyFilter]);

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );
  const startNum =
    filtered.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1;
  const endNum = Math.min(safePage * ROWS_PER_PAGE, filtered.length);

  // Show at most 5 page buttons around current page
  const pageNumbers = (() => {
    const pages = [];
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  })();

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getFamilyName = (familyId) => {
    if (!familyId) return null;
    const f = families.find((f) => f.id === familyId);
    return f ? f.name : null;
  };

  const hasActiveFilters = statusFilter !== "All" || familyFilter !== "All";

  const clearFilters = () => {
    setStatusFilter("All");
    setFamilyFilter("All");
    setCurrentPage(1);
    setFiltersOpen(false);
  };

  // ── CSV export (filtered data) ─────────────────────────────────────────────
  const handleExport = () => {
    const header =
      "Full Name,Gender,Phone,Email,Role,Family,Status,Join Date,Address";
    const rows = filtered.map((m) =>
      [
        m.fullName,
        m.gender,
        m.phone,
        m.email,
        m.role,
        getFamilyName(m.familyId) ?? "Unassigned",
        m.status,
        m.joinDate,
        m.address,
      ].join(","),
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Toolbar: search + filters + export ── */}
      <div className="mem-toolbar">
        {/* Search input */}
        <div className="mem-search-wrap">
          <Search size={15} className="mem-search-icon" />
          <input
            className="mem-search-field"
            type="text"
            placeholder="Search by name, phone or email…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          {/* Clear search button */}
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

        {/* Spacer pushes controls to the right */}
        <div style={{ flex: 1 }} />

        {/* Filters dropdown */}
        <div
          className="mem-more-filters-wrap"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className={`btn-icon-text ${hasActiveFilters ? "mem-filter-active" : ""}`}
            onClick={() => setFiltersOpen((v) => !v)}
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasActiveFilters && <span className="mem-filter-dot" />}
          </button>

          {filtersOpen && (
            <div className="mem-filters-dropdown" style={{ minWidth: "220px" }}>
              {/* Status section */}
              <div className="mem-filters-dropdown-title">Status</div>
              {["All", "Active", "Inactive"].map((s) => (
                <button
                  key={s}
                  className={`mem-filter-option ${statusFilter === s ? "selected" : ""}`}
                  onClick={() => {
                    handleStatusFilterChange(s);
                  }}
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

              {/* Divider */}
              <div className="mem-filters-divider" />

              {/* Family section */}
              <div className="mem-filters-dropdown-title">Family / Group</div>
              <button
                className={`mem-filter-option ${familyFilter === "All" ? "selected" : ""}`}
                onClick={() => handleFamilyFilterChange("All")}
              >
                <span className="mem-filter-option-dot all" />
                All Groups
                {familyFilter === "All" && (
                  <span className="mem-filter-check">✓</span>
                )}
              </button>
              <button
                className={`mem-filter-option ${familyFilter === "Unassigned" ? "selected" : ""}`}
                onClick={() => handleFamilyFilterChange("Unassigned")}
              >
                <span className="mem-filter-option-dot inactive" />
                Unassigned
                {familyFilter === "Unassigned" && (
                  <span className="mem-filter-check">✓</span>
                )}
              </button>
              {families.map((f) => (
                <button
                  key={f.id}
                  className={`mem-filter-option ${familyFilter === String(f.id) ? "selected" : ""}`}
                  onClick={() => handleFamilyFilterChange(String(f.id))}
                >
                  <span className="mem-filter-option-dot active" />
                  {f.name}
                  {familyFilter === String(f.id) && (
                    <span className="mem-filter-check">✓</span>
                  )}
                </button>
              ))}

              {/* Clear filters */}
              {hasActiveFilters && (
                <>
                  <div className="mem-filters-divider" />
                  <button className="mem-filter-clear" onClick={clearFilters}>
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Export */}
        <button
          className="btn-icon-text"
          onClick={handleExport}
          title="Export filtered list as CSV"
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* ── Table card ── */}
      <div className="page-v2-card" style={{ padding: 0, overflow: "hidden" }}>
        <div className="members-table-scroll">
          <table className="v2-table members-table">
            <thead>
              <tr>
                <th>MEMBER</th>
                <th>PHONE</th>
                <th>FAMILY / GROUP</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th style={{ textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                /* Empty state */
                <tr>
                  <td colSpan={6} className="mem-empty-row">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "2rem 0",
                      }}
                    >
                      <Users size={32} color="var(--gray-300)" />
                      <span>No members match the current filters.</span>
                      {hasActiveFilters && (
                        <button
                          className="mem-filter-clear"
                          onClick={clearFilters}
                          style={{ marginTop: "0.25rem" }}
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((m) => {
                  const familyName = getFamilyName(m.familyId);
                  return (
                    <tr key={m.id}>
                      {/* Member (avatar + name + email) */}
                      <td>
                        <div className="name-with-icon">
                          <Avatar member={m} />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                color: "var(--text-primary)",
                                fontSize: "0.88rem",
                              }}
                            >
                              {m.fullName}
                            </div>
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--text-light)",
                              }}
                            >
                              {m.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td style={{ whiteSpace: "nowrap" }}>{m.phone}</td>

                      {/* Family / Group */}
                      <td>
                        {familyName ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3rem",
                              fontSize: "0.82rem",
                              fontWeight: 500,
                              color: "var(--blue)",
                              background: "var(--blue-light)",
                              padding: "0.2rem 0.6rem",
                              borderRadius: "4px",
                            }}
                          >
                            {familyName}
                          </span>
                        ) : (
                          <span className="mem-unassigned-tag">Unassigned</span>
                        )}
                      </td>

                      {/* Role */}
                      <td>
                        <RoleTag role={m.role} />
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

                      {/* Actions — three-dot dropdown menu */}
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
                                onClick={() => {
                                  setActionMenu(null);
                                  onView(m);
                                }}
                              >
                                <Eye size={14} /> View Profile
                              </button>
                              <button
                                className="mem-action-item"
                                onClick={() => {
                                  setActionMenu(null);
                                  onEdit(m);
                                }}
                              >
                                <Pencil size={14} /> Edit
                              </button>
                              <div className="mem-action-divider" />
                              <button
                                className="mem-action-item danger"
                                onClick={() => {
                                  setActionMenu(null);
                                  onDelete(m.id);
                                }}
                              >
                                <Trash2 size={14} /> Delete
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
        <div className="table-footer" style={{ padding: "0.85rem 1.5rem" }}>
          <span className="table-info">
            {filtered.length === 0 ? (
              "No results"
            ) : (
              <>
                Showing <strong>{startNum}</strong>–<strong>{endNum}</strong> of{" "}
                <strong>{filtered.length}</strong> member
                {filtered.length !== 1 ? "s" : ""}
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
    </>
  );
};

export default MemberTable;
