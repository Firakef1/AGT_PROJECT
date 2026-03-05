import React from 'react'
import { Rocket, ArrowLeft, Clock, Sparkles } from 'lucide-react'

// ── Per-division metadata ──────────────────────────────────────────────────────
// Drives the colour palette, descriptive text, and feature preview list shown
// on the placeholder page for each unimplemented division.
const DIVISION_META = {
  education: {
    label:       'Education Division',
    tagline:     'Empowering minds through structured learning.',
    description:
      'Course management, learning resources, and member progress tracking ' +
      'for the Education team are actively being developed.',
    color:  '#16a34a',
    bg:     '#dcfce7',
    border: '#bbf7d0',
    features: [
      'Course & curriculum management',
      'Member learning progress tracker',
      'Resource library & file sharing',
      'Attendance & assignment records',
    ],
  },
  arts: {
    label:       'Arts Division',
    tagline:     'Celebrating creativity in the community.',
    description:
      'Creative project coordination, event management, and talent tracking ' +
      'for the Arts team are actively being developed.',
    color:  '#7c3aed',
    bg:     '#f3e8ff',
    border: '#e9d5ff',
    features: [
      'Creative project workspace',
      'Event & performance scheduling',
      'Talent profiles & portfolios',
      'Media gallery & asset store',
    ],
  },
}

// Fallback for any unknown division key passed in
const FALLBACK_META = {
  label:       'Division Portal',
  tagline:     'Under active development.',
  description: 'This section is currently being built and will be available soon.',
  color:  '#1a56db',
  bg:     '#e8f0fe',
  border: '#bfdbfe',
  features: [
    'Full feature set coming soon',
    'Stay tuned for updates',
  ],
}

/**
 * ComingSoon
 *
 * A portal-themed placeholder page rendered when the user selects an
 * unimplemented division (e.g. "education" or "arts") at the login screen.
 *
 * Props:
 *   division   {string}   – the division key (e.g. "education")
 *   onNavigate {function} – called with a page key to navigate away
 *                           (connected to App.jsx setActivePage)
 */
const ComingSoon = ({ division, onNavigate }) => {
  const meta = DIVISION_META[division] ?? FALLBACK_META

  return (
    <div
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        minHeight:      '72vh',
        padding:        '2.5rem 1.5rem',
        textAlign:      'center',
        gap:            '1.75rem',
      }}
    >
      {/* ── Hero icon bubble ── */}
      <div
        style={{
          width:          96,
          height:         96,
          borderRadius:   '50%',
          background:     meta.bg,
          border:         `2px solid ${meta.border}`,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          boxShadow:      `0 8px 24px ${meta.color}22`,
          flexShrink:     0,
        }}
      >
        <Rocket size={40} color={meta.color} />
      </div>

      {/* ── Headline block ── */}
      <div style={{ maxWidth: 460 }}>
        <h1
          style={{
            fontSize:     '1.75rem',
            fontWeight:   700,
            color:        'var(--text-primary)',
            marginBottom: '0.35rem',
            lineHeight:   1.2,
          }}
        >
          {meta.label}
        </h1>

        <p
          style={{
            fontSize:     '0.95rem',
            fontWeight:   500,
            color:        meta.color,
            marginBottom: '0.85rem',
          }}
        >
          {meta.tagline}
        </p>

        <p
          style={{
            fontSize:    '0.875rem',
            color:       'var(--text-secondary)',
            lineHeight:  1.7,
          }}
        >
          {meta.description}
        </p>
      </div>

      {/* ── "Coming Soon" status badge ── */}
      <div
        style={{
          display:        'inline-flex',
          alignItems:     'center',
          gap:            '0.5rem',
          padding:        '0.45rem 1.25rem',
          background:     meta.bg,
          color:          meta.color,
          borderRadius:   '20px',
          fontSize:       '0.8rem',
          fontWeight:     700,
          letterSpacing:  '0.07em',
          textTransform:  'uppercase',
          border:         `1px solid ${meta.border}`,
        }}
      >
        <Clock size={13} />
        Coming Soon
      </div>

      {/* ── Planned features preview card ── */}
      <div
        style={{
          background:   'var(--white)',
          border:       '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding:      '1.25rem 1.5rem',
          maxWidth:     400,
          width:        '100%',
          boxShadow:    'var(--shadow-sm)',
          textAlign:    'left',
        }}
      >
        {/* Card header */}
        <div
          style={{
            display:      'flex',
            alignItems:   'center',
            gap:          '0.5rem',
            marginBottom: '0.85rem',
          }}
        >
          <Sparkles size={15} color={meta.color} />
          <span
            style={{
              fontSize:      '0.75rem',
              fontWeight:    700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color:         'var(--text-light)',
            }}
          >
            Planned Features
          </span>
        </div>

        {/* Feature list */}
        <ul
          style={{
            listStyle: 'none',
            margin:    0,
            padding:   0,
            display:   'flex',
            flexDirection: 'column',
            gap:       '0.55rem',
          }}
        >
          {meta.features.map((feature, idx) => (
            <li
              key={idx}
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        '0.6rem',
                fontSize:   '0.855rem',
                color:      'var(--text-secondary)',
              }}
            >
              {/* Coloured bullet dot */}
              <span
                style={{
                  width:        7,
                  height:       7,
                  borderRadius: '50%',
                  background:   meta.color,
                  flexShrink:   0,
                  opacity:      0.7,
                }}
              />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Action buttons ── */}
      <div
        style={{
          display: 'flex',
          gap:     '0.75rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Primary: go to dashboard */}
        <button
          className="btn-accent-dark"
          onClick={() => onNavigate('dashboard')}
          style={{ minWidth: 160 }}
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </button>

        {/* Secondary: go to members page (always available) */}
        <button
          className="btn-outline-dark"
          onClick={() => onNavigate('members')}
          style={{ minWidth: 160 }}
        >
          Go to Members
        </button>
      </div>

      {/* ── Footer note ── */}
      <p
        style={{
          fontSize:  '0.78rem',
          color:     'var(--text-light)',
          maxWidth:  360,
          lineHeight: 1.6,
        }}
      >
        You can navigate to any available section using the sidebar at any time.
        This page will be replaced once the division is fully launched.
      </p>
    </div>
  )
}

export default ComingSoon
