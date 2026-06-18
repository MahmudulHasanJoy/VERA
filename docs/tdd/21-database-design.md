# 21 — Database Design

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 4 — Technical Design Document (TDD) |
| **DBMS (dev)** | SQLite 3 |
| **DBMS (prod)** | PostgreSQL 15+ (planned) |
| **ORM** | SQLAlchemy 2.0 |
| **File (dev)** | `backend/vera.db` |

---

## 1. Overview

The VERA database consists of **14 tables** supporting user management, emergency operations, blood matching, NGO coordination, donations, notifications, and disaster monitoring. Schema is defined in `backend/app/models/__init__.py` and created at startup via `Base.metadata.create_all()`.

---

## 2. Table Definitions

### 2.1 users

Central account table for all roles.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK, AUTO | User ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | Login email |
| full_name | VARCHAR(255) | NOT NULL | Display name |
| phone | VARCHAR(32) | NULL | Contact number |
| hashed_password | VARCHAR(255) | NOT NULL | bcrypt hash |
| role | ENUM(UserRole) | NOT NULL, DEFAULT citizen | User role |
| organization_name | VARCHAR(255) | NULL | NGO/hospital name |
| address | VARCHAR(500) | NULL | Text address |
| latitude | FLOAT | NULL | Geo coordinate |
| longitude | FLOAT | NULL | Geo coordinate |
| blood_group | ENUM(BloodGroup) | NULL | Donor blood type |
| available_for_donation | BOOLEAN | DEFAULT false | Donor availability |
| id_document_type | ENUM(DocumentType) | NULL | Verification doc type |
| id_document_number | VARCHAR(64) | NULL | Verification doc number |
| is_active | BOOLEAN | DEFAULT true | Account active flag |
| is_verified | BOOLEAN | DEFAULT false | Volunteer verified flag |
| verification_status | ENUM(VerificationStatus) | DEFAULT pending | Verification workflow |
| created_at | DATETIME | DEFAULT utcnow | Registration time |

**Indexes:** `email` (unique), `id` (PK)

---

### 2.2 emergency_requests

Citizen emergency assistance tickets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Request ID |
| requester_id | INTEGER | FK → users.id, NOT NULL | Who submitted |
| title | VARCHAR(255) | NOT NULL | Short title |
| description | TEXT | NOT NULL | Full details |
| emergency_type | ENUM(EmergencyType) | NOT NULL | Category |
| status | ENUM(EmergencyStatus) | DEFAULT open | Workflow status |
| location | VARCHAR(500) | NULL | Text location |
| latitude | FLOAT | NULL | Geo coordinate |
| longitude | FLOAT | NULL | Geo coordinate |
| contact_phone | VARCHAR(32) | NULL | Callback number |
| assigned_volunteer_id | INTEGER | FK → users.id, NULL | Assigned responder |
| is_verified | BOOLEAN | DEFAULT false | Admin/volunteer verified |
| created_at | DATETIME | DEFAULT utcnow | Created |
| updated_at | DATETIME | DEFAULT utcnow, ON UPDATE | Last modified |

**Foreign keys:** `requester_id` → `users.id`, `assigned_volunteer_id` → `users.id`

---

### 2.3 blood_requests

Urgent blood need postings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Request ID |
| requester_id | INTEGER | FK → users.id | Submitter |
| patient_name | VARCHAR(255) | NOT NULL | Patient name |
| blood_group | ENUM(BloodGroup) | NOT NULL | Required type |
| units_needed | INTEGER | DEFAULT 1 | Units required |
| hospital_name | VARCHAR(255) | NULL | Hospital |
| location | VARCHAR(500) | NULL | Location text |
| contact_phone | VARCHAR(32) | NOT NULL | Contact |
| notes | TEXT | NULL | Additional info |
| status | ENUM(EmergencyStatus) | DEFAULT open | Status |
| is_urgent | BOOLEAN | DEFAULT true | Urgency flag |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.4 resources

NGO/hospital relief inventory.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Resource ID |
| organization_id | INTEGER | FK → users.id | Owner org |
| name | VARCHAR(255) | NOT NULL | Item name |
| resource_type | ENUM(ResourceType) | NOT NULL | Category |
| quantity | INTEGER | DEFAULT 0 | Stock count |
| unit | VARCHAR(32) | DEFAULT units | Unit label |
| location | VARCHAR(500) | NULL | Storage location |
| latitude | FLOAT | NULL | Geo |
| longitude | FLOAT | NULL | Geo |
| notes | TEXT | NULL | Notes |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.5 ngo_coordinations

Inter-organization support requests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Coordination ID |
| requester_id | INTEGER | FK → users.id | Requesting org |
| title | VARCHAR(255) | NOT NULL | Title |
| message | TEXT | NOT NULL | Details |
| volunteers_needed | INTEGER | DEFAULT 0 | Headcount needed |
| location | VARCHAR(500) | NULL | Area |
| status | ENUM(CoordinationStatus) | DEFAULT open | Status |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.6 fundraising_campaigns

Fundraising drives by NGOs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Campaign ID |
| creator_id | INTEGER | FK → users.id | NGO creator |
| title | VARCHAR(255) | NOT NULL | Campaign title |
| description | TEXT | NOT NULL | Full description |
| cause | VARCHAR(255) | NOT NULL | Cause label |
| goal_amount | FLOAT | NOT NULL | Target amount |
| raised_amount | FLOAT | DEFAULT 0 | Running total |
| status | ENUM(CampaignStatus) | DEFAULT active | Status |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.7 donations

Logged contributions (money or in-kind).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Donation ID |
| donor_id | INTEGER | FK → users.id | Donor |
| campaign_id | INTEGER | FK → fundraising_campaigns.id, NULL | Linked campaign |
| donation_type | ENUM(DonationType) | NOT NULL | Type |
| amount | FLOAT | NULL | Monetary amount |
| item_description | TEXT | NULL | In-kind description |
| allocated_to | VARCHAR(255) | NULL | Allocation label |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.8 notifications

In-app user alerts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Notification ID |
| user_id | INTEGER | FK → users.id | Recipient |
| title | VARCHAR(255) | NOT NULL | Alert title |
| message | TEXT | NOT NULL | Alert body |
| link | VARCHAR(255) | NULL | Frontend path |
| is_read | BOOLEAN | DEFAULT false | Read flag |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.9 shelters

Emergency shelter listings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Shelter ID |
| name | VARCHAR(255) | NOT NULL | Shelter name |
| address | VARCHAR(500) | NOT NULL | Address |
| capacity | INTEGER | NOT NULL | Total capacity |
| available_beds | INTEGER | NOT NULL | Available beds |
| contact_phone | VARCHAR(32) | NOT NULL | Contact |
| latitude | FLOAT | NULL | Geo |
| longitude | FLOAT | NULL | Geo |
| managed_by | INTEGER | FK → users.id, NULL | Managing NGO |
| is_active | BOOLEAN | DEFAULT true | Active flag |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.10 incident_reports

Disaster incident reports.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Incident ID |
| reporter_id | INTEGER | FK → users.id | Reporter |
| title | VARCHAR(255) | NOT NULL | Title |
| description | TEXT | NOT NULL | Details |
| disaster_type | VARCHAR(64) | NOT NULL | e.g. flood, cyclone |
| severity | VARCHAR(32) | DEFAULT medium | low/medium/high |
| location | VARCHAR(500) | NOT NULL | Location |
| latitude | FLOAT | NULL | Geo |
| longitude | FLOAT | NULL | Geo |
| status | ENUM(EmergencyStatus) | DEFAULT open | Status |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.11 volunteer_opportunities

NGO-published volunteer programs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Opportunity ID |
| organization_id | INTEGER | FK → users.id | Publishing NGO |
| title | VARCHAR(255) | NOT NULL | Title |
| description | TEXT | NOT NULL | Details |
| location | VARCHAR(500) | NOT NULL | Location |
| slots | INTEGER | DEFAULT 1 | Total slots |
| filled_slots | INTEGER | DEFAULT 0 | Filled count |
| start_date | VARCHAR(32) | NULL | Start (string MVP) |
| end_date | VARCHAR(32) | NULL | End (string MVP) |
| status | ENUM(OpportunityStatus) | DEFAULT open | Status |
| created_at | DATETIME | DEFAULT utcnow | Created |

---

### 2.12 volunteer_applications

Volunteer applications to opportunities.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Application ID |
| opportunity_id | INTEGER | FK → volunteer_opportunities.id | Target opportunity |
| volunteer_id | INTEGER | FK → users.id | Applicant |
| status | ENUM(ApplicationStatus) | DEFAULT pending | Review status |
| created_at | DATETIME | DEFAULT utcnow | Applied |

---

### 2.13 certificates

Participation certificates for volunteers.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Certificate ID |
| volunteer_id | INTEGER | FK → users.id | Recipient |
| organization_id | INTEGER | FK → users.id | Issuing org |
| program_name | VARCHAR(255) | NOT NULL | Program title |
| certificate_code | VARCHAR(64) | UNIQUE, INDEX | Public verify code |
| issue_date | DATETIME | DEFAULT utcnow | Issue date |
| is_verified | BOOLEAN | DEFAULT true | Validity flag |

---

### 2.14 disaster_coverage

Area-level relief coverage status.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PK | Coverage ID |
| area_name | VARCHAR(255) | NOT NULL | Area label |
| latitude | FLOAT | NOT NULL | Geo |
| longitude | FLOAT | NOT NULL | Geo |
| coverage_status | ENUM(CoverageStatus) | NOT NULL | served/partial/underserved/critical |
| notes | TEXT | NULL | Notes |
| reported_by | INTEGER | FK → users.id | Reporter |
| updated_at | DATETIME | DEFAULT utcnow, ON UPDATE | Last update |

---

## 3. Relationships Summary

```
users 1──* emergency_requests (requester_id)
users 1──* emergency_requests (assigned_volunteer_id)
users 1──* blood_requests
users 1──* resources
users 1──* ngo_coordinations
users 1──* donations
users 1──* fundraising_campaigns
users 1──* notifications
users 1──* shelters (managed_by)
users 1──* incident_reports
users 1──* volunteer_opportunities
users 1──* volunteer_applications
users 1──* certificates (volunteer_id, organization_id)
users 1──* disaster_coverage
fundraising_campaigns 1──* donations
volunteer_opportunities 1──* volunteer_applications
```

---

## 4. Indexes & Constraints

| Table | Index / Constraint | Purpose |
|-------|-------------------|---------|
| users | UNIQUE(email) | Login lookup |
| certificates | UNIQUE(certificate_code) | Public verification |
| All PKs | PRIMARY KEY(id) | Row identity |
| All FKs | FOREIGN KEY | Referential integrity |

**Note:** MVP uses SQLite without explicit ON DELETE rules; application layer handles orphans.

---

## 5. Enum Reference

| Enum | Values |
|------|--------|
| UserRole | citizen, volunteer, donor, ngo, hospital, admin |
| VerificationStatus | pending, approved, rejected |
| EmergencyType | medical, blood, ambulance, food, shelter, rescue, transport, missing_person, other |
| EmergencyStatus | open, in_progress, verified, resolved, cancelled |
| BloodGroup | A+, A-, B+, B-, AB+, AB-, O+, O- |
| DocumentType | nid, passport, other |
| ResourceType | food, medicine, clothing, equipment, money, other |
| DonationType | money, food, medicine, clothing, equipment, other |
| CoordinationStatus | open, accepted, completed, cancelled |
| CoverageStatus | served, partial, underserved, critical |
| OpportunityStatus | open, closed, completed |
| ApplicationStatus | pending, approved, rejected |
| CampaignStatus | active, paused, completed |

---

## 6. Schema Management

| Environment | Method |
|-------------|--------|
| Development | `Base.metadata.create_all()` on app startup |
| Reset | `npm run reset:db` or `RESET_DB=1` env var |
| Production (planned) | Alembic migrations |

### Connection Configuration

```python
# app/core/database.py
engine = create_engine(settings.database_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
```

SQLite uses `check_same_thread=False` for FastAPI async compatibility.

---

## 7. Data Integrity Rules

| Rule | Enforcement |
|------|-------------|
| Unique email per user | DB unique + API check on register |
| Donation updates campaign total | Application logic in `create_donation` |
| Blood request notifies matching donors | Application logic in `create_blood_request` |
| Opportunity closes when slots full | Application logic in `review_application` |
| Underserved coverage notifies NGOs | Application logic in `create_coverage` |

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [20 — TDD](./20-tdd.md) |
| **Current** | 21 — Database Design |
| **Next** | [22 — API Design](./22-api-design.md) |

---

*Phase 4 — Technical Design Document | VERA*
