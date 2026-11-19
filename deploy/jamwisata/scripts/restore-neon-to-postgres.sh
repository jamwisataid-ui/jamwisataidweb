#!/usr/bin/env bash
set -Eeuo pipefail

: "${SOURCE_DATABASE_URL:?Isi SOURCE_DATABASE_URL dengan koneksi Neon sumber}"
: "${POSTGRES_USER:=jamwisata}"
: "${POSTGRES_DB:=jamwisata}"

POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-jamwisata-postgres}"
WORK_DIR="$(mktemp -d)"
DUMP_FILE="${WORK_DIR}/neon.dump"

cleanup() {
  rm -rf "${WORK_DIR}"
  docker exec "${POSTGRES_CONTAINER}" rm -f /tmp/neon.dump >/dev/null 2>&1 || true
}
trap cleanup EXIT

echo "Membuat dump konsisten dari database sumber..."
docker run --rm \
  -e SOURCE_DATABASE_URL \
  -v "${WORK_DIR}:/backup" \
  postgres:18-alpine \
  sh -c 'pg_dump "$SOURCE_DATABASE_URL" --format=custom --no-owner --no-acl --file=/backup/neon.dump'

echo "Memulihkan dump ke PostgreSQL VPS..."
docker cp "${DUMP_FILE}" "${POSTGRES_CONTAINER}:/tmp/neon.dump"
docker exec "${POSTGRES_CONTAINER}" \
  pg_restore \
  --username="${POSTGRES_USER}" \
  --dbname="${POSTGRES_DB}" \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --exit-on-error \
  /tmp/neon.dump

echo "Restore selesai. Ringkasan tabel publik:"
docker exec "${POSTGRES_CONTAINER}" \
  psql --username="${POSTGRES_USER}" --dbname="${POSTGRES_DB}" --tuples-only --command \
  "select count(*) || ' tabel' from pg_tables where schemaname = 'public';"
