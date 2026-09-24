# DesignSpace — Interior Design Planning, Collaboration & Project Management Platform

A full-stack, enterprise-grade web application tailored for discerning interior design clients, architects, and master fit-out contractors. Built with **React.js, Express.js, Node.js, MongoDB Atlas, JWT Authentication, Role-Based Access Control (RBAC)**, and a **Glassmorphism design system**.

---

## 🏛️ System Architecture

DesignSpace connects all primary interior stakeholders into a synchronized execution loop:

```
CLIENT ──(Creates Project Brief)──► REQUESTED
                                        │
                                        ▼
                               DESIGNER Assigned
                                        │
                                        ▼
                                 Concept Draft
                                        │
                                        ▼
                                 PROPOSAL_SENT
                                        │
                                 Client Review
                                ┌───────┴───────┐
                                │               │
                          (Approves)       (Requests Revision)
                                │               │
                                ▼               ▼
                            APPROVED ◄─── REVISION_REQUESTED
                                │
                                ▼
                       CONTRACTOR Fit-out
                                │
                                ▼
                           IN_PROGRESS
                       (Tasks + Materials + Budget)
                                │
                                ▼
                            COMPLETED
```

---

## 💎 Primary Technologies

- **Frontend**: React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Recharts, Axios
- **Backend**: Node.js, Express.js (ES Modules), Mongoose, Multer, JWT (`jsonwebtoken`), `bcryptjs`, `cookie-parser`, `cors`
- **Database**: MongoDB Atlas (or local MongoDB fallback)
- **Security**: JWT in HTTP-Only Cookies / Authorization Bearer headers, RBAC middleware, resource ownership verification, parameterized validation, sanitize uploads

---

## 🚀 Quick Setup Instructions

### 1. Configure Environment Variables

Create `server/.env` with your MongoDB Atlas connection string:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.your-atlas-id.mongodb.net/designspace?retryWrites=true&w=majority
MONGODB_USERNAME=
MONGODB_PASSWORD=
JWT_SECRET=your_super_secret_jwt_key_here_2026
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

*(If running locally, `MONGODB_URI=mongodb://127.0.0.1:27017/designspace` works out of the box).*

---

### 2. Install Dependencies

```bash
# Install root, backend, and frontend packages
npm run server:install
npm run client:install
```

---

### 3. Seed Realistic Demo Data

DesignSpace comes with a complete database seeder containing mock users for all 4 roles, luxury projects, proposals, tasks, materials, expenses, and milestones:

```bash
npm run seed
```

#### Demo Logins (Password for all accounts: `Password123!`):

| Role | Email | Access |
| :--- | :--- | :--- |
| **👑 ADMIN** | `admin@designspace.com` | Global command center, user management, audit logs |
| **👤 CLIENT 1** | `client@designspace.com` | Tribeca Loft project owner, proposal approvals |
| **👤 CLIENT 2** | `julian.mercer@luxhome.io` | Pacific Heights Villa owner |
| **🎨 DESIGNER 1**| `designer@designspace.com` | Lead architect for Tribeca Loft |
| **🎨 DESIGNER 2**| `marcus.thorne@studio.com` | Contemporary workspace designer |
| **🔨 CONTRACTOR 1**| `contractor@designspace.com`| Master builder for Tribeca Loft fit-out |
| **🔨 CONTRACTOR 2**| `apex.builds@craftfit.io` | Structural contracting firm |

---

### 4. Run Locally

To launch both the Express backend (port 5000) and Vite frontend (port 5173):

```bash
# In one terminal: Start backend
cd server && npm run dev

# In a second terminal: Start frontend
cd client && npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛡️ Security & Authorization

1. **JWT Verification**: Verified on every protected API endpoint via `authenticate` middleware.
2. **RBAC**: Separated from authentication via `authorize(...roles)`.
3. **Resource Ownership**: Endpoints verify user relationship with project before allowing modifications.
4. **File Restrictions**: Multer blocks script files and limits uploads to 10MB.
5. **No Password Exposure**: Password field is configured with `select: false` on Mongoose schema.

---

## 📋 Comprehensive API Map

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login and receive JWT | Public |
| `GET` | `/api/auth/me` | Fetch active user session | Private |
| `POST` | `/api/auth/logout` | Invalidate cookie session | Private |
| `GET` | `/api/projects` | List projects (scoped by role) | Private |
| `POST` | `/api/projects` | Create interior project brief | CLIENT, ADMIN |
| `GET` | `/api/projects/:id` | Deep project workspace data | Private |
| `PUT` | `/api/projects/:id` | Update project parameters | Private |
| `PATCH`| `/api/projects/:id/assign` | Assign Designer or Contractor | CLIENT, ADMIN |
| `POST` | `/api/proposals` | Submit design proposal | DESIGNER, ADMIN |
| `PATCH`| `/api/proposals/:id/approve` | Approve proposal | CLIENT, ADMIN |
| `POST` | `/api/proposals/:id/revisions`| Request proposal revision | CLIENT, ADMIN |
| `GET` | `/api/tasks` | Query site tasks | Private |
| `POST` | `/api/tasks` | Create task | Private |
| `POST` | `/api/materials` | Specify project material | Private |
| `POST` | `/api/expenses` | Record site expense receipt | Private |
| `POST` | `/api/milestones` | Add project phase milestone | Private |
| `POST` | `/api/files/upload` | Upload blueprint/design file | Private |
| `GET` | `/api/notifications` | User notifications & count | Private |
| `GET` | `/api/audit-logs` | Platform audit logs | ADMIN |
| `GET` | `/api/analytics/admin` | Platform KPIs & chart datasets | ADMIN |

---

## 🎨 Glassmorphism Design System

The visual design is curated with a luxury interior editorial aesthetic:
- **Palette**: Charcoal backgrounds (`#0c0d0e`, `#121316`), warm whites, muted rose (`#D98272`), and soft gold accents (`#D8B244`).
- **Typography**: Playfair Display (editorial headings) & Plus Jakarta Sans (body).
- **Glass Surfaces**: Frosted translucent backdrops with subtle 1px border glows.
