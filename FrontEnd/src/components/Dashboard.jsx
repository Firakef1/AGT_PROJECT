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

const monthlyData = [
  { name: "JAN", income: 180000, expenses: 120000 },
  { name: "FEB", income: 150000, expenses: 140000 },
  { name: "MAR", income: 280000, expenses: 180000 },
  { name: "APR", income: 320000, expenses: 220000 },
  { name: "MAY", income: 480000, expenses: 350000 },
  { name: "JUN", income: 542000, expenses: 380000 },
];

const yearlyData = [
  { name: "2021", income: 1200000, expenses: 900000 },
  { name: "2022", income: 1800000, expenses: 1200000 },
  { name: "2023", income: 2400000, expenses: 1600000 },
  { name: "2024", income: 3200000, expenses: 2100000 },
  { name: "2025", income: 4500000, expenses: 2800000 },
  { name: "2026", income: 5420000, expenses: 3200000 },
];

// Preview list shown on the dashboard card (latest 4)
const recentActivities = [
  {
    icon: UserPlus,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
    title: "New Member Joined",
    description: "Abebe Kebede joined Gospel Division.",
    time: "2 HOURS AGO",
  },
  {
    icon: ClipboardCheck,
    iconBg: "#e8f5e9",
    iconColor: "#16a34a",
    title: "Budget Approved",
    description: "Monthly budget for Media team finalized.",
    time: "YESTERDAY",
  },
  {
    icon: AlertTriangle,
    iconBg: "#fff3cd",
    iconColor: "#d97706",
    title: "Low Inventory Alert",
    description: "Sound system cables need replacement.",
    time: "3 DAYS AGO",
  },
  {
    icon: FileBarChart,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
    title: "Quarterly Report Generated",
    description: "Q3 management report is ready for review.",
    time: "4 DAYS AGO",
  },
];

// Full activity log shown in the "View All" modal
const allActivities = [
  {
    icon: UserPlus,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
    title: "New Member Joined",
    description: "Abebe Kebede joined Gospel Division.",
    time: "2 HOURS AGO",
  },
  {
    icon: ClipboardCheck,
    iconBg: "#e8f5e9",
    iconColor: "#16a34a",
    title: "Budget Approved",
    description: "Monthly budget for Media team finalized.",
    time: "YESTERDAY",
  },
  {
    icon: AlertTriangle,
    iconBg: "#fff3cd",
    iconColor: "#d97706",
    title: "Low Inventory Alert",
    description: "Sound system cables need replacement.",
    time: "3 DAYS AGO",
  },
  {
    icon: FileBarChart,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
    title: "Quarterly Report Generated",
    description: "Q3 management report is ready for review.",
    time: "4 DAYS AGO",
  },
  {
    icon: Users,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
    title: "Division Meeting Scheduled",
    description: "Youth Division quarterly meeting set for Friday.",
    time: "5 DAYS AGO",
  },
  {
    icon: Wallet,
    iconBg: "#e8f5e9",
    iconColor: "#16a34a",
    title: "Expense Submitted",
    description: "Media team submitted 12,000 ETB expense report.",
    time: "6 DAYS AGO",
  },
  {
    icon: PackageCheck,
    iconBg: "#fce4ec",
    iconColor: "#dc2626",
    title: "Inventory Updated",
    description: "Projector set added to inventory by store keeper.",
    time: "1 WEEK AGO",
  },
  {
    icon: UserPlus,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
    title: "New Member Joined",
    description: "Tigist Alemu joined Media Division.",
    time: "1 WEEK AGO",
  },
  {
    icon: ClipboardCheck,
    iconBg: "#e8f5e9",
    iconColor: "#16a34a",
    title: "Report Reviewed",
    description: "Q2 finance report reviewed and approved by management.",
    time: "2 WEEKS AGO",
  },
  {
    icon: Building2,
    iconBg: "#fef3e2",
    iconColor: "#d97706",
    title: "New Division Created",
    description: "Prayer & Intercession Division officially launched.",
    time: "2 WEEKS AGO",
  },
  {
    icon: FileBarChart,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
    title: "Annual Budget Drafted",
    description: "Finance committee completed the 2026 budget draft.",
    time: "3 WEEKS AGO",
  },
  {
    icon: AlertTriangle,
    iconBg: "#fff3cd",
    iconColor: "#d97706",
    title: "Maintenance Scheduled",
    description: "Sound equipment maintenance booked for next week.",
    time: "3 WEEKS AGO",
  },
];

const Dashboard = ({ setActivePage }) => {
  const [chartPeriod, setChartPeriod] = useState("year");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [stats, setStats] = useState({ members: 0, divisions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [members, divisions] = await Promise.all([
          apiFetch("/members"),
          apiFetch("/divisions")
        ]);
        setStats({
          members: members.length,
          divisions: divisions.length
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const chartData = chartPeriod === "month" ? monthlyData : yearlyData;

  const summaryCards = [
    {
      title: "Total Members",
      value: stats.members.toLocaleString(),
      change: "+0%",
      changeType: "neutral",
      icon: Users,
      iconBg: "#e8f0fe",
      iconColor: "#1a56db",
      page: "members",
    },
    {
      title: "Total Divisions",
      value: stats.divisions.toString(),
      change: "0%",
      changeType: "neutral",
      icon: Building2,
      iconBg: "#fef3e2",
      iconColor: "#d97706",
      page: "divisions",
    },
    {
      title: "Monthly Budget",
      value: "45,000 ETB",
      change: "+12%",
      changeType: "positive",
      icon: Wallet,
      iconBg: "#e8f5e9",
      iconColor: "#16a34a",
      page: "finance",
    },
    {
      title: "Inventory Status",
      value: "Optimal",
      change: "-2%",
      changeType: "negative",
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
              <button
                className={chartPeriod === "month" ? "active" : ""}
                onClick={() => setChartPeriod("month")}
              >
                Month
              </button>
              <button
                className={chartPeriod === "year" ? "active" : ""}
                onClick={() => setChartPeriod("year")}
              >
                Year
              </button>
            </div>
          </div>
          <div className="dash-chart-amount">
            <h2>542,000 ETB</h2>
            <span className="dash-chart-percent">
              <ArrowUpRight size={14} /> 15%
            </span>
          </div>
          <div className="dash-chart-container">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData}>
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
            {recentActivities.map((activity, idx) => {
              const Icon = activity.icon;
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
            })}
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
            <p>Assign tasks and manage members across {stats.divisions} active divisions.</p>
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
              {allActivities.map((activity, idx) => {
                const Icon = activity.icon;
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
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
