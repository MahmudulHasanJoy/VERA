# A — Software Development Methodology

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Course** | CSE307 — System Analysis and Design |
| **Phase** | 5 — System Analysis and Development Issues |
| **Section** | A — Software Development Methodology |
| **Team** | Md. Mahmudul Hasan (2311960), Ridwan Hasan Khandakar (2310604) |

---

## A1. Selected Methodology and Justification

### A1.1 Selected Methodology: **Agile — Scrum (with an Iterative/Incremental delivery model)**

For the VERA project we selected the **Agile Scrum** software development methodology, delivering the product in short, incremental sprints that each produce a working slice of the system.

---

### A1.2 Why Agile Scrum Fits VERA

VERA is an emergency-response coordination platform with **many independent modules** (authentication, emergencies, blood matching, NGO resources, donations, shelters, coverage monitoring, notifications, admin reports). Requirements were **discovered progressively** through interviews, surveys, and observation of real social-media emergency behaviour — so the requirements were **not fully fixed** at the start. This makes a plan-driven model (like pure Waterfall) unsuitable and an adaptive model (Agile) the natural fit.

| Project characteristic | Why it favours Agile Scrum |
|------------------------|----------------------------|
| **Evolving requirements** | Requirements were refined after interviews/surveys; Agile welcomes change even late in development. |
| **Modular scope** | Each module (emergencies, blood, donations…) maps cleanly to a sprint backlog and can ship independently. |
| **Small team (2 developers)** | Scrum works well for small, self-organising teams with lightweight ceremonies. |
| **Need for early, working MVP** | Incremental delivery produced a demonstrable MVP early instead of waiting for a "big bang" release. |
| **Frequent stakeholder feedback** | Citizens, NGOs, and donors could review each increment and steer priorities. |
| **Risk reduction** | High-value, high-risk modules (auth, blood matching) were built first, surfacing integration risk early. |
| **Fixed academic timeline** | Timeboxed sprints keep progress measurable against course phase deadlines. |

---

### A1.3 How Scrum Is Applied to VERA

**Roles**

| Scrum role | VERA mapping |
|------------|--------------|
| Product Owner | Team lead — owns and prioritises the product backlog with stakeholder input |
| Scrum Master | Rotating team member — removes blockers, facilitates ceremonies |
| Development Team | Both developers — design, build, and test increments |

**Sprint cadence:** 2-week sprints across the project timeline.

**Ceremonies**

| Ceremony | Purpose in VERA |
|----------|-----------------|
| Sprint Planning | Select backlog items (e.g. "Blood request + donor matching") for the sprint |
| Daily Stand-up | Short sync on progress and blockers |
| Sprint Review | Demo the working increment (deployed to a test environment) |
| Sprint Retrospective | Improve process (e.g. add automated tests after a regression) |

**Artifacts**

| Artifact | VERA example |
|----------|--------------|
| Product Backlog | Full list of Functional Requirements FR-01 → FR-25 |
| Sprint Backlog | Subset chosen per sprint (e.g. FR-08, FR-09 for the Emergency sprint) |
| Increment | Deployable software (e.g. FastAPI endpoints + Next.js pages for emergencies) |

---

### A1.3.1 Core Agile Practices Adopted (XP influence)

Beyond Scrum ceremonies, VERA explicitly adopts the **four core Agile/Extreme Programming (XP) practices** to raise quality and feedback speed:

| Core Practice | How VERA applies it |
|---------------|---------------------|
| **Short releases** | Each 2-week sprint ends with a deployable increment pushed to a test environment, so stakeholders see working software frequently. |
| **40-hour work week** | The team maintains a sustainable pace to avoid burnout and reduce defects — no crunch-driven "hero" coding, which is critical for a life-safety platform. |
| **Onsite customer** | An **NGO representative acts as the onsite customer/proxy Product Owner**, available during sprint reviews (and on-call during development) to clarify emergency-workflow requirements and give rapid feedback on priorities. |
| **Pair programming** | For **high-risk, high-value modules** (authentication/RBAC and blood donor-matching), the two developers pair-program to catch defects early, share domain knowledge, and improve code quality. Lower-risk modules are developed solo with peer code review. |

These practices directly address VERA's need for **fast feedback** (onsite NGO customer), **reliability** (pair programming on critical modules), and **frequent, low-risk delivery** (short releases at a sustainable pace).

---

### A1.4 Mapping Sprints to VERA Modules

| Sprint | Focus | Requirements delivered |
|--------|-------|------------------------|
| Sprint 1 | Foundation & Auth | FR-01 – FR-04 (register, login, profile, RBAC) |
| Sprint 2 | Emergencies & Incidents | FR-08, FR-09, FR-18 |
| Sprint 3 | Blood requests & donor matching | FR-07, FR-10 – FR-12 |
| Sprint 4 | NGO resources, coordination, donations | FR-13 – FR-16 |
| Sprint 5 | Volunteers, certificates, shelters, coverage | FR-05, FR-06, FR-17, FR-19 – FR-21 |
| Sprint 6 | Search, notifications, dashboards, admin reports | FR-22 – FR-25 |
| Sprint 7 | Hardening, testing, Dockerization, deployment | NFRs, migrations, OCI deployment |

---

### A1.5 Alternatives Considered and Rejected

| Methodology | Why it was **not** selected for VERA |
|-------------|--------------------------------------|
| **Waterfall** | Requires all requirements fixed up front; VERA's requirements evolved through discovery. No working software until late — too risky for an emergency platform demo. |
| **V-Model** | Strong testing focus but still sequential and rigid; poor fit for changing scope. |
| **Big Bang** | No planning discipline; unacceptable for a multi-module system with deadlines. |
| **Spiral** | Excellent for risk but heavyweight, documentation-intensive, and oversized for a 2-person student team. |
| **Kanban (pure)** | Good for continuous flow but lacks the timeboxed cadence needed to align with fixed academic phase deadlines. Scrum's sprints map better to milestones. |

---

### A1.6 Benefits Realised

- A **working MVP** was demonstrable early and improved each sprint.
- Requirement changes (e.g. adding disaster **coverage monitoring**) were absorbed without rework of unrelated modules.
- Parallel, modular development suited the two-person team.
- Continuous testing and retrospectives improved quality (unit tests, regression pass, security review).

---

## Phase Navigation

| | Document |
|---|----------|
| **Current** | A — Software Development Methodology |
| **Next** | [B — Project Management](./B-project-management.md) |

---

*Phase 5 — System Analysis and Development Issues | VERA*
