// ── Avatar colour palette (cycles by member id) ────────────────────────────
export const avatarPalette = [
  { color: "#1a56db", bg: "#e8f0fe" },
  { color: "#16a34a", bg: "#dcfce7" },
  { color: "#d97706", bg: "#fff3cd" },
  { color: "#7c3aed", bg: "#f3e8ff" },
  { color: "#dc2626", bg: "#fef2f2" },
  { color: "#0891b2", bg: "#e0f2fe" },
  { color: "#059669", bg: "#d1fae5" },
  { color: "#92400e", bg: "#fef3e2" },
];

export const getAvatarStyle = (id) => {
  if (typeof id === 'string') {
    // Simple hash for string IDs (UUIDs)
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarPalette[Math.abs(hash) % avatarPalette.length];
  }
  return avatarPalette[(id - 1) % avatarPalette.length];
};

/** Derives two-letter initials from a full name */
export const getInitials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

// ── Role colour map ─────────────────────────────────────────────────────────
export const roleColors = {
  ADMIN:           { color: "#1e40af", bg: "#dbeafe" },
  MEMBERS_MANAGER: { color: "#7c3aed", bg: "#f5f3ff" },
  DIVISION_HEAD:   { color: "#0891b2", bg: "#ecfeff" },
  MEMBER:          { color: "#4b5563", bg: "#f3f4f6" },
};

/** All selectable roles for form dropdowns */
export const ALL_ROLES = Object.keys(roleColors);

/** All selectable statuses */
export const ALL_STATUSES = ["PENDING", "APPROVED", "REJECTED"];

/** All selectable genders (value for API, label for display) */
export const ALL_GENDERS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

/** Language options for member forms (checkboxes: can select one or both) */
export const LANGUAGE_OPTIONS = [
  { value: "AFAN_OROMO", label: "Afan Oromo" },
  { value: "AMHARIC", label: "Amharic" },
];

// ── Blank form template for MemberFormModal ─────────────────────────────────
export const EMPTY_MEMBER_FORM = {
  fullName:     "",
  studentId:    "",
  gender:       "MALE",
  phone:        "",
  email:        "",
  birthday:     "",
  joinDate:     "",
  address:      "",
  divisionId:   null, // using divisionId for familyId in frontend due to legacy mapping, need to be careful
  familyRole:   "CHILD",
  role:         "MEMBER",
  status:       "PENDING",
  profileImage: null,
  section:      null,
  language:     null,
};

// ── Blank form template for FamilyModal ─────────────────────────────────────
export const EMPTY_FAMILY_FORM = {
  name:        "",
  leaderId:    null,
  fatherId:    null,
  motherId:    null,
  description: "",
};

