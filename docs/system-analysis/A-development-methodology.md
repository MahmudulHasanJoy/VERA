# A — Software Development Methodology

**Title:** Volunteer Emergency Response Alliance (VERA)

A platform that connects people in need with volunteers, donors, NGOs, hospitals, emergency responders, and relief organizations through a centralized emergency assistance network.

## Group Members

| ID | Name | Contribution |
|----|------|--------------|
| 2311960 | Md. Mahmudul Hasan | 100% |
| 2310604 | Ridwan Hasan Khandakar | 100% |
| 2022752 | Kazi Fatema Tuj Johra | 100% |
| 2312226 | Fouzia Abida | 100% |
| 2310690 | Syed Mehedi Hussain | 100% |
| 2210892 | Sowhardra Paul | 100% |

**Course:** CSE307 — System Analysis and Design · **Task 5(A):** Software Development Methodology

---

## A1. Selecting a Software Development Methodology (with Justification)

### A1.1 Our Choice

For the VERA project, we selected the **Agile methodology using the Scrum framework** (Lecture 6).

In simple words, Agile means we build the software in small pieces, show a working piece to users early, take their feedback, and keep improving. We do not try to plan everything perfectly at the start and build it all at once.

### A1.2 Why Agile Is Suitable for VERA (Justification)

We picked Agile because it matches the nature of our project. The reasons are:

1. **Our requirements kept changing.** When we started, we did not know all the features. After doing interviews and surveys, we discovered new needs (for example, disaster coverage monitoring). One of the basic principles of Agile is to *"embrace change, even if introduced late in development"* (Lecture 6). A fixed method like Waterfall could not handle this.

2. **VERA has many modules.** We have separate parts like login, emergencies, blood requests, donations, shelters, and reports. Agile lets us *"deliver functioning software incrementally and frequently"* — we build one module at a time and show it working.

3. **We wanted feedback early.** Agile *"encourages customers and analysts to work together daily."* An NGO can look at each part and tell us if it is correct before we build the next part.

4. **Our team is small and self-organizing.** Scrum works well for small teams that plan their own work, which fits our six-member group.

5. **It lowers risk.** By building and testing small pieces, we find problems early instead of at the end. This is very important for an emergency platform where mistakes can be serious.

### A1.3 Agile Values We Followed (Lecture 6)

Agile is built on four values, and we tried to keep all of them:

| Value | How we applied it in VERA |
|-------|----------------------------|
| **Communication** | The team talked daily and kept in touch with the NGO representative. |
| **Simplicity** | We built the simplest thing that works first, then improved it. |
| **Feedback** | We showed each finished module to users and took their comments. |
| **Courage** | We were willing to change or remove features when feedback told us to. |

### A1.4 The Four Core Practices of Agile (Lecture 6)

Lecture 6 lists four core practices. We adopted all four:

| Core Practice | How VERA used it |
|---------------|------------------|
| **Short releases** | Every 2 weeks we released a small working version, so the system could grow step by step. |
| **40-hour work week** | We worked at a steady, healthy pace instead of rushing at the end. This keeps quality high and reduces mistakes. |
| **Onsite customer** | An **NGO representative** acted as our onsite customer, giving quick answers and feedback about real emergency needs. |
| **Pair programming** | For the hard and risky modules (login/security and blood donor matching), two members coded together to catch mistakes early and improve quality. |

### A1.5 The Scrum Framework We Used (Lecture 6)

Scrum is the Agile approach we followed. Its main parts are:

**Roles:**

| Role | Who / What it means |
|------|---------------------|
| **Product Owner** | Decides what features are most important (kept the feature list ordered by priority). |
| **Scrum Master** | Helps the team, removes problems, and runs the meetings. |
| **Development Team** | The members who design, code, and test the software. |

**Scrum artifacts and events (in simple terms):**

| Term | Meaning in VERA |
|------|-----------------|
| **Product Backlog** | The full list of all features we want (our requirements FR-01 to FR-25). |
| **Sprint Backlog** | The small set of features we chose to build in one sprint. |
| **Sprint** | A short 2-week period in which we build the chosen features. |
| **Daily Scrum** | A short daily meeting to say what we did, what we will do, and any problem. |
| **Demo** | At the end of a sprint we show the working software to users. |

### A1.6 How We Divided the Work into Sprints

| Sprint | What we built |
|--------|---------------|
| Sprint 1 | Registration, login, roles (FR-01 to FR-04) |
| Sprint 2 | Emergency and incident reporting (FR-08, FR-09, FR-18) |
| Sprint 3 | Blood requests and donor matching (FR-07, FR-10 to FR-12) |
| Sprint 4 | NGO resources, coordination, donations (FR-13 to FR-16) |
| Sprint 5 | Shelters, coverage, volunteers, certificates (FR-05, FR-06, FR-17, FR-19 to FR-21) |
| Sprint 6 | Search, notifications, dashboard, admin reports (FR-22 to FR-25) |
| Sprint 7 | Testing, security fixes, deployment |

### A1.7 We Also Used Prototyping (Lecture 6)

Along with Scrum, we used **prototyping** to gather requirements. We mostly used the **selected-features prototype** — an early version with some (not all) features — so users could see the screens and tell us what to change before we finished the real system.

### A1.8 Why We Did Not Choose Other Methods

| Method | Why we did not choose it |
|--------|--------------------------|
| **Waterfall** | It needs all requirements fixed at the beginning. Our requirements kept changing, so this did not fit. Also, no working software is seen until the very end. |
| **V-Model** | Good for testing, but still fixed and step-by-step like Waterfall. |
| **Spiral** | Good for risk, but too heavy and needs too much documentation for a student team. |

---

## Short Answer (Summary)

We selected the **Agile methodology (Scrum framework)** for VERA because our requirements changed over time, our system has many modules, and we needed early feedback from users and NGOs. We followed the four Agile values, the four core practices (short releases, 40-hour week, onsite customer, pair programming), and the Scrum process (product backlog, sprint backlog, sprints, daily scrum, and demos), and we used prototyping to confirm requirements.

---

*CSE307 — System Analysis and Design | Task 5(A) | VERA*
