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

#### Interview Question Structures (Pyramid / Funnel / Diamond)

Following the three interview shapes, VERA matches the **structure to the stakeholder** rather than using one shape for everyone:

| Structure | Shape | Used for | Why |
|-----------|-------|----------|-----|
| **Funnel** | General → Specific (open then closed) | **Citizens, emergency victims, volunteers** | Starts non-threateningly with broad, open questions ("Tell me about a time you needed urgent help") to put emotional or non-technical respondents at ease, then narrows to specifics. |
| **Pyramid** | Specific → General (closed then open) | **Hospital / blood-bank staff, admins** | Begins with concrete, factual questions (units of blood, current tools) to engage detail-oriented professionals, then broadens to opinions and improvement ideas. |
| **Diamond** | Specific → General → Specific | **NGO coordinators** | Opens with specific facts, expands to broad discussion of coordination challenges, then closes with specific feature priorities — ideal for a rich, multi-topic stakeholder. |

### D2.2 Survey Plan

| Attribute | Detail |
|-----------|--------|
| **Target participants** | General citizens, students, blood donors, volunteers |
| **Sample size** | Statistically derived (see below) — target **≈ 385**, minimum pilot 100 |
| **Channel** | Online form shared via social media and campus groups |
| **Question types** | Multiple choice + Likert scale + short answer |
| **Sample questions** | How do you currently request blood? Would you use a verified volunteer platform? Which features matter most? |
| **Output** | Quantitative charts → prioritised needs ([`06-surveys.md`](../business-analysis/06-surveys.md)) |

#### Sample Size Determination (Formula)

Rather than picking an arbitrary count, the survey sample size is derived using the standard **sample-size formula** for estimating a proportion:

$$
n_0 = \frac{z^2 \cdot p \cdot (1-p)}{e^2}
$$

| Symbol | Meaning | Value used |
|--------|---------|-----------|
| $z$ | z-score for confidence level | 1.96 (95% confidence) |
| $p$ | estimated proportion (max variability) | 0.5 |
| $e$ | acceptable margin of error | 0.05 (±5%) |

$$
n_0 = \frac{(1.96)^2 \cdot 0.5 \cdot 0.5}{(0.05)^2} = \frac{0.9604}{0.0025} \approx \mathbf{385}
$$

**Finite population correction** (if the sampling frame *N* is known — e.g. a target community of registered volunteers):

$$
n = \frac{n_0}{1 + \dfrac{n_0 - 1}{N}}
$$

**Interpretation for VERA:**
- A statistically valid sample at 95% confidence, ±5% margin ≈ **385 respondents**.
- The earlier **100+** figure is treated as an initial **pilot** (≈ ±10% margin at 95%); the plan scales toward **385** for full statistical validity, or applies the finite-population correction once a specific sampling frame (e.g. a campus or NGO volunteer list) is fixed.

### D2.3 Observation Plan (with STROBE)

| Attribute | Detail |
|-----------|--------|
| **What** | Emergency/blood posts in public Facebook groups; volunteer WhatsApp coordination; NGO field/office operations |
| **Focus** | Structure of requests, duplication, response time, status updates |
| **Output** | Behaviour patterns → structural requirements (dedup, status workflow, controlled contact) |

**STROBE technique** — *STRuctured OBservation of the Environment*. When observing NGO offices and coordinators, we examine physical/environmental cues to **validate (or contradict) what interviewees claim**. This guards against the common gap between what stakeholders *say* they do and what they *actually* do.

| STROBE element | What we look for at VERA stakeholders | Requirement insight |
|----------------|----------------------------------------|---------------------|
| **Office location & layout** | Is the NGO desk central or isolated? Who sits near the coordinator? | Reveals real coordination flow and who must be notified. |
| **Desk / equipment placement** | Shared whiteboards, printed contact lists, pinned maps | Confirms need for a digital shared board, coverage map, contact registry. |
| **Props & technology in use** | Are they using phones/registers/Excel instead of a system? | Confirms the manual, unstructured process VERA replaces. |
| **External information sources** | Sticky notes, wall posters of blood contacts | Shows reliance on ad-hoc records → need for structured donor/resource data. |
| **Body language / behaviour during a request** | Rushing between calls, re-entering the same data | Confirms time pressure → drives the ≤5-step, fast-entry usability requirement. |

STROBE findings are cross-checked against interview claims; any contradiction is flagged and re-confirmed before a requirement is accepted.

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
