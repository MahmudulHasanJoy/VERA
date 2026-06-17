# VERA — Project Overview

**Volunteer Emergency Response Alliance**

| Field | Detail |
|-------|--------|
| **Course** | CSE307 — System Analysis and Design |
| **Section** | 02 |
| **Instructor** | Dr. Razib Hayat Khan |
| **Phase** | Project Idea & Business Analysis |
| **Repository** | [github.com/Mahmud2311960/VERA](https://github.com/Mahmud2311960/VERA) |

---

## 1. Executive Summary

VERA (Volunteer Emergency Response Alliance) is a centralized emergency assistance and resource coordination platform designed for Bangladesh. It connects people in need with volunteers, donors, NGOs, hospitals, blood banks, and relief organizations through a single web-based system.

The platform replaces fragmented communication on Facebook, WhatsApp, and personal networks with a structured, role-based platform that improves response speed, transparency, and resource allocation during everyday emergencies and large-scale disasters.

---

## 2. Problem Statement

Bangladesh faces frequent emergencies — road accidents, medical crises, floods, cyclones, fires, and humanitarian disasters. When help is needed urgently, people currently rely on:

- Social media posts and groups
- Personal calls and messaging apps
- Word-of-mouth coordination

This leads to:

- **Slow response times** when minutes matter
- **No central coordination** between volunteers, hospitals, and NGOs
- **Difficulty finding blood donors** during medical emergencies
- **Uneven resource distribution** — some areas receive duplicate aid while others are left unattended
- **Lack of donation transparency** for fundraising during crises
- **No verified volunteer network** ready to deploy when disasters strike

---

## 3. Proposed Solution

VERA provides a unified information system where:

- **Citizens** report emergencies (medical, blood, ambulance, shelter, rescue, transport, missing persons)
- **Volunteers** are verified, assigned to requests, and recognized through certificates
- **Hospitals & blood banks** broadcast urgent needs and coordinate donors
- **NGOs** manage resources, recruit volunteers, and coordinate relief operations
- **Donors** contribute money and materials with tracked allocation
- **Administrators** monitor operations and generate reports

The system supports location-based search, disaster coverage monitoring, shelter management, incident reporting, and automated notifications to relevant stakeholders.

---

## 4. Business Objectives

1. Establish a common platform for emergency services and resource coordination
2. Minimize response time for medical emergencies, natural disasters, and humanitarian crises
3. Connect blood donors to recipients quickly through targeted matching
4. Enable transparent fundraising and donation tracking
5. Help NGOs recruit, manage, and certify volunteers
6. Track relief operations geographically and identify underserved areas
7. Build a ready-to-deploy volunteer network through everyday platform use

---

## 5. Stakeholders

| Stakeholder | Role |
|-------------|------|
| Citizens / victims | Submit emergency and incident reports |
| Volunteers | Respond to requests, join relief missions |
| Blood donors | Register and receive targeted blood alerts |
| Hospitals & blood banks | Broadcast urgent medical needs |
| NGOs & relief organizations | Coordinate resources and volunteer teams |
| Donors | Contribute funds and relief materials |
| Government & disaster management authorities | Oversight and large-scale coordination |
| Students & educational institutions | Participate in volunteer programs |
| System administrators | Verify requests, manage users, generate reports |

---

## 6. Value Proposition

| For | Value |
|-----|-------|
| **People in need** | Faster access to help through one platform instead of scattered outreach |
| **Volunteers** | Verified opportunities, certificates, and coordinated assignments |
| **NGOs** | Central hub for resource tracking, volunteer recruitment, and field coordination |
| **Donors** | Transparent tracking of how contributions are used |
| **Hospitals** | Direct blood and emergency alerts to nearby matching resources |
| **Nation** | Better disaster preparedness through a continuously active volunteer ecosystem |

---

## 7. Key Features (Functional Scope)

| # | Feature | Description |
|---|---------|-------------|
| 1 | User registration & authentication | Secure accounts with role-based access |
| 2 | Volunteer verification | NID/Passport identity submission and admin approval |
| 3 | Become a donor | Registration with blood group and availability |
| 4 | Emergency requests | Medical, rescue, shelter, transport, and more |
| 5 | Blood request management | Create, search donors, notify, and resolve requests |
| 6 | Resource tracking | NGOs track food, medicine, clothing, and equipment |
| 7 | NGO coordination | Organizations request and deploy volunteer support |
| 8 | Donation management | Money and material contributions with allocation tracking |
| 9 | Fundraising campaigns | NGOs create campaigns and track funds raised |
| 10 | Notification system | Alerts for blood requests, verification, and underserved areas |
| 11 | Shelter management | Available shelters with bed capacity |
| 12 | Incident reporting | Disaster-related emergency information |
| 13 | Request verification | Authorized users validate emergency requests |
| 14 | Volunteer opportunities | NGOs publish programs; volunteers apply |
| 15 | Certificate management | Issue and verify volunteer participation certificates |
| 16 | Disaster coverage monitoring | Map underserved areas and relief status |
| 17 | Location-based search | Find nearby volunteers, hospitals, shelters, resources |
| 18 | Admin reports | Operational and statistical reporting |

---

## 8. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| Backend | FastAPI (Python), SQLAlchemy |
| Database | SQLite (development), PostgreSQL (production target) |
| Authentication | JWT |
| Maps | Maps API (planned) |
| Notifications | SMS & Email gateway (planned) |
| Hosting | AWS / cloud server (planned) |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Fake emergency requests | Request verification workflow, admin review, status tracking |
| Volunteer safety | Verification before field assignment; verified-only actions |
| Misinformation / duplicates | Centralized status updates, duplicate detection (planned) |
| Internet outage during disasters | Offline/SMS fallback strategy (future phase) |
| Low digital literacy in rural areas | Simple UI, phone-based support channel (future phase) |
| System overload during disasters | Cloud hosting, scalable architecture |

---

## 10. Opportunities

- **Targeted routing** — e.g. blood requests alert only matching donors nearby
- **Ready-to-deploy volunteers** — everyday use keeps the network active before disasters
- **National safety ecosystem** — long-term vision for countrywide emergency coordination
- **Global scalability** — the underlying crisis model applies beyond Bangladesh

---

## 11. Project Team

| ID | Name | Contribution |
|----|------|--------------|
| 2311960 | Md. Mahmudul Hasan | 100% |
| 2310604 | Ridwan Hasan Khandakar | 100% |
| 2022752 | Kazi Fatema Tuj Johra | 100% |
| 2312226 | Fouzia Abida | 100% |
| 2310690 | Syed Mehedi Hussain | 100% |
| 2210892 | Sowhardra Paul | 100% |

---

## 12. Current Implementation Status

The MVP implementation includes the full backend API and Next.js frontend with all core features listed in Section 7. Development can be started locally with:

```bash
npm run setup   # first time only
npm run dev     # starts frontend + backend
```

- **Frontend:** http://localhost:3000
- **API docs:** http://localhost:8000/docs

---

## 13. Roadmap (Post-MVP)

1. PostgreSQL + Alembic database migrations
2. Maps API integration for real-time location tracking
3. SMS and email notification gateway
4. Mobile application
5. Offline/low-connectivity support for disaster scenarios
6. Government and disaster-management authority integrations

---

*Document version: 1.0 — Project Idea & Business Analysis Phase*
