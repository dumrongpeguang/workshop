# workshop

A full-stack user profile management app.

- `backend/` — ASP.NET Core Web API (.NET 10) exposing CRUD endpoints for user profiles (in-memory store).
- `frontend/` — React + TypeScript (Vite) UI for listing, creating, editing, and deleting user profiles.

## Run everything on one URL (recommended)

Building/running the backend automatically builds the React app and serves it from the same origin — no CORS, one port.

```bash
cd backend
dotnet run
```

Open `http://localhost:5052` — this serves both the UI and the API (`/api/userprofiles`).

## Run frontend and backend separately (frontend hot-reload)

```bash
# terminal 1
cd backend
dotnet run

# terminal 2
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to `http://localhost:5052` (see `vite.config.ts`), so no CORS setup is needed here either.

### API endpoints

- `GET /api/userprofiles`
- `GET /api/userprofiles/{id}`
- `POST /api/userprofiles`
- `PUT /api/userprofiles/{id}`
- `DELETE /api/userprofiles/{id}`

