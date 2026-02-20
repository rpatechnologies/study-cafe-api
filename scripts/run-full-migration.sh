#!/usr/bin/env bash
# Re-runnable sync: copy source DB (sc_* on 3306) → microservices DB (3307).
# Use for initial migration and for going-live sync (pull latest source, then run this).
#
# Usage:
#   ./scripts/run-full-migration.sh       # ensure target MySQL up, then sync
#   SKIP_DOCKER=1 ./scripts/run-full-migration.sh   # skip docker check (target already up)
#   npm run sync                            # same as first
#
# Env: MIGRATION_SRC_* and MIGRATION_TGT_* (see .env.example). Loaded by migrate-wp-to-ms.js.
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

echo "=== StudyCafe sync: source (3306) → target (3307) ==="
echo ""

if [ "${SKIP_DOCKER}" != "1" ]; then
  if ! docker compose ps mysql 2>/dev/null | grep -q Up; then
    echo "Starting MySQL (target DB on 3307)..."
    docker compose up -d mysql
    echo "Waiting for MySQL to be ready..."
    for i in $(seq 1 30); do
      if docker compose exec -T mysql mysqladmin ping -h localhost -uroot -prootpassword 2>/dev/null; then
        break
      fi
      sleep 2
    done
  fi
fi

echo "Running full sync (migrate-wp-to-ms.js)..."
node scripts/migrate-wp-to-ms.js

echo ""
echo "Done. Re-run anytime to sync again. See docs/MIGRATION_GUIDE.md for verification."
