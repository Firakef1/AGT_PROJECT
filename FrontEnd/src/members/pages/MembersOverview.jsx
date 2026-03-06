import React from "react";
import OverviewCards from "../components/OverviewCards";
import {
  Users,
  UserCheck,
  UsersRound,
  UserPlus,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  initialMembers,
  initialFamilies,
  getInitials,
  getAvatarStyle,
} from "../../components/members/mockData";

// ── Derive stats from mock data ───────────────────────────────────────────────
const totalMembers   = initialMembers.length;
const activeMembers  = initialMembers.filter((m) => m.status === "Active").length;
const totalFamilies  = initialFamilies.length;

// "New this month" = joined within 30 days of the latest recorded join date
const latestJoin     = initialMembers.reduce(
  (max, m) => (m.joinDate > max ? m.joinDate : max),
  ""
);
const cutoff = new Date(latestJoin);
cutoff.setDate(cutoff.getDate() - 30);
const newThisMonth = initialMembers.filter(
  (m) => new Date(m.joinDate) >= cutoff
).length;

// ── Recent activity feed ──────────────────────────────────────────────────────
const ACTIVITY = [
  {
    icon: UserPlus,
    iconBg: "#e8f0fe",
    iconColor: "#1a56db",
    title: "New Member Added",
    desc: "Hiwot Girma joined the fellowship.",
    time: "2 DAYS AGO",
  },
  {
    icon: UsersRound,
    iconBg: "#fef3e2",
    iconColor: "#d97706",
    title: "Family Group Updated",
    desc: "Eben-ezer Group added 2 new members.",
    time: "4 DAYS AGO",
  },
  {
    icon: UserCheck,
    iconBg: "#dcfce7",
    iconColor: "#16a34a",
    title: "Status Updated",
    desc: "3 members marked Active after follow-up.",
    time: "1 WEEK AGO",
  },
  {
    icon: Users,
    iconBg: "#f3e8ff",
    iconColor: "#7c3aed",
    title: "Profile Edited",
    desc: "Dawit Haile's role updated to Admin.",
    time: "1 WEEK AGO",
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────
const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * MembersOverview
 *
 * The first page users see in the Members Division Dashboard.
 * Shows summary stat cards, the 5 most-recently-joined members,
 * and a recent activity feed.
 *
 * Props:
 *   onNavigate {function} – navigate to another dashboard page
 */
const MembersOverview = ({ onNavigate }) => {
  // ── Stat cards config ─────────────────────────────────────────────────────
  const cards = [
    {
      title:      "Total Members",
      value:      String(totalMembers),
      change:     "+5%",
      changeType: "positive",
      icon:       Users,
      iconBg:     "#e8f0fe",
      iconColor:  "#1a56db",
      onClick:    () => onNavigate("members"),
    },
    {
      title:      "Active Members",
      value:      String(activeMembers),
      change:     "+3%",
      changeType: "positive",
      icon:       UserCheck,
      iconBg:     "#dcfce7",
      iconColor:  "#16a34a",
      onClick:    () => onNavigate("members"),
    },
    {
      title:      "Families / Groups",
      value:      String(totalFamilies),
      change:     "0%",
      changeType: "neutral",
      icon:       UsersRound,
      iconBg:     "#fef3e2",
      iconColor:  "#d97706",
      onClick:    () => onNavigate("families"),
    },
    {
      title:      "New This Month",
      value:      String(newThisMonth),
      change:     `+${newThisMonth}`,
      changeType: "positive",
      icon:       UserPlus,
      iconBg:     "#f3e8ff",
      iconColor:  "#7c3aed",
      onClick:    () => onNavigate("members"),
    },
  ];

  // ── 5 most recently joined members ───────────────────────────────────────
  const recentMembers = [...initialMembers]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
    .slice(0, 5);

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
                      member.status === "Active" ? "active" : "inactive"
                    }`}
                  >
                    {member.status}
                  </span>

                  {/* Join date */}
                  <div className="members-recent-date">
                    <Clock size={11} />
                    <span>{formatDate(member.joinDate)}</span>
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
