# VERA v1.0 Release Notes

**Date:** 2026-07-08  
**Tag:** `v1.0.0`

## Shipped

- Full-stack MVP: Next.js frontend + FastAPI backend
- JWT auth with roles (citizen, volunteer, donor, ngo, hospital, admin)
- Emergency & blood request workflows with donor notifications
- NGO resources, coordination, donations, fundraising campaigns
- Shelters, incidents, volunteer opportunities, certificates
- Disaster coverage monitoring + OpenStreetMap visualization
- Location-based nearby search with map markers
- Sidebar navigation for authenticated app pages
- SQLite local default; PostgreSQL via Docker Compose
- Alembic initial migration (`0001_initial`)
- Backend pytest suite for auth / emergencies / blood notifications
- Unified API error responses (`detail`, `code`, `fields`)
- Optional email/SMS notification channels (env-gated)
- Course documentation: business analysis, PRD, SRS, TDD

## Known limitations

- No live payment gateway
- No SMS/email until `SMTP_*` / `SMS_*` configured
- No native mobile apps
- Maps use public OSM tiles (no Google Maps key required)

## Setup snapshot

```bash
npm run setup && npm run dev
# or
docker compose up --build
```

## Docs

- README (root)
- `docs/srs/`, `docs/tdd/`
- API: http://localhost:8000/docs
