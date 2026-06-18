# 11 — User Stories

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 2 — Product Requirement Document (PRD) |
| **Format** | As a [role], I want [goal], so that [benefit] |

---

## Epic 1 — Authentication & Accounts

| ID | User Story | Priority |
|----|------------|----------|
| US-01 | As a **new user**, I want to **register with my email and role**, so that **I can access features relevant to me**. | P0 |
| US-02 | As a **registered user**, I want to **log in securely**, so that **I can access my dashboard and requests**. | P0 |
| US-03 | As a **user**, I want to **log out**, so that **my account is protected on shared devices**. | P0 |
| US-04 | As a **user**, I want to **view my profile**, so that **I can confirm my role and verification status**. | P0 |

---

## Epic 2 — Volunteer Verification

| ID | User Story | Priority |
|----|------------|----------|
| US-05 | As a **volunteer**, I want to **submit my NID or Passport for verification**, so that **responders trust my identity**. | P0 |
| US-06 | As an **admin**, I want to **approve or reject volunteer verification**, so that **only trusted volunteers get verified status**. | P0 |
| US-07 | As a **volunteer**, I want to **receive a notification when verification status changes**, so that **I know when I can respond to missions**. | P1 |

---

## Epic 3 — Blood Donation

| ID | User Story | Priority |
|----|------------|----------|
| US-08 | As a **citizen**, I want to **register as a blood donor with my blood group**, so that **I can be matched to urgent requests**. | P0 |
| US-09 | As a **citizen**, I want to **create an urgent blood request**, so that **matching donors are notified quickly**. | P0 |
| US-10 | As a **donor**, I want to **receive notifications only for my blood group**, so that **I am not spammed with irrelevant alerts**. | P0 |
| US-11 | As a **hospital staff**, I want to **search donors by blood group**, so that **I can contact them during shortages**. | P0 |
| US-12 | As a **requester**, I want to **mark a blood request as resolved**, so that **donors know help is no longer needed**. | P0 |

---

## Epic 4 — Emergency Requests

| ID | User Story | Priority |
|----|------------|----------|
| US-13 | As a **citizen**, I want to **submit an emergency request with type and location**, so that **helpers understand what is needed**. | P0 |
| US-14 | As a **volunteer or NGO**, I want to **view all open emergency requests**, so that **I can decide where to respond**. | P0 |
| US-15 | As a **verified responder**, I want to **verify an emergency request**, so that **volunteers know it is legitimate**. | P0 |
| US-16 | As a **volunteer**, I want to **update emergency status** (in progress, resolved), so that **everyone sees current state**. | P1 |

---

## Epic 5 — NGO & Resources

| ID | User Story | Priority |
|----|------------|----------|
| US-17 | As an **NGO**, I want to **track relief resources** (food, medicine, equipment), so that **I know what supplies are available**. | P1 |
| US-18 | As an **NGO**, I want to **send coordination requests for volunteer support**, so that **other organizations can deploy teams**. | P1 |
| US-19 | As a **volunteer**, I want to **accept coordination requests**, so that **I can join organized relief efforts**. | P2 |

---

## Epic 6 — Donations & Fundraising

| ID | User Story | Priority |
|----|------------|----------|
| US-20 | As a **donor**, I want to **contribute money or materials**, so that **I can support emergency causes**. | P1 |
| US-21 | As an **NGO**, I want to **create a fundraising campaign with a goal**, so that **I can raise funds transparently**. | P1 |
| US-22 | As a **donor**, I want to **see where my donation was allocated**, so that **I trust the platform**. | P1 |
| US-23 | As a **donor**, I want to **donate to a specific campaign**, so that **my contribution counts toward that cause**. | P1 |

---

## Epic 7 — Shelters & Incidents

| ID | User Story | Priority |
|----|------------|----------|
| US-24 | As an **NGO**, I want to **register available shelters with bed capacity**, so that **displaced people can find housing**. | P1 |
| US-25 | As a **citizen**, I want to **view open shelters and available beds**, so that **I can direct people in need**. | P1 |
| US-26 | As a **citizen**, I want to **report a disaster incident** (flood, fire, cyclone), so that **organizations are aware of affected areas**. | P1 |
| US-27 | As an **NGO**, I want to **view incident reports**, so that **I can plan relief deployments**. | P1 |

---

## Epic 8 — Volunteers & Certificates

| ID | User Story | Priority |
|----|------------|----------|
| US-28 | As an **NGO**, I want to **publish volunteer opportunities**, so that **students and volunteers can apply**. | P1 |
| US-29 | As a **volunteer**, I want to **apply to opportunities**, so that **I can join structured programs**. | P1 |
| US-30 | As an **NGO**, I want to **issue participation certificates**, so that **volunteers have official recognition**. | P2 |
| US-31 | As a **volunteer**, I want to **view my certificates**, so that **I can use them for my career**. | P2 |
| US-32 | As anyone, I want to **verify a certificate by code**, so that **employers can confirm authenticity**. | P2 |

---

## Epic 9 — Search & Coverage

| ID | User Story | Priority |
|----|------------|----------|
| US-33 | As a **user**, I want to **search for nearby volunteers, hospitals, shelters, and resources**, so that **I find help close to me**. | P1 |
| US-34 | As a **user**, I want to **use my current GPS location for search**, so that **I don't have to enter coordinates manually**. | P2 |
| US-35 | As an **NGO**, I want to **report area coverage status** (served, underserved, critical), so that **aid is distributed fairly**. | P1 |
| US-36 | As an **NGO**, I want to **receive alerts for underserved areas**, so that **I can redirect relief teams**. | P1 |

---

## Epic 10 — Notifications & Admin

| ID | User Story | Priority |
|----|------------|----------|
| US-37 | As a **user**, I want to **receive in-app notifications**, so that **I am alerted to urgent events**. | P0 |
| US-38 | As a **user**, I want to **mark notifications as read**, so that **I can track what I've seen**. | P1 |
| US-39 | As an **admin**, I want to **view operational reports**, so that **I can monitor platform health**. | P1 |
| US-40 | As a **user**, I want to **see dashboard statistics**, so that **I understand current emergency activity**. | P1 |

---

## Story Map (MVP Release)

```
Release 1 (P0)          Release 2 (P1)           Release 3 (P2)
─────────────          ──────────────           ──────────────
US-01 → US-04          US-17 → US-19            US-30 → US-32
US-05 → US-06          US-20 → US-23            US-34
US-08 → US-12          US-24 → US-27
US-13 → US-15          US-28 → US-29
US-37                  US-33, US-35 → US-36
                       US-38 → US-40
```

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [10 — User Journey](./10-user-journey.md) |
| **Current** | 11 — User Stories |
| **Next** | [12 — Acceptance Criteria](./12-acceptance-criteria.md) |

---

*Phase 2 — Product Requirement Document | VERA*
