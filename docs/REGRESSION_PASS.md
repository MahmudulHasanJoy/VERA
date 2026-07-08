# Final regression pass — VERA MVP

**Date:** 2026-07-08

## Checklist

| Journey | Status | Notes |
|---------|--------|-------|
| Register / login / logout / me | Pass | Relationship + schema fixes verified |
| Emergencies create/list/update | Pass | API + UI |
| Blood request + donor notify | Pass | Test coverage + in-app notify |
| Donations / campaigns | Pass | Logged donations (no payment gateway) |
| Resources / coordination | Pass | Role-gated creates |
| Volunteers / opportunities / certificates | Pass | Public certificate verify works |
| Shelters / incidents | Pass | |
| Coverage report + map | Pass | Leaflet OSM markers |
| Nearby search + map | Pass | |
| Notifications list/read | Pass | |
| Admin report | Pass | Admin role |
| Sidebar nav + mobile menu | Pass | Authenticated layout |

## Automated

```bash
cd backend && python -m pytest -q
```

## Known limitations carried into v1.0

- Payments, real SMS/email (optional env), native mobile out of scope

## Sign-off

MVP critical journeys: **ready for v1.0.0 tag** barring environment-specific ops issues.
