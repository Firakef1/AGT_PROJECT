import React, { useState, useEffect } from "react";
import {
  Download,
  Plus,
  Mic,
  BookOpen,
  Camera,
  GlassWater,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Monitor,
  BookMarked,
  X,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

// ── Icon / style per division ─────────────────────────────────────────────────
const DIVISION_META = {
  "Audio/Visual": { icon: Mic, iconBg: "#f3e8ff", iconColor: "#7c3aed" },
  Literature: { icon: BookOpen, iconBg: "#fef2f2", iconColor: "#dc2626" },
  Kitchen: { icon: GlassWater, iconBg: "#e8f0fe", iconColor: "#1a56db" },
};

const TABS = ["All Items", "Audio/Visual", "Literature", "Kitchen"];
const ROWS_PER_PAGE = 5;
const EMPTY_FORM = {
  name: "",
  quantity: "",
  division: "Audio/Visual",
  status: "instock",
};

const todayStr = () =>
  new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

// ── Seed data (12 items so pagination is real) ────────────────────────────────
const seedItems = [
  {
    id: 1,
    name: "Wireless Microphone System",
    quantity: "4 units",
    division: "Audio/Visual",
    updated: "Oct 12, 2023",
    status: "instock",
    icon: Mic,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
  },
  {
    id: 2,
    name: "Amharic Hymnals",
    quantity: "12 copies",
    division: "Literature",
    updated: "Oct 24, 2023",
    status: "lowstock",
    icon: BookOpen,
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
  },
  {
    id: 3,
    name: "Live Stream Camera (Sony A7)",
    quantity: "2 units",
    division: "Audio/Visual",
    updated: "Sep 15, 2023",
    status: "instock",
    icon: Camera,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
  },
  {
    id: 4,
    name: "Disposable Communion Cups",
    quantity: "1,000+",
    division: "Kitchen",
    updated: "Oct 28, 2023",
    status: "instock",
    icon: GlassWater,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
  },
  {
    id: 5,
    name: "Stage Flood Light Bulbs",
    quantity: "3 units",
    division: "Audio/Visual",
    updated: "Oct 05, 2023",
    status: "lowstock",
    icon: Lightbulb,
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
  },
  {
    id: 6,
    name: "Portable PA System",
    quantity: "1 unit",
    division: "Audio/Visual",
    updated: "Nov 01, 2023",
    status: "instock",
    icon: Monitor,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
  },
  {
    id: 7,
    name: "Bible Study Guides",
    quantity: "45 copies",
    division: "Literature",
    updated: "Oct 20, 2023",
    status: "instock",
    icon: BookMarked,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
  },
  {
    id: 8,
    name: "Offering Plates",
    quantity: "8 units",
    division: "Kitchen",
    updated: "Sep 30, 2023",
    status: "instock",
    icon: GlassWater,
    iconBg: "#e8f5e9",
    iconColor: "#16a34a",
  },
  {
    id: 9,
    name: "Projector Screen",
    quantity: "2 units",
    division: "Audio/Visual",
    updated: "Nov 05, 2023",
    status: "instock",
    icon: Monitor,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
  },
  {
    id: 10,
    name: "English Bibles",
    quantity: "6 copies",
    division: "Literature",
    updated: "Oct 15, 2023",
    status: "lowstock",
    icon: BookOpen,
    iconBg: "#fff3cd",
    iconColor: "#d97706",
  },
  {
    id: 11,
    name: "Lapel Microphones",
    quantity: "2 units",
    division: "Audio/Visual",
    updated: "Oct 10, 2023",
    status: "lowstock",
    icon: Mic,
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
  },
  {
    id: 12,
    name: "Sound Mixer Board",
    quantity: "1 unit",
    division: "Audio/Visual",
    updated: "Nov 08, 2023",
    status: "instock",
    icon: Mic,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────
const Inventory = () => {
  const [items, setItems] = useState(seedItems);
  const [activeTab, setActiveTab] = useState("All Items");
  const [currentPage, setCurrentPage] = useState(1);

  // add / edit modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState("");

  // view modal
  const [viewItem, setViewItem] = useState(null);

  // three-dot action menu (stores open item id)
  const [actionMenu, setActionMenu] = useState(null);

  // ── Close action menu on outside click ──
  useEffect(() => {
    if (actionMenu === null) return;
    const close = () => setActionMenu(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [actionMenu]);

  // ── Derived / filtered ──
  const filtered = items.filter(
    (item) => activeTab === "All Items" || item.division === activeTab,
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );
  const startNum =
    filtered.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1;
  const endNum = Math.min(safePage * ROWS_PER_PAGE, filtered.length);

  const pageNumbers = (() => {
    const pages = [];
    const start = Math.max(1, safePage - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  })();

  // ── Dynamic stat values ──
  const totalCount = items.length;
  const lowStockCount = items.filter((i) => i.status === "lowstock").length;
  const avCount = items.filter((i) => i.division === "Audio/Visual").length;
  const litCount = items.filter((i) => i.division === "Literature").length;

  // ── Tab change ──
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // ── Add / Edit modal ──
  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setForm({
      name: item.name,
      quantity: item.quantity,
      division: item.division,
      status: item.status,
    });
    setEditId(item.id);
    setFormError("");
    setActionMenu(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
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
      setFormError("Item name is required.");
      return;
    }
    const meta = DIVISION_META[form.division] ?? DIVISION_META["Audio/Visual"];
    const updated = todayStr();
    const entry = {
      id: editId ?? Date.now(),
      name: form.name.trim(),
      quantity: form.quantity.trim() || "—",
      division: form.division,
      status: form.status,
      updated,
      icon: meta.icon,
      iconBg: meta.iconBg,
      iconColor: meta.iconColor,
    };
    if (editId !== null) {
      setItems((prev) => prev.map((i) => (i.id === editId ? entry : i)));
    } else {
      setItems((prev) => [...prev, entry]);
      setCurrentPage(1);
    }
    closeModal();
  };

  // ── View modal ──
  const openViewModal = (item) => {
    setViewItem(item);
    setActionMenu(null);
  };

  // ── Remove ──
  const handleRemove = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActionMenu(null);
    setCurrentPage(1);
  };

  // ── Export CSV ──
  const handleExport = () => {
    const header = "Item Name,Quantity,Division,Last Updated,Status";
    const rows = filtered.map((i) =>
      [
        i.name,
        i.quantity,
        i.division,
        i.updated,
        i.status === "instock" ? "In Stock" : "Low Stock",
      ].join(","),
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="page-v2">
      {/* ── Page header ── */}
      <div className="page-v2-header">
        <div>
          <h1>Inventory</h1>
          <p>
            Manage and track church assets and supplies across all divisions.
          </p>
        </div>
        <button className="btn-outline-dark" onClick={handleExport}>
          <Download size={14} /> Export Report
        </button>
      </div>

      {/* ── Dynamic stat cards ── */}
      <div className="page-v2-stats four-col">
        <div className="inv-stat-card" style={{ borderLeftColor: "#1a56db" }}>
          <p className="inv-stat-label">Total Items</p>
          <h2 className="inv-stat-value">{totalCount.toLocaleString()}</h2>
          <span className="inv-stat-sub" style={{ color: "#16a34a" }}>
            Across all divisions
          </span>
        </div>
        <div className="inv-stat-card" style={{ borderLeftColor: "#dc2626" }}>
          <p className="inv-stat-label">Low Stock Alert</p>
          <h2 className="inv-stat-value">{lowStockCount}</h2>
          <span
            className="inv-stat-sub"
            style={{ color: lowStockCount > 0 ? "#dc2626" : "#16a34a" }}
          >
            {lowStockCount > 0 ? "CRITICAL ACTION REQUIRED" : "ALL GOOD"}
          </span>
        </div>
        <div className="inv-stat-card" style={{ borderLeftColor: "#1a56db" }}>
          <p className="inv-stat-label">Audio / Visual Assets</p>
          <h2 className="inv-stat-value">{avCount}</h2>
          <span className="inv-stat-sub" style={{ color: "#718096" }}>
            Main Hall & Media Booth
          </span>
        </div>
        <div className="inv-stat-card" style={{ borderLeftColor: "#1a56db" }}>
          <p className="inv-stat-label">Literature</p>
          <h2 className="inv-stat-value">{litCount}</h2>
          <span className="inv-stat-sub" style={{ color: "#718096" }}>
            Bibles & Hymnals
          </span>
        </div>
      </div>

      {/* ── Tabs + Table card ── */}
      <div className="page-v2-card">
        <div className="card-header-row">
          <div className="inv-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`inv-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="btn-accent" onClick={openAddModal}>
            <Plus size={14} /> Add Item
          </button>
        </div>

        {/* Horizontal-scroll wrapper */}
        <div className="inv-table-scroll">
          <table className="v2-table inv-table">
            <thead>
              <tr>
                <th>ITEM NAME</th>
                <th>QUANTITY</th>
                <th>DIVISION</th>
                <th>LAST UPDATED</th>
                <th>STATUS</th>
                <th style={{ textAlign: "center" }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="mem-empty-row">
                    No items found for this category.
                  </td>
                </tr>
              ) : (
                paginated.map((item) => {
                  const Icon = item.icon;
                  const isLow = item.status === "lowstock";
                  const qtyStyle = isLow
                    ? { color: "#dc2626", fontWeight: 600 }
                    : { color: "inherit" };

                  return (
                    <tr key={item.id}>
                      {/* Item name */}
                      <td>
                        <div className="name-with-icon">
                          <div
                            className="item-icon-sm"
                            style={{ background: item.iconBg }}
                          >
                            <Icon size={14} color={item.iconColor} />
                          </div>
                          <strong
                            style={{
                              color: "var(--text-primary)",
                              fontSize: "0.88rem",
                            }}
                          >
                            {item.name}
                          </strong>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td style={qtyStyle}>{item.quantity}</td>

                      {/* Division */}
                      <td>{item.division}</td>

                      {/* Last updated */}
                      <td style={{ whiteSpace: "nowrap" }}>{item.updated}</td>

                      {/* Status */}
                      <td>
                        <span className={`inv-status-badge ${item.status}`}>
                          {item.status === "instock" ? "IN STOCK" : "LOW STOCK"}
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
                                prev === item.id ? null : item.id,
                              )
                            }
                          >
                            <MoreVertical size={16} />
                          </button>

                          {actionMenu === item.id && (
                            <div className="mem-action-menu">
                              <button
                                className="mem-action-item"
                                onClick={() => openViewModal(item)}
                              >
                                <Eye size={14} /> View
                              </button>
                              <button
                                className="mem-action-item"
                                onClick={() => openEditModal(item)}
                              >
                                <Pencil size={14} /> Edit
                              </button>
                              <div className="mem-action-divider" />
                              <button
                                className="mem-action-item danger"
                                onClick={() => handleRemove(item.id)}
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
                <strong>{filtered.length}</strong> items
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
          ADD / EDIT ITEM MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {showModal && (
        <div className="mem-modal-overlay" onClick={closeModal}>
          <div className="mem-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="mem-modal-header">
              <div>
                <h3 className="mem-modal-title">
                  {editId !== null ? "Edit Item" : "Add New Item"}
                </h3>
                <p className="mem-modal-subtitle">
                  {editId !== null
                    ? "Update the item's details below."
                    : "Fill in the details to add a new inventory item."}
                </p>
              </div>
              <button
                className="mem-modal-close"
                onClick={closeModal}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="mem-modal-body">
              {/* Item Name */}
              <div className="mem-form-group">
                <label className="mem-form-label">
                  Item Name <span className="mem-required">*</span>
                </label>
                <input
                  className={`mem-form-input ${formError ? "error" : ""}`}
                  type="text"
                  placeholder="e.g. Wireless Microphone"
                  value={form.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  autoFocus
                />
                {formError && (
                  <span className="mem-form-error">{formError}</span>
                )}
              </div>

              {/* Quantity */}
              <div className="mem-form-group">
                <label className="mem-form-label">Quantity</label>
                <input
                  className="mem-form-input"
                  type="text"
                  placeholder="e.g. 4 units, 12 copies"
                  value={form.quantity}
                  onChange={(e) => handleFormChange("quantity", e.target.value)}
                />
              </div>

              {/* Division + Status */}
              <div className="mem-form-row">
                <div className="mem-form-group">
                  <label className="mem-form-label">Category</label>
                  <select
                    className="mem-form-select"
                    value={form.division}
                    onChange={(e) =>
                      handleFormChange("division", e.target.value)
                    }
                  >
                    {Object.keys(DIVISION_META).map((d) => (
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
                    <option value="instock">In Stock</option>
                    <option value="lowstock">Low Stock</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mem-modal-footer">
              <button className="mem-modal-btn cancel" onClick={closeModal}>
                Cancel
              </button>
              <button className="mem-modal-btn submit" onClick={handleSubmit}>
                {editId !== null ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW ITEM MODAL
      ══════════════════════════════════════════════════════════════════ */}
      {viewItem && (
        <div className="mem-modal-overlay" onClick={() => setViewItem(null)}>
          <div
            className="mem-modal mem-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mem-modal-header">
              <h3 className="mem-modal-title">Item Details</h3>
              <button
                className="mem-modal-close"
                onClick={() => setViewItem(null)}
                title="Close"
              >
                <X size={17} />
              </button>
            </div>

            {/* Body */}
            <div className="mem-view-body">
              {/* Icon + name */}
              <div className="mem-view-top">
                <div
                  className="item-icon-sm inv-view-icon"
                  style={{ background: viewItem.iconBg }}
                >
                  {React.createElement(viewItem.icon, {
                    size: 22,
                    color: viewItem.iconColor,
                  })}
                </div>
                <div className="mem-view-identity">
                  <h4 className="mem-view-name">{viewItem.name}</h4>
                  <div className="mem-view-tags">
                    <span className={`inv-status-badge ${viewItem.status}`}>
                      {viewItem.status === "instock" ? "IN STOCK" : "LOW STOCK"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detail rows */}
              <div className="mem-view-details">
                <div className="mem-view-row">
                  <span className="mem-view-label">Category</span>
                  <span className="mem-view-value">{viewItem.division}</span>
                </div>
                <div className="mem-view-row">
                  <span className="mem-view-label">Quantity</span>
                  <span className="mem-view-value">
                    {viewItem.quantity || "—"}
                  </span>
                </div>
                <div className="mem-view-row">
                  <span className="mem-view-label">Last Updated</span>
                  <span className="mem-view-value">{viewItem.updated}</span>
                </div>
                <div className="mem-view-row">
                  <span className="mem-view-label">Status</span>
                  <span className="mem-view-value">
                    {viewItem.status === "instock" ? "In Stock" : "Low Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mem-modal-footer">
              <button
                className="mem-modal-btn cancel"
                onClick={() => setViewItem(null)}
              >
                Close
              </button>
              <button
                className="mem-modal-btn submit"
                onClick={() => {
                  setViewItem(null);
                  openEditModal(viewItem);
                }}
              >
                Edit Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
