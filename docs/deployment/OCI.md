# Deploy VERA on Oracle Cloud Infrastructure (OCI)

This guide deploys the full VERA stack on a single OCI Compute VM:

| Service    | Role                                      |
|-----------|-------------------------------------------|
| **Nginx** | Public entry on port 80                     |
| **Frontend** | Next.js website                        |
| **Backend**  | FastAPI API + data collection            |
| **PostgreSQL** | Persistent database (Docker volume)    |

**Estimated cost:** OCI **Always Free** tier (Ampere A1 or AMD Micro VM) is enough for demos and small pilots.

---

## Architecture

```
Internet
   │
   ▼
OCI VM (public IP, port 80)
   │
   └── Nginx
         ├── /          → Next.js (frontend:3000)
         └── /api/      → FastAPI (backend:8000)
                              └── PostgreSQL (db, internal only)
```

User data (registrations, emergencies, coverage reports, donations, etc.) is stored in PostgreSQL on the VM.

---

## Part 1 — OCI console setup

### 1. Create an OCI account

1. Go to [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/)
2. Sign up and complete verification.

### 2. Create a compartment (optional but recommended)

1. OCI Console → **Identity & Security** → **Compartments**
2. **Create compartment** → name it `vera-prod`

### 3. Create a Virtual Cloud Network (VCN)

If you use the default “Create VCN automatically” when launching a VM, you can skip this.

Otherwise:

1. **Networking** → **Virtual cloud networks** → **Start VCN Wizard**
2. Choose **VCN with Internet Connectivity**
3. Name: `vera-vcn`, CIDR `10.0.0.0/16` → **Next** → **Create**

### 4. Open firewall ports (Security List)

1. **Networking** → **Virtual cloud networks** → your VCN
2. Click the **public subnet** → **Default Security List**
3. **Add Ingress Rules**:

| Source CIDR | Protocol | Destination port | Purpose        |
|-------------|----------|------------------|----------------|
| `0.0.0.0/0` | TCP      | 22               | SSH            |
| `0.0.0.0/0` | TCP      | 80               | Website + API  |

> For HTTPS later, also open port **443** and add a TLS certificate (see [Optional: HTTPS](#optional-https-with-a-domain)).

### 5. Create a Compute instance

1. **Compute** → **Instances** → **Create instance**
2. Suggested settings:
   - **Name:** `vera-server`
   - **Image:** Ubuntu 22.04 or 24.04
   - **Shape:** `VM.Standard.A1.Flex` (Always Free ARM, 2 OCPU / 12 GB RAM) **or** `VM.Standard.E2.1.Micro` (smaller)
   - **Networking:** public subnet, **Assign a public IPv4 address**
   - **SSH keys:** upload your public key (generate with `ssh-keygen` if needed)
3. **Create**
4. Copy the **Public IP address** (e.g. `129.146.xxx.xxx`)

---

## Part 2 — Deploy on the VM

### 1. SSH into the server

```bash
ssh -i ~/.ssh/your_key ubuntu@YOUR_VM_PUBLIC_IP
```

### 2. Install Docker

```bash
curl -fsSL https://raw.githubusercontent.com/MahmudulHasanJoy/VERA/main/deploy/oci-vm-bootstrap.sh | bash
```

Or clone first and run locally:

```bash
git clone https://github.com/MahmudulHasanJoy/VERA.git
cd VERA
chmod +x deploy/oci-vm-bootstrap.sh
./deploy/oci-vm-bootstrap.sh
```

**Log out and SSH back in** so the `docker` group applies.

### 3. Configure environment

```bash
cd VERA   # if not already there
cp deploy/.env.production.example deploy/.env
nano deploy/.env
```

Set at minimum:

```env
PUBLIC_URL=http://YOUR_VM_PUBLIC_IP
POSTGRES_PASSWORD=a-strong-random-password
SECRET_KEY=a-long-random-secret-at-least-32-characters
```

`PUBLIC_URL` must match how users open the site (no trailing slash). Nginx serves both the website and API on port 80.

### 4. Start the stack

```bash
chmod +x deploy/up.sh
./deploy/up.sh
```

Or manually:

```bash
docker compose --env-file deploy/.env -f docker-compose.prod.yml up -d --build
```

First build takes several minutes.

### 5. Verify

```bash
docker compose --env-file deploy/.env -f docker-compose.prod.yml ps
curl http://localhost/health
```

In your browser:

| URL | What |
|-----|------|
| `http://YOUR_VM_PUBLIC_IP` | VERA website |
| `http://YOUR_VM_PUBLIC_IP/docs` | API documentation |
| `http://YOUR_VM_PUBLIC_IP/health` | Health check |

Register users, submit coverage reports, emergencies, etc. — data is stored in PostgreSQL.

---

## Part 3 — Operations

### View logs

```bash
docker compose --env-file deploy/.env -f docker-compose.prod.yml logs -f
docker compose --env-file deploy/.env -f docker-compose.prod.yml logs -f backend
```

### Restart after code changes

```bash
git pull
./deploy/up.sh
```

### Stop / start

```bash
docker compose --env-file deploy/.env -f docker-compose.prod.yml down
docker compose --env-file deploy/.env -f docker-compose.prod.yml up -d
```

### Database backup

```bash
docker compose --env-file deploy/.env -f docker-compose.prod.yml exec db \
  pg_dump -U vera vera > vera-backup-$(date +%F).sql
```

### Restore backup

```bash
cat vera-backup-2026-07-09.sql | docker compose --env-file deploy/.env -f docker-compose.prod.yml exec -T db psql -U vera vera
```

---

## Optional: HTTPS with a domain

1. Point a domain **A record** to your VM public IP (e.g. `vera.yourdomain.com`).
2. Update `deploy/.env`:
   ```env
   PUBLIC_URL=https://vera.yourdomain.com
   ```
3. Rebuild frontend (API URL is baked in at build time):
   ```bash
   ./deploy/up.sh
   ```
4. Install Certbot on the VM and terminate TLS in Nginx, or use [OCI Load Balancer](https://docs.oracle.com/en-us/iaas/Content/Balance/Concepts/balanceoverview.htm) with a certificate.

---

## Optional: OCI Block Volume (extra disk)

For larger datasets:

1. Create a **Block Volume** in OCI and attach it to the instance.
2. Mount it (e.g. `/mnt/vera-data`).
3. Change the Postgres volume in `docker-compose.prod.yml` to use that path.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Site not loading | Check Security List allows port 80; confirm instance has public IP |
| `Connection refused` on SSH | Security List port 22; correct SSH key |
| API errors / CORS | `PUBLIC_URL` in `deploy/.env` must exactly match browser URL (http vs https, no trailing slash) |
| Frontend can’t reach API | Rebuild after changing `PUBLIC_URL`: `./deploy/up.sh` |
| Out of memory on Micro VM | Use A1.Flex shape or add swap: `sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile` |
| Permission denied for Docker | `newgrp docker` or log out/in after bootstrap |

---

## Alternative OCI options

| Option | When to use |
|--------|-------------|
| **Compute VM + Docker** (this guide) | Simplest; best for coursework and MVP |
| **OCI Container Instances** | Serverless containers; no VM management |
| **Oracle Kubernetes Engine (OKE)** | Large scale, multiple services |
| **Autonomous Database** | Managed Postgres; replace `db` service and set `DATABASE_URL` |

For collecting real-world data during a pilot, the VM + Docker approach above is the recommended starting point.

---

## Quick reference

```bash
# On OCI Ubuntu VM
git clone https://github.com/MahmudulHasanJoy/VERA.git
cd VERA
./deploy/oci-vm-bootstrap.sh
# re-login SSH
cp deploy/.env.production.example deploy/.env
nano deploy/.env
./deploy/up.sh
```

Open **http://YOUR_VM_PUBLIC_IP** — your VERA site is live.
