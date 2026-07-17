# D — Requirement Discovery

**Title:** Volunteer Emergency Response Alliance (VERA)

## Group Members

| ID | Name | Contribution |
|----|------|--------------|
| 2311960 | Md. Mahmudul Hasan | 100% |
| 2310604 | Ridwan Hasan Khandakar | 100% |
| 2022752 | Kazi Fatema Tuj Johra | 100% |
| 2312226 | Fouzia Abida | 100% |
| 2310690 | Syed Mehedi Hussain | 100% |
| 2210892 | Sowhardra Paul | 100% |

**Course:** CSE307 — System Analysis and Design · **Task 5(D):** Requirement Discovery

---

## What Is Requirement Discovery? (Lecture 4)

Requirement discovery (also called **fact-finding** or **information gathering**) is how we find out what the users really need from the system. Lecture 4 divides the methods into **interactive methods** (we talk to people directly) and Lecture 5 adds **unobtrusive methods** (we quietly study documents and behaviour).

Lecture 4 also reminds us of two important types of requirements:
- **Functional requirement** — a function or feature the system *must do* (e.g. "register a user").
- **Non-functional requirement** — a quality or attribute of the system (e.g. "must be secure", "must be fast").

---

## D1. Suitable Methods (with Justification)

VERA has many different users (citizens, volunteers, donors, NGOs, hospitals, admins), so one method is not enough. We chose **four methods together** (a mixed-method approach). Lecture 5 says unobtrusive methods are "insufficient when used alone", so we combine them with interactive methods.

| Method | Type (Lecture) | Why it is suitable for VERA |
|--------|----------------|------------------------------|
| **Interviews** | Interactive (Lec 4) | Best for deep answers from important people like NGO staff and hospital staff. We can ask follow-up questions. |
| **Questionnaires / Surveys** | Interactive (Lec 4) | Best to reach **many** citizens, students, and donors quickly and cheaply. Good when people are spread out in many places. |
| **Observation** | Unobtrusive (Lec 5) | Lets us see what people *actually do* (for example, how blood requests are posted on Facebook), not just what they say. |
| **Document Analysis** | Unobtrusive (Lec 5) | We study old reports, forms, and similar systems to find facts and needs. |

**Main methods:** Interviews + Questionnaires, supported by Observation and Document Analysis.

---

## D2. Plan for the Selected Methods

### D2.1 Interview Plan (Lecture 4)

| Item | Plan |
|------|------|
| Who we interview | NGO coordinators, hospital / blood-bank staff, senior volunteers, possible admins |
| How many | 6 to 10 people |
| Length | 30 to 45 minutes each |
| Question types | Both **open-ended** (for detail) and **closed** (for quick facts) |
| Example questions | "How do you handle an emergency request now?", "What slows you down?", "How do you check if a volunteer is real?" |

**Interview question structure (Lecture 4).** Lecture 4 gives three shapes for arranging questions. We choose the shape based on the person:

| Structure | How it works | We use it for | Why |
|-----------|--------------|---------------|-----|
| **Funnel** | Start general (open), then go specific (closed) | Citizens, victims, volunteers | It is a soft, non-threatening start. Good when the person feels emotional about the topic. |
| **Pyramid** | Start specific (closed), then go general (open) | Hospital staff, admins | Good to warm up detail-minded people with exact facts first, then open up. |
| **Diamond** | Specific → general → specific | NGO coordinators | Combines both shapes for a long, detailed interview. |

### D2.2 Questionnaire (Survey) Plan (Lectures 4 & 5)

| Item | Plan |
|------|------|
| Who answers | Citizens, students, blood donors, volunteers |
| How we send it | Online form shared on social media and campus groups |
| Question types | Closed (multiple choice), **interval scale** (1–5 rating), and a few open-ended |
| Language | Simple, short, clear, and free of bias (Lecture 4 rules) |

**Sample size (Lecture 5).** Lecture 5 says we should not survey everyone (too costly). Instead we pick a sample. To find how many people to survey, we use the sample-size idea from Lecture 5:

- Choose a **confidence level** → for 95% confidence, the value **z = 1.96**.
- Choose the **interval estimate** (how much error we accept) → i = ±0.05.
- Assume the worst-case proportion p = 0.5.

A common way to get the sample size for a proportion is:

**n = z² × p × (1 − p) ÷ i² = (1.96)² × 0.5 × 0.5 ÷ (0.05)² ≈ 385**

So a good statistical sample is **about 385 people**. If we cannot reach that many, we start with a smaller **pilot sample of 100** (this gives a bigger error, about ±10%) and grow towards 385.

### D2.3 Observation Plan with STROBE (Lecture 5)

We observe how people currently work — for example, blood/emergency posts on Facebook and how volunteers coordinate on WhatsApp.

Lecture 5 also teaches **STROBE** (STRuctured OBservation of the Environment). This means we look at the decision-maker's surroundings to **confirm or reject** what they told us in interviews. When we visit an NGO office we check:

| STROBE element (Lecture 5) | What we look at | What it tells us |
|----------------------------|-----------------|------------------|
| Office location | Is the coordinator central or far away? | Who really controls coordination |
| Desk placement | Does it help people talk? | How information flows |
| Stationary equipment | Registers, printed contact lists, whiteboards | They still use manual tools → VERA can replace them |
| Props | Do they use a PC / phone / tablet? | How ready they are for a digital system |
| External information sources | Wall posters, sticky notes of blood contacts | Need for a proper digital contact list |

If what we see is different from what they said, we ask again before writing the requirement.

### D2.4 Document Analysis Plan (Lecture 5)

We study disaster reports, NGO relief records, old forms, and similar apps. This is **hard data** (Lecture 5) and helps us find real facts and common gaps.

---

## D3. Functional Requirements (All Found)

These are the things the system **must do**. (Full details are in the SRS, FR-01 to FR-25.)

**User accounts**
- FR-01 Register with name, email, password, phone, and role.
- FR-02 Log in and get a secure token.
- FR-03 View own profile.
- FR-04 Give different powers to different roles (citizen, volunteer, donor, NGO, hospital, admin).

**Volunteers and donors**
- FR-05 Volunteer sends ID document for checking.
- FR-06 Admin approves or rejects the volunteer.
- FR-07 User registers as a blood donor.

**Emergencies and blood**
- FR-08 Create an emergency request (medical, blood, food, rescue, etc.).
- FR-09 View and update emergency status (open, in progress, resolved…).
- FR-10 Create a blood request.
- FR-11 Update / resolve a blood request.
- FR-12 Notify matching donors and search donors by blood group.

**NGO, resources, donations**
- FR-13 NGOs record relief resources (food, medicine, etc.).
- FR-14 NGOs create coordination requests.
- FR-15 Record donations.
- FR-16 Create fundraising campaigns.

**Shelters, incidents, coverage**
- FR-17 Register shelters with capacity and beds.
- FR-18 Report a disaster incident.
- FR-19 Report which areas are covered or underserved.

**Volunteers, certificates, search**
- FR-20 Post volunteer opportunities; volunteers apply.
- FR-21 Give certificates with a code that anyone can verify.
- FR-22 Search for nearby help by location.

**Notifications and reports**
- FR-23 Send in-app notifications.
- FR-24 Show dashboard statistics.
- FR-25 Admin reports.

---

## D4. Non-Functional Requirements (at least five)

These describe the **qualities** of the system, not the tasks.

| # | Type | Requirement |
|---|------|-------------|
| 1 | **Performance** | Most pages/requests should respond within about 2 seconds under normal use. |
| 2 | **Security** | Passwords are stored in a hashed (hidden) form; login uses a secure token; each role only sees what it is allowed to. |
| 3 | **Usability** | The website should be easy to use on mobile and computer, and main tasks should take only a few steps. |
| 4 | **Reliability** | The system should be available most of the time (target 99% uptime) and never lose saved data. |
| 5 | **Scalability** | The system should still work when many people use it at once during a disaster. |
| 6 | **Privacy** | A user's contact details are shown only to the right people. |
| 7 | **Compatibility** | Works on the latest Chrome, Firefox, Edge, and Safari browsers. |

---

## Short Answer (Summary)

To discover requirements for VERA we used **four fact-finding methods**: **interviews** and **questionnaires** (interactive, Lecture 4) plus **observation** and **document analysis** (unobtrusive, Lecture 5). We planned the interviews using the **Funnel, Pyramid, and Diamond** question structures, planned the survey with a **sample size of about 385** people using the Lecture 5 sample-size idea, and planned observation using the **STROBE** technique. From this we found all the **functional requirements (FR-01 to FR-25)** and at least **five non-functional requirements** (performance, security, usability, reliability, scalability, privacy, compatibility).

---

*CSE307 — System Analysis and Design | Task 5(D) | VERA*
