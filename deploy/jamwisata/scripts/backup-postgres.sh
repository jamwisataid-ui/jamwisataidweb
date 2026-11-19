#!/usr/bin/env bash
set -Eeuo pipefail

: "${POSTGRES_USER:=jamwisata}"
: "${POSTGRES_DB:=jamwisata}"

POSTGRES_CONTAINER="${POSTGRES_CONTAINER:-jamwisata-postgres}"
BACKUP_DIR="${BACKUP_DIR:-/opt/jamwisata/backups/postgres}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
TEMP_FILE="${BACKUP_DIR}/.${POSTGRES_DB}-${TIMESTAMP}.dump.tmp"
FINAL_FILE="${BACKUP_DIR}/${POSTGRES_DB}-${TIMESTAMP}.dump"

install -d -m 700 "${BACKUP_DIR}"

docker exec "${POSTGRES_CONTAINER}" \
  pg_dump --username="${POSTGRES_USER}" --dbname="${POSTGRES_DB}" \
  --format=custom --no-owner --no-acl > "${TEMP_FILE}"

chmod 600 "${TEMP_FILE}"
mv "${TEMP_FILE}" "${FINAL_FILE}"
find "${BACKUP_DIR}" -type f -name '*.dump' -mtime "+${BACKUP_RETENTION_DAYS}" -delete

echo "Backup tersimpan: ${FINAL_FILE}"
