# GubaeTech — Frontend

> Internal Management Portal for **ASTU Gibi Gubae**  
> Built with React 19 + Vite 7 · All data is currently mocked · No backend connected yet

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Application Architecture](#5-application-architecture)
6. [Routing & Navigation](#6-routing--navigation)
7. [Pages & Features — Public Layer](#7-pages--features--public-layer)
8. [Pages & Features — Administrative Portal](#8-pages--features--administrative-portal)
9. [Pages & Features — Members Division Dashboard](#9-pages--features--members-division-dashboard)
10. [Design System](#10-design-system)
11. [Mock Data Reference](#11-mock-data-reference)
12. [Data Shapes (API Contract)](#12-data-shapes-api-contract)
13. [API Endpoints the Frontend Needs](#13-api-endpoints-the-frontend-needs)
14. [Authentication Flow](#14-authentication-flow)
15. [Current State & Known Gaps](#15-current-state--known-gaps)
16. [Backend Integration Checklist](#16-backend-integration-checklist)

---

## 1. Project Overview

GubaeTech is a **multi-portal internal management system** for ASTU Gibi Gubae (a university church fellowship). The platform is designed around the concept of **division-based access**: when a leader logs in they select their division, and the system routes them into the appropriate management environment.

The frontend is **fully implemented and functional with mock data**. Every CRUD operation, every modal, every chart, and every table works end-to-end inside the browser using local React state seeded from hardcoded JavaScript files. The backend team's job is to replace those mock data sources with real API calls — the UI does not need to change.

### What is built

| Area | Status |
|---|---|
| Public landing page | ✅ Complete |
| Login with division selector | ✅ Complete |
| Administrative portal shell (sidebar + topnav) | ✅ Complete |
| Dashboard overview | ✅ Complete |
| Division management | ✅ Complete |
| Member management (table, add, edit, delete, view profile) | ✅ Complete |
| Family / group management | ✅ Complete |
| Finance (transactions, charts, budget) | ✅ Complete |
| Inventory management | ✅ Complete |
| Reports (generation, preview, export) | ✅ Complete |
| System settings | ✅ Complete |
| Members Division Dashboard (separate portal) | ✅ Complete |
| Attendance module | 🚧 Placeholder |
| Events module | 🚧 Placeholder |
| Notifications module | 🚧 Placeholder |
| Education Division portal | 🚧 Placeholder |
| Arts Division portal | 🚧 Placeholder |
| Real authentication | ❌ Not connected |
| API integration | ❌ Not connected |

---

## 2. Tech Stack

| Package | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI framework |
| Vite | 7.3.1 | Build tool & dev server |
| lucide-react | 0.575.0 | Icon library (used throughout) |
| recharts | 3.7.0 | Charts (Dashboard financial overview, Finance page) |
| react-icons | 5.5.0 | Additional icon sets |
| react-router-dom | 7.13.1 | Installed but **not yet used** — routing is currently state-based (see Section 6) |

### Dev dependencies

| Package | Purpose |
|---|---|
| @vitejs/plugin-react | Vite React plugin (Babel fast refresh) |
| eslint + plugins | Linting |

---

## 3. Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Install & run

```bash
cd FrontEnd
npm install
npm run dev
```

The dev server starts at **http://localhost:5173** by default.

### Other scripts

```bash
npm run build      # production build → dist/
npm run preview    # preview production build locally
npm run lint       # run ESLint
```

### Demo login

The login currently accepts **any email and password** (no validation against a real backend). Just fill in the fields and click Sign In.

To reach different portals, select a division before signing in:

| Division | Destination |
|---|---|
| Administrative | Main Administrative Portal |
| Members | Members Division Dashboard |
| Education | Coming Soon placeholder |
| Arts | Coming Soon placeholder |

---

## 4. Project Structure

```
FrontEnd/
├── public/                        # Static assets served as-is
├── src/
│   ├── assets/                    # Images, videos, logo files
│   │   ├── mk_logo.jpeg           # GubaeTech logo
│   │   ├── 30TH.mp4               # Hero video on landing page
│   │   ├── hackaton kick off.jpg
│   │   ├── welcome for new division members.jpg
│   │   └── welcome for new charity division members.jpg
│   │
│   ├── components/                # All main-portal components
│   │   │
│   │   ├── ── Public / Pre-auth ──
│   │   ├── LandingPage.jsx        # Public landing page
│   │   ├── LandingPage.css        # Landing page styles (isolated)
│   │   ├── Login.jsx              # Login form
│   │   ├── Login.css              # Login styles (isolated)
│   │   ├── DivisionSelector.jsx   # Division dropdown in login form
│   │   ├── RegistrationModal.jsx  # Event registration modal (on landing)
│   │   ├── EventDetailsModal.jsx  # Event detail modal (on landing)
│   │   │
│   │   ├── ── Portal Shell ──
│   │   ├── Sidebar.jsx            # Left navigation sidebar
│   │   ├── TopNav.jsx             # Top navigation bar (search, notifs, profile)
│   │   ├── ComingSoon.jsx         # Placeholder for unbuilt division portals
│   │   │
│   │   ├── ── Portal Pages ──
│   │   ├── Dashboard.jsx          # Main overview dashboard
│   │   ├── Divisions.jsx          # Division management
│   │   ├── Members.jsx            # Member + family management hub
│   │   ├── Finance.jsx            # Finance & budget management
│   │   ├── Inventory.jsx          # Inventory management
│   │   ├── Reports.jsx            # Report generation & export
│   │   ├── Settings.jsx           # System settings
│   │   │
│   │   └── members/               # Reusable member sub-components
│   │       ├── MemberTable.jsx    # Searchable, filterable, paginated member table
│   │       ├── MemberFormModal.jsx# Add / edit member modal form
│   │       ├── FamilyCard.jsx     # Family group card (grid view)
│   │       ├── FamilyModal.jsx    # Create / edit family group modal
│   │       ├── FamilyMembersManager.jsx  # Side panel: assign/remove members
│   │       └── mockData.js        # Shared seed data + helper functions
│   │
│   ├── members/                   # Members Division Dashboard (standalone portal)
│   │   ├── members-dashboard.css  # Scoped styles for the Members portal
│   │   │
│   │   ├── dashboard/
│   │   │   ├── MembersDivisionDashboard.jsx  # Root + internal page router
│   │   │   ├── MembersLayout.jsx             # Shell (sidebar + topbar + content)
│   │   │   ├── MembersSidebar.jsx            # Left nav for members portal
│   │   │   └── MembersTopbar.jsx             # Top bar with breadcrumb + notifs
│   │   │
│   │   ├── pages/
│   │   │   ├── MembersOverview.jsx     # Overview: stats + recent members + activity
│   │   │   ├── FamiliesPage.jsx        # Dedicated families management page
│   │   │   ├── AttendancePage.jsx      # Placeholder
│   │   │   ├── EventsPage.jsx          # Placeholder
│   │   │   └── NotificationsPage.jsx   # Placeholder
│   │   │
│   │   └── components/
│   │       └── OverviewCards.jsx       # Reusable stat card grid component
│   │
│   ├── App.jsx                    # Root component — auth gate + portal router
│   ├── App.css                    # Global styles + design system
│   ├── index.css                  # Minimal CSS reset (mostly commented out)
│   └── main.jsx                   # React entry point
│
├── index.html                     # HTML shell
├── vite.config.js                 # Vite configuration
├── package.json
└── README.md                      # This file
```

---

## 5. Application Architecture

### State machine in App.jsx

The entire application is controlled by a single state machine in `App.jsx`. There is **no React Router** driving page changes — navigation is handled by updating a string state variable `activePage` which the root component reads to decide what to render.

```
App state
├── showLanding   {boolean}  — whether to show the landing page
├── isLoggedIn    {boolean}  — whether the user has authenticated
├── activePage    {string}   — which page/portal to render
└── sidebarCollapsed {boolean} — sidebar collapse state
```

### Render decision tree

```
App renders:
  if (showLanding && !isLoggedIn)  → <LandingPage>
  if (!isLoggedIn)                 → <Login>
  if (activePage === "members-dashboard") → <MembersDivisionDashboard>  (own layout)
  else                             → Main portal shell
                                       <Sidebar> + <TopNav> + renderPage()
```

### Why two separate portal layouts?

The **Members Division Dashboard** is intentionally rendered outside the main portal shell. It has its own sidebar, its own topbar, and its own internal page routing. This is by design — each division will eventually have its own standalone management environment. The Members one is the first fully implemented example.

### Internal routing (Members Division Dashboard)

Inside `MembersDivisionDashboard.jsx` there is a second, smaller state machine with its own `activePage` string that switches between:

```
overview → members → families → attendance → events → notifications
```

---

## 6. Routing & Navigation

### Current approach (state-based)

Navigation happens by calling `setActivePage(pageKey)`. This is done from:
- The `Sidebar` (clicking nav items)
- The `TopNav` (search results, notification clicks, profile menu)
- Individual pages (e.g. dashboard cards linking to other sections)
- The login flow (division selection maps to a starting page)

### Division → page mapping (on login)

Defined in `App.jsx` as `DIVISION_PAGE_MAP`:

```javascript
const DIVISION_PAGE_MAP = {
  administrative: "dashboard",       // → main portal, Dashboard page
  members:        "members-dashboard", // → Members Division Dashboard
  education:      "education",       // → ComingSoon placeholder
  arts:           "arts",            // → ComingSoon placeholder
};
```

### Page keys used in renderPage()

| Key | Component rendered |
|---|---|
| `"dashboard"` | `<Dashboard>` |
| `"divisions"` | `<Divisions>` |
| `"members"` | `<Members>` |
| `"finance"` | `<Finance>` |
| `"inventory"` | `<Inventory>` |
| `"reports"` | `<Reports>` |
| `"settings"` | `<Settings>` |
| `"education"` | `<ComingSoon division="education">` |
| `"arts"` | `<ComingSoon division="arts">` |

### Future: migrating to React Router

`react-router-dom` is already installed. When the backend is ready, the routing should be migrated to use proper URL-based routes so that:
- Deep links work (`/dashboard`, `/members`, `/members-dashboard/families`)
- Browser back/forward navigation works
- Auth guards can redirect unauthenticated requests to `/login`

---

## 7. Pages & Features — Public Layer

### LandingPage.jsx

The public-facing page shown before any login. Contains:

- **Navbar** with logo, section links (Home, About, Fellowship, Events), Register button, and Login button
- **Hero section** with a background video (`30TH.mp4`)
- **Events section** — 3 real upcoming events (Hackathon, Special Needs Welcome, Charity Division Welcome) rendered as cards
- **EventDetailsModal** — opens when a user clicks an event card, shows full details
- **RegistrationModal** — opens when "Register" is clicked, a form for event sign-up
- **Mobile navigation** — hamburger menu for small screens

**State**: `isModalOpen`, `isMobileNavOpen`, `selectedEvent`  
**Props received**: `onLogin` — callback that transitions to the login page

### Login.jsx

Login form with:
- Email + password fields with show/hide password toggle
- **DivisionSelector** dropdown — lets the user pick which division they belong to
- The Sign In button label updates dynamically based on the selected division
- 1.5 second simulated loading spinner on submit
- On success: calls `onLogin(selectedDivision)` which App.jsx uses to route the user

**Currently**: accepts any credentials (no real auth)  
**Needs**: `POST /auth/login` returning a token + user role

### DivisionSelector.jsx

A custom-styled dropdown component. Registered divisions:

| Value | Label | Status |
|---|---|---|
| `administrative` | Administrative | Live |
| `members` | Members | Live |
| `education` | Education | Soon |
| `arts` | Arts | Soon |

### RegistrationModal.jsx

Modal form for event registration. Currently collects user info for events. Needs a backend endpoint to persist registrations.

### EventDetailsModal.jsx

Read-only modal showing full event details when an event card is clicked on the landing page.

---

## 8. Pages & Features — Administrative Portal

The Administrative Portal is the main management environment. It uses a persistent `Sidebar` + `TopNav` shell, with pages swapped into the content area.

### Sidebar.jsx

**Navigation items**: Dashboard, Divisions, Members, Finance, Inventory, Reports  
**Footer items**: Settings, Sign Out  
**Features**:
- Collapsible — narrows to icon-only mode. Toggle button in the header.
- Section labels: "NAVIGATION" and "SYSTEM"
- Active item highlighted with blue background + shadow
- Smooth collapse animation (width transition)
- Responds responsively at ≤1024px (auto-collapses)

**Props**: `activePage`, `setActivePage`, `collapsed`, `setCollapsed`, `onLogout`

### TopNav.jsx

**Left side**: Smart search bar with live dropdown results. Searches across members, divisions, finance, inventory, reports. Results are categorised with coloured icons and clicking navigates directly to the relevant page.

**Right side**:
- **Notification bell** — dropdown panel with 4 seeded notifications. Supports mark-as-read per item and mark-all-read. Clicking a notification navigates to the relevant page.
- **User profile** — displays "Admin User / Super Admin". Dropdown shows: Edit Profile, Upload Photo, Settings, Sign Out. Profile photo can be uploaded (drag-and-drop or file picker) and previewed — stored in local state.

**Props**: `onLogout`, `setActivePage`

---

### Dashboard.jsx

**Route key**: `"dashboard"`

Overview page visible to Administrative division users after login.

**Summary cards** (4 cards, click to navigate):
- Total Members → links to Members page
- Total Divisions → links to Divisions page
- Monthly Budget → links to Finance page
- Inventory Status → links to Inventory page

**Financial Overview chart**: Area chart (recharts) showing Income vs Expenses. Toggle between Month view and Year view.

**Recent Activities list**: 4 latest activities. "View All" button opens a modal with the full 12-item activity log.

**Bottom cards** (clickable):
- Division Management → links to Divisions page
- System Health → links to Settings page

**Data**: All hardcoded in `Dashboard.jsx`. Needs API data for real numbers.

---

### Divisions.jsx

**Route key**: `"divisions"`

**Features**:
- Stat cards: Total Divisions, Total Members (across all divisions), Active Budgets
- Paginated table of divisions (5 per page) with search and filter by budget status
- Filter dropdown: All / On Track / Review Needed / Under Budget / Over Budget
- **Add Division** — modal form: name, leader, member count, budget status
- **Edit Division** — same modal pre-filled
- **Delete Division** — confirmation modal with toast feedback
- **Export CSV** — exports current filtered view
- **Export Single** — exports a single division row
- Recharts pie/donut chart showing member distribution across divisions
- Recent activity feed (last 3 division events)
- Toast notifications on all CRUD operations

**Seeded data** (5 divisions):

| Name | Leader | Members | Budget |
|---|---|---|---|
| Education | Abebe Kebede | 45 | On Track |
| Service | Marta Almaz | 30 | Review Needed |
| Media | Samuel Yohannes | 25 | On Track |
| Outreach | Sara Tekle | 20 | Under Budget |
| Choir | Yared Solomon | 62 | Over Budget |

---

### Members.jsx + sub-components

**Route key**: `"members"`

The most feature-rich page in the administrative portal.

**Tab navigation**: Members tab | Families tab

#### Members tab

- **Stat cards**: Total Members, Active, Inactive, Family Groups
- **MemberTable** (`components/members/MemberTable.jsx`):
  - Full-text search (name, email, phone, role, address)
  - Filter by status (Active / Inactive) and family group
  - Paginated (10 rows per page) with page number controls
  - Each row: avatar (initials + colour-coded), name, role tag, status, family, join date, action menu
  - **Action menu** (⋯ per row): View Profile, Edit, Delete
  - **Export CSV** — exports all filtered results
- **Add Member** button → `MemberFormModal`
- **View Profile** → inline profile modal with all member details

#### Families tab

- **FamilyCard** grid (`components/members/FamilyCard.jsx`):
  - Shows: group name, leader (with avatar), description, member count, creation date
  - Per-card actions: Edit, Delete, Manage Members
- **Create Group** → `FamilyModal` (`components/members/FamilyModal.jsx`)
- **Manage Members** → `FamilyMembersManager` side panel (`components/members/FamilyMembersManager.jsx`):
  - Lists current members of the group (with remove button)
  - Lists available members not in this group (with add button)
  - Both lists are searchable
  - Shows a warning if a member is being moved from another group

#### MemberFormModal fields

| Field | Type | Required |
|---|---|---|
| Full Name | text | ✅ |
| Gender | select (Male/Female/Other) | ✅ |
| Phone | tel | No |
| Email | email | No |
| Birthday | date | No |
| Join Date | date | No |
| Address | text | No |
| Role | select (8 team options) | ✅ |
| Status | select (Active/Inactive) | ✅ |
| Family Group | select (from families list) | No |
| Profile Image | file upload | No |

**Validation**: full name required, email format checked, phone format checked.

---

### Finance.jsx

**Route key**: `"finance"`

**Stat cards** (4): Total Income, Total Expenses, Current Balance, Monthly Budget  
**Charts**:
- Income trend — recharts BarChart, switchable between 1/3/6 month windows
- Expense trend — recharts BarChart, weekly view
- Budget Distribution — recharts PieChart / RadialBarChart

**Budget Breakdown panel**: 5 budget categories (Church Events, Administrative, Social Services, Maintenance, Audio/Visual) with progress bars showing allocated vs spent.

**Transaction table**: 
- Shows description, category, date, status, amount (income green / expense red)
- Status badges: Completed / Processing
- **Add Income** button → modal form
- **Add Expense** button → modal form
- **View All** → full transaction list modal with search + filter by category and type

**Add transaction form fields**: Description, Category, Date, Amount

**Seeded transactions** (4 records). Income and expense totals are derived dynamically from `transactionList` state.

---

### Inventory.jsx

**Route key**: `"inventory"`

**Stat cards** (3): Total Items, In Stock count, Low Stock count  
**Tab filter**: All Items | Audio/Visual | Literature | Kitchen  
**Paginated table** (5 rows per page):
- Columns: Item name (with division icon), Quantity, Division, Last Updated, Status, Actions
- Status badges: In Stock (green) / Low Stock (amber)
- **Actions**: View detail, Edit, Delete

**Add Item** → modal form  
**Export CSV** — exports current filtered view

**Item form fields**: Name, Quantity, Division (Audio/Visual / Literature / Kitchen), Status

**Seeded data**: 12 items across 3 divisions.

---

### Reports.jsx

**Route key**: `"reports"`

**Report type cards** (4): Membership Report, Financial Report, Division Performance, Inventory Report  
Each card shows: icon, name, description, last-updated status, View button, Generate button.

**Generate Report modal**:
- Select report type and date range
- Animated progress bar simulation
- File upload input (for importing external report data)
- Completion state with download link

**Report Preview modal**: Shows a structured preview of report data (member stats, financial breakdown, etc.)

**Exports / History modal**: 
- Lists 3 recent report files (RPT-001, RPT-002, RPT-003)
- Search by name, filter by type (PDF / XLSX)
- Download and preview actions

**Quick Stats section**: 4 stat cards — Total Reports, Members Tracked, Data Sources, Last Updated

**Toast notifications** on generate and export actions.

---

### Settings.jsx

**Route key**: `"settings"`

Three settings sections, each with a coloured icon and individual item icons:

**General Settings**:
- Church Information (Building icon — update name, address, contact)
- System Preferences (Monitor icon — language, timezone, display)
- Notification Settings (Bell icon — email and system notifications)

**User Management**:
- User Roles (Users icon — define roles and permissions)
- Access Control (Lock icon — manage feature access)
- Password Policy (Key icon — security requirements)

**Data Management**:
- Backup & Restore (HardDrive icon)
- Data Export (Download icon)
- Data Privacy (EyeOff icon — retention and privacy config)

**System Information card** (2×2 grid):
- Version: 1.0.0
- Last Updated: February 25, 2026
- Database: Healthy
- Server Status: Online

All "Configure" buttons are currently non-functional (no modals implemented yet).

---

### ComingSoon.jsx

Placeholder rendered for Education and Arts divisions. Shows:
- Coloured icon bubble (green for Education, purple for Arts)
- Division name + tagline
- "Coming Soon" badge
- Planned features list card
- Navigation buttons: Back to Dashboard, Go to Members

---

## 9. Pages & Features — Members Division Dashboard

A **completely separate portal** with its own layout. Accessed by logging in with the "Members" division. Lives in `src/members/`.

### MembersDivisionDashboard.jsx

Root component. Manages `activePage` string state internally. Renders `MembersLayout` and switches page content.

**Internal pages**: `overview` → `members` → `families` → `attendance` → `events` → `notifications`

### MembersLayout.jsx

Shell component: renders `MembersSidebar` + `MembersTopbar` + a `<main>` content area. Manages sidebar collapsed state.

### MembersSidebar.jsx

Left navigation with:
- Logo (Users icon + "Members / Division Portal" text)
- Collapse toggle button (ChevronLeft/Right)
- Section label: "NAVIGATION"
- Nav items: Overview, Members, Families / Groups, Attendance (Soon), Events (Soon), Notifications (Soon)
- Footer: Main Portal (ArrowLeft — returns to Administrative portal), Sign Out

"Soon" items show a pill badge and are accessible but show placeholder content.

### MembersTopbar.jsx

- **Left**: Breadcrumb ("Members Division / {Page Title}") + large page title
- **Right**: 
  - Notification bell — dropdown panel with 4 seeded notifications (mark-as-read per item + mark-all + close)
  - Profile button — shows "Division Leader / Members Division" — dropdown: Account Settings, Sign Out

### MembersOverview.jsx

**Stats cards** (4, click to navigate):
- Total Members (computed from mock data: 20)
- Active Members (computed: 17)
- Families / Groups (computed: 5)
- New This Month (computed from join dates: 1)

**Recent Members list**: Top 5 most recently joined. Shows avatar (initials + colour), name, role, status badge, join date.

**Recent Activity feed**: 4 hardcoded activity items with icons, description, and timestamp.

### FamiliesPage.jsx

Standalone families management page (separate from the Members.jsx tab). Reuses the exact same sub-components:
- `FamilyCard` for the card grid
- `FamilyModal` for create/edit
- `FamilyMembersManager` for the side panel
- Delete confirmation modal with member unassignment

**Stat cards** (3): Total Groups, Assigned Members, Unassigned Members  
Empty state with "Create First Group" prompt when no families exist.

State is **independent** from the Members page's state — seeded from the same `initialFamilies` and `initialMembers` in `mockData.js`.

### AttendancePage.jsx / EventsPage.jsx / NotificationsPage.jsx

Placeholder pages. Each has:
- Distinct accent colour (blue / purple / amber)
- Feature description and planned features list
- "Coming Soon" badge
- Navigation buttons back to Overview and Members

---

## 10. Design System

All design tokens are CSS custom properties defined in `src/App.css` under `:root`. Every component uses these variables — **no hardcoded colour values** except where a specific dynamic colour must be inlined (e.g. recharts, avatar palette).

### Colour tokens

```css
/* Primary */
--navy:         #1e293b
--navy-dark:    #0f172a
--navy-sidebar: #1a2332   /* sidebar background */
--blue:         #1a56db   /* primary action colour */
--blue-light:   #e8f0fe   /* blue tint backgrounds */

/* Accent */
--gold:         #d4a017
--gold-bg:      #fef3e2

/* Semantic */
--green:        #16a34a   --green-bg:  #dcfce7
--red:          #dc2626   --red-bg:    #fef2f2
--orange:       #d97706   --orange-bg: #fff3cd
--purple:       #7c3aed   --purple-bg: #f3e8ff

/* Neutrals */
--bg:           #f8fafc   /* page background */
--white:        #ffffff
--gray-50 through --gray-900  (standard Tailwind-style scale)

--text-primary:   var(--gray-900)
--text-secondary: var(--gray-500)
--text-light:     var(--gray-400)
--border:         var(--gray-200)

/* Elevation */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05)
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07)
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08)

/* Shape */
--radius:    12px
--radius-sm: 8px
--transition: all 0.2s ease
```

### Typography

- **Font**: Inter (system-ui fallback)
- **Base size**: 16px
- **Line height**: 1.6

### Key reusable CSS classes

| Class | Used for |
|---|---|
| `.page-v2` | Page wrapper (flex column, 1.5rem gap, fade-in animation) |
| `.page-v2-header` | Page title + subtitle + action button row |
| `.page-v2-stats.three-col / .four-col` | Stat card grid |
| `.page-stat-card` | Individual stat card (hover lift + sliding top accent bar) |
| `.page-v2-card` | White content card with border + shadow |
| `.card-header-row` | Title + subtitle + actions row inside a card |
| `.btn-accent` | Primary blue button |
| `.btn-accent-dark` | Navy dark button |
| `.btn-outline-dark` | Outlined button |
| `.btn-icon-text` | Icon + text combo button |
| `.v2-table` | Styled data table |
| `.icon-btn` | Small circular icon-only action button |
| `.icon-btn.danger` | Destructive action variant (red on hover) |
| `.status-pill` | Completed / Processing badge |
| `.mem-modal-overlay` / `.mem-modal` | Member-style modal overlay + panel |
| `.members-hub-tabs` / `.members-hub-tab` | Tab navigation bar |

### Animation conventions

- **Page entry**: `portalPageIn` keyframe — 220ms ease, Y+10px → Y0, opacity 0→1
- **Card hover**: `translateY(-2px)` + shadow upgrade + top accent bar slides in (scaleX 0→1)
- **Dropdowns**: `md-dropdown-in` / `dropdownFadeIn` — 150ms, Y-6px → Y0
- **Modals**: `modalSlideUp` — 220ms, Y+20px → Y0

---

## 11. Mock Data Reference

All mock data currently lives in the files listed below. When backend integration happens, these are the sources to replace with API calls.

### `src/components/members/mockData.js`

Shared across `Members.jsx`, `FamiliesPage.jsx`, `MembersOverview.jsx`, and all member sub-components.

**`initialMembers`** — 20 member records  
**`initialFamilies`** — 5 family group records  
**`avatarPalette`** — 8-colour cycling palette for member avatars  
**`roleColors`** — colour map for 8 team roles  
**`ALL_ROLES`** — `["Media Team", "Education Team", "Charity Team", "Arts Team", "Music Team", "Youth Team", "Prayer Team", "Admin"]`  
**`ALL_STATUSES`** — `["Active", "Inactive"]`  
**`ALL_GENDERS`** — `["Male", "Female", "Other"]`  
**`EMPTY_MEMBER_FORM`** — blank form template  
**`EMPTY_FAMILY_FORM`** — blank family form template  
**Helper functions**: `getAvatarStyle(id)`, `getInitials(name)`

### `src/components/Dashboard.jsx`

- `monthlyData` — 6 months income/expense (hardcoded)
- `yearlyData` — 6 years income/expense (hardcoded)
- `summaryCards` — 4 stat card definitions with hardcoded values
- `recentActivities` — 4 activity items
- `allActivities` — 12 activity items (full modal list)

### `src/components/Divisions.jsx`

- `initialDivisions` — 5 division records
- `recentActivitiesData` — 3 activity items
- `budgetOptions` — 4 status options

### `src/components/Finance.jsx`

- `incomeData`, `expenseData`, `weeklyExpenseData` — chart arrays (in component state)
- `transactions` — 4 initial transaction records
- `budgetDetails` — 5 budget category objects (hardcoded, not in state)
- `spendingData` — 6 category spending records for the pie chart

### `src/components/Inventory.jsx`

- `seedItems` — 12 inventory item records across 3 divisions
- `DIVISION_META` — icon/colour map for Audio/Visual, Literature, Kitchen
- `TABS` — `["All Items", "Audio/Visual", "Literature", "Kitchen"]`

### `src/components/Reports.jsx`

- `reportTypes` — 4 report type definitions (name, description, icon, status)
- `recentReports` — 3 recent report file records (id, name, date, size, type)

### `src/members/dashboard/MembersTopbar.jsx`

- `INITIAL_NOTIFS` — 4 seeded notifications for the Members Division topbar

### `src/members/pages/MembersOverview.jsx`

- `ACTIVITY` — 4 hardcoded recent activity items
- Stats (totalMembers, activeMembers, totalFamilies, newThisMonth) computed live from `initialMembers` / `initialFamilies`

---

## 12. Data Shapes (API Contract)

These are the exact object shapes the frontend currently uses. The backend must return data matching these shapes so that the frontend requires zero changes after integration.

### Member

```javascript
{
  id:           number,        // unique integer
  fullName:     string,        // e.g. "Abebe Kebede"
  gender:       string,        // "Male" | "Female" | "Other"
  phone:        string,        // e.g. "+251 911 223344"  (optional)
  email:        string,        // valid email  (optional)
  birthday:     string,        // ISO date "YYYY-MM-DD"  (optional)
  joinDate:     string,        // ISO date "YYYY-MM-DD"
  address:      string,        // free text  (optional)
  familyId:     number | null, // FK → Family.id, null if unassigned
  role:         string,        // one of ALL_ROLES (see below)
  status:       string,        // "Active" | "Inactive"
  profileImage: string | null  // URL string or null
}
```

**Valid roles**: `"Media Team"`, `"Education Team"`, `"Charity Team"`, `"Arts Team"`, `"Music Team"`, `"Youth Team"`, `"Prayer Team"`, `"Admin"`

### Family / Group

```javascript
{
  id:          number,        // unique integer
  name:        string,        // e.g. "Lior Group"
  leaderId:    number | null, // FK → Member.id, null if no leader
  description: string,        // free text (optional)
  createdAt:   string         // ISO date "YYYY-MM-DD"
}
```

### Division

```javascript
{
  id:           number,  // unique integer
  name:         string,  // e.g. "Education"
  leader:       string,  // leader's full name (denormalised string)
  members:      number,  // member count
  budgetStatus: string   // "On Track" | "Review Needed" | "Under Budget" | "Over Budget"
}
```

Note: `icon`, `iconBg`, `iconColor` are currently assigned client-side based on division name/id. The backend does not need to return these.

### Transaction

```javascript
{
  id:       number,   // unique integer  (add this — currently missing from mock)
  desc:     string,   // e.g. "Monthly Tithe Collection"
  category: string,   // e.g. "Income", "Events", "Maintenance"
  date:     string,   // ISO date "YYYY-MM-DD"
  status:   string,   // "Completed" | "Processing"
  amount:   string,   // formatted string e.g. "+45,000 ETB" or "-12,500 ETB"
  type:     string    // "income" | "expense"
}
```

> **Note**: The frontend currently stores `amount` as a pre-formatted string. For a proper API, return `amount` as a plain `number` (e.g. `45000`) and `type` as `"income"` or `"expense"`. The frontend will need a small formatting helper added when connecting.

### Inventory Item

```javascript
{
  id:       number,  // unique integer
  name:     string,  // e.g. "Wireless Microphone System"
  quantity: string,  // e.g. "4 units"  (currently a string — consider splitting into number + unit)
  division: string,  // "Audio/Visual" | "Literature" | "Kitchen"
  updated:  string,  // human-readable date e.g. "Oct 12, 2023"  (use ISO in API)
  status:   string   // "instock" | "lowstock"
}
```

### Budget Category

```javascript
{
  name:      string,  // e.g. "Church Events"
  allocated: number,  // e.g. 120000
  spent:     number,  // e.g. 90000
  remaining: number,  // derived: allocated - spent
  color:     string,  // hex colour for the chart bar
  status:    string   // "On Track" | "Warning" | "Over Budget"
}
```

### Report File

```javascript
{
  id:   string,  // e.g. "RPT-001"
  name: string,  // e.g. "Q1 Financial Summary"
  date: string,  // e.g. "May 12, 2024"
  size: string,  // e.g. "2.4 MB"
  type: string   // "PDF" | "XLSX"
}
```

### Notification

```javascript
{
  id:      number,
  type:    string,   // "member" | "division" | "finance" | "inventory" | "report" | "alert"
  title:   string,
  message: string,
  time:    string,   // human-readable relative time e.g. "2 hours ago"
  read:    boolean
}
```

### Authenticated User (login response)

```javascript
{
  token:    string,  // JWT or session token
  user: {
    id:       number,
    name:     string,   // displayed in TopNav as "Admin User"
    role:     string,   // displayed in TopNav as "Super Admin"
    division: string    // "administrative" | "members" | "education" | "arts"
                        // drives the post-login routing in App.jsx
  }
}
```

---

## 13. API Endpoints the Frontend Needs

The following REST endpoints are required to replace every mock data source in the frontend. All endpoints should return JSON. All write operations should return the updated/created object so the frontend can update state without a refetch.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user. Body: `{ email, password, division }`. Returns user + token. |
| `POST` | `/api/auth/logout` | Invalidate session/token. |
| `GET` | `/api/auth/me` | Return the current authenticated user (for session restore). |

### Members

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/members` | List all members. Supports query params: `?status=Active`, `?familyId=2`, `?search=abebe` |
| `POST` | `/api/members` | Create a new member. Body: Member shape (without `id`). Returns created member with `id`. |
| `PUT` | `/api/members/:id` | Update a member. Body: partial or full Member shape. Returns updated member. |
| `DELETE` | `/api/members/:id` | Delete a member. Returns `{ success: true }`. |
| `POST` | `/api/members/:id/photo` | Upload profile photo. Body: `multipart/form-data`. Returns `{ profileImage: "url" }`. |

### Families / Groups

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/families` | List all family groups. |
| `POST` | `/api/families` | Create a new family group. Returns created family with `id` and `createdAt`. |
| `PUT` | `/api/families/:id` | Update a family group. Returns updated family. |
| `DELETE` | `/api/families/:id` | Delete a family group. Should also unassign all members (set `familyId = null`). Returns `{ success: true }`. |

### Divisions

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/divisions` | List all divisions. |
| `POST` | `/api/divisions` | Create a new division. Returns created division with `id`. |
| `PUT` | `/api/divisions/:id` | Update a division. Returns updated division. |
| `DELETE` | `/api/divisions/:id` | Delete a division. Returns `{ success: true }`. |

### Finance

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/finance/transactions` | List transactions. Supports: `?type=income`, `?category=Events`, `?search=tithe` |
| `POST` | `/api/finance/transactions` | Add a new transaction. Returns created transaction. |
| `GET` | `/api/finance/summary` | Returns `{ totalIncome, totalExpenses, balance, monthlyBudget }` |
| `GET` | `/api/finance/budget` | Returns the budget category breakdown array. |
| `GET` | `/api/finance/chart?period=month` | Returns chart data arrays for income/expense trend. |

### Inventory

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/inventory` | List all inventory items. Supports: `?division=Audio%2FVisual`, `?status=lowstock` |
| `POST` | `/api/inventory` | Create a new item. Returns created item. |
| `PUT` | `/api/inventory/:id` | Update an item. Returns updated item. |
| `DELETE` | `/api/inventory/:id` | Delete an item. Returns `{ success: true }`. |

### Reports

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports` | List generated report files (id, name, date, size, type). |
| `POST` | `/api/reports/generate` | Trigger report generation. Body: `{ type, range }`. Returns job status or file when complete. |
| `GET` | `/api/reports/:id/download` | Download a specific report file. |

### Notifications

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/notifications` | List notifications for the authenticated user. |
| `PUT` | `/api/notifications/:id/read` | Mark a single notification as read. |
| `PUT` | `/api/notifications/read-all` | Mark all notifications as read. |

### Settings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/settings` | Return current system settings. |
| `PUT` | `/api/settings` | Update system settings. |
| `GET` | `/api/settings/system-info` | Return version, last-updated, database status, server status. |

---

## 14. Authentication Flow

### Current (mock) flow

```
1. User fills email + password + selects division
2. Submit → 1500ms artificial delay (setTimeout)
3. Calls onLogin(selectedDivision) unconditionally
4. App.jsx maps division → activePage → renders portal
```

No token is stored. No session persists across page refreshes. Any credentials are accepted.

### Required (real) flow

```
1. User fills email + password + selects division
2. POST /api/auth/login  { email, password, division }
3. On success → store JWT token (localStorage or httpOnly cookie)
4. Read user.division from response → map to activePage
5. On failure → show error message in the login form
6. On page refresh → call GET /api/auth/me with stored token
   → if valid: restore session, redirect to appropriate portal
   → if invalid/expired: redirect to /login
7. Logout → DELETE token → show landing page
```

### Where to make changes for real auth

| File | Change needed |
|---|---|
| `Login.jsx` | Replace `setTimeout` with `fetch('/api/auth/login', ...)`. Show error state if credentials are rejected. |
| `App.jsx` | On mount, check for existing token and call `/api/auth/me` to restore session. |
| `TopNav.jsx` | Replace hardcoded `"Admin User"` / `"Super Admin"` with values from auth context/store. |
| `MembersTopbar.jsx` | Same — replace `"Division Leader"` / `"Members Division"` with real user data. |

### Suggested: React Context for auth state

Create an `AuthContext` that holds `{ user, token, login, logout }` and wrap the app. This avoids prop-drilling the user object through every component.

---

## 15. Current State & Known Gaps

### What works perfectly in the browser

- All CRUD operations (create, read, update, delete) across every module
- All search, filter, and pagination
- All modals (open, close, validate, submit, error states)
- All charts (recharts — responsive, interactive tooltips)
- All CSV exports (members, divisions, inventory)
- Toast notifications
- Profile photo upload and preview (stores in local React state)
- Sidebar collapse / expand
- Search with live dropdown results in TopNav
- Notification read/unread state
- Division-based routing at login
- Members Division Dashboard (complete separate portal)
- Responsive layout (tested down to ~375px)

### What is simulated / hardcoded

| Feature | Current state | What's needed |
|---|---|---|
| Authentication | Always succeeds after 1.5s | Real `POST /api/auth/login` |
| All list data | Hardcoded seed arrays | `GET` API calls, replaces `useState(seedData)` |
| Create / Edit / Delete | Mutates local React state only | API calls + state update from response |
| Dashboard numbers | Static strings e.g. `"1,240"` | `GET /api/finance/summary`, `GET /api/members` count |
| Finance charts | Hardcoded monthly/weekly arrays | `GET /api/finance/chart?period=...` |
| Report generation | Fake progress bar animation | Real `POST /api/reports/generate` |
| Report downloads | Alert placeholder | Real `GET /api/reports/:id/download` |
| Profile photo | Preview in-memory only, lost on refresh | `POST /api/members/:id/photo` → store URL |
| Notifications | 4 hardcoded items, state reset on refresh | `GET /api/notifications` + WebSocket or polling |
| Settings "Configure" | Non-functional buttons | Modal forms + `PUT /api/settings` |
| User name in TopNav | Hardcoded "Admin User / Super Admin" | From auth response |

### Known pre-existing lint warnings

The following issues exist in the codebase and are **not caused by the Members Division Dashboard** work:

| File | Issue |
|---|---|
| `Divisions.jsx` | 2 ESLint warnings (unused variables) |
| `Finance.jsx` | 4 ESLint warnings (unused variables) |
| `Reports.jsx` | 3 ESLint warnings (unused variables) |
| `App.css` | 1 CSS warning: `-webkit-line-clamp` without standard `line-clamp` (in `.family-card-desc`) |

None of these affect runtime functionality.

### react-router-dom is installed but unused

The package is in `dependencies` but the app uses state-based navigation. When the backend is connected, migrate to proper URL routing for deep links, browser history, and auth guards.

---

## 16. Backend Integration Checklist

Use this checklist when wiring the backend to the frontend. Work module by module — each can be integrated independently.

### Phase 1 — Authentication (do this first)

- [ ] Implement `POST /api/auth/login` returning `{ token, user: { id, name, role, division } }`
- [ ] Implement `GET /api/auth/me` for session restore
- [ ] Update `Login.jsx`: replace `setTimeout` with real fetch, add error display
- [ ] Create `AuthContext` / auth store, make user data available app-wide
- [ ] Update `TopNav.jsx` and `MembersTopbar.jsx` to read user name/role from context
- [ ] Add token storage (localStorage or cookie)
- [ ] Add session restore in `App.jsx` on mount
- [ ] Implement logout endpoint, clear token on `handleLogout`

### Phase 2 — Members & Families

- [ ] `GET /api/members` → replace `useState(initialMembers)` in `Members.jsx` and `FamiliesPage.jsx`
- [ ] `GET /api/families` → replace `useState(initialFamilies)`
- [ ] `POST /api/members` → replace local state mutation in `handleMemberSubmit`
- [ ] `PUT /api/members/:id` → same handler, edit path
- [ ] `DELETE /api/members/:id` → replace `handleDeleteMember`
- [ ] `POST /api/families` → replace `handleFamilySubmit` (create path)
- [ ] `PUT /api/families/:id` → replace `handleFamilySubmit` (edit path)
- [ ] `DELETE /api/families/:id` → replace `handleDeleteFamily`
- [ ] `PUT /api/members/:id` (familyId field) → replace `handleUpdateMemberFamily`
- [ ] `POST /api/members/:id/photo` → replace in-memory profile image
- [ ] Update `mockData.js` exports: keep helpers (`getInitials`, `getAvatarStyle`, `roleColors`) but remove `initialMembers` and `initialFamilies` once API is live

### Phase 3 — Divisions

- [ ] `GET /api/divisions` → replace `useState(initialDivisions)` in `Divisions.jsx`
- [ ] `POST /api/divisions` → replace `handleSave` (create path)
- [ ] `PUT /api/divisions/:id` → replace `handleSave` (edit path)
- [ ] `DELETE /api/divisions/:id` → replace `handleDelete`
- [ ] Update dashboard "Total Divisions" card value from API

### Phase 4 — Finance

- [ ] `GET /api/finance/summary` → replace hardcoded stat card values
- [ ] `GET /api/finance/transactions` → replace `useState(transactions)`
- [ ] `POST /api/finance/transactions` → replace `handleAddTransaction`
- [ ] `GET /api/finance/chart?period=month` → replace hardcoded chart arrays
- [ ] `GET /api/finance/budget` → replace hardcoded `budgetDetails` array
- [ ] Update Dashboard "Monthly Budget" card value from summary endpoint

### Phase 5 — Inventory

- [ ] `GET /api/inventory` → replace `useState(seedItems)`
- [ ] `POST /api/inventory` → replace local create handler
- [ ] `PUT /api/inventory/:id` → replace local edit handler
- [ ] `DELETE /api/inventory/:id` → replace local delete handler
- [ ] Update Dashboard "Inventory Status" from API

### Phase 6 — Reports

- [ ] `GET /api/reports` → replace hardcoded `recentReports` list
- [ ] `POST /api/reports/generate` → replace fake progress simulation
- [ ] `GET /api/reports/:id/download` → replace alert placeholder with real file download
- [ ] Quick stats (`stat-card` values) → drive from a summary endpoint

### Phase 7 — Notifications

- [ ] `GET /api/notifications` → replace `initialNotifications` in `TopNav.jsx` and `INITIAL_NOTIFS` in `MembersTopbar.jsx`
- [ ] `PUT /api/notifications/:id/read` → wire to `markOneRead` handlers
- [ ] `PUT /api/notifications/read-all` → wire to `markAllRead` handlers
- [ ] Consider WebSocket or polling for real-time notification delivery

### Phase 8 — Dashboard

- [ ] Drive "Total Members" card from `GET /api/members` count
- [ ] Drive "Monthly Budget" card from `GET /api/finance/summary`
- [ ] Drive chart data from `GET /api/finance/chart`
- [ ] Drive "Recent Activities" feed from a dedicated activity-log endpoint
- [ ] Replace all hardcoded stat values in `summaryCards`

### Phase 9 — Settings

- [ ] `GET /api/settings/system-info` → replace hardcoded version/date/status values
- [ ] Implement modals behind each "Configure" button
- [ ] `PUT /api/settings` for each settings category

### Phase 10 — Routing migration (optional but recommended)

- [ ] Install and configure `react-router-dom` properly
- [ ] Map each `activePage` key to a URL route (`/dashboard`, `/members`, etc.)
- [ ] Map Members Division pages to sub-routes (`/members-dashboard/overview`, etc.)
- [ ] Add auth guard: redirect to `/login` if no valid token
- [ ] Replace all `setActivePage(x)` calls with `navigate('/x')`

---

## Notes for the Backend Team

1. **CORS**: The Vite dev server runs on `http://localhost:5173`. Configure your backend to accept requests from this origin during development.

2. **Base URL**: When integrating, add a single `API_BASE_URL` constant (or `.env` variable `VITE_API_URL`) at the top of each data-fetching file. Do not scatter base URLs across components.

3. **Error handling**: The frontend currently has no global error boundary or API error handler. Add `try/catch` blocks and consider a toast notification for network errors when integrating each endpoint.

4. **Pagination**: `MemberTable` handles pagination client-side on the full dataset. Once the member list grows, move pagination server-side — the table already accepts a filtered/paginated array as props.

5. **Image uploads**: Profile photos are currently stored only in React state (lost on refresh). The backend needs a file storage solution (e.g. S3, local disk, Cloudinary) and should return a persistent URL.

6. **Currency**: All monetary values in the UI are displayed in **ETB (Ethiopian Birr)**. Ensure the backend stores and returns amounts as plain numbers, not pre-formatted strings.

7. **Date formats**: The frontend formats dates using `toLocaleDateString("en-US", ...)`. The backend should return all dates as ISO 8601 strings (`YYYY-MM-DD` or full ISO datetime). Do not return pre-formatted date strings.

8. **State independence**: The Members Division Dashboard and the main Members page in the Administrative Portal currently have **independent state** (both seeded from `mockData.js`). When connected to a real API, both will read from the same endpoints and will naturally stay in sync.

---

*Last updated: Members Division Dashboard implementation complete. All mock data identified and documented. Ready for backend integration.*
