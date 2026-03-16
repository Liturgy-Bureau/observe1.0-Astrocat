# Observe 1.0 — Astrocat

> **Note:** Observe 1.0 is the first iteration of a broader, ongoing ecosystem. Development has moved forward into successor releases, but this codebase remains a fully functional reference point and a great place to get familiar with the project's foundations.

A full-stack **MEAN** (MongoDB · Express · Angular · Node.js) application built for real-time observation and monitoring, featuring live chat, user management, and a flexible object-tracking backend.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running Locally](#running-locally)
- [Building for Production](#building-for-production)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Observe 1.0 (codename **Astrocat**) is the foundational release of the Observe platform — a monitoring and collaboration tool designed for teams that need a live, shared view of their data. It combines real-time socket-based communication with a flexible object-storage system and a full user-account lifecycle (registration, authentication, profiles, and password recovery).

---

## Features

- 🔐 **JWT Authentication** — Secure registration, login, and token-based session management via Passport.js
- 💬 **Live Chat** — Real-time messaging powered by Socket.IO (user namespace + admin namespace)
- 📊 **Dashboard** — Data visualisation with ngx-charts and ngx-gauge
- 🗂️ **Object Management** — Schema-flexible object storage in a dedicated MongoDB database
- 👤 **User Profiles** — Full profile management with avatar upload (Sharp + Multer), contact details, and per-user statistics
- 📧 **Email Integration** — Password-reset and notification emails via Nodemailer + Google OAuth2
- 🔔 **Admin Notifications** — Real-time MongoDB change-stream events pushed to the admin socket namespace
- 📱 **Responsive UI** — Angular 11 frontend with W3.CSS, Font Awesome 4, and ngx-bootstrap

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 11, TypeScript, LESS, RxJS |
| Backend | Node.js, Express 4 |
| Database | MongoDB (Mongoose ODM, dual-database setup) |
| Real-time | Socket.IO 4 |
| Auth | Passport.js, JWT, Bcrypt |
| Email | Nodemailer, Google APIs |
| Image processing | Sharp, Multer |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 14 and **npm** ≥ 6
- **Angular CLI** 11 (`npm install -g @angular/cli@11`)
- A running **MongoDB** instance (local or Atlas)
- A Google Cloud project with OAuth2 credentials for Nodemailer (optional — required for password-reset emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/Liturgy-Bureau/observe1.0-Astrocat.git
cd observe1.0-Astrocat

# Install backend dependencies
npm install

# Install frontend dependencies
cd angular-src
npm install
cd ..
```

### Configuration

Copy or edit the files in `config/` to match your environment:

```
config/
├── database.js   # MongoDB connection strings + JWT secret
├── passport.js   # Passport-JWT strategy
└── apis.js       # Google OAuth2 / Nodemailer credentials
```

Key values to set in **`config/database.js`**:

| Key | Description |
|---|---|
| `mongoURIUsers` | Connection string for the users database |
| `mongoURIObjects` | Connection string for the objects database |
| `secret` | JWT signing secret (use a long random string in production) |

> ⚠️ **Never commit real credentials.** Add `config/apis.js` to `.gitignore` if it contains secrets.

### Running Locally

```bash
# Start the Express/Socket.IO server
npm start
# Server listens on http://localhost:3000

# In a separate terminal, start the Angular dev server
cd angular-src
ng serve
# Frontend available at http://localhost:4200
```

The Angular dev proxy is pre-configured to forward API calls to the backend on port 3000.

---

## Building for Production

```bash
cd angular-src
ng build --prod   # Angular 11 syntax; equivalent to --configuration production
```

The compiled output lands in `public/`. The Express server automatically serves these static files.

---

## Deployment

A condensed deployment checklist (see also [`DEPLOY-HELP.txt`](./DEPLOY-HELP.txt)):

1. Run `ng build --prod` (Angular 11 syntax) and upload everything **except** `angular-src/` and `node_modules/`.
2. Update the password-reset link in `routes/user-routes.js` to point to your production domain.
3. On the server, run `npm install` (or `npm ci`) to restore backend dependencies.
4. Apply the `passport-jwt` auth-header patch included in the repo:
   - Replace `node_modules/passport-jwt/lib/auth-header.js` with the local patched copy.
5. Start (or restart) the application with **pm2**:
   ```bash
   pm2 restart observe
   ```

---

## Project Structure

```
observe1.0-Astrocat/
├── angular-src/        # Angular 11 frontend source
│   └── src/app/
│       ├── components/ # Home, dashboard, register, live-chat, docs, navbar …
│       └── services/   # Socket.IO service, auth service …
├── config/             # Database, Passport, and API configuration
├── models/             # Mongoose schemas (User, Object)
├── routes/             # Express routers (user-routes, objix-routes)
├── socket-srv/         # Socket.IO event handlers
├── helpers/            # Image-upload middleware
├── public/             # Compiled Angular build (served as static files)
├── docs/               # In-app documentation page
├── app.js              # Express entry point
└── package.json        # Backend dependencies
```

---

## Contributing

Contributions are welcome! Observe 1.0 serves as the reference baseline for the Observe ecosystem, so understanding it is a great first step if you want to contribute to the broader project.

1. **Fork** the repository and create a feature branch (`git checkout -b feature/your-idea`).
2. Make your changes and ensure the backend starts without errors (`npm start`).
3. If you touched the frontend, confirm the Angular build succeeds (`ng build`).
4. Open a **Pull Request** with a clear description of what you changed and why.

Bug reports and feature suggestions are equally appreciated — please open an [issue](https://github.com/Liturgy-Bureau/observe1.0-Astrocat/issues).

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.
