import React, { useState, useEffect } from 'react'
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
  Filter
} from 'lucide-react'

const spendingData = [
  { name: 'JAN', amount: 22000 },
  { name: 'FEB', amount: 18000 },
  { name: 'MAR', amount: 28000 },
  { name: 'APR', amount: 24000 },
  { name: 'MAY', amount: 32000 },
  { name: 'JUN', amount: 26000 },
]

const budgetDistribution = [
  { name: 'Church Events', percent: 75, color: '#1a56db' },
  { name: 'Administrative', percent: 42, color: '#d97706' },
  { name: 'Social Services', percent: 60, color: '#16a34a' },
  { name: 'Maintenance', percent: 18, color: '#dc2626' },
]

const transactions = [
  { desc: 'Weekly Contribution', category: 'Donation', date: 'May 12, 2024', status: 'Completed', amount: '+ ETB 15,200.00', type: 'income' },
  { desc: 'Audio Equipment Repair', category: 'Maintenance', date: 'May 10, 2024', status: 'Completed', amount: '- ETB 3,450.00', type: 'expense' },
  { desc: 'Conference Catering', category: 'Events', date: 'May 08, 2024', status: 'Processing', amount: '- ETB 8,900.00', type: 'expense' },
  { desc: 'Member Monthly Dues', category: 'Dues', date: 'May 05, 2024', status: 'Completed', amount: '+ ETB 24,000.00', type: 'income' },
]

const Finance = () => {
  const [incomeData, setIncomeData] = useState([
    { name: 'JAN', amount: 45000 },
    { name: 'FEB', amount: 42000 },
    { name: 'MAR', amount: 48000 },
    { name: 'APR', amount: 50000 },
    { name: 'MAY', amount: 45000 },
  ])

  const [expenseData, setExpenseData] = useState([
    { name: 'JAN', amount: 22000 },
    { name: 'FEB', amount: 18000 },
    { name: 'MAR', amount: 28000 },
    { name: 'APR', amount: 24000 },
    { name: 'MAY', amount: 32000 },
    { name: 'JUN', amount: 12300 },
  ])

  const [weeklyExpenseData, setWeeklyExpenseData] = useState([
    { name: 'Week 1', amount: 2100 },
    { name: 'Week 2', amount: 4200 },
    { name: 'Week 3', amount: 3500 },
    { name: 'Week 4', amount: 2500 },
  ])

  const [transactionList, setTransactionList] = useState(transactions)
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

  const budgetDetails = [
    { name: 'Church Events', allocated: 120000, spent: 90000, remaining: 30000, color: '#1a56db', status: 'On Track' },
    { name: 'Administrative', allocated: 50000, spent: 21000, remaining: 29000, color: '#d97706', status: 'On Track' },
    { name: 'Social Services', allocated: 80000, spent: 48000, remaining: 32000, color: '#16a34a', status: 'On Track' },
    { name: 'Maintenance', allocated: 40000, spent: 32800, remaining: 7200, color: '#dc2626', status: 'Warning' },
    { name: 'Audio/Visual', allocated: 25000, spent: 15000, remaining: 10000, color: '#7c3aed', status: 'On Track' },
  ]

  // Derived Stats
  const totalIncome = transactionList
    .filter(tx => tx.type === 'income')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0), 0)

  const totalExpense = transactionList
    .filter(tx => tx.type === 'expense')
    .reduce((acc, curr) => acc + (Math.abs(parseFloat(curr.amount.replace(/[^0-9.-]+/g, ""))) || 0), 0)

  const balance = totalIncome - totalExpense

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

  const handleAddTransaction = (type) => {
    if (!formData.desc || !formData.amount || !formData.category) {
      alert('Please fill in all fields')
      return
    }

    const amountNum = parseFloat(formData.amount)
    if (isNaN(amountNum)) {
      alert('Invalid amount')
      return
    }

    const newTx = {
      desc: formData.desc,
      category: formData.category,
      date: formData.date,
      status: 'Completed',
      amount: `${type === 'income' ? '+' : '-'} ETB ${amountNum.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
      type: type
    }

    setTransactionList(prev => [newTx, ...prev])

    // Update chart data (simplified: update JUN and Week 4)
    if (type === 'expense') {
      setExpenseData(prev => prev.map(d => d.name === 'JUN' ? { ...d, amount: d.amount + amountNum } : d))
      setWeeklyExpenseData(prev => prev.map(d => d.name === 'Week 4' ? { ...d, amount: d.amount + amountNum } : d))
    }

    setShowIncomeModal(false)
    setShowExpenseModal(false)
    resetForm()
  }

  // Derived filtered transactions for the "View All" modal
  const filteredTransactions = transactionList.filter(tx => {
    const matchesSearch = tx.desc.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'All' || tx.category === filterCategory
    const matchesType = filterType === 'All' || tx.type === filterType
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="page-v2">
      {/* Header */}
      <div className="page-v2-header">
        <div>
          <h1>Finance Overview</h1>
          <p>ASTU Gibi Gubae Internal Management</p>
        </div>
        <div className="header-actions-group">
          <button className="btn-accent-outline" onClick={() => setShowIncomeModal(true)}>
            <Plus size={14} /> Add Income
          </button>
          <button className="btn-accent-dark" onClick={() => setShowExpenseModal(true)}>
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
              <AreaChart key={activePeriod} data={activePeriod === 1 ? weeklyExpenseData : expenseData.slice(-activePeriod)}>
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
            {budgetDistribution.map((item, idx) => (
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
            ))}
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
                    <div className={`tx-icon ${tx.type}`}>
                      {tx.type === 'income'
                        ? <ArrowDownRight size={14} />
                        : <ArrowUpRight size={14} />
                      }
                    </div>
                    <strong>{tx.desc}</strong>
                  </div>
                </td>
                <td>{tx.category}</td>
                <td>{tx.date}</td>
                <td>
                  <span className={`status-pill ${tx.status.toLowerCase()}`}>
                    {tx.status}
                  </span>
                </td>
                <td className={`tx-amount ${tx.type}`} style={{ textAlign: 'right' }}>
                  {tx.amount}
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
                              <div className={`tx-icon ${tx.type}`}>
                                {tx.type === 'income' ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                              </div>
                              <strong>{tx.desc}</strong>
                            </div>
                          </td>
                          <td>{tx.category}</td>
                          <td>{tx.date}</td>
                          <td><span className={`status-pill ${tx.status.toLowerCase()}`}>{tx.status}</span></td>
                          <td className={`tx-amount ${tx.type}`} style={{ textAlign: 'right' }}>{tx.amount}</td>
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