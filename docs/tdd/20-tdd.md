# 20 — Technical Design Document (TDD)

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Course** | CSE309 — Web Design |
| **Section** | 06 |
| **Instructor** | Sayef Reyadh |
| **Phase** | 4 — Technical Design Document (TDD) |
| **Version** | 1.0 |
| **Date** | 18/06/2026 |
| **Status** | Approved for implementation |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Module Design](#4-module-design)
5. [Data Design](#5-data-design)
6. [Interface Design](#6-interface-design)
7. [Security Design](#7-security-design)
8. [Deployment Design](#8-deployment-design)
9. [Related Documents](#9-related-documents)

---

## 1. Introduction

### 1.1 Purpose
This Technical Design Document (TDD) describes **how** VERA is built. It translates SRS requirements (Phase 3) into concrete architecture, database schema, API contracts, and implementation decisions for developers and reviewers.

### 1.2 Scope
Covers the MVP web application: Next.js frontend, FastAPI backend, SQLite (dev) / PostgreSQL (prod) database, JWT authentication, and REST API v1.

### 1.3 Audience
Developers, database administrators, QA engineers, project supervisors.

### 1.4 References

| Document | Location |
|----------|----------|
| SRS | `docs/srs/17-srs.md` |
| ERD | `docs/tdd/18-erd.md` |
| System Design | `docs/tdd/19-system-design.md` |
| Database Design | `docs/tdd/21-database-design.md` |
| API Design | `docs/tdd/22-api-design.md` |

---

## 2. System Architecture

VERA uses a **three-tier client-server architecture**:

| Tier | Technology | Responsibility |
|------|------------|----------------|
| Presentation | Next.js 16, React 19, Tailwind CSS 4 | UI, routing, client state |
| Application | FastAPI, Uvicorn, Pydantic, SQLAlchemy | Business logic, auth, validation |
| Data | SQLite / PostgreSQL | Persistent storage |

**Communication:** JSON over HTTP REST. All protected endpoints require `Authorization: Bearer <JWT>`.

See [19 — System Design](./19-system-design.md) for component diagrams and sequence flows.

---

## 3. Technology Stack

| Layer | Component | Version / Notes |
|-------|-----------|-----------------|
| Frontend | Next.js | 16 (App Router) |
| Frontend | React | 19 |
| Frontend | Tailwind CSS | 4 |
| Backend | FastAPI | 0.115+ |
| Backend | Uvicorn | ASGI server |
| Backend | SQLAlchemy | 2.0 ORM |
| Backend | Pydantic | 2.x validation |
| Auth | python-jose | JWT HS256 |
| Auth | passlib + bcrypt | Password hashing |
| Database (dev) | SQLite | `vera.db` |
| Database (prod) | PostgreSQL | Planned migration |
| Dev tooling | concurrently | Runs frontend + backend |

---

## 4. Module Design

### 4.1 Backend Modules

| Module | Path | Responsibility |
|--------|------|----------------|
| `main` | `app/main.py` | App factory, CORS, lifespan, health check |
| `core.config` | `app/core/config.py` | Environment settings |
| `core.database` | `app/core/database.py` | Engine, session, Base |
| `core.security` | `app/core/security.py` | Hash, JWT encode/decode |
| `models` | `app/models/__init__.py` | 14 SQLAlchemy entities |
| `schemas` | `app/schemas/__init__.py` | Pydantic DTOs |
| `api.deps` | `app/api/deps.py` | `get_current_user`, `require_roles` |
| `api.routes.*` | `app/api/routes/` | HTTP handlers by domain |
| `services.notifications` | `app/services/notifications.py` | Notification helper |

### 4.2 Frontend Modules

| Module | Path | Responsibility |
|--------|------|----------------|
| Pages | `src/app/**` | Route-level UI per feature |
| Components | `src/components/` | Navbar, AuthGuard, StatCard |
| API client | `src/lib/api.ts` | HTTP wrapper, error handling |
| Auth | `src/lib/auth.ts` | Token storage, logout |
| Types | `src/types/index.ts` | Shared TypeScript interfaces |

### 4.3 Route Organization

All API routes mount under `/api/v1`:

```
/api/v1/auth/*          → auth.py
/api/v1/emergencies/*   → emergencies.py
/api/v1/blood/*         → blood.py
/api/v1/stats/*         → stats.py
/api/v1/reports/*       → reports.py
/api/v1/search/*        → search.py
/api/v1/*               → features.py (volunteers, donations, etc.)
```

---

## 5. Data Design

### 5.1 Overview
14 tables model users, emergencies, blood, resources, coordination, donations, campaigns, notifications, shelters, incidents, volunteer programs, certificates, and disaster coverage.

### 5.2 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Enum columns for status/type fields | Type safety, validation at DB and API layers |
| Nullable lat/long on location entities | Supports text-only location in MVP |
| Dual FK on `emergency_requests` | Separate requester and assigned volunteer |
| `certificate_code` unique index | Public verification without auth |
| Auto-notify on blood request | Core SRS requirement FR-05 |

Full schema: [21 — Database Design](./21-database-design.md)  
Entity relationships: [18 — ERD](./18-erd.md)

---

## 6. Interface Design

### 6.1 REST API
- Base URL: `http://localhost:8000/api/v1` (dev)
- Content-Type: `application/json`
- Auth header: `Authorization: Bearer <token>`
- Login uses `application/x-www-form-urlencoded` (OAuth2 password flow)

Full endpoint catalog: [22 — API Design](./22-api-design.md)

### 6.2 Frontend Pages

| Route | Feature |
|-------|---------|
| `/` | Landing |
| `/login`, `/register` | Authentication |
| `/dashboard` | Stats overview |
| `/emergencies` | Emergency requests |
| `/blood` | Blood requests & donors |
| `/donations` | Donations & campaigns |
| `/resources` | NGO resource inventory |
| `/volunteers` | Verification, opportunities, certificates |
| `/shelters` | Shelter listings |
| `/incidents` | Incident reports |
| `/coverage` | Disaster coverage map |
| `/search` | Nearby search |
| `/notifications` | User notifications |
| `/admin` | Admin reports |

### 6.3 External Interfaces (Future)

| Interface | Status |
|-----------|--------|
| Google Maps API | Planned |
| SMS gateway | Out of MVP scope |
| Payment gateway | Out of MVP scope |
| Email service | Out of MVP scope |

---

## 7. Security Design

| Concern | Implementation |
|---------|----------------|
| Authentication | JWT (24h expiry), stored in localStorage |
| Authorization | Role-based via `require_roles()`; admin bypasses all role checks |
| Password storage | bcrypt one-way hash |
| Input validation | Pydantic schemas on all write endpoints |
| CORS | Configurable origin whitelist |
| SQL injection | SQLAlchemy parameterized queries |

**Roles:** `citizen`, `volunteer`, `donor`, `ngo`, `hospital`, `admin`

---

## 8. Deployment Design

### 8.1 Development
```bash
npm run setup      # Install deps, create .env
npm run dev        # Frontend :3000 + Backend :8000
npm run reset:db   # Reset SQLite schema
```

### 8.2 Production (Target)

| Service | Port | Notes |
|---------|------|-------|
| Nginx | 443 | TLS termination, reverse proxy |
| Next.js | 3000 | SSR/static |
| Uvicorn | 8000 | FastAPI workers |
| PostgreSQL | 5432 | Managed DB |

Environment variables: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`.

---

## 9. Related Documents

| Phase | Documents |
|-------|-----------|
| Phase 1 | `docs/business-analysis/` |
| Phase 2 | `docs/prd/` |
| Phase 3 | `docs/srs/` |
| Phase 4 | `docs/tdd/` (this folder) |

### Phase 4 Index

| # | Document | Description |
|---|----------|-------------|
| 18 | [ERD](./18-erd.md) | Entity relationship diagram |
| 19 | [System Design](./19-system-design.md) | Architecture & components |
| 20 | TDD | This master document |
| 21 | [Database Design](./21-database-design.md) | Tables, columns, indexes |
| 22 | [API Design](./22-api-design.md) | REST endpoint specification |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [19 — System Design](./19-system-design.md) |
| **Current** | 20 — TDD |
| **Next** | [21 — Database Design](./21-database-design.md) |

---

*Phase 4 — Technical Design Document | VERA*
