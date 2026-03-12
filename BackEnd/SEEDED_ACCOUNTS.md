# Seeded accounts

The backend seeds these accounts on first run (when you start the server).

## Admin (full access)

- **Email:** `admin@gubaetech.local` (or `ADMIN_EMAIL` in `.env`)
- **Password:** `ChangeMe123!` (or `ADMIN_PASSWORD` in `.env`)
- **Role:** ADMIN  
- **Use:** Sign in with division "Administrative" → main dashboard (divisions, finance, inventory, etc.)

## Members Division leader (Members portal)

- **Email:** `members-lead@gubaetech.local` (or `MEMBERS_LEAD_EMAIL` in `.env`)
- **Password:** `MembersLead123!` (or `MEMBERS_LEAD_PASSWORD` in `.env`)
- **Role:** MEMBERS_MANAGER  
- **Use:** Sign in with division **"Members"** → you are taken to the **Members Division dashboard** (overview, members, families, events, attendance, notifications).

### How to log in as Members Division leader

1. Start the backend (`npm run dev` in `BackEnd/`) so the seed runs and creates the accounts if they don’t exist.
2. Open the app and go to the login page.
3. In **Select Division**, choose **Members** (so the button says “Sign In to Members Management”).
4. Enter:
   - **Email:** `members-lead@gubaetech.local`
   - **Password:** `MembersLead123!`
5. Click **Sign In**.

You will land in the Members Division portal. This user is linked to a seeded member in the “Members Management” division, so division-scoped features (e.g. Events, Attendance) default to that division.
