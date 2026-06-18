# 17 — Software Requirements Specification (SRS)

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Course** | CSE309 — Web Design |
| **Section** | 06 |
| **Instructor** | Sayef Reyadh |
| **Phase** | 3 — Software Requirements Specification (SRS) |
| **Version** | 1.0 |
| **Date** | 18/06/2026 |
| **Status** | Approved for design and implementation |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [System Features](#3-system-features)
4. [External Interface Requirements](#4-external-interface-requirements)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Other Requirements](#6-other-requirements)
7. [Appendices](#7-appendices)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) describes the functional and non-functional requirements for **VERA (Volunteer Emergency Response Alliance)** — a web-based emergency assistance and resource coordination platform for Bangladesh.

### 1.2 Scope
VERA connects citizens, volunteers, donors, NGOs, hospitals, and administrators through a centralized system for emergency requests, blood matching, resource tracking, donations, and disaster coverage monitoring.

**In scope:** Web application (Next.js frontend, FastAPI backend), JWT authentication, role-based access, 14 database entities, REST API.

**Out of scope:** Native mobile apps, SMS/offline mode, payment gateway integration (MVP).

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|------------|
| VERA | Volunteer Emergency Response Alliance |
| JWT | JSON Web Token |
| NGO | Non-Governmental Organization |
| MVP | Minimum Viable Product |
| SRS | Software Requirements Specification |
| DFD | Data Flow Diagram |
| ERD | Entity Relationship Diagram |

### 1.4 References

| Document | Location |
|----------|----------|
| Project Overview | `docs/business-analysis/01-project-overview.md` |
| PRD | `docs/prd/08-prd.md` |
| Functional Requirements | `docs/srs/13-functional-requirements.md` |
| Non-Functional Requirements | `docs/srs/14-non-functional-requirements.md` |
| Use Cases | `docs/srs/15-use-cases.md` |
| DFD | `docs/srs/16-dfd.md` |

### 1.5 Overview
The remainder of this document provides system context, detailed feature requirements, interface specifications, and appendices linking to detailed sub-documents.

---

## 2. Overall Description

### 2.1 Product Perspective
VERA is a standalone web system comprising:
- **Frontend:** Next.js 16 SPA with Tailwind CSS
- **Backend:** FastAPI REST API
- **Database:** SQLite (development), PostgreSQL (production target)

```
[Browser] ←→ [Next.js :3000] ←→ [FastAPI :8000] ←→ [Database]
```

### 2.2 Product Functions (Summary)
1. User registration and authentication
2. Emergency and blood request management
3. Volunteer verification and opportunities
4. NGO resource and coordination management
5. Donations and fundraising campaigns
6. Shelter and incident reporting
7. Location-based search
8. Disaster coverage monitoring
9. Notifications and admin reporting

### 2.3 User Classes

| Class | Description |
|-------|-------------|
| Citizen | General public reporting emergencies |
| Volunteer | Field responders (verified) |
| Donor | Blood or financial contributors |
| NGO | Relief organizations |
| Hospital | Medical / blood bank facilities |
| Admin | Platform administrators |

### 2.4 Operating Environment
- **Client:** Modern web browsers (Chrome, Firefox, Edge, Safari)
- **Server:** Python 3.11+, Node.js 18+
- **OS:** Windows, Linux, macOS (development); Linux (production)
- **Network:** Internet required

### 2.5 Design & Implementation Constraints
- REST API with JSON payloads
- JWT bearer authentication
- Role-based access control on all protected endpoints
- Mobile-responsive UI required

### 2.6 Assumptions & Dependencies
- Users have internet access
- Email addresses are valid and accessible
- Location data provided by user or browser geolocation
- Admin manually reviews volunteer verification (MVP)

---

## 3. System Features

Detailed specifications: [`13-functional-requirements.md`](./13-functional-requirements.md)

| Module | Features | FR IDs |
|--------|----------|--------|
| Authentication | Register, login, profile, RBAC | FR-01 → FR-04 |
| Volunteer/Donor | Verification, become donor | FR-05 → FR-07 |
| Emergency | Submit, verify, update | FR-08 → FR-09 |
| Blood | Request, resolve, search, notify | FR-10 → FR-12 |
| NGO | Resources, coordination | FR-13 → FR-14 |
| Donations | Donate, campaigns | FR-15 → FR-16 |
| Disaster | Shelters, incidents, coverage | FR-17 → FR-19 |
| Volunteers | Opportunities, certificates | FR-20 → FR-21 |
| Search | Nearby location search | FR-22 |
| System | Notifications, dashboard, reports | FR-23 → FR-25 |

Use case details: [`15-use-cases.md`](./15-use-cases.md)

---

## 4. External Interface Requirements

### 4.1 User Interfaces
| Screen | Path | Purpose |
|--------|------|---------|
| Landing | `/` | Marketing and CTA |
| Register / Login | `/register`, `/login` | Authentication |
| Dashboard | `/dashboard` | Stats and navigation |
| Emergencies | `/emergencies` | Emergency CRUD |
| Blood | `/blood` | Blood requests and donor search |
| Donations | `/donations` | Campaigns and donations |
| Resources | `/resources` | NGO resources and coordination |
| Volunteers | `/volunteers` | Verification, opportunities, certificates |
| Shelters | `/shelters` | Shelter management |
| Incidents | `/incidents` | Disaster reporting |
| Coverage | `/coverage` | Disaster coverage map data |
| Search | `/search` | Location-based search |
| Notifications | `/notifications` | Alert inbox |
| Admin | `/admin` | Operational reports |

### 4.2 Hardware Interfaces
- GPS-enabled devices for location input (browser Geolocation API)
- Standard keyboard/mouse/touch input

### 4.3 Software Interfaces
| Interface | Protocol | Purpose |
|-----------|----------|---------|
| VERA REST API | HTTP/JSON | Frontend ↔ Backend |
| OpenAPI/Swagger | HTTP | API documentation at `/docs` |
| Browser localStorage | JS API | JWT token storage |

### 4.4 Communications Interfaces
- HTTP/HTTPS on ports 3000 (frontend) and 8000 (backend)
- CORS enabled for configured origins

---

## 5. Non-Functional Requirements

Full specification: [`14-non-functional-requirements.md`](./14-non-functional-requirements.md)

| Category | Key Requirements |
|----------|------------------|
| Performance | API < 2s, notifications < 5s |
| Security | bcrypt, JWT, RBAC, HTTPS |
| Usability | Responsive, ≤5 steps for core flows |
| Reliability | 99% uptime target, health check |
| Maintainability | Modular routes, `/api/v1` versioning |
| Data | Timestamps, backups, privacy |

---

## 6. Other Requirements

### 6.1 Legal & Compliance
- User consent required at registration
- Identity documents handled per local data protection practices
- Future: compliance with Bangladesh data protection regulations

### 6.2 Backup & Recovery
- Daily database backups (production)
- Schema reset script for development (`npm run reset:db`)

### 6.3 Documentation Requirements
- API auto-documented via FastAPI OpenAPI
- Phase documents in `docs/` directory
- README with setup instructions

---

## 7. Appendices

### Appendix A — Data Flow Diagrams
See [`16-dfd.md`](./16-dfd.md)

### Appendix B — Traceability Matrix

| Business Objective | SRS FR | Use Case | Implemented |
|--------------------|--------|----------|-------------|
| Minimize response time | FR-10, FR-12 | UC-05, UC-06 | ✅ |
| Connect helpers and victims | FR-08, FR-22 | UC-03, UC-13 | ✅ |
| Transparent donations | FR-15, FR-16 | UC-10, UC-11 | ✅ |
| Volunteer verification | FR-05, FR-06 | UC-07, UC-08 | ✅ |
| Disaster coordination | FR-19 | UC-12 | ✅ |

### Appendix C — Document Index (Phases 1–3)

| Phase | Documents |
|-------|-----------|
| 1 — Business Analysis | `docs/business-analysis/01` → `06` |
| 2 — PRD | `docs/prd/08` → `12` |
| 3 — SRS | `docs/srs/13` → `17` (this document) |
| 4 — TDD | `docs/tdd/18` → `22` |

---

## Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Lead | Md. Mahmudul Hasan | | |
| Team Member | Ridwan Hasan Khandakar | | |
| Instructor | Sayef Reyadh | | |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [16 — DFD](./16-dfd.md) |
| **Current** | 17 — SRS (Master Document) |
| **Next** | [18 — ERD](../tdd/18-erd.md) |

---

*Phase 3 — Software Requirements Specification | VERA*
