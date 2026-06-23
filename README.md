---
title: Alumni Connect
emoji: 🎓
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---


# Alumni Connect Platform

Alumni Connect is a premium, web-based networking portal designed to bridge the gap between alumni and current students of Easwari Engineering College (EEC). The platform facilitates real-time chat, job referrals, blog publication, event hosting, and features an integrated local ATS (Applicant Tracking System) resume analyzer.

---

## Technology Stack

The platform is built using a modern, decoupled architecture designed for speed, portability, and ease of local deployment:

### Frontend
- **Framework**: React.js (v18+)
- **Styling**: Tailwind CSS (custom deep-teal & slate palette)
- **Routing**: React Router DOM (v6) for Single Page App client-side routing
- **Visualizations**: React Simple Maps & React Tooltip for the interactive global alumni map

### Backend
- **Server**: Node.js & Express.js (v4+)
- **Security**: JSON Web Tokens (JWT) for secure session authentication & `bcryptjs` for pure-JavaScript password hashing
- **Persistence**: Built-in JSON-based persistent file database (located at `server/data/db.json`) allowing full data preservation across restarts without external database setup errors

---

## Project Workflow

The application operates through a unified, secure flow:

```
[ Visitor ]
    │
    ▼ (browse public listings)
Blogs / Events / Jobs (Public Views)
    │
    ▼ (register/log in)
[ Auth Page (JWT Server Validation) ]
    │
    ├─► Success: Token saved in LocalStorage
    │
    ▼ (restricted access)
[ Dashboard System ]
    ├─► Notifications (Real-time updates)
    ├─► Messages (Chat with other members)
    ├─► Manage Blogs (Create/Edit/Delete posts)
    ├─► Manage Events (Schedule community meetings)
    └─► Manage Jobs (Publish job/referral postings)
```

### 1. Authentication
- Users register or log in on the **Auth Page** using custom forms.
- The React client sends credentials to the Express API (`/api/auth/signup` or `/api/auth/login`).
- The server validates credentials, hashes passwords using bcrypt, generates a secure JWT token, and returns the session object.
- The client stores the JWT in `LocalStorage` to preserve session status.

### 2. Dashboard Content Management
- The dashboard enables authenticated users to manage content tables (`blogs`, `events`, `job_openings`).
- API requests are handled by the generic `/api/content/:table` endpoints on the backend server.
- All created, edited, and deleted items are persisted to `server/data/db.json` on the server.

### 3. Real-Time Chat System
- Authenticated users can open the **Messages** tab in the dashboard.
- The chat list fetches all registered users from `/api/users` along with their live unread message counts.
- Selecting a user opens the chat feed, pulling conversations from `/api/messages`.
- An automated polling loop syncs message feeds and unread count badges every 3 seconds for a responsive chat experience.

### 4. Smart ATS Resume Matcher
- Located under the **ATS Tracker** tab in the main navigation.
- Computes matching scores by tokenizing and matching keywords from a pasted resume against a job description.
- Evaluates and displays matching percentages, matched keywords, and critical missing keywords locally in the browser for privacy.

---

## Setup & Installation

Follow these steps to run the frontend and backend servers concurrently on your machine:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 1. Clone & Navigate
Ensure you are in the project root directory:
```bash
cd alumni--main
```

### 2. Install Dependencies
Install all package dependencies for both the frontend and the backend server:
```bash
# Install frontend packages (including concurrently)
npm install

# Install backend packages
cd server
npm install
cd ..
```

### 3. Run the Servers Concurrently
Run the unified dev command to boot up both the React frontend and the Express backend simultaneously:
```bash
npm run dev
```

- **Frontend client** will open at `http://localhost:3000`
- **Backend API server** will bind to `http://localhost:5000`

---

##  Demo Accounts

The database comes pre-seeded with four default accounts representing different alumni and student profiles. You can use these credentials to log in and test the chat and referral systems immediately:

1. **John Doe** (Alumni, USA)
   - Email: `john.doe@eec.com`
   - Password: `password123`
2. **Jane Smith** (Alumni, UK)
   - Email: `jane.smith@eec.com`
   - Password: `password123`
3. **Arun Kumar** (Alumni, India)
   - Email: `arun@eec.com`
   - Password: `password123`
4. **Emily Johnson** (Student, Australia)
   - Email: `emily.j@eec.com`
   - Password: `password123`
