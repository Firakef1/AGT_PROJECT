import React, { useState, useEffect } from 'react'
import {
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Building2,
  Users,
  TrendingUp,
  Clock,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Loader2
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts'
import { apiFetch } from '../services/apiFetch.js'

const Divisions = () => {
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  // Toast State
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' })

  useEffect(() => {
    fetchDivisions()
  }, [])

  const fetchDivisions = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/divisions')
      // Map icons and colors
      const mapped = data.map((div, idx) => ({
        ...div,
        icon: GraduationCap,
        iconBg: '#e8f0fe',
        iconColor: '#1a56db',
        statusColor: idx % 2 === 0 ? '#16a34a' : '#3b82f6', // Mock colors based on status if needed
        budgetStatus: 'On Track'
      }))
      setDivisions(mapped)
    } catch (err) {
      setError('Failed to load divisions')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  // Filter State
  const [activeFilter, setActiveFilter] = useState('All')
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    if (!showFilterMenu) return;
    const close = () => setShowFilterMenu(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [showFilterMenu]);

  useEffect(() => {
    setCurrentPage(1)
  }, [activeFilter])

  const handleExport = () => {
    const headers = ['Division Name', 'Leader', 'Members']
    const rows = filteredDivisions.map(d => [
      `"${d.name}"`,
      `"${d.leader?.fullName || 'No Leader'}"`,
      d._count?.members || 0
    ].join(','))

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
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

  const filteredDivisions = divisions.filter(d =>
    activeFilter === 'All' || d.budgetStatus === activeFilter
  )

  const ITEMS_PER_PAGE = 5
  const totalPages = Math.ceil(filteredDivisions.length / ITEMS_PER_PAGE)
  const currentDivisions = filteredDivisions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const chartDivisions = [...divisions]
    .sort((a, b) => (b._count?.members || 0) - (a._count?.members || 0))

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <Loader2 className="spin" size={48} />
    </div>
  )

  return (
    <div className="page-v2">
      <div className="page-v2-header">
        <div>
          <h1>Divisions Overview</h1>
          <p>View and monitor the performance of all church departments. (Read-only)</p>
        </div>
      </div>

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
              {divisions.reduce((acc, curr) => acc + (curr._count?.members || 0), 0)}
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

      <div className="page-v2-card">
        <div className="card-header-row">
          <h3>Division List</h3>
          <div className="card-header-actions">
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
              </tr>
            </thead>
            <tbody>
              {currentDivisions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                    No divisions found.
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
                      <td>{div.leader?.fullName || 'Unassigned'}</td>
                      <td className="center-text">{div._count?.members || 0}</td>
                      <td>
                        <span className="budget-dot" style={{ background: div.statusColor }}></span>
                        <span style={{ color: div.statusColor, fontWeight: 500, fontSize: '0.85rem' }}>
                          {div.budgetStatus}
                        </span>
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

      <div className="divisions-bottom-grid">
        <div className="page-v2-card">
          <h3 className="card-title-with-icon">
            <Clock size={18} color="#1a56db" /> Recent Activities
          </h3>
          <div className="div-activities-list">
             <p style={{ color: 'var(--text-secondary)', padding: '1rem' }}>No recent activities recorded.</p>
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
                    value: d._count?.members || 0
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={85}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
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
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 5,
              width: '130px'
            }}>
              {activeIndex === -1 ? (
                <>
                  <span style={{ fontSize: '2.2rem', fontWeight: '800', display: 'block' }}>
                    {divisions.reduce((acc, curr) => acc + (curr._count?.members || 0), 0)}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                    Total Members
                  </span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '1.8rem', fontWeight: '800', display: 'block' }}>
                    {chartDivisions[activeIndex]._count?.members}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                    {chartDivisions[activeIndex].name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast.show && (
        <div className="toast-container">
          <div className={`custom-toast toast-${toast.type}`}>
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