# 04 — Information Gathering

**VERA: Volunteer Emergency Response Alliance**

---

## 4.1 Purpose

Information gathering is the process of collecting data about the current emergency response landscape, user needs, stakeholder expectations, and system requirements. This document describes the methods, sources, and findings that informed the VERA project.

---

## 4.2 Information Gathering Methods

| Method | Purpose | Document |
|--------|---------|----------|
| Document analysis | Review existing reports, news, and academic sources | This document (§4.3) |
| Observation | Study how people currently seek and offer emergency help | This document (§4.4) |
| Interviews | Collect qualitative insights from stakeholders | `05-interviews.md` |
| Surveys | Gather quantitative data on user needs and preferences | `06-surveys.md` |
| Benchmarking | Analyze similar platforms and systems | This document (§4.5) |

---

## 4.3 Document Analysis

### Sources Reviewed

| Source | Type | Key Findings |
|--------|------|--------------|
| Project Proposal Report (VERA) | Internal project document | Defined goals, stakeholders, functional requirements |
| Bangladesh disaster statistics | Public reports | High frequency of floods, cyclones, road accidents |
| Social media emergency posts | Observation of Facebook groups | Requests are unstructured, duplicated, slow to reach donors |
| Blood donation group patterns | Observation | Generic posts; mismatched blood groups; no verification |
| NGO relief operation reports | Public news / NGO websites | Coordination gaps during 2024 flood response |
| WHO / humanitarian coordination literature | Academic | Centralized platforms reduce response delays |

### Key Facts Gathered

1. Bangladesh population exceeds 170 million with high urban and rural density
2. Road traffic injuries are a leading cause of emergency medical need
3. Annual monsoon flooding affects millions and requires coordinated relief
4. Facebook and WhatsApp are the dominant channels for urgent blood requests
5. No widely adopted national platform exists for volunteer emergency coordination
6. Students actively seek volunteer opportunities but lack a centralized directory
7. Donation transparency is a recurring public concern during disaster fundraising

---

## 4.4 Observation Study

### Observed Behaviour — Emergency Requests

| Observation | Frequency | Implication for VERA |
|-------------|-----------|---------------------|
| Blood requests posted as Facebook status | Very common | Need structured blood request module |
| Same request shared across multiple groups | Common | Need deduplication and central listing |
| Contact phone numbers posted publicly | Common | Need controlled contact sharing |
| No status update when request is fulfilled | Very common | Need request status workflow (open → resolved) |
| Volunteers coordinate via WhatsApp chains | Common | Need NGO coordination module |

### Observed Behaviour — Disaster Relief

| Observation | Implication |
|-------------|-------------|
| Multiple NGOs arrive at same location | Resource tracking and coverage monitoring needed |
| Remote areas unvisited for days | Location-based underserved area alerts needed |
| Relief supplies distributed without records | Donation and resource tracking needed |

---

## 4.5 Benchmarking

| Platform / System | Country | Strengths | Gaps VERA addresses |
|-------------------|---------|-----------|---------------------|
| Facebook emergency groups | Global | Large user base, free | No verification, no structure, no tracking |
| Zello (walkie-talkie app) | Global | Works during outages (partial) | Not designed for resource coordination |
| Blood donor apps (various) | Bangladesh | Blood-specific matching | No full emergency scope |
| Humanitarian Data Exchange (HDX) | Global | Disaster data standards | Not citizen-facing, not local |
| Uber / ride-sharing model | Global | Location-based matching | Inspiration for donor/volunteer routing |

**VERA's differentiator:** A single Bangladesh-focused platform combining emergencies, blood, volunteers, NGOs, donations, shelters, and disaster coverage — with role-based access and verification.

---

## 4.6 Requirements Extracted from Information Gathering

### Functional Requirements (from analysis)

1. User registration and authentication with roles
2. Volunteer identity verification (NID/Passport)
3. Emergency and blood request submission
4. Blood donor search and automated notification
5. Resource tracking for NGOs
6. NGO coordination and volunteer deployment
7. Donation and fundraising campaign management
8. Shelter information management
9. Incident and disaster reporting
10. Request verification by authorized users
11. Location-based search for nearby help
12. Notification system for stakeholders
13. Volunteer opportunity and certificate management
14. Disaster coverage monitoring
15. Admin operational reports

### Non-Functional Requirements (from analysis)

| Category | Requirement |
|----------|-------------|
| Performance | Respond to requests within seconds under normal load |
| Security | JWT authentication, role-based access, volunteer verification |
| Usability | Simple interface for citizens with varying tech literacy |
| Availability | Cloud-hosted, target 99% uptime |
| Scalability | Handle traffic spikes during disasters |
| Transparency | All donations and resource allocations logged |

---

## 4.7 Information Gathering Timeline

| Week | Activity | Output |
|------|----------|--------|
| 1 | Document analysis and observation | Problem identification notes |
| 2 | Stakeholder interviews (planned) | `05-interviews.md` |
| 3 | Online survey distribution | `06-surveys.md` |
| 4 | Synthesis and requirements definition | Functional requirements list |

---

## 4.8 Data Validation

Information gathered through multiple methods was cross-validated:

- Interview themes confirmed survey quantitative results
- Document analysis aligned with observed social media behaviour
- Stakeholder requirements mapped to functional requirements in the proposal

---

## 4.9 Limitations

| Limitation | Mitigation |
|------------|------------|
| Small interview sample | Supplemented with survey for broader reach |
| Urban bias in online survey | Future rural outreach planned |
| No live disaster observation | Used documented flood/cyclone reports |
| Student project scope | Focus on MVP with clear expansion roadmap |

---

*Phase 1 — Project Idea & Business Analysis | VERA*
