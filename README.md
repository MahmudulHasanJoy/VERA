# VERA — Volunteer Emergency Response Alliance

A full-stack emergency assistance platform connecting citizens, volunteers, donors, NGOs, hospitals, and relief organizations across Bangladesh.

## Stack

- **Frontend:** Next.js 16, React 19, Tailwind CSS 4, Leaflet maps
- **Backend:** FastAPI, SQLAlchemy, JWT auth
- **Database:** SQLite (local default) / PostgreSQL (Docker & production)
- **Migrations:** Alembic

## Project structure

```
VERA/
├── backend/          # FastAPI API, models, Alembic, tests
├── frontend/         # Next.js web app
├── docs/             # Business analysis, PRD, SRS, TDD
├── docker-compose.yml
└── scripts/          # setup / cleanup / DB reset helpers
```

## Quick start (local)

```bash
npm run setup   # first time — installs deps, env files, Python packages
npm run dev     # backend :8000 + frontend :3000
```

- App: http://localhost:3000
- API docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

Reset local SQLite:

```bash
npm run reset:db
```

## Docker

```bash
docker compose up --build
```

Starts Postgres, API (`:8000`), and web (`:3000`).

## Tests

```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest -q
```

## Database migrations (Alembic)

From `backend/`:

```bash
# SQLite (default .env)
alembic upgrade head

# Or point DATABASE_URL at Postgres first, then:
alembic upgrade head
```

Dev still auto-creates missing tables on startup; Alembic is the path for production schema changes.

## Features (MVP)

- Role-based auth (citizen, volunteer, donor, ngo, hospital, admin)
- Emergencies, blood requests + donor matching notifications
- NGO resources, coordination, donations & campaigns
- Shelters, incidents, volunteer opportunities & certificates
- Disaster coverage monitoring with map view
- Nearby location search with OpenStreetMap markers
- In-app notifications (+ optional email/SMS channels)
- Admin report dashboard

## Documentation phases

| Phase | Path |
|-------|------|
| Business analysis | `docs/business-analysis/` |
| PRD | `docs/prd/` |
| SRS | `docs/srs/` |
| TDD | `docs/tdd/` |

## Environment

Copy examples:

- `backend/.env.example` → `backend/.env`
- `frontend/.env.local.example` → `frontend/.env.local`

Key backend vars: `DATABASE_URL`, `SECRET_KEY`, `CORS_ORIGINS`, optional `SMTP_*` / `SMS_*`.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Port 3000/8000 in use | Stop old `npm run dev`, or rerun `npm run predev` cleanup |
| `Registration failed` / mapper error | Ensure `User.emergency_requests` has `foreign_keys`; restart API |
| `no such column` | Run `npm run reset:db` then `npm run dev` |
| Hydration warning with Grammarly | Extension noise; layout uses `suppressHydrationWarning` |
| Docker frontend can't call API | Confirm `NEXT_PUBLIC_API_URL=http://localhost:8000` |

## Known limitations (v1)

- Payment gateway not integrated (donations are logged)
- Native mobile / offline mode not in scope
- Email/SMS require external credentials (off by default)
- Production secrets must replace default `SECRET_KEY`

## Security notes

- Passwords hashed with bcrypt
- JWT Bearer auth on protected routes
- Role checks via `require_roles` (admin bypass)
- Unified API errors do not leak stack traces
