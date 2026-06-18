# 14 — Non-Functional Requirements

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 3 — Software Requirements Specification (SRS) |
| **Version** | 1.0 |

---

## 1. Performance Requirements

### NFR-P01 — API Response Time
| ID | NFR-P01 |
|----|---------|
| **Requirement** | 95% of API requests shall complete within 2 seconds under normal load (≤100 concurrent users). |
| **Measurement** | Server-side response time logging |
| **Priority** | High |

### NFR-P02 — Page Load Time
| ID | NFR-P02 |
|----|---------|
| **Requirement** | Frontend pages shall achieve First Contentful Paint < 2s on broadband connections. |
| **Measurement** | Lighthouse / browser dev tools |
| **Priority** | Medium |

### NFR-P03 — Blood Notification Latency
| ID | NFR-P03 |
|----|---------|
| **Requirement** | Donor notifications shall be created within 5 seconds of blood request submission. |
| **Priority** | High |

### NFR-P04 — Disaster Traffic Spike
| ID | NFR-P04 |
|----|---------|
| **Requirement** | System shall handle 10× normal traffic during disaster events without data loss (production target). |
| **Priority** | Medium (production) |

---

## 2. Security Requirements

### NFR-S01 — Password Storage
| ID | NFR-S01 |
|----|---------|
| **Requirement** | Passwords shall be hashed using bcrypt before storage. Plain-text passwords shall never be persisted. |
| **Implementation** | `passlib[bcrypt]` |

### NFR-S02 — Authentication Token
| ID | NFR-S02 |
|----|---------|
| **Requirement** | API access shall require JWT bearer tokens with configurable expiry (default 24 hours). |
| **Implementation** | `python-jose`, HS256 |

### NFR-S03 — Authorization
| ID | NFR-S03 |
|----|---------|
| **Requirement** | All protected endpoints shall validate JWT and enforce role-based access control. |
| **Implementation** | `require_roles()` dependency |

### NFR-S04 — HTTPS
| ID | NFR-S04 |
|----|---------|
| **Requirement** | Production deployment shall enforce HTTPS for all client-server communication. |
| **Priority** | High (production) |

### NFR-S05 — Input Validation
| ID | NFR-S05 |
|----|---------|
| **Requirement** | All API inputs shall be validated via Pydantic schemas before processing. |
| **Implementation** | FastAPI + Pydantic v2 |

### NFR-S06 — CORS
| ID | NFR-S06 |
|----|---------|
| **Requirement** | CORS shall be restricted to configured frontend origins in production. |
| **Implementation** | `CORSMiddleware`, `CORS_ORIGINS` env |

---

## 3. Usability Requirements

### NFR-U01 — Responsive Design
| ID | NFR-U01 |
|----|---------|
| **Requirement** | Web UI shall be usable on desktop, tablet, and mobile screen sizes. |
| **Implementation** | Tailwind CSS responsive utilities |

### NFR-U02 — Task Completion Steps
| ID | NFR-U02 |
|----|---------|
| **Requirement** | Core flows (register, submit emergency, submit blood request) shall complete in ≤ 5 user steps. |
| **Priority** | High |

### NFR-U03 — Error Messages
| ID | NFR-U03 |
|----|---------|
| **Requirement** | User-facing errors shall display clear, actionable messages (not raw stack traces). |
| **Implementation** | Frontend `ApiError` handler |

### NFR-U04 — Accessibility Target
| ID | NFR-U04 |
|----|---------|
| **Requirement** | Forms shall use semantic HTML labels; colour contrast shall meet WCAG 2.1 AA where feasible. |
| **Priority** | Medium |

---

## 4. Reliability & Availability

### NFR-R01 — Uptime
| ID | NFR-R01 |
|----|---------|
| **Requirement** | Production system shall target 99% monthly uptime. |
| **Priority** | Medium (production) |

### NFR-R02 — Data Persistence
| ID | NFR-R02 |
|----|---------|
| **Requirement** | All created requests, donations, and user records shall be persisted before API success response. |
| **Implementation** | SQLAlchemy transactions |

### NFR-R03 — Health Check
| ID | NFR-R03 |
|----|---------|
| **Requirement** | Backend shall expose `GET /health` for monitoring. |
| **Implementation** | `app/main.py` |

---

## 5. Scalability & Maintainability

### NFR-M01 — Modular Architecture
| ID | NFR-M01 |
|----|---------|
| **Requirement** | Backend shall separate routes, models, schemas, and services into distinct modules. |
| **Structure** | `app/api/routes/`, `app/models/`, `app/schemas/` |

### NFR-M02 — Database Migration Path
| ID | NFR-M02 |
|----|---------|
| **Requirement** | Schema changes shall be migratable via Alembic when moving to PostgreSQL. |
| **Priority** | Medium |

### NFR-M03 — API Versioning
| ID | NFR-M03 |
|----|---------|
| **Requirement** | All endpoints shall be prefixed with `/api/v1` to support future versions. |

### NFR-M04 — Type Safety
| ID | NFR-M04 |
|----|---------|
| **Requirement** | Frontend shall use TypeScript with shared type definitions for API entities. |
| **Implementation** | `frontend/src/types/` |

---

## 6. Compatibility Requirements

### NFR-C01 — Browser Support
| ID | NFR-C01 |
|----|---------|
| **Requirement** | Support latest two versions of Chrome, Firefox, Edge, and Safari. |

### NFR-C02 — Backend Runtime
| ID | NFR-C02 |
|----|---------|
| **Requirement** | Backend shall run on Python 3.11+ with FastAPI and Uvicorn. |

### NFR-C03 — Development Environment
| ID | NFR-C03 |
|----|---------|
| **Requirement** | Single `npm run dev` command shall start frontend and backend concurrently. |

---

## 7. Data Requirements

### NFR-D01 — Audit Trail
| ID | NFR-D01 |
|----|---------|
| **Requirement** | All records shall include `created_at` timestamps; emergencies and coverage include `updated_at`. |

### NFR-D02 — Data Backup
| ID | NFR-D02 |
|----|---------|
| **Requirement** | Production database shall have daily automated backups with 30-day retention. |
| **Priority** | High (production) |

### NFR-D03 — Privacy
| ID | NFR-D03 |
|----|---------|
| **Requirement** | User contact details shall only be exposed to authenticated users within appropriate context. |

---

## 8. Operational Requirements

### NFR-O01 — Configuration
| ID | NFR-O01 |
|----|---------|
| **Requirement** | Secrets (JWT key, database URL) shall be loaded from environment variables, not hardcoded. |
| **Files** | `backend/.env`, `frontend/.env.local` |

### NFR-O02 — API Documentation
| ID | NFR-O02 |
|----|---------|
| **Requirement** | Backend shall auto-generate OpenAPI docs at `/docs`. |

### NFR-O03 — Logging
| ID | NFR-O03 |
|----|---------|
| **Requirement** | Production shall log errors and authentication failures for security monitoring. |
| **Priority** | Medium (production) |

---

## NFR Summary Matrix

| Category | Count | High Priority |
|----------|-------|---------------|
| Performance | 4 | 2 |
| Security | 6 | 4 |
| Usability | 4 | 2 |
| Reliability | 3 | 1 |
| Maintainability | 4 | 1 |
| Compatibility | 3 | 1 |
| Data | 3 | 1 |
| Operational | 3 | 1 |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [13 — Functional Requirements](./13-functional-requirements.md) |
| **Current** | 14 — Non-Functional Requirements |
| **Next** | [15 — Use Cases](./15-use-cases.md) |

---

*Phase 3 — Software Requirements Specification | VERA*
