import React, { useState, useEffect } from 'react'
import {
  FileText,
  Plus,
  Download,
  BarChart2,
  FilePlus,
  Upload,
  X,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  FileUp,
  PieChart,
  Activity,
  List,
  Search,
  Filter,
  AlertTriangle,
  Info
} from 'lucide-react'

const Reports = () => {
  const [showModal, setShowModal] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [reportData, setReportData] = useState({
    type: 'Financial Summary',
    range: 'May 2024'
  })

  // New states for View/Export functionality
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [showExportsModal, setShowExportsModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportSearchQuery, setExportSearchQuery] = useState('')
  const [exportFilterType, setExportFilterType] = useState('All')

  // Toast State
  const [toast, setToast] = useState({ show: false, title: '', message: '', type: 'success' })

  const showToast = (title, message, type = 'success') => {
    setToast({ show: true, title, message, type })
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
  }

  const reportTypes = [
    { name: 'Membership Report', description: 'Comprehensive member statistics and demographics', icon: <FileText size={20} />, status: 'Updated 2d ago', color: '#1a56db' },
    { name: 'Financial Report', description: 'Monthly and yearly financial summaries', icon: <TrendingUp size={20} />, status: 'Daily Sync', color: '#16a34a' },
    { name: 'Division Performance', description: 'Activity and engagement metrics by division', icon: <BarChart2 size={20} />, status: 'Real-time', color: '#d97706' },
    { name: 'Inventory Report', description: 'Current inventory status and usage patterns', icon: <FilePlus size={20} />, status: 'Updated 5h ago', color: '#7c3aed' },
  ]

  const recentReports = [
    { id: 'RPT-001', name: 'Q1 Financial Summary', date: 'May 12, 2024', size: '2.4 MB', type: 'PDF' },
    { id: 'RPT-002', name: 'Annual Member Audit', date: 'May 10, 2024', size: '1.8 MB', type: 'XLSX' },
    { id: 'RPT-003', name: 'Division Activity Log', date: 'May 08, 2024', size: '850 KB', type: 'PDF' },
  ]

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleGenerate = () => {
    if (!selectedFile) {
      showToast('Validation Error', 'Please select a file to process', 'error')
      return
    }
    setIsGenerating(true)
    setProgress(0)
    setGenerationComplete(false)

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setGenerationComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 150)
  }

  const resetModal = () => {
    setShowModal(false)
    setIsGenerating(false)
    setProgress(0)
    setSelectedFile(null)
    setGenerationComplete(false)
  }

  const handleExport = (reportName) => {
    setIsExporting(true)
    // Simulate export delay
    setTimeout(() => {
      setIsExporting(false)
      showToast('Export Successful', `${reportName} has been exported matching your criteria.`, 'success')
    }, 1500)
  }

  const handleView = (report) => {
    setSelectedReport(report)
    setShowPreviewModal(true)
  }

  const filteredExports = recentReports.filter(rpt => {
    const matchesSearch = rpt.name.toLowerCase().includes(exportSearchQuery.toLowerCase())
    const matchesType = exportFilterType === 'All' || rpt.type === exportFilterType
    return matchesSearch && matchesType
  })

  return (
    <div className="page-v2">
      {/* Header */}
      <div className="page-v2-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p>Generate, export and analyze church management data</p>
        </div>
        <button className="btn-accent" onClick={() => setShowModal(true)}>
          <FilePlus size={16} /> Generate Custom Report
        </button>
      </div>

      {/* Stats row */}
      <div className="page-v2-stats four-col">
        <div className="fin-stat-card">
          <p className="page-stat-label">Total Reports</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <h2 className="page-stat-value">1,280</h2>
            <span className="dash-stat-change positive">+12%</span>
          </div>
        </div>
        <div className="fin-stat-card">
          <p className="page-stat-label">Downloads</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <h2 className="page-stat-value">842</h2>
            <span className="dash-stat-change positive">+5.4%</span>
          </div>
        </div>
        <div className="fin-stat-card">
          <p className="page-stat-label">Data Accuracy</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <h2 className="page-stat-value">99.8%</h2>
            <CheckCircle size={18} color="#16a34a" />
          </div>
        </div>
        <div className="fin-stat-card">
          <p className="page-stat-label">Last Sync</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <h2 className="page-stat-value" style={{ fontSize: '1.2rem' }}>2 mins ago</h2>
            <Clock size={18} color="#1a56db" />
          </div>
        </div>
      </div>

      <div className="page-grid-2-1">
        {/* Main Reports Grid */}
        <div className="page-v2-card">
          <div className="card-header-row">
            <h3>Standard Reports</h3>
            <button className="btn-icon-text">View All Categories</button>
          </div>
          <div className="reports-type-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
            {reportTypes.map((report, idx) => (
              <div key={idx} className="report-v2-card" style={{ padding: '1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', transition: 'var(--transition)', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ background: `${report.color}15`, color: report.color, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {report.icon}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 700 }}>{report.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{report.status}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: '1.5' }}>{report.description}</p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button className="btn-accent-outline" style={{ flex: 1, padding: '0.5rem' }} onClick={() => handleView(report)}>View</button>
                  <button
                    className="btn-secondary-outline"
                    style={{ flex: 1, padding: '0.5rem' }}
                    onClick={() => handleExport(report.name)}
                    disabled={isExporting}
                  >
                    {isExporting ? '...' : 'Export'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="page-v2-card">
          <div className="card-header-row">
            <h3>Recent Exports</h3>
            <ChevronRight size={16} />
          </div>
          <div className="recent-reports-list" style={{ marginTop: '1rem' }}>
            {recentReports.map((rpt, idx) => (
              <div key={idx} style={{ padding: '1rem 0', borderBottom: idx !== recentReports.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '36px', height: '36px', background: 'var(--gray-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                  <FileText size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rpt.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{rpt.date} • {rpt.size}</span>
                </div>
                <button className="btn-icon">
                  <Download size={16} color="var(--accent)" />
                </button>
              </div>
            ))}
          </div>
          <button className="btn-view-detail" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => setShowExportsModal(true)}>View Full Export History</button>
        </div>
      </div>

      {/* Custom Report Modal */}
      {showModal && (
        <div className="mem-modal-overlay" onClick={resetModal}>
          <div className="mem-modal" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div>
                <h2 className="mem-modal-title">Generate Custom Report</h2>
                <p className="mem-modal-subtitle">Process and analyze local data files</p>
              </div>
              <button className="mem-modal-close" onClick={resetModal}>
                <X size={20} />
              </button>
            </div>

            <div className="mem-modal-body">
              {!isGenerating && !generationComplete ? (
                <>
                  <div className="mem-form-group">
                    <label className="mem-form-label">Report Type</label>
                    <select className="mem-form-select">
                      <option>Quarterly Performance</option>
                      <option>Member Retention Audit</option>
                      <option>Expense Breakdown</option>
                      <option>Custom Query</option>
                    </select>
                  </div>

                  <div className="mem-form-group">
                    <label className="mem-form-label">Upload Reference Data</label>
                    <div
                      onClick={() => document.getElementById('file-upload').click()}
                      style={{
                        border: '2px dashed var(--border)',
                        borderRadius: 'var(--radius)',
                        padding: '2rem 1.5rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        background: selectedFile ? '#f0f9ff' : 'var(--gray-50)',
                        transition: 'var(--transition)'
                      }}
                    >
                      <input
                        id="file-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                      <div style={{ background: '#e0f2fe', color: '#0369a1', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <Upload size={24} />
                      </div>
                      {selectedFile ? (
                        <div>
                          <p style={{ fontWeight: 600, color: '#0369a1' }}>{selectedFile.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{(selectedFile.size / 1024).toFixed(1)} KB • Ready to process</p>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontWeight: 600 }}>Click to upload or drag and drop</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>CSV, XLSX, or JSON (max 10MB)</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : isGenerating ? (
                <div style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                  <div className="loader-container" style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 1.5rem' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {progress}%
                    </div>
                    <div style={{ width: '80px', height: '80px', border: '5px solid #e2e8f0', borderRadius: '50%', position: 'absolute' }}></div>
                    <div style={{ width: '80px', height: '80px', border: '5px solid var(--accent)', borderRadius: '50%', position: 'absolute', borderTopColor: 'transparent', transition: '0.1s linear' }}></div>
                  </div>
                  <h3 style={{ marginBottom: '0.5rem' }}>Generating Report...</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Analyzing file data and compiling visualizations</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ background: '#dcfce7', color: '#166534', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <CheckCircle size={32} />
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Report Generated!</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your custom report has been processed successfully and is ready for download.</p>

                  <div style={{ background: 'var(--gray-50)', padding: '1.25rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left', border: '1px solid var(--border)' }}>
                    <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <FileText color="var(--accent)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Custom_Analysis_Report.pdf</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Generated today • 4.2 MB</p>
                    </div>
                    <button className="btn-icon" style={{ background: 'var(--accent)', color: '#fff' }}>
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mem-modal-footer">
              {!generationComplete ? (
                <>
                  <button className="btn-icon-text" style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }} onClick={resetModal} disabled={isGenerating}>Cancel</button>
                  <button className="btn-accent" onClick={handleGenerate} disabled={isGenerating || !selectedFile}>
                    {isGenerating ? 'Processing...' : 'Generate Now'}
                  </button>
                </>
              ) : (
                <button className="btn-accent" onClick={resetModal} style={{ width: '100%' }}>Done</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {showPreviewModal && selectedReport && (
        <div className="mem-modal-overlay" onClick={() => setShowPreviewModal(false)}>
          <div className="mem-modal" style={{ maxWidth: '750px' }} onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: `${selectedReport.color}15`, color: selectedReport.color, width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedReport.icon}
                </div>
                <div>
                  <h2 className="mem-modal-title">{selectedReport.name} Preview</h2>
                  <p className="mem-modal-subtitle">Snapshot of current analytics and trends</p>
                </div>
              </div>
              <button className="mem-modal-close" onClick={() => setShowPreviewModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mem-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--gray-50)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Summary Metric</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>4,821</h2>
                    <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 600 }}>+5.2%</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Total engagement across all parameters</p>
                </div>
                <div style={{ background: 'var(--gray-50)', padding: '1.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Active Status</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a' }}></div>
                    <span style={{ fontWeight: 700 }}>Optimal Performance</span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Based on calculated system efficiency</p>
                </div>
              </div>

              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '1rem' }}>Monthly Trend Analysis</h4>
                <div style={{ height: '180px', background: 'var(--gray-100)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '1rem' }}>
                  {[40, 65, 45, 80, 55, 90].map((h, i) => (
                    <div key={i} style={{ width: '30px', background: selectedReport.color, height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.7 + (i * 0.05) }}></div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>
            </div>

            <div className="mem-modal-footer">
              <button className="btn-icon-text" style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }} onClick={() => setShowPreviewModal(false)}>Close Preview</button>
              <button
                className="btn-accent"
                onClick={() => {
                  setShowPreviewModal(false)
                  handleExport(selectedReport.name)
                }}
              >
                Export Full Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export History Modal */}
      {showExportsModal && (
        <div className="mem-modal-overlay" onClick={() => setShowExportsModal(false)}>
          <div className="mem-modal" style={{ maxWidth: '850px', height: '80vh' }} onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div>
                <h2 className="mem-modal-title">Full Export History</h2>
                <p className="mem-modal-subtitle">Track and download all previously generated files</p>
              </div>
              <button className="mem-modal-close" onClick={() => setShowExportsModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mem-modal-body" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    type="text"
                    className="mem-form-input"
                    placeholder="Search export history..."
                    style={{ paddingLeft: '36px' }}
                    value={exportSearchQuery}
                    onChange={(e) => setExportSearchQuery(e.target.value)}
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <select
                    className="mem-form-select"
                    value={exportFilterType}
                    onChange={(e) => setExportFilterType(e.target.value)}
                  >
                    <option value="All">All Formats</option>
                    <option value="PDF">PDF Documents</option>
                    <option value="XLSX">Excel Sheets</option>
                    <option value="CSV">CSV Data</option>
                  </select>
                </div>
              </div>

              <div className="inv-table-scroll" style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <table className="v2-table" style={{ border: 'none' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--white)' }}>
                    <tr>
                      <th>FILE NAME</th>
                      <th>DATE GENERATED</th>
                      <th>SIZE</th>
                      <th>TYPE</th>
                      <th style={{ textAlign: 'right' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExports.length > 0 ? (
                      filteredExports.map((rpt, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="name-with-icon">
                              <div style={{ width: '32px', height: '32px', background: 'var(--gray-100)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                                <FileText size={16} />
                              </div>
                              <strong>{rpt.name}</strong>
                            </div>
                          </td>
                          <td>{rpt.date}</td>
                          <td>{rpt.size}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="btn-icon" style={{ color: 'var(--accent)' }}>
                              <Download size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                          No export records found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mem-modal-footer">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: 'auto' }}>
                Total Exports: {recentReports.length} recorded files
              </span>
              <button className="btn-accent" onClick={() => setShowExportsModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}

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

export default Reports