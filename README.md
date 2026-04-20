# Contest Notifier


Track upcoming programming contests across Codeforces, LeetCode, AtCoder, and CodeChef.
Bookmark, get web-push reminders, export to calendar, attach YouTube solutions.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 6, TailwindCSS 4, TanStack Query 5, Zustand, React Router 7, lucide-react |
| Backend | Node 20, Express 4, Mongoose 8, Pino, Zod, ioredis / node-cache, web-push, node-cron |
| Infra | Docker Compose (mongo + redis + backend + frontend), GitHub Actions, Husky + Prettier |

## Architecture

```
frontend (Vite SPA)
  ├─ /all → backend
  └─ service worker ← web push ← backend
backend (Express)
  ├─ Redis / memory cache
  ├─ cron: pre-warm every 10m, notify every 5m
  ├─ external: clist.by, codeforces.com/api
  └─ MongoDB (solutions, push subscriptions)
```

## Quick start (Docker)

```bash
cp backend/.env.example backend/.env   # fill CLIST_* keys
docker compose up --build
# frontend → http://localhost:5173
# backend  → http://localhost:8001
```

## Local dev

**Backend**
```bash
cd backend
cp .env.example .env   # set MONGO_URI, CLIST_*
npm i
npm run server
```

**Frontend**
```bash
cd frontend
cp .env.example .env    # VITE_API_BASE_URL=http://localhost:8001
npm i
npm run dev
```

## Environment

### Backend (`backend/.env`)

| Var | Required | Default | Notes |
|-----|----------|---------|-------|
| `PORT` | no | 8001 | |
| `NODE_ENV` | no | development | |
| `MONGO_URI` | **yes** | — | MongoDB connection |
| `FRONTEND_URL` | no | http://localhost:5173 | CORS origin |
| `CLIST_USERNAME` | **yes** | — | clist.by account |
| `CLIST_API_KEY` | **yes** | — | clist.by API key |
| `REDIS_URL` | no | — | unset ⇒ in-memory cache (dev only) |
| `VAPID_PUBLIC_KEY` | push only | — | `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | push only | — | |
| `VAPID_SUBJECT` | no | `mailto:admin@example.com` | |

### Frontend (`frontend/.env`)

| Var | Default |
|-----|---------|
| `VITE_API_BASE_URL` | http://localhost:8001 |

## Scripts

### Backend
- `npm run server` — dev with nodemon
- `npm start` — production
- `npm test` — vitest

### Frontend
- `npm run dev` — vite dev
- `npm run build` — production build
- `npm run lint` — eslint
- `npm test` — vitest unit
- `npm run test:e2e` — playwright (run `npx playwright install` once)

### Root
- `npm run format` — prettier write
- `npm run format:check` — prettier check
- Husky runs `lint-staged` on commit

## API

```
GET  /api/contests/all               → { upcoming, past, errors }
GET  /api/contests/{codeforces|leetcode|codechef|atcoder}
GET  /api/contests/solution/:contestId
POST /api/contests/add-solution
GET  /api/push/public-key
POST /api/push/subscribe
POST /api/push/unsubscribe
GET  /healthz
```

All `/api/*` routes rate-limited. POST endpoints Zod-validated.

## Web Push

1. Generate keys: `cd backend && npx web-push generate-vapid-keys`
2. Paste into `backend/.env`
3. Restart backend, click "Notify me" in UI
4. Backend cron (every 5 min) notifies subscribers of contests starting within 1 hour

## Caching

- Cold external fetch: ~2s
- Warm cache hit: ~5ms
- Cron pre-warms every 10 min ⇒ users always hit warm cache
- TTL: 10 min
- Use Redis in prod (`REDIS_URL`). In-memory fallback for dev only.

## License

MIT
