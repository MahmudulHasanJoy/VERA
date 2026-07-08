# Performance smoke check — VERA MVP

**Date:** 2026-07-08  
**Environment:** Local Windows, SQLite, uvicorn + Next.js dev

## Method

Manual smoke against running `npm run dev` and pytest TestClient:

| Endpoint | Observation |
|----------|-------------|
| `GET /health` | Instant (&lt; 50ms typical) |
| `POST /api/v1/auth/register` | Dominated by bcrypt hash (~100–300ms) — acceptable |
| `POST /api/v1/auth/login` | Similar bcrypt verify cost |
| `GET /api/v1/emergencies` | Fast on small demo datasets |
| `GET /api/v1/stats/dashboard` | Multiple count queries; fine for demo scale |
| Search / map pages | Markers via OSM CDN; first load waits on Leaflet script |

## Baseline goals (classroom/demo)

- Interactive pages usable with dozens–low hundreds of rows
- No multi-second blockers on core CRUD for pilot data

## Bottlenecks / notes

1. bcrypt cost is intentional (security over raw login speed).
2. Nearby search is O(n) Haversine in Python — OK for MVP; index/geo later if scale grows.
3. Dashboard aggregates full table counts — replace with cached counters if needed after pilot.

## Optimizations applied now

- None required for demo scale beyond existing indexed PKs/email unique index.

## Verdict

**Pass for classroom/demo smoke.** No severe bottleneck blocks walkthrough.
