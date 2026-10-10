# Iali — MVP Slice (React + Node API)

Free two-way hiring platform for Nigeria. See PRD: `C:\Users\PC\Downloads\Iali_PRD.txt`.

## Prereqs
- Node.js 20 LTS (https://nodejs.org) — required. Run `node --version` to verify.
- No DB server needed locally (SQLite dev). Postgres via `DATABASE_URL` for staging/prod.

## Quick start
```powershell
cd C:\Users\PC\iali\backend
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev   # :4000
# new terminal
cd C:\Users\PC\iali\frontend
npm install
npm run dev   # :5173 -> proxies /api to :4000
```

Seed logins (after `npm run seed`):
- Admin: admin@iali.ng / Admin123!
- Recruiter (verified): tunde@techstartup.ng / Recruiter123!
- Candidate: adaeze@example.com / Candidate123!

## Structure
- `frontend/` Vite + React + Router, mobile-first CSS. `/api` proxied to backend.
- `backend/` Express + Prisma + JWT + mock CV parse + location rules (LOC-03/04/05).
- Stubs log to console when mail/SMS/AI keys absent — expected in this slice.
