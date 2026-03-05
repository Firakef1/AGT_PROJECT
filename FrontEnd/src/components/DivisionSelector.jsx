import React, { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  GraduationCap,
  Palette,
  Users,
  ChevronDown,
  Check,
} from "lucide-react";

// ── Division registry ──────────────────────────────────────────────────────────
// Add more divisions here as they become available — the dropdown will scale
// automatically without any layout changes on the login page.
const DIVISIONS = [
  {
    value: "administrative",
    label: "Administrative",
    icon: LayoutDashboard,
    status: "live", // routes to dashboard
  },
  {
    value: "members",
    label: "Members",
    icon: Users,
    status: "live", // routes to members page
  },
  {
    value: "education",
    label: "Education",
    icon: GraduationCap,
    status: "soon", // routes to ComingSoon placeholder
  },
  {
    value: "arts",
    label: "Arts",
    icon: Palette,
    status: "soon", // routes to ComingSoon placeholder
  },
];

/**
 * DivisionSelector
 *
 * A compact collapsible dropdown placed above the Sign In button.
 * Only the selected division is visible at rest — the full list expands
 * on click and collapses when the user picks an option or clicks away.
 *
 * Props:
 *   value    {string}   – currently selected division value
 *   onChange {function} – called with the new division value on selection
 */
const DivisionSelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef(null);

  // Derive the currently selected division object for the trigger display
  const selected = DIVISIONS.find((d) => d.value === value) ?? DIVISIONS[0];
  const SelectedIcon = selected.icon;

  // Close the dropdown when the user clicks anywhere outside the component
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (!wrapRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const handleSelect = (divValue) => {
    onChange(divValue);
    setIsOpen(false);
  };

  return (
    <div className="div-selector-wrap" ref={wrapRef}>
      {/* Label — same font weight / size as other form-group labels */}
      <label className="div-selector-label">Select Division</label>

      {/* ── Trigger button ── */}
      <button
        type="button"
        className={`div-trigger ${isOpen ? "div-trigger--open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected division: ${selected.label}. Click to change.`}
      >
        {/* Selected division icon */}
        <SelectedIcon
          size={15}
          className="div-trigger__icon"
          aria-hidden="true"
        />

        {/* Selected division name */}
        <span className="div-trigger__label">{selected.label}</span>

        {/* "Soon" badge — visible when a coming-soon division is selected */}
        {selected.status === "soon" && (
          <span className="div-badge" aria-label="Coming soon">
            Soon
          </span>
        )}

        {/* Chevron — rotates 180° when the dropdown is open */}
        <ChevronDown
          size={15}
          className={`div-trigger__chevron ${isOpen ? "div-trigger__chevron--open" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* ── Dropdown panel ── */}
      {isOpen && (
        <ul
          className="div-dropdown"
          role="listbox"
          aria-label="Division options"
        >
          {DIVISIONS.map((div) => {
            const Icon = div.icon;
            const isActive = div.value === value;
            const isSoon = div.status === "soon";

            return (
              <li key={div.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={[
                    "div-dropdown-item",
                    isActive ? "div-dropdown-item--active" : "",
                    isSoon ? "div-dropdown-item--soon" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSelect(div.value)}
                  title={isSoon ? `${div.label} — Coming Soon` : div.label}
                >
                  {/* Small icon bubble */}
                  <span
                    className="div-dropdown-item__icon-wrap"
                    aria-hidden="true"
                  >
                    <Icon size={14} />
                  </span>

                  {/* Division name */}
                  <span className="div-dropdown-item__label">{div.label}</span>

                  {/* Coming-soon badge */}
                  {isSoon && <span className="div-badge">Soon</span>}

                  {/* Checkmark for the currently selected option */}
                  {isActive && (
                    <Check
                      size={13}
                      className="div-dropdown-item__check"
                      aria-label="Selected"
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Hint line — only shown when a coming-soon division is selected */}
      {selected.status === "soon" && (
        <p className="div-selector-hint">
          Coming soon — you'll land on a preview page after signing in.
        </p>
      )}
    </div>
  );
};

export default DivisionSelector;
