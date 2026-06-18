# 16 — Data Flow Diagram (DFD)

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 3 — Software Requirements Specification (SRS) |
| **Notation** | Gane & Sarson style (Level 0, 1, 2) |

---

## DFD Level 0 — Context Diagram

Shows VERA as a single process interacting with external entities.

```
                    ┌─────────────────────────────────────────┐
                    │                                         │
   Emergency        │                                         │
   Requests ───────►│                                         │
                    │                                         │
   Blood Requests ─►│         0. VERA Platform               │──────► Emergency
                    │         (Emergency Assistance            │        Alerts
   Donations ──────►│          & Resource Coordination)       │
                    │                                         │──────► Notifications
   Volunteer        │                                         │
   Applications ───►│                                         │──────► Reports
                    │                                         │
   Coverage         │                                         │──────► Donor
   Reports ────────►│                                         │        Matching
                    │                                         │
                    └─────────────────────────────────────────┘
                          ▲           ▲           ▲
                          │           │           │
                     Citizens    Volunteers    NGOs / Hospitals
```

### External Entities

| Entity | Inputs to System | Outputs from System |
|--------|------------------|---------------------|
| Citizens | Emergency requests, blood requests, incidents | Notifications, request status |
| Volunteers | Verification docs, applications | Assignments, certificates |
| NGOs | Resources, campaigns, coverage | Coordination alerts, stats |
| Hospitals | Blood requests | Donor lists, notifications |
| Donors | Donations, donor registration | Blood alerts, allocation records |
| Administrators | Verification decisions | Dashboard, admin reports |

---

## DFD Level 1 — Major Processes

```
                              ┌──────────────────┐
                              │   D1: Users DB   │
                              └────────▲─────────┘
                                       │
┌──────────┐    Register/Login    ┌────┴─────┐    JWT      ┌──────────────┐
│  Users   │─────────────────────►│ 1.0 Auth │────────────►│ All Modules  │
└──────────┘                      └──────────┘             └──────────────┘
                                       │
┌──────────┐   Emergency data    ┌────▼──────────┐         ┌──────────────────┐
│ Citizens │────────────────────►│ 2.0 Emergency │◄───────►│ D2: Emergencies  │
└──────────┘                      │    Handler    │         └──────────────────┘
                                  └───────┬───────┘
┌──────────┐   Blood request      ┌──────▼───────┐         ┌──────────────────┐
│ Hospitals│─────────────────────►│ 3.0 Blood     │────────►│ D3: Blood        │
│ Citizens │                      │    Matching   │         │    Requests      │
└──────────┘                      └───────┬───────┘         └──────────────────┘
                                          │
                                          ▼
                                  ┌───────────────┐
                                  │ 4.0 Notify    │──────► D4: Notifications
                                  │    Service    │
                                  └───────────────┘

┌──────────┐   Resource data     ┌───────────────┐         ┌──────────────────┐
│   NGOs   │────────────────────►│ 5.0 Resource  │◄───────►│ D5: Resources    │
│          │   Campaign data     │   & Campaign  │         │ D6: Campaigns    │
└──────────┘────────────────────►└───────┬───────┘         │ D7: Donations    │
                                         │                 └──────────────────┘
┌──────────┐   Donation            ┌────▼──────────┐
│  Donors  │──────────────────────►│ 6.0 Donation  │
└──────────┘                       │    Tracker    │
                                    └───────────────┘

┌──────────┐   Coverage data       ┌───────────────┐         ┌──────────────────┐
│   NGOs   │─────────────────────►│ 7.0 Coverage  │◄───────►│ D8: Coverage     │
│Volunteers│                      │    Monitor    │         └──────────────────┘
└──────────┘                      └───────────────┘

┌──────────┐   Coordinates         ┌───────────────┐
│  Users   │─────────────────────►│ 8.0 Location  │◄─── D1, D2, D5, Shelters
└──────────┘                      │    Search     │
                                  └───────────────┘
```

### Level 1 Process Descriptions

| Process | Description | Data Stores |
|---------|-------------|-------------|
| 1.0 Auth | Registration, login, JWT, profile | D1: Users |
| 2.0 Emergency Handler | Create, list, verify, update emergencies | D2: Emergencies |
| 3.0 Blood Matching | Blood requests, donor search, auto-notify | D3: Blood Requests, D1 |
| 4.0 Notify Service | Create and deliver in-app notifications | D4: Notifications |
| 5.0 Resource & Campaign | NGO resources, fundraising campaigns | D5, D6 |
| 6.0 Donation Tracker | Record donations, update campaign totals | D7: Donations |
| 7.0 Coverage Monitor | Area status, underserved alerts | D8: Coverage |
| 8.0 Location Search | Haversine nearby search across entities | Multiple |

---

## DFD Level 2 — Process 3.0 Blood Matching (Decomposition)

```
┌─────────────┐
│   Citizen   │
│  /Hospital  │
└──────┬──────┘
       │ Blood request (group, patient, phone)
       ▼
┌──────────────────┐     ┌─────────────────┐
│ 3.1 Validate &   │────►│ D3: Blood       │
│     Save Request │     │    Requests     │
└────────┬─────────┘     └─────────────────┘
         │
         │ Trigger
         ▼
┌──────────────────┐     ┌─────────────────┐
│ 3.2 Find Matching│◄────│ D1: Users       │
│     Donors       │     │ (role=donor,    │
└────────┬─────────┘     │  group, active) │
         │               └─────────────────┘
         │ Donor list
         ▼
┌──────────────────┐     ┌─────────────────┐
│ 3.3 Create       │────►│ D4: Notifications│
│     Notifications│     └─────────────────┘
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ 3.4 Return       │──────► Citizen (request confirmed)
│     Response     │
└──────────────────┘
```

---

## DFD Level 2 — Process 2.0 Emergency Handler

```
Citizen ──► 2.1 Create Request ──► D2: Emergencies
                │
Volunteer ──► 2.2 List Open ──► Read D2
                │
NGO ────────► 2.3 Verify Request ──► Update D2 (is_verified, status)
                │
Volunteer ──► 2.4 Update Status ──► Update D2 (in_progress, resolved)
```

---

## Data Store Inventory

| Store | Table | Primary Data |
|-------|-------|--------------|
| D1 | users | Accounts, roles, verification, blood group |
| D2 | emergency_requests | Emergency tickets |
| D3 | blood_requests | Blood donation requests |
| D4 | notifications | In-app alerts |
| D5 | resources | NGO relief inventory |
| D6 | fundraising_campaigns | Campaign goals and raised amounts |
| D7 | donations | Donation records |
| D8 | disaster_coverage | Area coverage status |
| D9 | shelters | Shelter capacity |
| D10 | incident_reports | Disaster incidents |
| D11 | volunteer_opportunities | NGO programs |
| D12 | volunteer_applications | Volunteer applications |
| D13 | certificates | Issued certificates |
| D14 | ngo_coordinations | Coordination requests |

---

## Data Flow Dictionary (Sample)

| Flow | From | To | Data Elements |
|------|------|-----|---------------|
| F-01 | Citizen | 2.0 | title, description, emergency_type, location |
| F-02 | 3.0 | Donor | notification: title, message, link |
| F-03 | Donor | 6.0 | amount, donation_type, campaign_id |
| F-04 | 6.0 | D6 | raised_amount (updated) |
| F-05 | NGO | 7.0 | area_name, lat, lng, coverage_status |
| F-06 | 8.0 | User | id, name, type, distance_km |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [15 — Use Cases](./15-use-cases.md) |
| **Current** | 16 — DFD |
| **Next** | [17 — SRS](./17-srs.md) |

---

*Phase 3 — Software Requirements Specification | VERA*
