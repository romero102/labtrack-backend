# LabTrack Backend 🔧

RESTful API for LabTrack, a computer maintenance management system for university computer labs. Built with Node.js, Express, and MongoDB.

🔗 **Frontend Demo:** [labtrack-frontend-lime.vercel.app](https://labtrack-frontend-lime.vercel.app)
💻 **Frontend Repo:** [github.com/romero102/labtrack-frontend](https://github.com/romero102/labtrack-frontend)

---

## The Problem

During my time as a lab technician at a university, maintenance records were kept on paper forms that were never consulted again. No one knew what hardware was inside each machine until they opened it up. Parts would quietly disappear — a 8GB RAM module swapped for a 2GB one — and no one would notice until much later.

LabTrack was built to solve that: a digital system to register every computer's specs, track maintenance history, and give technicians instant access to that information via QR code.

---

## Features

- 🔐 **JWT Authentication** with HTTP-only cookies and secure cookie config per environment
- 👥 **Role-based access control** — Admin and Technician roles via middleware
- 🔒 **Maintenance ownership middleware** — Technicians can only modify their own records
- 📱 **QR Code generation** — Auto-generated per computer, links to its profile and history
- 🔑 **Password recovery** — Email-based reset flow with SHA-256 hashed tokens and 15-minute expiry
- 🚫 **Soft delete for users** — Deactivate accounts without losing maintenance history
- ✅ **Request validation** — Per-route validators with express-validator
- ⚙️ **First-run setup** — Endpoint to create the initial admin only when no users exist
- 🛡️ **Async error handling** — Centralized via asyncHandler utility

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB + Mongoose
- **Auth:** JSON Web Tokens (JWT) + Bcrypt
- **Email:** Nodemailer (Gmail)
- **QR Code:** qrcode
- **Validation:** express-validator
- **Environment:** dotenv

---

## System Structure

```
Users
 └── assigned to Labs
      └── Labs contain Computers
           └── Computers have Maintenance records
```

**Admin** can manage everything: users, labs, computers, and all maintenance records.

**Technician** can:
- View all labs, computers, users, and maintenance records
- Create maintenance records for assigned computers
- Edit and delete only their own maintenance records

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/setup` | Create first admin (only if no users exist) | Public |
| POST | `/login` | Login and receive JWT cookie | Public |
| POST | `/logout` | Clear auth cookie | Protected |
| POST | `/forgot-password` | Send password reset email | Public |
| POST | `/reset-password/:token` | Reset password with token | Public |
| GET | `/verify` | Verify token and return user data | Protected |
| GET | `/setup-status` | Check if system has been initialized | Public |

### Users — `/api/users`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | List all users | Admin |
| GET | `/:id` | Get user by ID | Admin |
| POST | `/` | Create user | Admin |
| PUT | `/:id` | Update user | Admin |
| PUT | `/:id/deactivate` | Deactivate user (soft delete) | Admin |
| PUT | `/:id/restore` | Restore user | Admin |

### Labs — `/api/labs`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | List all labs | Admin / Technician |
| GET | `/:id` | Get lab by ID | Admin / Technician |
| POST | `/` | Create lab | Admin |
| PUT | `/:id` | Update lab | Admin |
| DELETE | `/:id` | Delete lab | Admin |

### Computers — `/api/computers`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | List all computers | Admin / Technician |
| GET | `/:id` | Get computer by ID | Admin / Technician |
| POST | `/` | Create computer + generate QR | Admin |
| PUT | `/:id` | Update computer | Admin |
| DELETE | `/:id` | Delete computer | Admin |

### Maintenance — `/api/maintenance`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/` | List all maintenance records | Admin / Technician |
| GET | `/:id` | Get record by ID | Admin / Technician |
| POST | `/` | Create maintenance record | Admin / Technician |
| PUT | `/:id` | Update record (owner or admin) | Admin / Technician |
| DELETE | `/:id` | Delete record (owner or admin) | Admin / Technician |

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/romero102/labtrack-backend.git
cd labtrack-backend
npm install
```

Create a `.env` file based on `.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_SECRET=your_cloudinary_secret
PORT=5000
```

```bash
npm run dev
```

### First Run

Hit `GET /api/auth/setup-status` to check if the system is initialized. If not, use `POST /api/auth/setup` to create the first admin account. After that, only admins can create new users.

---

## Project Structure

```
src/
├── controllers/     # Route handlers
├── middleware/      # Auth, roles, ownership, validation
├── models/          # Mongoose schemas
├── routes/          # Express routers
├── utils/           # asyncHandler and helpers
└── validators/      # express-validator rule sets
```

---

## Author

**Ilsen Romero Caraballo** — Full Stack Developer (MERN)
[GitHub](https://github.com/romero102)

---

## License

MIT
