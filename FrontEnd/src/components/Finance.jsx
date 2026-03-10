import React, { useState, useEffect, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  Plus,
  Minus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react'
import { apiFetch } from '../services/apiFetch'

const Finance = () => {

  const [transactionList, setTransactionList] = useState([])
  const [financeSummary, setFinanceSummary] = useState({ income: 0, expenses: 0, balance: 0, count: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [formData, setFormData] = useState({
    desc: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    amount: ''
  })

  const [activePeriod, setActivePeriod] = useState(6)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false)

  // Filter states for the "View All" modal
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterType, setFilterType] = useState('All')

  const budgetDetails = useMemo(() => {
    const expenses = transactionList.filter(t => t.type === 'EXPENSE')
    const categoryTotals = {}
    expenses.forEach(t => {
      const cat = t.description?.includes(' | Category: ') ? t.description.split(' | Category: ')[1] : 'Other'
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount
    })
    
    return Object.entries({
      'Events': { allocated: 120000, color: '#1a56db' },
      'Administrative': { allocated: 50000, color: '#d97706' },
      'Social Services': { allocated: 80000, color: '#16a34a' },
      'Maintenance': { allocated: 40000, color: '#dc2626' },
      'Other': { allocated: 25000, color: '#7c3aed' },
    }).map(([name, data]) => {
      const spent = categoryTotals[name] || 0
      const remaining = data.allocated - spent
      const status = spent >= data.allocated ? 'Warning' : 'On Track'
      const percent = Math.min((spent / data.allocated) * 100, 100).toFixed(1)
      return { name, allocated: data.allocated, spent, remaining, color: data.color, status, percent }
    })
  }, [transactionList])

  const budgetDistribution = useMemo(() => {
    const totalSpent = budgetDetails.reduce((acc, curr) => acc + curr.spent, 0)
    return budgetDetails.filter(b => b.spent > 0).map(b => ({
      name: b.name,
      percent: totalSpent > 0 ? ((b.spent / totalSpent) * 100).toFixed(1) : 0,
      color: b.color
    })).sort((a,b) => b.percent - a.percent)
  }, [budgetDetails])

  const derivedExpenseData = useMemo(() => {
    const grouped = {}
    transactionList.filter(t => t.type === 'EXPENSE').forEach(t => {
      const d = new Date(t.occurredAt)
      const monthRef = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`
      grouped[monthRef] = (grouped[monthRef] || 0) + t.amount
    })
    return Object.keys(grouped).sort().map(k => {
      const [y, m] = k.split('-')
      const name = new Date(y, parseInt(m)-1).toLocaleString('en-US', { month: 'short' }).toUpperCase()
      return { name, amount: grouped[k] }
    })
  }, [transactionList])

  const fetchFinanceData = async () => {
    try {
      setLoading(true)
      const [summaryRes, transactionsRes] = await Promise.all([
        apiFetch('/finance/summary'),
        apiFetch('/finance')
      ])
      setFinanceSummary(summaryRes)
      setTransactionList(transactionsRes)
      
      // We can map mock chart data here if we want or just leave them empty
      // for now until a real timeseries API exists.
    } catch (err) {
      console.error('Error fetching finance data:', err)
      setError('Failed to load finance data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFinanceData()
  }, [])

  // Derived Stats
  const totalIncome = financeSummary.income || 0
  const totalExpense = financeSummary.expenses || 0
  const balance = financeSummary.balance || 0

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      desc: '',
      category: '',
      date: new Date().toISOString().split('T')[0],
      amount: ''
    })
  }

  const handleAddTransaction = async (type) => {
    if (!formData.desc || !formData.amount || !formData.category) {
      alert('Please fill in all fields')
      return
    }

    const amountNum = parseFloat(formData.amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Invalid amount')
      return
    }

    setIsSubmitting(true)
    try {
      await apiFetch('/finance', {
        method: 'POST',
        body: JSON.stringify({
          type: type.toUpperCase(),
          amount: amountNum,
          description: formData.desc + ' | Category: ' + formData.category,
        })
      })
      
      await fetchFinanceData()
      resetForm()
      
      if (type === 'income') setShowIncomeModal(false)
      if (type === 'expense') setShowExpenseModal(false)
    } catch (err) {
      console.error(`Error adding ${type}:`, err)
      alert(err.message || 'Failed to add transaction')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Derived filtered transactions for the "View All" modal
  const filteredTransactions = transactionList.filter(tx => {
    const matchesSearch = (tx.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    // Basic category filter hack since we stored it in description
    const matchesCategory = filterCategory === 'All' || (tx.description || '').includes(`Category: ${filterCategory}`)
    const matchesType = filterType === 'All' || tx.type.toLowerCase() === filterType.toLowerCase()
    return matchesSearch && matchesCategory && matchesType
  })

  if (loading) return <div className="page-v2 flex-center"><Loader2 className="spin" /></div>
  if (error) return <div className="page-v2 flex-center"><p className="text-red-500">{error}</p></div>

  return (
    <div className="page-v2">
      {/* Header */}
      <div className="page-v2-header">
        <div>
          <h1>Finance Overview</h1>
          <p>ASTU Gibi Gubae Internal Management</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-accent-outline" onClick={() => setShowIncomeModal(true)} disabled={isSubmitting}>
            <Plus size={14} /> Add Income
          </button>
          <button className="btn-accent-dark" onClick={() => setShowExpenseModal(true)} disabled={isSubmitting}>
            <Minus size={14} /> Add Expense
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="page-v2-stats four-col">
        <div className="fin-stat-card">
          <div className="fin-stat-top">
            <div className="page-stat-icon" style={{ background: '#e8f0fe' }}>
              <Wallet size={18} color="#1a56db" />
            </div>
            <span className="dash-stat-change positive">+5.2%</span>
          </div>
          <p className="page-stat-label">Total Balance</p>
          <h2 className="page-stat-value">ETB {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top">
            <div className="page-stat-icon" style={{ background: '#e8f5e9' }}>
              <TrendingUp size={18} color="#16a34a" />
            </div>
            <span className="dash-stat-change positive">+12.0%</span>
          </div>
          <p className="page-stat-label">Monthly Income</p>
          <h2 className="page-stat-value">ETB {totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top">
            <div className="page-stat-icon" style={{ background: '#fef2f2' }}>
              <TrendingDown size={18} color="#dc2626" />
            </div>
            <span className="dash-stat-change negative">-2.4%</span>
          </div>
          <p className="page-stat-label">Monthly Expense</p>
          <h2 className="page-stat-value">ETB {totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
        </div>
        <div className="fin-stat-card">
          <div className="fin-stat-top">
            <div className="page-stat-icon" style={{ background: '#fef3e2' }}>
              <Target size={18} color="#d97706" />
            </div>
            <span className="fin-target-badge">Target 80%</span>
          </div>
          <p className="page-stat-label">Reserve Fund</p>
          <h2 className="page-stat-value">ETB 68,200.00</h2>
        </div>
      </div>

      {/* Chart + Budget Distribution */}
      <div className="fin-middle-grid">
        <div className="page-v2-card">
          <div className="card-header-row">
            <div>
              <h3>Monthly Spending Trend</h3>
              <p className="card-subtitle">Overview of expenses across selected period</p>
            </div>
            <div className="dash-period-toggle">
              {[1, 3, 6].map(p => (
                <button
                  key={p}
                  className={activePeriod === p ? 'active' : ''}
                  onClick={() => setActivePeriod(p)}
                >
                  {p}M
                </button>
              ))}
            </div>
          </div>
          <div className="fin-chart-container">
            <ResponsiveContainer width="100%" height="250">
              <AreaChart key={activePeriod} data={derivedExpenseData.length > 0 ? derivedExpenseData.slice(-activePeriod) : [{name: 'Empty', amount: 0}]}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a56db" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8896a6', fontSize: 12 }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(v) => `ETB ${(v / 1000).toFixed(1)}K`}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#1a56db"
                  strokeWidth={2.5}
                  fill="url(#spendGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#1a56db' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="page-v2-card">
          <h3>Budget Distribution</h3>
          <div className="budget-bars">
            {budgetDistribution.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No expenses logged yet.</p>
            ) : (
              budgetDistribution.map((item, idx) => (
                <div key={idx} className="budget-bar-item">
                  <div className="budget-bar-header">
                    <span>{item.name}</span>
                    <span className="budget-bar-percent">{item.percent}%</span>
                  </div>
                  <div className="budget-bar-track">
                    <div
                      className="budget-bar-fill"
                      style={{ width: `${item.percent}%`, background: item.color }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="btn-view-detail" onClick={() => setShowBudgetModal(true)}>View Detailed Budget</button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="page-v2-card">
        <div className="card-header-row">
          <h3>Recent Transactions</h3>
          <button
            className="view-all-link-btn"
            style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600 }}
            onClick={() => setShowAllTransactionsModal(true)}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>
        <table className="v2-table">
          <thead>
            <tr>
              <th>TRANSACTION</th>
              <th>CATEGORY</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {transactionList.map((tx, idx) => (
              <tr key={idx}>
                <td>
                  <div className="name-with-icon">
                    <div className={`tx-icon ${tx.type.toLowerCase()}`}>
                      {tx.type === 'INCOME'
                        ? <ArrowDownRight size={14} />
                        : <ArrowUpRight size={14} />
                      }
                    </div>
                    <strong>{tx.description?.split(' | Category: ')[0] || tx.description}</strong>
                  </div>
                </td>
                <td>{tx.description?.includes(' | Category: ') ? tx.description.split(' | Category: ')[1] : 'Other'}</td>
                <td>{new Date(tx.occurredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                <td>
                  <span className={`status-pill completed`}>
                    Completed
                  </span>
                </td>
                <td className={`tx-amount ${tx.type.toLowerCase()}`} style={{ textAlign: 'right' }}>
                  {tx.type === 'INCOME' ? '+' : '-'} ETB {parseFloat(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Income Modal */}
      {showIncomeModal && (
        <div className="mem-modal-overlay" onClick={() => setShowIncomeModal(false)}>
          <div className="mem-modal" onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div>
                <h2 className="mem-modal-title">Add New Income</h2>
                <p className="mem-modal-subtitle">Record a new contribution or dues payment</p>
              </div>
              <button className="mem-modal-close" onClick={() => setShowIncomeModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mem-modal-body">
              <div className="mem-form-group">
                <label className="mem-form-label">Description</label>
                <input
                  name="desc"
                  className="mem-form-input"
                  placeholder="e.g. Weekly Contribution"
                  value={formData.desc}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mem-form-row">
                <div className="mem-form-group">
                  <label className="mem-form-label">Category</label>
                  <select name="category" className="mem-form-select" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    <option value="Donation">Donation</option>
                    <option value="Dues">Dues</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mem-form-group">
                  <label className="mem-form-label">Amount (ETB)</label>
                  <input
                    name="amount"
                    type="number"
                    className="mem-form-input"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mem-form-group">
                <label className="mem-form-label">Date</label>
                <input
                  name="date"
                  type="date"
                  className="mem-form-input"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mem-modal-footer">
              <button className="btn-icon-text" style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }} onClick={() => setShowIncomeModal(false)}>Cancel</button>
              <button className="btn-accent" onClick={() => handleAddTransaction('income')}>
                Add Income
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="mem-modal-overlay" onClick={() => setShowExpenseModal(false)}>
          <div className="mem-modal" onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div>
                <h2 className="mem-modal-title">Add New Expense</h2>
                <p className="mem-modal-subtitle">Record a new expenditure or bill payment</p>
              </div>
              <button className="mem-modal-close" onClick={() => setShowExpenseModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mem-modal-body">
              <div className="mem-form-group">
                <label className="mem-form-label">Description</label>
                <input
                  name="desc"
                  className="mem-form-input"
                  placeholder="e.g. Equipment Repair"
                  value={formData.desc}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mem-form-row">
                <div className="mem-form-group">
                  <label className="mem-form-label">Category</label>
                  <select name="category" className="mem-form-select" value={formData.category} onChange={handleInputChange}>
                    <option value="">Select Category</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Events">Events</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Social Services">Social Services</option>
                  </select>
                </div>
                <div className="mem-form-group">
                  <label className="mem-form-label">Amount (ETB)</label>
                  <input
                    name="amount"
                    type="number"
                    className="mem-form-input"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="mem-form-group">
                <label className="mem-form-label">Date</label>
                <input
                  name="date"
                  type="date"
                  className="mem-form-input"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mem-modal-footer">
              <button className="btn-icon-text" style={{ background: 'var(--gray-100)', color: 'var(--text-primary)' }} onClick={() => setShowExpenseModal(false)}>Cancel</button>
              <button className="btn-accent" style={{ background: 'var(--red)' }} onClick={() => handleAddTransaction('expense')}>
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Detailed Budget Modal */}
      {showBudgetModal && (
        <div className="mem-modal-overlay" onClick={() => setShowBudgetModal(false)}>
          <div className="mem-modal" style={{ maxWidth: '650px' }} onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div>
                <h2 className="mem-modal-title">Detailed Budget Allocation</h2>
                <p className="mem-modal-subtitle">Review status and remaining funds per category</p>
              </div>
              <button className="mem-modal-close" onClick={() => setShowBudgetModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mem-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {budgetDetails.map((item, idx) => {
                  const percent = (item.spent / item.allocated) * 100
                  return (
                    <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.name}</h4>
                          <span style={{ fontSize: '0.75rem', color: item.status === 'Warning' ? 'var(--red)' : 'var(--green)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, marginTop: '2px' }}>
                            {item.status === 'Warning' ? <AlertCircle size={12} /> : <CheckCircle size={12} />}
                            {item.status}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>Remaining</span>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>ETB {item.remaining.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="budget-bar-track" style={{ height: '8px', marginBottom: '0.75rem' }}>
                        <div
                          className="budget-bar-fill"
                          style={{ width: `${percent}%`, background: item.color, height: '100%' }}
                        ></div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: 'var(--gray-50)', padding: '0.6rem', borderRadius: '6px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Allocated</span>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>ETB {item.allocated.toLocaleString()}</p>
                        </div>
                        <div style={{ background: 'var(--gray-50)', padding: '0.6rem', borderRadius: '6px' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Spent</span>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginTop: '2px' }}>ETB {item.spent.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="mem-modal-footer">
              <button className="btn-accent" onClick={() => setShowBudgetModal(false)}>Close Overview</button>
            </div>
          </div>
        </div>
      )}
      {/* View All Transactions Modal */}
      {showAllTransactionsModal && (
        <div className="mem-modal-overlay" onClick={() => setShowAllTransactionsModal(false)}>
          <div className="mem-modal" style={{ maxWidth: '900px', height: '85vh' }} onClick={e => e.stopPropagation()}>
            <div className="mem-modal-header">
              <div>
                <h2 className="mem-modal-title">Transaction History</h2>
                <p className="mem-modal-subtitle">Search and filter through all financial records</p>
              </div>
              <button className="mem-modal-close" onClick={() => setShowAllTransactionsModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="mem-modal-body" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {/* Filter Bar */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
                  <input
                    type="text"
                    className="mem-form-input"
                    placeholder="Search transactions..."
                    style={{ paddingLeft: '36px' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div style={{ width: '150px' }}>
                  <select
                    className="mem-form-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
                <div style={{ width: '180px' }}>
                  <select
                    className="mem-form-select"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <option value="All">All Categories</option>
                    <option value="Donation">Donation</option>
                    <option value="Dues">Dues</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Events">Events</option>
                    <option value="Administrative">Administrative</option>
                    <option value="Social Services">Social Services</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table Container */}
              <div className="inv-table-scroll" style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                <table className="v2-table" style={{ border: 'none' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--white)' }}>
                    <tr>
                      <th>TRANSACTION</th>
                      <th>CATEGORY</th>
                      <th>DATE</th>
                      <th>STATUS</th>
                      <th style={{ textAlign: 'right' }}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="name-with-icon">
                              <div className={`tx-icon ${tx.type.toLowerCase()}`}>
                                {tx.type === 'INCOME' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                              </div>
                              <strong>{tx.description?.split(' | Category: ')[0] || tx.description}</strong>
                            </div>
                          </td>
                          <td>{tx.description?.includes(' | Category: ') ? tx.description.split(' | Category: ')[1] : 'Other'}</td>
                          <td>{new Date(tx.occurredAt).toLocaleDateString()}</td>
                          <td><span className={`status-pill completed`}>Completed</span></td>
                          <td className={`tx-amount ${tx.type.toLowerCase()}`} style={{ textAlign: 'right' }}>
                            {tx.type === 'INCOME' ? '+' : '-'} ETB {parseFloat(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                          No transactions found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mem-modal-footer">
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: 'auto' }}>
                Showing {filteredTransactions.length} of {transactionList.length} transactions
              </span>
              <button className="btn-accent" onClick={() => setShowAllTransactionsModal(false)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Finance