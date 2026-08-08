#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/deploy/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing ${ENV_FILE}"
  echo "Copy deploy/.env.production.example to deploy/.env and edit it first."
  exit 1
fi

cd "$ROOT_DIR"
docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml up -d --build

echo ""
echo "VERA is starting. Check status with:"
echo "  docker compose --env-file deploy/.env -f docker-compose.prod.yml ps"
echo ""
echo "View logs:"
echo "  docker compose --env-file deploy/.env -f docker-compose.prod.yml logs -f"
