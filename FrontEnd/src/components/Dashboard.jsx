import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Building2,
  Wallet,
  PackageCheck,
  UserPlus,
  ClipboardCheck,
  AlertTriangle,
  FileBarChart,
  ArrowUpRight,
  X,
  Loader2
} from "lucide-react";
import { apiFetch } from "../services/apiFetch.js";

const iconMap = {
  UserPlus: UserPlus,
  Building2: Building2,
  Wallet: Wallet,
  PackageCheck: PackageCheck,
  ClipboardCheck: ClipboardCheck,
  AlertTriangle: AlertTriangle,
  FileBarChart: FileBarChart,
  Users: Users
};

const Dashboard = ({ setActivePage }) => {
  const [chartPeriod, setChartPeriod] = useState("year");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [dashboardData, setDashboardData] = useState({ 
    members: 0, 
    events: 0, 
    inventory: 0, 
    finance: { income: 0, expenses: 0, balance: 0 } 
  });
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState({ monthly: [], yearly: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsData, activitiesData, chartDataRes] = await Promise.all([
          apiFetch("/dashboard/summary"),
          apiFetch("/dashboard/activities"),
          apiFetch("/dashboard/chart").catch(() => ({ monthly: [], yearly: [] })),
        ]);
        setDashboardData(statsData);
        setActivities(activitiesData || []);
        setChartData(chartDataRes?.monthly ? chartDataRes : { monthly: [], yearly: [] });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartSeries = chartPeriod === "month" 
    ? (chartData.monthly || []) 
    : (chartData.yearly || []);

  const summaryCards = [
    {
      title: "Total Members",
      value: dashboardData.members.toLocaleString(),
      change: "Active",
      changeType: "positive",
      icon: Users,
      iconBg: "#e8f0fe",
      iconColor: "#1a56db",
      page: "members",
    },
    {
      title: "Balance",
      value: `${dashboardData.finance.balance.toLocaleString('en-US')} ETB`,
      change: "Available",
      changeType: "positive",
      icon: Wallet,
      iconBg: "#e8f5e9",
      iconColor: "#16a34a",
      page: "finance",
    },
    {
      title: "Total Events",
      value: dashboardData.events.toString(),
      change: "Planned",
      changeType: "neutral",
      icon: Building2,
      iconBg: "#fef3e2",
      iconColor: "#d97706",
      page: "events",
    },
    {
      title: "Inventory",
      value: dashboardData.inventory.toString(),
      change: "Items Tracker",
      changeType: "neutral",
      icon: PackageCheck,
      iconBg: "#fce4ec",
      iconColor: "#dc2626",
      page: "inventory",
    },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loader2 className="spin" size={48} />
    </div>
  );

  return (
    <div className="dashboard-v2">
      {/* Welcome Section */}
      <div className="dash-welcome">
        <h1>Welcome to GubaeTech</h1>
        <p>Internal management overview for ASTU Gibi Gubae.</p>
      </div>

      {/* Summary Cards */}
      <div className="dash-summary-cards">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="dash-stat-card dash-stat-card--clickable"
              onClick={() => setActivePage(card.page)}
              title={`Go to ${card.title}`}
            >
              <div className="dash-stat-card-top">
                <div
                  className="dash-stat-icon"
                  style={{ background: card.iconBg }}
                >
                  <Icon size={22} color={card.iconColor} />
                </div>
                <span className={`dash-stat-change ${card.changeType}`}>
                  {card.change}
                </span>
              </div>
              <p className="dash-stat-label">{card.title}</p>
              <h2 className="dash-stat-value">{card.value}</h2>
            </div>
          );
        })}
      </div>

      {/* Middle Section: Chart + Activities */}
      <div className="dash-middle-grid">
        {/* Financial Overview */}
        <div className="dash-chart-card">
          <div className="dash-chart-header">
            <div>
              <h3>Financial Overview</h3>
              <p className="dash-chart-subtitle">Income vs Expenses trend</p>
            </div>
            <div className="dash-period-toggle">
              <button className="active">All Time</button>
            </div>
          </div>
          <div className="dash-chart-amount">
            <h2>{dashboardData.finance.balance.toLocaleString('en-US')} ETB</h2>
            <span className="dash-chart-percent positive">
              <ArrowUpRight size={14} /> Available Balance
            </span>
          </div>
          <div className="dash-chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartSeries.length > 0 ? chartSeries : [{ name: 'Total', income: dashboardData.finance.income, expenses: dashboardData.finance.expenses }]}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a56db" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8896a6", fontSize: 12 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "10px",
                    border: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value) => `${(value / 1000).toFixed(0)}K ETB`}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#1a56db"
                  strokeWidth={2.5}
                  fill="url(#incomeGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#1a56db" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="dash-activities-card">
          <div className="dash-activities-header">
            <h3>Recent Activities</h3>
            <button
              className="dash-view-all"
              onClick={() => setShowAllActivities(true)}
            >
              View All
            </button>
          </div>
          <div className="dash-activities-list">
            {activities.length === 0 ? (
              <div className="dash-empty-state">
                <FileBarChart size={32} color="#cbd5e1" />
                <p>No recent activities found.</p>
              </div>
            ) : (
              activities.slice(0, 4).map((activity, idx) => {
                const Icon = iconMap[activity.icon] || ClipboardCheck;
                return (
                  <div key={idx} className="dash-activity-item">
                    <div
                      className="dash-activity-icon"
                      style={{ background: activity.iconBg }}
                    >
                      <Icon size={18} color={activity.iconColor} />
                    </div>
                    <div className="dash-activity-content">
                      <h4>{activity.title}</h4>
                      <p>{activity.description}</p>
                      <span className="dash-activity-time">{activity.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="dash-bottom-grid">
        <div
          className="dash-bottom-card dash-division-card dash-bottom-card--clickable"
          onClick={() => setActivePage("divisions")}
          title="Go to Divisions"
        >
          <div className="dash-bottom-card-content">
            <h3>Division Management</h3>
            <p>Assign tasks and manage members across {dashboardData.divisions || 0} active divisions.</p>
          </div>
          <div className="dash-bottom-card-icon">
            <Building2 size={40} color="rgba(255,255,255,0.3)" />
          </div>
        </div>
        <div
          className="dash-bottom-card dash-health-card dash-bottom-card--clickable"
          onClick={() => setActivePage("settings")}
          title="Go to Settings"
        >
          <div className="dash-bottom-card-content">
            <h3>System Health</h3>
            <p>
              <span className="dash-health-dot"></span>
              All services operational
            </p>
          </div>
          <div className="dash-bottom-card-icon">
            <PackageCheck size={40} color="rgba(255,255,255,0.3)" />
          </div>
        </div>
      </div>

      {/* ── All Activities Modal ── */}
      {showAllActivities && (
        <div
          className="activities-modal-overlay"
          onClick={() => setShowAllActivities(false)}
        >
          <div
            className="activities-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="activities-modal-header">
              <div>
                <h3>All Activities</h3>
                <p className="activities-modal-subtitle">
                  {allActivities.length} total events recorded
                </p>
              </div>
              <button
                className="activities-modal-close"
                onClick={() => setShowAllActivities(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="activities-modal-body">
              {activities.length === 0 ? (
                 <div className="dash-empty-state" style={{ marginTop: '40px', textAlign: 'center' }}>
                   <p>No activities have been recorded yet.</p>
                 </div>
              ) : (
                activities.map((activity, idx) => {
                  const Icon = iconMap[activity.icon] || ClipboardCheck;
                  return (
                    <div
                      key={idx}
                      className="dash-activity-item activities-modal-item"
                    >
                      <div
                        className="dash-activity-icon"
                        style={{ background: activity.iconBg }}
                      >
                        <Icon size={18} color={activity.iconColor} />
                      </div>
                      <div className="dash-activity-content">
                        <h4>{activity.title}</h4>
                        <p>{activity.description}</p>
                        <span className="dash-activity-time">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
