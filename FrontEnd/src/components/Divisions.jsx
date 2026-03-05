import React, { useState, useEffect } from 'react'
import {
  Plus,
  Filter,
  Download,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HandHelping,
  Monitor,
  Megaphone,
  Music,
  Clock,
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  X,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const defaultIcon = GraduationCap
const defaultIconBg = '#e8f0fe'
const defaultIconColor = '#1a56db'

const initialDivisions = [
  { id: 1, name: 'Education', leader: 'Abebe Kebede', members: 45, budgetStatus: 'On Track', statusColor: '#16a34a', icon: GraduationCap, iconBg: '#e8f0fe', iconColor: '#1a56db' },
  { id: 2, name: 'Service', leader: 'Marta Almaz', members: 30, budgetStatus: 'Review Needed', statusColor: '#d97706', icon: HandHelping, iconBg: '#fef3e2', iconColor: '#d97706' },
  { id: 3, name: 'Media', leader: 'Samuel Yohannes', members: 25, budgetStatus: 'On Track', statusColor: '#16a34a', icon: Monitor, iconBg: '#e8f0fe', iconColor: '#1a56db' },
  { id: 4, name: 'Outreach', leader: 'Sara Tekle', members: 20, budgetStatus: 'Under Budget', statusColor: '#3b82f6', icon: Megaphone, iconBg: '#fce4ec', iconColor: '#dc2626' },
  { id: 5, name: 'Choir', leader: 'Yared Solomon', members: 62, budgetStatus: 'Over Budget', statusColor: '#dc2626', icon: Music, iconBg: '#fce4ec', iconColor: '#dc2626' },
]

const recentActivitiesData = [
  { text: "New division 'Youth Outreach' created", time: '2 hours ago', by: 'Admin', color: '#3b82f6' },
  { text: 'Budget status updated for Media division', time: '5 hours ago', by: 'Samuel Yohannes', color: '#d97706' },
  { text: '15 new members joined Education division', time: 'Yesterday', by: 'System', color: '#16a34a' },
]

const budgetOptions = [
  { label: 'On Track', color: '#16a34a' },
  { label: 'Review Needed', color: '#d97706' },
  { label: 'Under Budget', color: '#3b82f6' },
  { label: 'Over Budget', color: '#dc2626' },
]

const Divisions = () => {
  const [divisions, setDivisions] = useState(initialDivisions)
  const [recentActivities, setRecentActivities] = useState(recentActivitiesData)
  const [currentPage, setCurrentPage] = useState(1)

  // Toast State
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' })

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  // Filter State
  const [activeFilter, setActiveFilter] = useState('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  // ── Close filter menu when clicking anywhere else ──
  useEffect(() => {
    if (!showFilterMenu) return;
    const close = () => setShowFilterMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showFilterMenu]);

  // ── Reset page when filter changes ──
  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter])

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    members: '',
    budgetStatus: 'On Track'
  })

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const openAddModal = () => {
    setEditId(null)
    setFormData({ name: '', leader: '', members: '', budgetStatus: 'On Track' })
    setShowModal(true)
  }

  const openEditModal = (div) => {
    setEditId(div.id)
    setFormData({
      name: div.name,
      leader: div.leader,
      members: div.members,
      budgetStatus: div.budgetStatus
    })
    setShowModal(true)
  }

  const confirmDelete = (id) => {
    setDeleteId(id)
    setShowDeleteModal(true)
  }

  const handleDelete = () => {
    if (deleteId) {
      const divToDelete = divisions.find(d => d.id === deleteId)
      setDivisions(prev => prev.filter(d => d.id !== deleteId))
      setRecentActivities(prev => [
        { text: `Division '${divToDelete?.name || 'Deleted'}' removed`, time: 'Just now', by: 'Admin', color: '#dc2626' },
        ...prev
      ])
    }
    setShowDeleteModal(false)
    setDeleteId(null)
  }

  const handleSave = () => {
    if (!formData.name || !formData.leader) {
      showToast('Validation Error', 'Please fill in all required fields', 'error')
      return
    }

    const budgetInfo = budgetOptions.find(o => o.label === formData.budgetStatus)

    if (editId) {
      setDivisions(prev => prev.map(d =>
        d.id === editId
          ? { ...d, ...formData, statusColor: budgetInfo.color }
          : d
      ))
      setRecentActivities(prev => [
        { text: `Division '${formData.name}' updated`, time: 'Just now', by: 'Admin', color: '#d97706' },
        ...prev
      ])
    } else {
      const newDiv = {
        id: Date.now(),
        ...formData,
        statusColor: budgetInfo.color,
        icon: defaultIcon,
        iconBg: defaultIconBg,
        iconColor: defaultIconColor,
        members: parseInt(formData.members) || 0
      }
      setDivisions(prev => [...prev, newDiv])
      setRecentActivities(prev => [
        { text: `New division '${formData.name}' created`, time: 'Just now', by: 'Admin', color: '#3b82f6' },
        ...prev
      ])
    }
    setShowModal(false)
  }

  const handleExport = () => {
    const headers = ['Division Name', 'Leader', 'Members', 'Budget Status']
    const rows = filteredDivisions.map(d => [
      `"${d.name}"`,
      `"${d.leader}"`,
      d.members,
      `"${d.budgetStatus}"`
    ].join(','))

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    URL.revokeObjectURL(blob) // Clean up if needed
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'all_divisions_export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Export Success', 'Full divisions list has been exported.', 'success')
  }

  const handleExportSingle = (d) => {
    const headers = ['Division Name', 'Leader', 'Members', 'Budget Status']
    const row = [
      `"${d.name}"`,
      `"${d.leader}"`,
      d.members,
      `"${d.budgetStatus}"`
    ].join(',')

    const csvContent = [headers.join(','), row].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${d.name.toLowerCase().replace(/\s+/g, '_')}_report.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    showToast('Single Export', `Report for ${d.name} division exported.`, 'info')
  }

  // Derived Data
  const filteredDivisions = divisions.filter(d =>
    activeFilter === 'All' || d.budgetStatus === activeFilter
  )

  // Pagination Logic
  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(filteredDivisions.length / ITEMS_PER_PAGE)
  const currentDivisions = filteredDivisions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Derived Data for Chart
  const chartDivisions = [...divisions]
    .sort((a, b) => (parseInt(b.members) || 0) - (parseInt(a.members) || 0))

  const maxMembersForChart = Math.max(...chartDivisions.map(d => parseInt(d.members) || 0), 1)

  return (
    <div className="page-v2">
      {/* Header */}
      <div className="page-v2-header">
        <div>
          <h1>Divisions Management</h1>
          <p>Configure and monitor the performance of all church departments.</p>
        </div>
        <button className="btn-accent" onClick={openAddModal}>
          <Plus size={16} /> Add Division
        </button>
      </div>

      {/* Stat Cards */}
      <div className="page-v2-stats three-col">
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: '#e8f0fe' }}>
            <Building2 size={20} color="#1a56db" />
          </div>
          <div>
            <p className="page-stat-label">Total Divisions</p>
            <h2 className="page-stat-value">{divisions.length}</h2>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: '#e8f5e9' }}>
            <Users size={20} color="#16a34a" />
          </div>
          <div>
            <p className="page-stat-label">Total Members</p>
            <h2 className="page-stat-value">
              {divisions.reduce((acc, curr) => acc + (parseInt(curr.members) || 0), 0)}
            </h2>
          </div>
        </div>
        <div className="page-stat-card">
          <div className="page-stat-icon" style={{ background: '#fef3e2' }}>
            <TrendingUp size={20} color="#d97706" />
          </div>
          <div>
            <p className="page-stat-label">Budget Efficiency</p>
            <h2 className="page-stat-value">94.5%</h2>
          </div>
        </div>
      </div>

      {/* Division List */}
      <div className="page-v2-card">
        <div className="card-header-row">
          <h3>Division List</h3>
          <div className="card-header-actions">
            <div className="filter-wrapper" style={{ position: 'relative' }}>
              <button
                className={`btn-icon-text ${activeFilter !== 'All' ? 'filter-active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowFilterMenu(!showFilterMenu)
                }}
              >
                <Filter size={14} />
                {activeFilter === 'All' ? 'Filter' : activeFilter}
              </button>

              {showFilterMenu && (
                <div className="mem-filters-dropdown" style={{ display: 'block', top: 'calc(100% + 5px)', right: 0 }}>
                  <div className="mem-filters-dropdown-title">Filter by Budget</div>
                  <button
                    className={`mem-filter-option ${activeFilter === 'All' ? 'selected' : ''}`}
                    onClick={() => setActiveFilter('All')}
                  >
                    All Statuses
                  </button>
                  {budgetOptions.map(opt => (
                    <button
                      key={opt.label}
                      className={`mem-filter-option ${activeFilter === opt.label ? 'selected' : ''}`}
                      onClick={() => setActiveFilter(opt.label)}
                    >
                      <span className="budget-dot" style={{ background: opt.color, marginRight: '8px' }}></span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="btn-icon-text" onClick={handleExport}>
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="members-table-scroll" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: '1rem' }}>
          <table className="v2-table members-table">
            <thead>
              <tr>
                <th>DIVISION NAME</th>
                <th>LEADER</th>
                <th>MEMBER COUNT</th>
                <th>BUDGET STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentDivisions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No divisions found with the selected filter.
                  </td>
                </tr>
              ) : (
                currentDivisions.map((div) => {
                  const Icon = div.icon || GraduationCap
                  return (
                    <tr key={div.id}>
                      <td>
                        <div className="name-with-icon">
                          <div className="item-icon-sm" style={{ background: div.iconBg }}>
                            <Icon size={14} color={div.iconColor} />
                          </div>
                          <strong>{div.name}</strong>
                        </div>
                      </td>
                      <td>{div.leader}</td>
                      <td className="center-text">{div.members}</td>
                      <td>
                        <span className="budget-dot" style={{ background: div.statusColor }}></span>
                        <span style={{ color: div.statusColor, fontWeight: 500, fontSize: '0.85rem' }}>
                          {div.budgetStatus}
                        </span>
                      </td>
                      <td>
                        <div className="action-icons">
                          <button className="icon-btn" onClick={() => handleExportSingle(div)} title="Download Report">
                            <Download size={15} color="var(--blue)" />
                          </button>
                          <button className="icon-btn" onClick={() => openEditModal(div)}>
                            <Pencil size={15} />
                          </button>
                          <button className="icon-btn danger" onClick={() => confirmDelete(div.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="table-info">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredDivisions.length)} of {filteredDivisions.length} divisions
          </span>
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={14} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="divisions-bottom-grid">
        <div className="page-v2-card">
          <h3 className="card-title-with-icon">
            <Clock size={18} color="#1a56db" /> Recent Activities
          </h3>
          <div className="div-activities-list">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="div-activity-item">
                <span className="div-activity-dot" style={{ background: act.color }}></span>
                <div>
                  <strong>{act.text}</strong>
                  <p className="div-activity-meta">{act.time} • by {act.by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="page-v2-card">
          <h3 className="card-title-with-icon">
            <BarChart3 size={18} color="#1a56db" /> Member Distribution
          </h3>
          <div className="circular-chart-container" style={{
            height: '280px',
            width: '100%',
            marginTop: '0.5rem',
            position: 'relative'
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartDivisions.map(d => ({
                    name: d.name,
                    value: parseInt(d.members) || 0
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                  onMouseEnter={(_, index) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  {chartDivisions.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.statusColor || '#c7d2fe'}
                      stroke={activeIndex === index ? '#fff' : 'none'}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Summary (Doughnut Hole Tooltip) */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 5,
              width: '130px',
              height: '130px',
              borderRadius: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: activeIndex === -1 ? 'transparent' : chartDivisions[activeIndex].statusColor,
              padding: '20px'
            }}>
              {activeIndex === -1 ? (
                <>
                  <span style={{
                    fontSize: '2.2rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    display: 'block',
                    lineHeight: 1,
                    transition: 'color 0.3s ease'
                  }}>
                    {divisions.reduce((acc, curr) => acc + (parseInt(curr.members) || 0), 0)}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    transition: 'color 0.3s ease'
                  }}>
                    Total Members
                  </span>
                </>
              ) : (
                <>
                  <span style={{
                    fontSize: '1.8rem',
                    fontWeight: '800',
                    color: '#fff',
                    display: 'block',
                    lineHeight: 1,
                    animation: 'fadeInUp 0.3s ease forwards'
                  }}>
                    {chartDivisions[activeIndex].members}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#fff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 700,
                    display: 'block',
                    marginTop: '4px',
                    wordBreak: 'break-word',
                    animation: 'fadeInUp 0.3s ease 0.05s forwards',
                    opacity: 0
                  }}>
                    {chartDivisions[activeIndex].name}
                  </span>
                </>
              )}
            </div>
          </div>
          <p className="dist-label" style={{ marginTop: '0.5rem', textAlign: 'center' }}>MEMBER DISTRIBUTION BY DIVISION</p>
        </div>
      </div>

      {/* Modal */}
      {
        showModal && (
          <div className="mem-modal-overlay" onClick={() => setShowModal(false)}>
            <div className="mem-modal" onClick={e => e.stopPropagation()}>
              <div className="mem-modal-header">
                <div>
                  <h3 className="mem-modal-title">{editId ? 'Edit Division' : 'Add New Division'}</h3>
                  <p className="mem-modal-subtitle">Enter the details for the division below.</p>
                </div>
                <button className="mem-modal-close" onClick={() => setShowModal(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="mem-modal-body">
                <div className="mem-form-group">
                  <label className="mem-form-label">Division Name *</label>
                  <input
                    type="text"
                    className="mem-form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Youth Education"
                  />
                </div>
                <div className="mem-form-group">
                  <label className="mem-form-label">Leader Name *</label>
                  <input
                    type="text"
                    className="mem-form-input"
                    value={formData.leader}
                    onChange={e => setFormData({ ...formData, leader: e.target.value })}
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="mem-form-row">
                  <div className="mem-form-group">
                    <label className="mem-form-label">Member Count</label>
                    <input
                      type="number"
                      className="mem-form-input"
                      value={formData.members}
                      onChange={e => setFormData({ ...formData, members: e.target.value })}
                    />
                  </div>
                  <div className="mem-form-group">
                    <label className="mem-form-label">Budget Status</label>
                    <select
                      className="mem-form-select"
                      value={formData.budgetStatus}
                      onChange={e => setFormData({ ...formData, budgetStatus: e.target.value })}
                    >
                      {budgetOptions.map(opt => (
                        <option key={opt.label} value={opt.label}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mem-modal-footer" style={{ padding: '1rem 1.4rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button className="btn-icon-text" style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn-accent" onClick={handleSave}>
                  {editId ? 'Save Changes' : 'Add Division'}
                </button>
              </div>
            </div>
          </div>
        )
      }
      {/* Custom Delete Modal */}
      {
        showDeleteModal && (
          <div className="mem-modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="mem-modal" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
              <div className="mem-modal-header" style={{ background: 'var(--red-bg)', borderBottom: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--red)', color: 'white', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Trash2 size={18} />
                  </div>
                  <div>
                    <h3 className="mem-modal-title" style={{ color: 'var(--red)' }}>Are you sure?</h3>
                    <p className="mem-modal-subtitle">This action cannot be undone.</p>
                  </div>
                </div>
              </div>
              <div className="mem-modal-body" style={{ textAlign: 'center', padding: '1.5rem 1.4rem' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Do you really want to delete this division? All associated data will be permanently removed.
                </p>
              </div>
              <div className="mem-modal-footer" style={{ padding: '1rem 1.4rem', borderTop: 'none', display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
                <button
                  className="btn-icon-text"
                  style={{ background: 'var(--gray-100)', color: 'var(--text-primary)', minWidth: '100px', justifyContent: 'center' }}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-accent"
                  style={{ background: 'var(--red)', minWidth: '100px', justifyContent: 'center' }}
                  onClick={handleDelete}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Custom Toast Notification */}
      {toast.show && (
        <div className="toast-container">
          <div className={`custom-toast toast-${toast.type}`}>
            <div className="toast-icon">
              {toast.type === 'success' && <CheckCircle size={20} color="var(--green)" />}
              {toast.type === 'error' && <X size={20} color="var(--red)" />}
              {toast.type === 'warning' && <AlertTriangle size={20} color="var(--orange)" />}
              {toast.type === 'info' && <Info size={20} color="var(--blue)" />}
            </div>
            <div className="toast-content">
              <div className="toast-title">{toast.title}</div>
              <div className="toast-message">{toast.message}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Divisions