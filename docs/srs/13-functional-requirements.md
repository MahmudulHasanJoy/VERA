# 13 — Functional Requirements

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 3 — Software Requirements Specification (SRS) |
| **Version** | 1.0 |
| **Traceability** | PRD FR-01 → FR-21, User Stories US-01 → US-40 |

---

## 1. Authentication & User Management

### FR-01 — User Registration
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-01 |
| **Description** | The system shall allow new users to create an account with email, password, full name, phone, role, and optional organization/address/blood group. |
| **Input** | email, password (≥8 chars), full_name, role, optional fields |
| **Output** | User record created, HTTP 201 |
| **Roles** | All (unauthenticated) |
| **API** | `POST /api/v1/auth/register` |

### FR-02 — User Authentication
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-02 |
| **Description** | The system shall authenticate users via email/password and issue a JWT access token. |
| **Input** | email (username), password |
| **Output** | JWT bearer token |
| **API** | `POST /api/v1/auth/login` |

### FR-03 — User Profile
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-03 |
| **Description** | Authenticated users shall retrieve their own profile including role, verification status, and blood group. |
| **API** | `GET /api/v1/auth/me` |

### FR-04 — Role-Based Access Control
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-04 |
| **Description** | The system shall enforce permissions based on roles: citizen, volunteer, donor, ngo, hospital, admin. |
| **Roles** | citizen, volunteer, donor, ngo, hospital, admin |

---

## 2. Volunteer & Donor Management

### FR-05 — Volunteer Verification
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-05 |
| **Description** | Volunteers shall submit NID, Passport, or other identity document type and number for verification review. |
| **API** | `POST /api/v1/volunteers/verification` |

### FR-06 — Verification Review
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-06 |
| **Description** | Administrators shall approve or reject volunteer verification and notify the volunteer. |
| **API** | `PATCH /api/v1/volunteers/{user_id}/verification` |

### FR-07 — Become a Donor
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-07 |
| **Description** | Users shall register as blood donors with blood group and availability flag. |
| **API** | `POST /api/v1/donors/register` |

---

## 3. Emergency & Blood Requests

### FR-08 — Emergency Request Submission
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-08 |
| **Description** | Users shall create emergency requests with title, description, type (medical, blood, ambulance, food, shelter, rescue, transport, missing_person, other), location, and contact. |
| **Types** | medical, blood, ambulance, food, shelter, rescue, transport, missing_person, other |
| **API** | `POST /api/v1/emergencies` |

### FR-09 — Emergency Request Management
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-09 |
| **Description** | Authorized users shall list, view, and update emergency status and verification. |
| **Statuses** | open, in_progress, verified, resolved, cancelled |
| **API** | `GET/PATCH /api/v1/emergencies` |

### FR-10 — Blood Request Management
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-10 |
| **Description** | Users shall create blood requests with patient name, blood group, units, hospital, location, and urgency flag. |
| **API** | `POST /api/v1/blood/requests` |

### FR-11 — Blood Request Resolution
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-11 |
| **Description** | Authorized users shall update blood request status (e.g., mark resolved). |
| **API** | `PATCH /api/v1/blood/requests/{id}` |

### FR-12 — Blood Donor Search & Notification
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-12 |
| **Description** | On blood request creation, the system shall notify matching available donors. Users shall search donors by blood group. |
| **API** | `GET /api/v1/blood/donors?blood_group=` |

---

## 4. NGO, Resources & Coordination

### FR-13 — Resource Tracking
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-13 |
| **Description** | NGOs and hospitals shall log relief resources (food, medicine, clothing, equipment, money) with quantity and location. |
| **API** | `POST/GET /api/v1/resources` |

### FR-14 — NGO Coordination
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-14 |
| **Description** | NGOs shall create coordination requests for volunteer support and update status. |
| **API** | `POST/GET/PATCH /api/v1/coordination` |

---

## 5. Donations & Fundraising

### FR-15 — Donation Management
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-15 |
| **Description** | Users shall record donations (money, food, medicine, clothing, equipment) with optional campaign linkage. |
| **API** | `POST/GET /api/v1/donations` |

### FR-16 — Fundraising Campaigns
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-16 |
| **Description** | NGOs shall create campaigns with title, description, cause, and goal amount. Raised amount updates on donation. |
| **API** | `POST/GET /api/v1/campaigns` |

---

## 6. Shelters, Incidents & Coverage

### FR-17 — Shelter Management
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-17 |
| **Description** | NGOs shall register shelters with capacity, available beds, address, and contact. |
| **API** | `POST/GET /api/v1/shelters` |

### FR-18 — Incident Reporting
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-18 |
| **Description** | Users shall report disaster incidents with type, severity, description, and location. |
| **API** | `POST/GET /api/v1/incidents` |

### FR-19 — Disaster Coverage Monitoring
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-19 |
| **Description** | Authorized users shall report area coverage status (served, partial, underserved, critical). Critical/underserved areas trigger NGO notifications. |
| **API** | `POST/GET /api/v1/coverage` |

---

## 7. Volunteers, Certificates & Search

### FR-20 — Volunteer Opportunities
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-20 |
| **Description** | NGOs shall publish volunteer opportunities; volunteers shall apply; NGOs review applications. |
| **API** | `POST/GET /api/v1/opportunities`, `POST .../apply`, `PATCH /api/v1/applications/{id}/review` |

### FR-21 — Certificate Management
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-21 |
| **Description** | NGOs shall issue certificates with unique codes; anyone shall verify certificates publicly. |
| **API** | `POST/GET /api/v1/certificates`, `GET /api/v1/certificates/verify/{code}` |

### FR-22 — Location-Based Search
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-22 |
| **Description** | Users shall search nearby volunteers, hospitals, NGOs, donors, shelters, resources, and emergencies by coordinates and radius. |
| **API** | `GET /api/v1/search/nearby` |

---

## 8. Notifications & Reporting

### FR-23 — Notification System
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-23 |
| **Description** | The system shall deliver in-app notifications for blood alerts, verification updates, and underserved area reports. Users shall mark notifications read. |
| **API** | `GET /api/v1/notifications`, `PATCH /api/v1/notifications/{id}/read` |

### FR-24 — Dashboard Statistics
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-24 |
| **Description** | Authenticated users shall view dashboard metrics: users, open emergencies, blood requests, volunteers, campaigns, shelters, underserved areas, unread notifications. |
| **API** | `GET /api/v1/stats/dashboard` |

### FR-25 — Admin Reports
| Attribute | Specification |
|-----------|---------------|
| **ID** | FR-25 |
| **Description** | Administrators shall generate operational reports: users by role, emergencies by status, donations, campaigns, opportunities, incidents. |
| **API** | `GET /api/v1/reports/admin` |

---

## Functional Requirements Traceability Matrix

| FR ID | PRD FR | User Story | Implemented |
|-------|--------|------------|-------------|
| FR-01 | FR-01 | US-01 | ✅ |
| FR-02 | FR-02 | US-02 | ✅ |
| FR-08 | FR-06 | US-13 | ✅ |
| FR-10 | FR-08 | US-09 | ✅ |
| FR-12 | FR-09 | US-10 | ✅ |
| FR-23 | FR-14 | US-37 | ✅ |
| FR-25 | FR-21 | US-39 | ✅ |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [12 — Acceptance Criteria](../prd/12-acceptance-criteria.md) |
| **Current** | 13 — Functional Requirements |
| **Next** | [14 — Non-Functional Requirements](./14-non-functional-requirements.md) |

---

*Phase 3 — Software Requirements Specification | VERA*
