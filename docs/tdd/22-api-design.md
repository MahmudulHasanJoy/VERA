# 22 — API Design

**VERA: Volunteer Emergency Response Alliance**

## Document Information

| Field | Detail |
|-------|--------|
| **Phase** | 4 — Technical Design Document (TDD) |
| **API Version** | v1 |
| **Base URL (dev)** | `http://localhost:8000/api/v1` |
| **Format** | JSON |
| **Auth** | Bearer JWT (OAuth2 password flow for login) |

---

## 1. Conventions

### 1.1 Authentication

| Endpoint type | Auth required |
|---------------|---------------|
| `POST /auth/register` | No |
| `POST /auth/login` | No |
| `GET /certificates/verify/{code}` | No |
| `GET /health` | No |
| All other endpoints | Yes — `Authorization: Bearer <token>` |

### 1.2 Login

```http
POST /api/v1/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=secret123
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### 1.3 Error Responses

| Status | Meaning |
|--------|---------|
| 400 | Bad request (e.g. duplicate email) |
| 401 | Invalid or missing token |
| 403 | Insufficient role permissions |
| 404 | Resource not found |
| 422 | Validation error (Pydantic) |

```json
{ "detail": "Error message" }
```

### 1.4 Role Authorization

`require_roles(A, B)` allows users with role A or B. **Admin** always bypasses role checks.

---

## 2. Health Check

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/health` | No | Service health (outside `/api/v1`) |

**Response:**
```json
{ "status": "ok", "service": "vera-api" }
```

---

## 3. Authentication (`/auth`)

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/auth/register` | No | — | Create account |
| POST | `/auth/login` | No | — | Obtain JWT |
| GET | `/auth/me` | Yes | Any | Current user profile |

### POST `/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "secret123",
  "full_name": "Rahim Ahmed",
  "phone": "+8801712345678",
  "role": "citizen",
  "organization_name": null,
  "address": "Dhaka",
  "latitude": 23.8103,
  "longitude": 90.4125,
  "blood_group": null
}
```

**Response 201:** `UserRead` (no password field)

### GET `/auth/me`

**Response 200:** `UserRead`

---

## 4. Emergencies (`/emergencies`)

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/emergencies` | Yes | Any | List emergencies |
| POST | `/emergencies` | Yes | Any | Create emergency |
| GET | `/emergencies/{id}` | Yes | Any | Get one |
| PATCH | `/emergencies/{id}` | Yes | volunteer, ngo, hospital, admin | Update status/assignment |

### Query Parameters (GET list)

| Param | Type | Description |
|-------|------|-------------|
| `status_filter` | EmergencyStatus | Filter by status |
| `type_filter` | EmergencyType | Filter by type |

### POST body (`EmergencyRequestCreate`)

```json
{
  "title": "Medical emergency",
  "description": "Elderly person needs assistance",
  "emergency_type": "medical",
  "location": "Mirpur, Dhaka",
  "latitude": 23.8067,
  "longitude": 90.3683,
  "contact_phone": "+8801712345678"
}
```

### PATCH body (`EmergencyRequestUpdate`)

```json
{
  "status": "in_progress",
  "assigned_volunteer_id": 5,
  "is_verified": true
}
```

---

## 5. Blood (`/blood`)

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/blood/requests` | Yes | Any | List blood requests |
| POST | `/blood/requests` | Yes | Any | Create (auto-notifies donors) |
| PATCH | `/blood/requests/{id}` | Yes | donor, hospital, volunteer, admin | Update status |
| GET | `/blood/donors` | Yes | Any | Find available donors |

### Query Parameters

| Endpoint | Param | Type | Required |
|----------|-------|------|----------|
| GET `/blood/requests` | `status_filter` | EmergencyStatus | No |
| GET `/blood/requests` | `blood_group` | BloodGroup | No |
| GET `/blood/donors` | `blood_group` | BloodGroup | **Yes** |

### POST `/blood/requests` body

```json
{
  "patient_name": "Karim Hossain",
  "blood_group": "B+",
  "units_needed": 2,
  "hospital_name": "DMCH",
  "location": "Dhaka",
  "contact_phone": "+8801712345678",
  "notes": "Urgent surgery",
  "is_urgent": true
}
```

**Side effect:** Creates notifications for all active donors with matching blood group.

### GET `/blood/donors` response

```json
[
  {
    "id": 3,
    "full_name": "Sadia Rahman",
    "phone": "+8801812345678",
    "blood_group": "B+",
    "address": "Gulshan, Dhaka"
  }
]
```

---

## 6. Statistics (`/stats`)

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/stats/dashboard` | Yes | Any | Dashboard aggregate stats |

**Response (`DashboardStats`):**
```json
{
  "total_users": 120,
  "open_emergencies": 8,
  "open_blood_requests": 3,
  "active_campaigns": 5,
  "total_donations": 45000.0,
  "active_shelters": 12,
  "verified_volunteers": 34,
  "underserved_areas": 2
}
```

---

## 7. Reports (`/reports`)

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/reports/admin` | Yes | admin | Admin summary report |

---

## 8. Search (`/search`)

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/search/nearby` | Yes | Any | Location-based search |

### Query Parameters

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `latitude` | float | Yes | — | Center lat |
| `longitude` | float | Yes | — | Center lon |
| `radius_km` | float | No | 25 | Max 200 km |
| `search_type` | string | No | all | volunteer, hospital, ngo, donor, shelter, resource, emergency |

**Response:** Array of `NearbySearchResult` sorted by distance.

```json
[
  {
    "id": 7,
    "name": "Relief Shelter A",
    "type": "shelter",
    "role": null,
    "location": "Uttara, Dhaka",
    "latitude": 23.8759,
    "longitude": 90.3795,
    "distance_km": 4.2,
    "extra": { "available_beds": 50, "contact_phone": "+880..." }
  }
]
```

---

## 9. Features (root `/api/v1`)

### 9.1 Volunteers

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/volunteers/verification` | Yes | volunteer | Submit ID for verification |
| PATCH | `/volunteers/{user_id}/verification` | Yes | admin | Approve/reject volunteer |

**POST body:**
```json
{
  "id_document_type": "nid",
  "id_document_number": "1234567890"
}
```

**PATCH body:**
```json
{ "status": "approved" }
```

### 9.2 Donors

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| POST | `/donors/register` | Yes | Any | Become blood donor |

**Body:**
```json
{
  "blood_group": "O+",
  "available_for_donation": true,
  "phone": "+8801712345678",
  "address": "Banani, Dhaka"
}
```

### 9.3 Resources

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/resources` | Yes | Any | List resources |
| POST | `/resources` | Yes | ngo, hospital, admin | Add resource |

### 9.4 NGO Coordination

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/coordination` | Yes | Any | List coordination requests |
| POST | `/coordination` | Yes | ngo, hospital, admin | Create request |
| PATCH | `/coordination/{id}` | Yes | ngo, volunteer, admin | Update status |

### 9.5 Donations & Campaigns

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/donations` | Yes | Any | List (own donations unless admin) |
| POST | `/donations` | Yes | Any | Record donation |
| GET | `/campaigns` | Yes | Any | List campaigns |
| POST | `/campaigns` | Yes | ngo, admin | Create campaign |

**POST `/donations` body:**
```json
{
  "donation_type": "money",
  "amount": 5000,
  "campaign_id": 2,
  "item_description": null,
  "allocated_to": null
}
```

### 9.6 Notifications

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/notifications` | Yes | Any | List own notifications |
| PATCH | `/notifications/{id}/read` | Yes | Any | Mark as read |

### 9.7 Shelters

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/shelters` | Yes | Any | List active shelters |
| POST | `/shelters` | Yes | ngo, admin | Create shelter |

### 9.8 Incidents

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/incidents` | Yes | Any | List incident reports |
| POST | `/incidents` | Yes | Any | Report incident |

### 9.9 Volunteer Opportunities

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/opportunities` | Yes | Any | List opportunities |
| POST | `/opportunities` | Yes | ngo, admin | Create opportunity |
| POST | `/opportunities/{id}/apply` | Yes | volunteer | Apply to opportunity |
| PATCH | `/applications/{id}/review` | Yes | ngo, admin | Approve/reject application |

**PATCH query param:** `status` = `pending` | `approved` | `rejected`

### 9.10 Certificates

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/certificates` | Yes | Any | List (own unless admin/ngo) |
| POST | `/certificates` | Yes | ngo, admin | Issue certificate |
| GET | `/certificates/verify/{code}` | **No** | — | Public verification |

### 9.11 Disaster Coverage

| Method | Path | Auth | Roles | Description |
|--------|------|------|-------|-------------|
| GET | `/coverage` | Yes | Any | List coverage areas |
| POST | `/coverage` | Yes | ngo, admin, volunteer | Report coverage status |

**POST body:**
```json
{
  "area_name": "Sylhet Sadar",
  "latitude": 24.8949,
  "longitude": 91.8687,
  "coverage_status": "underserved",
  "notes": "Flooded roads blocking aid"
}
```

**Side effect:** Notifies all NGOs when status is `underserved` or `critical`.

---

## 10. Endpoint Summary

| # | Method | Endpoint | Auth |
|---|--------|----------|------|
| 1 | POST | `/auth/register` | No |
| 2 | POST | `/auth/login` | No |
| 3 | GET | `/auth/me` | Yes |
| 4 | GET | `/emergencies` | Yes |
| 5 | POST | `/emergencies` | Yes |
| 6 | GET | `/emergencies/{id}` | Yes |
| 7 | PATCH | `/emergencies/{id}` | Yes |
| 8 | GET | `/blood/requests` | Yes |
| 9 | POST | `/blood/requests` | Yes |
| 10 | PATCH | `/blood/requests/{id}` | Yes |
| 11 | GET | `/blood/donors` | Yes |
| 12 | GET | `/stats/dashboard` | Yes |
| 13 | GET | `/reports/admin` | Yes |
| 14 | GET | `/search/nearby` | Yes |
| 15 | POST | `/volunteers/verification` | Yes |
| 16 | PATCH | `/volunteers/{id}/verification` | Yes |
| 17 | POST | `/donors/register` | Yes |
| 18 | GET/POST | `/resources` | Yes |
| 19 | GET/POST/PATCH | `/coordination` | Yes |
| 20 | GET/POST | `/donations` | Yes |
| 21 | GET/POST | `/campaigns` | Yes |
| 22 | GET/PATCH | `/notifications` | Yes |
| 23 | GET/POST | `/shelters` | Yes |
| 24 | GET/POST | `/incidents` | Yes |
| 25 | GET/POST | `/opportunities` | Yes |
| 26 | POST | `/opportunities/{id}/apply` | Yes |
| 27 | PATCH | `/applications/{id}/review` | Yes |
| 28 | GET/POST | `/certificates` | Yes |
| 29 | GET | `/certificates/verify/{code}` | No |
| 30 | GET/POST | `/coverage` | Yes |

**Total:** 30+ route handlers across 7 router modules.

---

## 11. OpenAPI / Swagger

Interactive API docs available at:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

Auto-generated from FastAPI route definitions and Pydantic schemas.

---

## Phase Navigation

| | Document |
|---|----------|
| **Previous** | [21 — Database Design](./21-database-design.md) |
| **Current** | 22 — API Design |
| **Next** | — (End of Phase 4) |

---

*Phase 4 — Technical Design Document | VERA*
