# 08 — Product Requirements Document (PRD)

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Course** | CSE309 — Web Design |
| **Section** | 06 |
| **Instructor** | Sayef Reyadh |
| **Phase** | 2 — Product Requirement Document (PRD) |
| **Version** | 1.0 |
| **Status** | Approved for MVP development |

## Table of Contents

1. [8.1 Purpose](#81-purpose)
2. [8.2 Product Vision](#82-product-vision)
3. [8.3 Target Users](#83-target-users)
4. [8.4 Product Goals & Success Metrics](#84-product-goals--success-metrics)
5. [8.5 Functional Requirements Summary](#85-functional-requirements-summary)
6. [8.6 Non-Functional Requirements](#86-non-functional-requirements)
7. [8.7 User Roles & Permissions](#87-user-roles--permissions)
8. [8.8 Out of Scope](#88-out-of-scope)
9. [8.9 Assumptions & Dependencies](#89-assumptions--dependencies)
10. [8.10 Related Documents](#810-related-documents)

---

## 8.1 Purpose

This Product Requirements Document (PRD) defines **what** VERA must do from a product perspective. It translates business analysis findings (Phase 1) into actionable requirements for design, development, and testing.

**Primary audience:** Developers, designers, QA, project supervisors.

---

## 8.2 Product Vision

> VERA is Bangladesh's centralized emergency assistance platform — connecting people in need with verified volunteers, donors, NGOs, hospitals, and relief organizations through one trusted, location-aware system.

**Problem solved:** Fragmented emergency communication on social media causes slow response, duplicate aid, and opaque donations.

**Product type:** Web application (MVP) with REST API backend.

---

## 8.3 Target Users

| Persona | Role in system | Priority |
|---------|----------------|----------|
| Citizen / victim | Submit emergencies, blood requests | P0 |
| Volunteer | Respond, verify, earn certificates | P0 |
| Blood donor | Register, receive targeted alerts | P0 |
| NGO coordinator | Resources, volunteers, campaigns | P0 |
| Hospital / blood bank | Broadcast urgent medical needs | P1 |
| Financial donor | Donate and track allocation | P1 |
| Administrator | Verify, report, manage platform | P1 |
| Student volunteer | Find opportunities, get certificates | P2 |

Detailed personas: [`09-user-personas.md`](./09-user-personas.md)

---

## 8.4 Product Goals & Success Metrics

| Goal | Metric | MVP Target |
|------|--------|------------|
| Faster emergency connection | Time from request to first responder contact | < 30 min (pilot) |
| Blood donor matching | % requests with matching donor notified | 100% auto-notify |
| Platform adoption | Registered users | 500+ (pilot) |
| Trust | % volunteers verified before field assignment | 100% for verified actions |
| Transparency | Donations with allocation record | 100% logged |
| Coordination | Underserved areas reported and visible | Map/list view available |

---

## 8.5 Functional Requirements Summary

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | User registration with role selection | P0 |
| FR-02 | Secure login / logout (JWT) | P0 |
| FR-03 | Role-based access control | P0 |
| FR-04 | Volunteer verification (NID/Passport) | P0 |
| FR-05 | Become a blood donor | P0 |
| FR-06 | Emergency request submission | P0 |
| FR-07 | Emergency request verification | P0 |
| FR-08 | Blood request create / resolve | P0 |
| FR-09 | Blood donor search & notification | P0 |
| FR-10 | NGO resource tracking | P1 |
| FR-11 | NGO coordination requests | P1 |
| FR-12 | Donation management | P1 |
| FR-13 | Fundraising campaigns | P1 |
| FR-14 | Notification system | P0 |
| FR-15 | Shelter management | P1 |
| FR-16 | Incident reporting | P1 |
| FR-17 | Volunteer opportunity management | P1 |
| FR-18 | Certificate issue & verification | P2 |
| FR-19 | Location-based nearby search | P1 |
| FR-20 | Disaster coverage monitoring | P1 |
| FR-21 | Admin operational reports | P1 |

User stories: [`11-user-stories.md`](./11-user-stories.md)  
Acceptance criteria: [`12-acceptance-criteria.md`](./12-acceptance-criteria.md)

---

## 8.6 Non-Functional Requirements

| ID | Category | Requirement |
|----|----------|-------------|
| NFR-01 | Performance | API response < 2s under normal load |
| NFR-02 | Security | Password hashing, JWT expiry, HTTPS in production |
| NFR-03 | Security | Role-based endpoint protection |
| NFR-04 | Usability | Mobile-responsive web UI |
| NFR-05 | Usability | Core flows completable in ≤ 5 steps |
| NFR-06 | Availability | 99% uptime target (production) |
| NFR-07 | Scalability | Support 10× traffic spike during disasters |
| NFR-08 | Maintainability | Modular API routes, typed frontend |
| NFR-09 | Data integrity | All donations and requests timestamped and auditable |
| NFR-10 | Privacy | Contact info visible only to authenticated users |

---

## 8.7 User Roles & Permissions

| Feature | Citizen | Volunteer | Donor | NGO | Hospital | Admin |
|---------|---------|-----------|-------|-----|----------|-------|
| Submit emergency | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Verify emergency | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Blood request | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Become donor | ✅ | ✅ | — | ❌ | ❌ | ❌ |
| Volunteer verification | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ approve |
| Resource tracking | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Create campaign | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Issue certificate | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |
| Admin reports | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 8.8 Out of Scope (MVP)

- Native iOS / Android apps
- SMS / offline mode during power outages
- Payment gateway integration (bKash/Nagad API)
- Government disaster management system integration
- AI-based misinformation detection
- Real-time map UI (API location search only in MVP)

---

## 8.9 Assumptions & Dependencies

| Assumption | Dependency |
|------------|------------|
| Users have internet access | Stable hosting (AWS/cloud) |
| Users have email for registration | Email validation service |
| Volunteers provide valid ID | Manual/admin verification workflow |
| Location data is approximate | User-entered or browser geolocation |
| Donations tracked manually in MVP | Future payment gateway |

---

## 8.10 Related Documents

| Document | Description |
|----------|-------------|
| [`09-user-personas.md`](./09-user-personas.md) | Detailed user personas |
| [`10-user-journey.md`](./10-user-journey.md) | End-to-end user journeys |
| [`11-user-stories.md`](./11-user-stories.md) | User stories by epic |
| [`12-acceptance-criteria.md`](./12-acceptance-criteria.md) | Testable acceptance criteria |
| [`../business-analysis/01-project-overview.md`](../business-analysis/01-project-overview.md) | Phase 1 overview |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [06 — Surveys](../business-analysis/06-surveys.md) |
| **Current** | 08 — PRD |
| **Next** | [09 — User Personas](./09-user-personas.md) |

---

*Phase 2 — Product Requirement Document | VERA*
