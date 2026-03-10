import React, { useState, useEffect } from "react";
import OverviewCards from "../components/OverviewCards";
import {
  Users,
  UserCheck,
  UsersRound,
  UserPlus,
  ArrowRight,
  Clock,
  Loader2
} from "lucide-react";
import { apiFetch } from "../../services/apiFetch";
import {
  getInitials,
  getAvatarStyle,
} from "../../components/members/mockData";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MembersOverview = ({ user, onNavigate }) => {
  const [members, setMembers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, d] = await Promise.all([
          apiFetch("/members"),
          apiFetch("/divisions")
        ]);
        setMembers(m);
        setDivisions(d);
      } catch (err) {
        console.error("Failed to fetch overview data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
      <Loader2 className="spin" size={32} />
    </div>
  );

  const totalMembers = members.length;
  const approvedMembers = members.filter(m => m.status === 'APPROVED').length;
  const totalDivisions = divisions.length;
  
  // Recent 5 members
  const recentMembers = [...members]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const cards = [
    {
      title:      "Total Registered",
      value:      String(totalMembers),
      change:     String(members.filter(m => m.status === 'PENDING').length),
      changeType: "neutral",
      icon:       Users,
      iconBg:     "#e8f0fe",
      iconColor:  "#1a56db",
      onClick:    () => onNavigate("members"),
    },
    {
      title:      "Approved Members",
      value:      String(approvedMembers),
      change:     "Live",
      changeType: "positive",
      icon:       UserCheck,
      iconBg:     "#dcfce7",
      iconColor:  "#16a34a",
      onClick:    () => onNavigate("members"),
    },
    {
      title:      "Divisions",
      value:      String(totalDivisions),
      change:     "Active",
      changeType: "neutral",
      icon:       UsersRound,
      iconBg:     "#fef3e2",
      iconColor:  "#d97706",
      onClick:    () => onNavigate("families"),
    },
    {
      title:      "New Requests",
      value:      String(members.filter(m => m.status === 'PENDING').length),
      change:     "Pending",
      changeType: "negative",
      icon:       UserPlus,
      iconBg:     "#f3e8ff",
      iconColor:  "#7c3aed",
      onClick:    () => onNavigate("members"),
    },
  ];

  // ── Activity (Placeholder for now) ──
  const ACTIVITY = [
    {
      icon: UserPlus,
      iconBg: "#e8f0fe",
      iconColor: "#1a56db",
      title: "System Online",
      desc: "Members Division portal is live.",
      time: "JUST NOW",
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="members-overview">

      {/* Welcome heading */}
      <div className="members-overview-welcome">
        <h1>Members Division Dashboard</h1>
        <p>
          Manage your congregation members, family groups, and ministry
          activities from one place.
        </p>
      </div>

      {/* ── Summary cards ── */}
      <OverviewCards cards={cards} />

      {/* ── Bottom grid: Recent Members + Recent Activity ── */}
      <div className="members-overview-grid">

        {/* Recent Members */}
        <div className="members-overview-card">
          <div className="members-card-header">
            <div>
              <h3>Recent Members</h3>
              <p className="members-card-subtitle">
                Latest additions to the fellowship
              </p>
            </div>
            <button
              className="members-view-all-btn"
              onClick={() => onNavigate("members")}
            >
              View All <ArrowRight size={13} />
            </button>
          </div>

          <div className="members-recent-list">
            {recentMembers.map((member) => {
              const style    = getAvatarStyle(member.id);
              const initials = getInitials(member.fullName);
              return (
                <div key={member.id} className="members-recent-item">
                  {/* Avatar */}
                  <div
                    className="members-recent-avatar"
                    style={{ background: style.bg, color: style.color, fontWeight: 700 }}
                  >
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="members-recent-info">
                    <p className="members-recent-name">{member.fullName}</p>
                    <p className="members-recent-meta">{member.role}</p>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`members-recent-badge ${
                      member.status === "APPROVED" ? "active" : "inactive"
                    }`}
                  >
                    {member.status}
                  </span>

                  {/* Join date */}
                  <div className="members-recent-date">
                    <Clock size={11} />
                    <span>{formatDate(member.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="members-overview-card">
          <div className="members-card-header">
            <div>
              <h3>Recent Activity</h3>
              <p className="members-card-subtitle">
                Latest changes in the system
              </p>
            </div>
          </div>

          <div className="members-activity-list">
            {ACTIVITY.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="members-activity-item">
                  <div
                    className="members-activity-icon"
                    style={{ background: item.iconBg }}
                  >
                    <Icon size={15} color={item.iconColor} />
                  </div>
                  <div className="members-activity-content">
                    <p className="members-activity-title">{item.title}</p>
                    <p className="members-activity-desc">{item.desc}</p>
                    <span className="members-activity-time">{item.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MembersOverview;
