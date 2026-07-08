# Security basics review — VERA MVP

**Date:** 2026-07-08  
**Scope:** Auth, secrets, roles, CORS, error leakage

## Checklist

| Check | Result | Notes |
|-------|--------|-------|
| JWT required on protected routes | Pass | OAuth2PasswordBearer + `get_current_user` |
| Invalid/missing token → 401 | Pass | Covered in pytest |
| Passwords hashed (bcrypt) | Pass | `passlib` / bcrypt; never stored plaintext |
| Role guards on admin/NGO actions | Pass | `require_roles`; admin bypass intentional |
| CORS whitelist | Pass | `CORS_ORIGINS` env |
| SECRET_KEY not hardcoded in repo for prod | Partial | Dev default exists; override via `.env` (gitignored) |
| Stack traces not returned to clients | Pass | Global handlers return safe JSON |
| SQL injection | Pass | SQLAlchemy ORM parameterized queries |
| Certificate public verify endpoint | Acceptable | Read-only by code; no auth by design |

## Actions taken / recommendations

1. Keep `backend/.env` out of git (already ignored).
2. Rotate `SECRET_KEY` before any public deploy.
3. Prefer Postgres for shared/staging environments (Docker compose provided).
4. Enable HTTPS at reverse proxy in production.
5. Rate-limit login in a later hardening pass (deferred).

## Residual risk

- Local defaults are convenient for classroom demos but unsafe for production without env changes.
- Browser `localStorage` JWT is XSS-sensitive; standard for this MVP scope.
