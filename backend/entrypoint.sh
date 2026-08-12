#!/bin/sh
set -e

PORT="${PORT:-8000}"

echo "Running database migrations..."
if alembic upgrade head; then
  echo "Migrations complete."
else
  echo "WARNING: alembic upgrade failed — continuing so the API can start."
  echo "Check DATABASE_URL (use Supabase pooler + ?sslmode=require)."
fi

echo "Starting API server on port ${PORT}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
