#!/bin/sh
set -e

PORT="${PORT:-8000}"

echo "Running database migrations..."
alembic upgrade head

echo "Starting API server on port ${PORT}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
