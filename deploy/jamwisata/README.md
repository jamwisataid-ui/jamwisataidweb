# JAM WISATA VPS deployment

This stack runs the Next.js application, PostgreSQL, and optional LiveKit
services on the VPS. Cloudflare R2 remains the private document store so a
single VPS disk failure cannot also remove jamaah documents. UploadThing and
Resend remain managed integrations.

## Server layout

- `/opt/jamwisata/current`: checked-out application release
- `/opt/jamwisata/shared/app.env`: production application secrets
- `/opt/jamwisata/shared/deploy.env`: Compose and LiveKit configuration
- `jamwisata-web`: Next.js standalone container
- `jamwisata-postgres`: private PostgreSQL service with a persistent volume
- `jamwisata-redis`: private Redis used only by LiveKit
- `jamwisata-livekit`: optional host-networked realtime server
- `jamwisata-mobile-preview`: static Expo Web preview for stakeholder review

The web container joins the existing `erp-retail_backend` network so the
existing Caddy container can proxy to `jamwisata-web:3000`. It is also bound to
`127.0.0.1:3300` for local health checks. PostgreSQL only joins the internal
Docker network; port 5432 is never published on the host.

## Required deployment variables

Set a unique random password in `/opt/jamwisata/shared/deploy.env`:

```dotenv
POSTGRES_DB=jamwisata
POSTGRES_USER=jamwisata
POSTGRES_PASSWORD=<random-secret>
```

Set the matching internal connection in `/opt/jamwisata/shared/app.env`:

```dotenv
DATABASE_URL=postgresql://jamwisata:<url-encoded-password>@postgres:5432/jamwisata
DATABASE_POOL_MAX=10
```

Do not reuse the VPS login password and do not publish PostgreSQL port 5432.

## One-time Neon migration

Start PostgreSQL without switching the application first:

```bash
docker compose --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml up -d postgres
```

Export the Neon URL only for the migration process, then restore the complete
database. The script never writes the URL into the repository or dump file:

```bash
export SOURCE_DATABASE_URL='<temporary-neon-unpooled-url>'
set -a
. /opt/jamwisata/shared/deploy.env
set +a
bash deploy/jamwisata/scripts/restore-neon-to-postgres.sh
unset SOURCE_DATABASE_URL
```

Compare critical row counts (users, packages, pilgrims, registrations,
payments, and documents) with the source before switching `DATABASE_URL`.
Keep Neon read-only until the VPS deployment has passed production smoke tests.

## Deploy

```bash
cd /opt/jamwisata/current
set -a
. /opt/jamwisata/shared/deploy.env
set +a
docker compose --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml build web
docker compose --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml up -d postgres web
curl --fail http://127.0.0.1:3300/api/health
```

## Backups

Create one backup immediately after the import:

```bash
set -a
. /opt/jamwisata/shared/deploy.env
set +a
bash deploy/jamwisata/scripts/backup-postgres.sh
```

Run the same script nightly from root cron or a systemd timer. The local default
retention is 14 days. Synchronize the resulting encrypted backup to storage
outside this VPS; a local-only backup does not protect against VPS loss.

Install the included systemd timer:

```bash
sudo install -m 0644 deploy/jamwisata/systemd/jamwisata-postgres-backup.service /etc/systemd/system/
sudo install -m 0644 deploy/jamwisata/systemd/jamwisata-postgres-backup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now jamwisata-postgres-backup.timer
```

Start realtime only after the VPS firewall/security group exposes LiveKit's
required ports and the server has enough free CPU, RAM, swap, and disk:

```bash
docker compose --profile realtime --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml up -d redis livekit
```

Production LiveKit requires `7881/tcp`, `3478/udp`, and
`50000-60000/udp`. Port `7880` remains behind Caddy. TURN/TLS is enabled only
after a certificate for `turn.jamwisata.id` is provisioned.

Build the reviewable mobile UI preview with the staging API URL:

```bash
docker compose --profile preview --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml build mobile-preview
docker compose --profile preview --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml up -d mobile-preview
```

## DNS cutover and rollback

Validate admin login, package APIs, registration, documents, payments, and
mobile sessions on the staging hostname first. Then enable the production
blocks in `Caddyfile.snippet` and point both `jamwisata.id` and
`www.jamwisata.id` to the VPS.

Keep the previous image tag and Neon database available until the new release
has passed health checks. For an application rollback, set
`JAMWISATA_IMAGE_TAG` to the previous tag and run `docker compose up -d web`.
For a database rollback, stop writes before pointing the old deployment back to
Neon so records cannot diverge silently.
