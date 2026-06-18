# 12 — Acceptance Criteria

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 2 — Product Requirement Document (PRD) |
| **Format** | Given / When / Then (Gherkin-style) |

---

## AC-01 — User Registration

**Related:** US-01, FR-01

| # | Criterion |
|---|-----------|
| AC-01.1 | **Given** a visitor on the register page, **When** they submit valid email, password (≥8 chars), name, and role, **Then** an account is created and they receive a success response. |
| AC-01.2 | **Given** an email already registered, **When** registration is attempted, **Then** the system returns an error "Email already registered". |
| AC-01.3 | **Given** a donor role selected, **When** blood group is omitted, **Then** registration still succeeds (blood group optional at register). |
| AC-01.4 | **Given** successful registration, **When** the user logs in, **Then** JWT token is issued valid for 24 hours. |

---

## AC-02 — Authentication

**Related:** US-02, US-03, FR-02

| # | Criterion |
|---|-----------|
| AC-02.1 | **Given** valid credentials, **When** user logs in, **Then** access token is returned and stored client-side. |
| AC-02.2 | **Given** invalid credentials, **When** login is attempted, **Then** HTTP 401 is returned. |
| AC-02.3 | **Given** a logged-in user, **When** they call `/api/v1/auth/me`, **Then** their profile is returned. |
| AC-02.4 | **Given** a logged-out user, **When** they access protected routes, **Then** they are redirected to login. |

---

## AC-03 — Volunteer Verification

**Related:** US-05, US-06, FR-04

| # | Criterion |
|---|-----------|
| AC-03.1 | **Given** a volunteer user, **When** they submit NID type and number, **Then** `verification_status` is set to `pending`. |
| AC-03.2 | **Given** a pending volunteer, **When** admin approves, **Then** `is_verified = true` and notification is sent. |
| AC-03.3 | **Given** a citizen role, **When** they attempt verification submit, **Then** HTTP 403 is returned. |

---

## AC-04 — Blood Requests & Donors

**Related:** US-08 → US-12, FR-05, FR-08, FR-09

| # | Criterion |
|---|-----------|
| AC-04.1 | **Given** an authenticated user, **When** they create a blood request with patient name, group, and phone, **Then** request appears in list with status `open`. |
| AC-04.2 | **Given** a new B+ blood request, **When** saved, **Then** all active B+ donors with `available_for_donation = true` receive a notification. |
| AC-04.3 | **Given** a blood request ID, **When** authorized user sets status to `resolved`, **Then** request no longer appears as open. |
| AC-04.4 | **Given** blood group filter `O+`, **When** donor search is called, **Then** only O+ donors are returned. |
| AC-04.5 | **Given** a citizen, **When** they call become-donor with blood group, **Then** role updates to `donor` and group is saved. |

---

## AC-05 — Emergency Requests

**Related:** US-13 → US-16, FR-06, FR-07

| # | Criterion |
|---|-----------|
| AC-05.1 | **Given** an authenticated user, **When** they submit title, description, and type, **Then** emergency is created with status `open`. |
| AC-05.2 | **Given** description < 10 characters, **When** submit is attempted, **Then** validation error is returned. |
| AC-05.3 | **Given** a volunteer/NGO/hospital user, **When** they verify a request, **Then** `is_verified = true` and status can be set to `verified`. |
| AC-05.4 | **Given** a citizen, **When** they attempt to verify a request, **Then** HTTP 403 is returned. |

---

## AC-06 — NGO Resources & Coordination

**Related:** US-17, US-18, FR-10, FR-11

| # | Criterion |
|---|-----------|
| AC-06.1 | **Given** an NGO user, **When** they add a resource with name, type, and quantity, **Then** it appears in the resource list. |
| AC-06.2 | **Given** a citizen, **When** they attempt to create a resource, **Then** HTTP 403 is returned. |
| AC-06.3 | **Given** an NGO, **When** they create a coordination request, **Then** it is visible to all authenticated users. |

---

## AC-07 — Donations & Campaigns

**Related:** US-20 → US-23, FR-12, FR-13

| # | Criterion |
|---|-----------|
| AC-07.1 | **Given** an authenticated user, **When** they donate ৳1000 to a campaign, **Then** donation is logged and campaign `raised_amount` increases by 1000. |
| AC-07.2 | **Given** an NGO, **When** they create a campaign with goal, **Then** campaign appears with status `active` and `raised_amount = 0`. |
| AC-07.3 | **Given** a donor, **When** they view donations, **Then** only their own donations are listed (unless admin). |

---

## AC-08 — Shelters & Incidents

**Related:** US-24 → US-27, FR-15, FR-16

| # | Criterion |
|---|-----------|
| AC-08.1 | **Given** an NGO, **When** they register a shelter with capacity and available beds, **Then** shelter appears in active list. |
| AC-08.2 | **Given** available beds > capacity, **When** submit is attempted, **Then** validation error is returned. |
| AC-08.3 | **Given** a citizen, **When** they report an incident with type and location, **Then** incident is created with status `open`. |

---

## AC-09 — Volunteer Opportunities & Certificates

**Related:** US-28 → US-32, FR-17, FR-18

| # | Criterion |
|---|-----------|
| AC-09.1 | **Given** an NGO, **When** they publish an opportunity with slots, **Then** volunteers can see and apply. |
| AC-09.2 | **Given** a verified volunteer, **When** they apply, **Then** application is created with status `pending`. |
| AC-09.3 | **Given** an NGO, **When** they issue a certificate, **Then** unique `certificate_code` is generated. |
| AC-09.4 | **Given** a valid certificate code, **When** verify endpoint is called, **Then** certificate details are returned (no auth required). |
| AC-09.5 | **Given** an invalid code, **When** verify is called, **Then** HTTP 404 is returned. |

---

## AC-10 — Location Search & Coverage

**Related:** US-33 → US-36, FR-19, FR-20

| # | Criterion |
|---|-----------|
| AC-10.1 | **Given** latitude/longitude, **When** nearby search is called, **Then** results are sorted by distance ascending. |
| AC-10.2 | **Given** search type `donor`, **When** search is called, **Then** only donor users are returned. |
| AC-10.3 | **Given** an NGO reports area as `critical`, **When** saved, **Then** all NGO users receive underserved area notification. |
| AC-10.4 | **Given** coverage list, **When** viewed, **Then** areas show status: served, partial, underserved, or critical. |

---

## AC-11 — Notifications

**Related:** US-37, US-38, FR-14

| # | Criterion |
|---|-----------|
| AC-11.1 | **Given** a blood request triggers donor alerts, **When** donors check notifications, **Then** unread alert is visible. |
| AC-11.2 | **Given** an unread notification, **When** user marks it read, **Then** `is_read = true`. |
| AC-11.3 | **Given** dashboard stats, **When** loaded, **Then** unread notification count is accurate. |

---

## AC-12 — Admin Reports

**Related:** US-39, US-40, FR-21

| # | Criterion |
|---|-----------|
| AC-12.1 | **Given** an admin user, **When** they access `/api/v1/reports/admin`, **Then** users-by-role and emergency stats are returned. |
| AC-12.2 | **Given** a non-admin user, **When** they access admin report, **Then** HTTP 403 is returned. |
| AC-12.3 | **Given** dashboard page, **When** loaded, **Then** stats show open emergencies, blood requests, volunteers, campaigns, shelters, underserved areas. |

---

## Definition of Done (MVP)

A user story is **Done** when:

- [ ] All acceptance criteria pass manual or automated test
- [ ] API endpoint documented in Swagger (`/docs`)
- [ ] Frontend page functional and responsive
- [ ] Role-based access enforced on API
- [ ] No critical linter or build errors
- [ ] Code merged to `main` branch

---

## Test Priority Matrix

| Priority | Stories | Test focus |
|----------|---------|------------|
| P0 — Smoke | US-01, US-02, US-09, US-13, US-37 | Auth, blood, emergency, notifications |
| P1 — Core | US-17, US-20, US-24, US-28, US-33 | NGO, donations, shelters, search |
| P2 — Extended | US-30, US-32, US-34 | Certificates, GPS, advanced flows |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [11 — User Stories](./11-user-stories.md) |
| **Current** | 12 — Acceptance Criteria |
| **Next** | Phase 3 (Design) — TBD |

---

*Phase 2 — Product Requirement Document | VERA*
