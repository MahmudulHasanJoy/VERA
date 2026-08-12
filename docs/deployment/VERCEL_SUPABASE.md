# Deploy VERA: Vercel (frontend) + Railway (API) + Supabase (database)

VERA has **three parts**. They do not all fit on Vercel alone.

| Part | Technology | Host |
|------|------------|------|
| Website UI | Next.js / React | **Vercel** |
| API | FastAPI (Python) | **Railway** or **Render** |
| Database | PostgreSQL | **Supabase** (already done) |

```
Browser → Vercel (frontend)
              │
              │  NEXT_PUBLIC_API_URL
              ▼
         Railway (FastAPI)
              │
              │  DATABASE_URL
              ▼
         Supabase (Postgres)
```

Login still uses **VERA JWT auth** (not Supabase Auth). Supabase is only the database.

---

## Before you start (local checklist)

1. Supabase tables exist (you already see them in Table Editor).
2. Local register/login works with Supabase.
3. Push latest code to GitHub `main` (including the Postgres enum fix).
4. Have ready:
   - Supabase **pooler** `DATABASE_URL`
   - Gemini API key (for VERA Bot)
   - GitHub repo access

**Pooler URL format (use this on Railway, not the `db.*` direct host):**
```env
DATABASE_URL=postgresql+psycopg2://postgres.mwsqekmbqrblaglffclb:YOUR_PASSWORD@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres
```

---

## Step 1 — Deploy the FastAPI backend (Railway)

Vercel cannot run your FastAPI app as a normal always-on API. Deploy the backend first.

### 1.1 Create a Railway project

1. Go to [https://railway.app](https://railway.app) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select `MahmudulHasanJoy/VERA`.

### 1.2 Configure the service (important)

Railway must **not** run `npm start`. If logs show `Missing script: "start"`, it is still treating the repo as Node.

**Easiest fix (recommended):** this repo includes a root `Dockerfile` + `railway.toml` that force the FastAPI API image. Redeploy after pulling latest `main`.

**Or set manually in Settings:**

| Setting | Value |
|---------|--------|
| **Root Directory** | leave empty **or** `backend` |
| **Builder** | Dockerfile (auto via `railway.toml`) |
| **Custom Start Command** | **Leave EMPTY** — do not set `uvicorn ... --port $PORT` (Railway will not expand `$PORT` and the app will crash). The Dockerfile runs `./entrypoint.sh`, which expands `$PORT` correctly. |

If you previously created a Node/frontend service, delete it and create a **new** service from GitHub so it picks up `railway.toml`.

Do **not** set start command to `npm start`.
### 1.3 Add environment variables (Railway → Variables)

```env
DATABASE_URL=postgresql+psycopg2://postgres.mwsqekmbqrblaglffclb:YOUR_PASSWORD@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres
SECRET_KEY=replace-with-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-flash-lite-latest
```

> Leave `CORS_ORIGINS` temporary for now. After Vercel gives you a URL, update it (Step 3).

### 1.4 Generate a public domain

1. Railway → your service → **Settings** → **Networking** → **Generate Domain**
2. Copy it, example: `https://vera-api-production-xxxx.up.railway.app`
3. Open `https://YOUR-RAILWAY-URL/docs` — you should see FastAPI Swagger.
4. Open `https://YOUR-RAILWAY-URL/health` — should return `{"status":"ok",...}`

---

## Step 2 — Deploy the frontend on Vercel

### 2.1 Import the project

1. Go to [https://vercel.com](https://vercel.com) → sign in with GitHub.
2. **Add New…** → **Project** → import `MahmudulHasanJoy/VERA`.

### 2.2 Configure build

| Setting | Value |
|---------|--------|
| **Root Directory** | `frontend` (click Edit → select `frontend`) |
| Framework | Next.js (auto) |
| Build Command | `next build` (default) |
| Output | default |

### 2.3 Environment variables (Vercel → Settings → Environment Variables)

**Required:**
```env
NEXT_PUBLIC_API_URL=https://YOUR-RAILWAY-URL
```
(no trailing slash)

**Also set these** (your unfinished Supabase middleware needs them or the site can crash):

In Supabase → **Project Settings → API**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://mwsqekmbqrblaglffclb.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key
```

> This does **not** replace login. It only keeps the existing middleware from breaking. Auth still goes through FastAPI + JWT.

Apply to **Production** (and Preview if you want).

### 2.4 Deploy

Click **Deploy**. When finished, copy the site URL, e.g.  
`https://vera-xxx.vercel.app`

---

## Step 3 — Connect everything (CORS)

1. Go back to **Railway** → Variables.
2. Update:
   ```env
   CORS_ORIGINS=https://vera-xxx.vercel.app,http://localhost:3000
   ```
3. Redeploy / restart the Railway service.
4. Open the Vercel site → **Register** → **Login** → check Dashboard.
5. Confirm new rows in Supabase **Table Editor → users**.

---

## Step 4 — Viva demo checklist

- [ ] `https://YOUR-RAILWAY-URL/docs` opens
- [ ] `https://YOUR-VERCEL-URL` opens
- [ ] Register + login works
- [ ] Emergencies / Blood create rows in Supabase
- [ ] VERA Bot works (Gemini key set on Railway)
- [ ] No secrets committed to GitHub (`.env` stays local)

---

## Common problems

| Problem | Fix |
|---------|-----|
| Vercel page loads but login fails / CORS error | Add exact Vercel URL to Railway `CORS_ORIGINS` and restart API |
| `localhost refused` on your PC | Only for local. Use the Vercel URL for the live site |
| Registration enum / NGO error | Make sure the `pg_enum` fix is pushed to `main` and Railway redeployed |
| Supabase connection fails on Railway | Use **pooler** host (`aws-0-ap-southeast-2.pooler.supabase.com`), not `db.*` |
| Vercel build fails on middleware / Supabase | Set `NEXT_PUBLIC_SUPABASE_URL` + publishable key, or remove `frontend/src/middleware.ts` |

---

## Optional: Render instead of Railway

Same idea:

1. New **Web Service** from GitHub
2. Root: `backend`
3. Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Same env vars as Step 1.3
5. Put Render URL into Vercel `NEXT_PUBLIC_API_URL`

---

## What “linking Supabase” means here

- **Already linked:** FastAPI `DATABASE_URL` → Supabase Postgres  
- **Vercel does not talk to the DB directly** for VERA features  
- Frontend → Railway API → Supabase  

That is the correct and simplest production setup for this project.
