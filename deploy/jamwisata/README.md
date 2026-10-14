# JAM WISATA VPS deployment

This stack keeps Neon, Cloudflare R2, UploadThing, and Resend managed while
running the Next.js application and optional LiveKit services on the VPS.

## Server layout

- `/opt/jamwisata/current`: checked-out application release
- `/opt/jamwisata/shared/app.env`: production application secrets
- `/opt/jamwisata/shared/deploy.env`: Compose and LiveKit configuration
- `jamwisata-web`: Next.js standalone container
- `jamwisata-redis`: private Redis used only by LiveKit
- `jamwisata-livekit`: optional host-networked realtime server
- `jamwisata-mobile-preview`: static Expo Web preview for stakeholder review

The web container joins the existing `erp-retail_backend` network so the
existing Caddy container can proxy to `jamwisata-web:3000`. It is also bound to
`127.0.0.1:3300` for local health checks.

## Deploy

```bash
cd /opt/jamwisata/current
set -a
. /opt/jamwisata/shared/deploy.env
set +a
docker compose --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml build web
docker compose --env-file /opt/jamwisata/shared/deploy.env \
  -f deploy/jamwisata/compose.yml up -d web
curl --fail http://127.0.0.1:3300/api/health
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

## Rollback

Keep the previous image tag until the new release has passed health checks.
Set `JAMWISATA_IMAGE_TAG` to that tag in `deploy.env`, then run `docker compose
up -d web`. DNS remains on the old host until staging validation succeeds.
