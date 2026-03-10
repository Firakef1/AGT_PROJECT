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
  description: "",
};

// ── Mock Families ────────────────────────────────────────────────────────────
export const initialFamilies = [
  {
    id: 1,
    name: "Lior Group",
    leaderId: 1,
    description: "East campus fellowship group focused on evangelism.",
    createdAt: "2022-01-15",
  },
  {
    id: 2,
    name: "Shalom Group",
    leaderId: 3,
    description: "West campus fellowship group for discipleship.",
    createdAt: "2022-03-20",
  },
  {
    id: 3,
    name: "Agape Group",
    leaderId: 5,
    description: "Graduate students fellowship centred on worship.",
    createdAt: "2022-06-10",
  },
  {
    id: 4,
    name: "Zion Group",
    leaderId: 8,
    description: "Freshmen welcome and integration fellowship.",
    createdAt: "2023-01-05",
  },
  {
    id: 5,
    name: "Eben-ezer Group",
    leaderId: 11,
    description: "Senior members accountability fellowship.",
    createdAt: "2023-04-12",
  },
];

// ── Mock Members (20 records — full field set) ───────────────────────────────
export const initialMembers = [
  {
    id: 1,
    fullName: "Abebe Kebede",
    gender: "Male",
    phone: "+251 911 223344",
    email: "abebe.k@example.com",
    birthday: "1998-03-15",
    joinDate: "2022-01-10",
    address: "Adama, Oromia",
    familyId: 1,
    role: "Media Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 2,
    fullName: "Sara Tesfaye",
    gender: "Female",
    phone: "+251 922 334455",
    email: "sara.t@example.com",
    birthday: "1999-07-22",
    joinDate: "2022-02-15",
    address: "Adama, Oromia",
    familyId: 1,
    role: "Education Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 3,
    fullName: "Samuel Yohannes",
    gender: "Male",
    phone: "+251 933 445566",
    email: "samuel.y@example.com",
    birthday: "1997-11-08",
    joinDate: "2022-03-01",
    address: "Adama, Oromia",
    familyId: 2,
    role: "Charity Team",
    status: "Inactive",
    profileImage: null,
  },
  {
    id: 4,
    fullName: "Martha Belay",
    gender: "Female",
    phone: "+251 944 556677",
    email: "martha.b@example.com",
    birthday: "2000-05-18",
    joinDate: "2022-03-15",
    address: "Addis Ababa",
    familyId: 2,
    role: "Arts Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 5,
    fullName: "Daniel Tekle",
    gender: "Male",
    phone: "+251 955 667788",
    email: "daniel.t@example.com",
    birthday: "1998-09-02",
    joinDate: "2022-06-20",
    address: "Adama, Oromia",
    familyId: 3,
    role: "Media Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 6,
    fullName: "Feven Hailu",
    gender: "Female",
    phone: "+251 966 778899",
    email: "feven.h@example.com",
    birthday: "2001-01-30",
    joinDate: "2022-07-05",
    address: "Adama, Oromia",
    familyId: 3,
    role: "Education Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 7,
    fullName: "Biruk Mekonnen",
    gender: "Male",
    phone: "+251 977 889900",
    email: "biruk.m@example.com",
    birthday: "1999-04-14",
    joinDate: "2022-08-10",
    address: "Nazareth",
    familyId: 3,
    role: "Charity Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 8,
    fullName: "Helen Tadesse",
    gender: "Female",
    phone: "+251 988 990011",
    email: "helen.t@example.com",
    birthday: "2000-12-20",
    joinDate: "2022-09-01",
    address: "Adama, Oromia",
    familyId: 4,
    role: "Arts Team",
    status: "Inactive",
    profileImage: null,
  },
  {
    id: 9,
    fullName: "Yonas Alemu",
    gender: "Male",
    phone: "+251 999 001122",
    email: "yonas.a@example.com",
    birthday: "1997-06-25",
    joinDate: "2022-10-15",
    address: "Adama, Oromia",
    familyId: 4,
    role: "Music Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 10,
    fullName: "Eden Mulugeta",
    gender: "Female",
    phone: "+251 900 112233",
    email: "eden.m@example.com",
    birthday: "1998-08-11",
    joinDate: "2022-11-20",
    address: "Addis Ababa",
    familyId: 4,
    role: "Youth Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 11,
    fullName: "Kaleb Girma",
    gender: "Male",
    phone: "+251 911 334400",
    email: "kaleb.g@example.com",
    birthday: "1999-02-07",
    joinDate: "2023-01-08",
    address: "Adama, Oromia",
    familyId: 5,
    role: "Prayer Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 12,
    fullName: "Naomi Assefa",
    gender: "Female",
    phone: "+251 922 445500",
    email: "naomi.a@example.com",
    birthday: "2000-10-19",
    joinDate: "2023-02-14",
    address: "Adama, Oromia",
    familyId: 5,
    role: "Arts Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 13,
    fullName: "Liya Bekele",
    gender: "Female",
    phone: "+251 933 556600",
    email: "liya.b@example.com",
    birthday: "1998-07-03",
    joinDate: "2023-03-05",
    address: "Adama, Oromia",
    familyId: 5,
    role: "Media Team",
    status: "Inactive",
    profileImage: null,
  },
  {
    id: 14,
    fullName: "Tsion Worku",
    gender: "Female",
    phone: "+251 944 667700",
    email: "tsion.w@example.com",
    birthday: "2001-04-28",
    joinDate: "2023-04-18",
    address: "Nazareth",
    familyId: null,
    role: "Education Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 15,
    fullName: "Mikael Gebre",
    gender: "Male",
    phone: "+251 955 778800",
    email: "mikael.g@example.com",
    birthday: "1997-09-16",
    joinDate: "2023-05-22",
    address: "Adama, Oromia",
    familyId: null,
    role: "Charity Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 16,
    fullName: "Tigist Alemu",
    gender: "Female",
    phone: "+251 966 889911",
    email: "tigist.a@example.com",
    birthday: "2000-03-12",
    joinDate: "2023-06-10",
    address: "Addis Ababa",
    familyId: null,
    role: "Youth Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 17,
    fullName: "Robel Habtamu",
    gender: "Male",
    phone: "+251 977 990022",
    email: "robel.h@example.com",
    birthday: "1999-11-27",
    joinDate: "2023-07-14",
    address: "Adama, Oromia",
    familyId: null,
    role: "Music Team",
    status: "Inactive",
    profileImage: null,
  },
  {
    id: 18,
    fullName: "Meron Teshome",
    gender: "Female",
    phone: "+251 988 001133",
    email: "meron.t@example.com",
    birthday: "2001-08-08",
    joinDate: "2023-08-20",
    address: "Adama, Oromia",
    familyId: 1,
    role: "Prayer Team",
    status: "Active",
    profileImage: null,
  },
  {
    id: 19,
    fullName: "Dawit Haile",
    gender: "Male",
    phone: "+251 999 112244",
    email: "dawit.h@example.com",
    birthday: "1998-05-21",
    joinDate: "2023-09-05",
    address: "Nazareth",
    familyId: 2,
    role: "Admin",
    status: "Active",
    profileImage: null,
  },
  {
    id: 20,
    fullName: "Hiwot Girma",
    gender: "Female",
    phone: "+251 900 223355",
    email: "hiwot.g@example.com",
    birthday: "2000-01-15",
    joinDate: "2023-10-12",
    address: "Adama, Oromia",
    familyId: null,
    role: "Media Team",
    status: "Active",
    profileImage: null,
  },
];
