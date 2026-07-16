# D — Requirement Discovery

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Course** | CSE307 — System Analysis and Design |
| **Phase** | 5 — System Analysis and Development Issues |
| **Section** | D — Requirement Discovery |

---

## D1. Suitable Requirement Discovery Methods (with Justification)

Requirement discovery (elicitation) is the process of finding, understanding, and documenting what stakeholders need from the system. For VERA we selected a **combination of four complementary methods**, because no single technique captures the needs of such a diverse stakeholder base (citizens, volunteers, donors, NGOs, hospitals, admins).

### D1.1 Selected Methods

| # | Method | Why it suits VERA (Justification) |
|---|--------|-----------------------------------|
| 1 | **Interviews** | Best for deep, qualitative insight from key stakeholders (NGO coordinators, hospital staff, admins) who understand real emergency workflows and pain points. Allows follow-up questions. |
| 2 | **Questionnaires / Surveys** | Reach a **large number of citizens, volunteers, and donors** cheaply and quickly to quantify needs (e.g. how they currently request blood). Ideal for a wide, geographically spread audience. |
| 3 | **Observation** | Study **real behaviour** in existing channels (Facebook groups, WhatsApp blood chains) to discover unspoken needs — e.g. duplicated posts, no status tracking — that users may not articulate. |
| 4 | **Document Analysis / Benchmarking** | Review disaster reports, NGO relief records, and similar platforms to extract requirements and avoid reinventing solved problems. |

**Primary method:** Interviews + Surveys (mixed-method), supported by Observation and Document Analysis. This triangulation lets qualitative depth (interviews) validate quantitative breadth (surveys).

### D1.2 Why Not Other Methods (Alone)

| Method | Limitation for VERA |
|--------|---------------------|
| Prototyping only | Useful later for UI validation, but doesn't discover the full breadth of stakeholder needs up front. |
| Brainstorming only | Generates ideas but not grounded in real user data. |
| JAD workshops only | Hard to gather geographically dispersed citizens and NGOs in one room. |

---

## D2. Plan for the Selected Methods

### D2.1 Interview Plan

| Attribute | Detail |
|-----------|--------|
| **Target participants** | NGO coordinators, hospital/blood-bank staff, experienced volunteers, potential admins |
| **Sample size** | 6–10 participants |
| **Format** | Semi-structured, 30–45 min, in-person or online |
| **Sample questions** | How do you currently receive/handle emergency requests? What slows you down? How do you verify volunteers? How do you track donations? |
| **Output** | Interview notes → themed requirements ([`05-interviews.md`](../business-analysis/05-interviews.md)) |

### D2.2 Survey Plan

| Attribute | Detail |
|-----------|--------|
| **Target participants** | General citizens, students, blood donors, volunteers |
| **Sample size** | 100+ respondents |
| **Channel** | Online form shared via social media and campus groups |
| **Question types** | Multiple choice + Likert scale + short answer |
| **Sample questions** | How do you currently request blood? Would you use a verified volunteer platform? Which features matter most? |
| **Output** | Quantitative charts → prioritised needs ([`06-surveys.md`](../business-analysis/06-surveys.md)) |

### D2.3 Observation Plan

| Attribute | Detail |
|-----------|--------|
| **What** | Emergency/blood posts in public Facebook groups; volunteer WhatsApp coordination |
| **Focus** | Structure of requests, duplication, response time, status updates |
| **Output** | Behaviour patterns → structural requirements (dedup, status workflow, controlled contact) |

### D2.4 Document Analysis Plan

| Attribute | Detail |
|-----------|--------|
| **Sources** | Bangladesh disaster statistics, NGO relief reports, WHO coordination literature, similar platforms |
| **Focus** | Common gaps, standards, proven features |
| **Output** | Benchmarked requirements & differentiators |

### D2.5 Discovery Schedule

| Week | Activity | Output |
|------|----------|--------|
| 1 | Document analysis & observation | Problem notes, initial requirements |
| 2 | Conduct stakeholder interviews | Qualitative themes |
| 3 | Distribute & collect surveys | Quantitative data |
| 4 | Synthesise & validate | Final requirement set (FR + NFR) |

---

## D3. All Possible Functional Requirements

Discovered functional requirements, grouped by module (traceable to SRS FR-01 → FR-25).

### Authentication & User Management
- **FR-01** Register with email, password, name, phone, role, optional org/address/blood group.
- **FR-02** Log in and receive a JWT access token.
- **FR-03** View own profile (role, verification status, blood group).
- **FR-04** Enforce role-based access control (citizen, volunteer, donor, ngo, hospital, admin).

### Volunteer & Donor Management
- **FR-05** Volunteers submit identity documents (NID/Passport) for verification.
- **FR-06** Admins approve/reject verification and notify the volunteer.
- **FR-07** Users register as blood donors with blood group and availability.

### Emergency & Blood Requests
- **FR-08** Submit emergency requests (medical, blood, ambulance, food, shelter, rescue, transport, missing person, other) with location and contact.
- **FR-09** List, view, and update emergency status (open, in_progress, verified, resolved, cancelled).
- **FR-10** Create blood requests (patient, group, units, hospital, location, urgency).
- **FR-11** Update/resolve blood request status.
- **FR-12** Notify matching available donors and search donors by blood group.

### NGO, Resources & Coordination
- **FR-13** Log relief resources (food, medicine, clothing, equipment, money) with quantity & location.
- **FR-14** Create and update NGO coordination requests for volunteer support.

### Donations & Fundraising
- **FR-15** Record donations (money, food, medicine, clothing, equipment), optionally linked to a campaign.
- **FR-16** Create fundraising campaigns with goal amount; raised amount updates on donation.

### Shelters, Incidents & Coverage
- **FR-17** Register shelters with capacity, available beds, address, contact.
- **FR-18** Report disaster incidents (type, severity, description, location).
- **FR-19** Report area coverage status (served, partial, underserved, critical); critical areas trigger NGO alerts.

### Volunteers, Certificates & Search
- **FR-20** Publish volunteer opportunities; volunteers apply; NGOs review applications.
- **FR-21** Issue certificates with unique codes; public certificate verification.
- **FR-22** Location-based search for nearby volunteers, hospitals, NGOs, donors, shelters, resources, emergencies.

### Notifications & Reporting
- **FR-23** Deliver in-app notifications (blood alerts, verification updates, coverage alerts); mark as read.
- **FR-24** Dashboard statistics (users, open emergencies, blood requests, volunteers, campaigns, shelters, underserved areas, unread notifications).
- **FR-25** Admin operational reports (users by role, emergencies by status, donations, campaigns, opportunities, incidents).

> Full specifications in [`../srs/13-functional-requirements.md`](../srs/13-functional-requirements.md).

---

## D4. Non-Functional Requirements (at least five)

| # | ID | Category | Requirement |
|---|----|----------|-------------|
| 1 | NFR-P01 | **Performance** | 95% of API requests complete within 2 seconds under normal load (≤100 concurrent users). |
| 2 | NFR-S01 | **Security** | Passwords hashed with bcrypt; plain-text passwords are never stored. JWT-based authentication with role-based access control. |
| 3 | NFR-U01 | **Usability** | The web UI is responsive and usable on desktop, tablet, and mobile; core flows complete in ≤ 5 steps. |
| 4 | NFR-R01 | **Reliability / Availability** | Production system targets 99% monthly uptime; all records persisted before success response. |
| 5 | NFR-M01 | **Maintainability / Scalability** | Modular architecture (routes, models, schemas, services); Alembic migration path; handles 10× traffic spikes during disasters. |
| 6 | NFR-D03 | **Privacy** | User contact details exposed only to authenticated users within appropriate context. |
| 7 | NFR-C01 | **Compatibility** | Supports the latest two versions of Chrome, Firefox, Edge, and Safari. |

> Full specifications in [`../srs/14-non-functional-requirements.md`](../srs/14-non-functional-requirements.md).

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [C — Feasibility Analysis](./C-feasibility-analysis.md) |
| **Current** | D — Requirement Discovery |

---

*Phase 5 — System Analysis and Development Issues | VERA*
