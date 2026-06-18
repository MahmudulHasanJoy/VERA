# 10 — User Journey

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 2 — Product Requirement Document (PRD) |
| **Related** | User personas, user stories |

---

## Journey 1 — Citizen: Urgent Blood Request

**Persona:** Rahim (Citizen)  
**Goal:** Find B+ blood for father within hours  
**Entry point:** Google search / friend referral → VERA landing page

### Journey Map

| Stage | User Action | System Response | Touchpoint | Emotion |
|-------|-------------|-----------------|------------|---------|
| **Awareness** | Hears about VERA from hospital staff | Landing page explains blood matching | Homepage | Hopeful |
| **Registration** | Creates account as Citizen | Account created, JWT issued | `/register` | Anxious |
| **Request** | Fills blood request form (B+, hospital, phone) | Request saved, donors notified | `/blood` | Urgent |
| **Wait** | Checks notifications and request list | Matching O+/B+ donors receive alerts | `/notifications` | Stressed |
| **Response** | Donor calls contact number | Status remains `open` | Phone | Relieved |
| **Resolution** | Marks request as resolved | Status → `resolved` | `/blood` | Grateful |

### Pain Points Addressed
- Replaces multi-group Facebook posting
- Auto-notifies only matching donors
- Clear status when fulfilled

### Success Criteria
- Request created in < 3 minutes
- Matching donors notified within 1 minute
- Request resolvable by requester or authorized role

---

## Journey 2 — Volunteer: First Response Mission

**Persona:** Nusrat (Volunteer)  
**Goal:** Get verified and respond to a flood relief opportunity

| Stage | User Action | System Response | Touchpoint |
|-------|-------------|-----------------|------------|
| **Register** | Signs up as Volunteer | Account with `pending` verification | `/register` |
| **Verify** | Submits NID number and type | Status → `pending` review | `/volunteers` |
| **Approved** | (Admin/NGO reviews) | `is_verified = true`, notification sent | `/notifications` |
| **Discover** | Browses volunteer opportunities | Lists open NGO programs | `/volunteers` |
| **Apply** | Applies to flood relief program | Application `pending` | `/volunteers` |
| **Deploy** | Accepted, joins field team | Opportunity slot filled | NGO dashboard |
| **Complete** | NGO issues certificate | Certificate code generated | `/volunteers` |

---

## Journey 3 — Blood Donor: Targeted Alert

**Persona:** Karim (Donor)  
**Goal:** Help when O+ is needed nearby without spam

| Stage | User Action | System Response | Touchpoint |
|-------|-------------|-----------------|------------|
| **Register** | Creates account, registers as O+ donor | `available_for_donation = true` | `/volunteers` |
| **Idle** | Uses platform normally | No irrelevant alerts | — |
| **Alert** | (Passive) Blood request created nearby | Notification: "Urgent O+ needed" | `/notifications` |
| **Respond** | Calls contact on blood request | Manual coordination | Phone |
| **Search** | (Optional) NGO searches donors by group | Karim appears in donor list | `/blood` |

---

## Journey 4 — NGO: Disaster Relief Coordination

**Persona:** Fatema (NGO)  
**Goal:** Coordinate flood relief without duplicate coverage

| Stage | User Action | System Response | Touchpoint |
|-------|-------------|-----------------|------------|
| **Login** | Signs in as NGO | NGO dashboard | `/dashboard` |
| **Resources** | Logs 500 rice packets, 200 medicine kits | Resources listed | `/resources` |
| **Coverage** | Reports "Union X" as underserved | NGOs notified if critical | `/coverage` |
| **Recruit** | Publishes volunteer opportunity | Opportunity visible to volunteers | `/volunteers` |
| **Campaign** | Creates flood relief fundraiser | Campaign with goal amount | `/donations` |
| **Track** | Views donations and allocation | Raised amount updated | `/donations` |

---

## Journey 5 — Hospital: Emergency Blood Broadcast

**Persona:** Dr. Hasan (Hospital)  
**Goal:** Find AB- donors within 25 km quickly

| Stage | User Action | System Response | Touchpoint |
|-------|-------------|-----------------|------------|
| **Register** | Hospital account with organization name | Role = hospital | `/register` |
| **Request** | Creates urgent AB- blood request | Donors with AB- notified | `/blood` |
| **Search** | Uses location search for nearby donors | Sorted by distance | `/search` |
| **Coordinate** | Volunteer accepts emergency transport | Status → `in_progress` | `/emergencies` |

---

## Journey 6 — Donor: Transparent Contribution

**Persona:** Tanvir (Financial Donor)

| Stage | User Action | System Response | Touchpoint |
|-------|-------------|-----------------|------------|
| **Browse** | Views active campaigns | Campaign list with progress | `/donations` |
| **Donate** | Contributes ৳5,000 to flood campaign | `raised_amount` increases | `/donations` |
| **Track** | Views donation history | Shows allocation to campaign | `/donations` |

---

## Journey 7 — Admin: Daily Operations

**Persona:** Admin

| Stage | User Action | System Response | Touchpoint |
|-------|-------------|-----------------|------------|
| **Monitor** | Opens dashboard | Stats: open emergencies, blood, volunteers | `/dashboard` |
| **Verify** | Reviews volunteer NID submission | Approves or rejects | API / future admin UI |
| **Report** | Generates admin report | Users by role, incidents, donations | `/admin` |

---

## Cross-Journey Touchpoints

```
                    ┌─────────────┐
     Register ─────►│  VERA Auth  │◄───── All personas
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │Emergency │    │  Blood   │    │ Donation │
    │  Module  │    │  Module  │    │  Module  │
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                 ┌──────────────┐
                 │ Notifications │
                 └──────────────┘
```

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [09 — User Personas](./09-user-personas.md) |
| **Current** | 10 — User Journey |
| **Next** | [11 — User Stories](./11-user-stories.md) |

---

*Phase 2 — Product Requirement Document | VERA*
