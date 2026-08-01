# Adobe Creative Academy — Platform (`app/`)

Implementation phase (ADR-010). Next.js 15 + TypeScript + Tailwind 3 + PostgreSQL (`pg`), Arabic-first RTL.

## Run

```bash
cd app
npm install
npm run seed      # builds local DB from docs/03 blueprint + content/ tree
npm run dev       # http://localhost:3000
```

## Demo accounts (local)

| Role | Email | Password |
|------|-------|----------|
| student | `student@academy.ar` | `student123` |
| admin | `admin@academy.ar` | `admin123` |

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Home / continue learning |
| `/catalog` | Stage catalog |
| `/catalog/[stageId]` | Stage detail (modules + lessons) |
| `/learn/[lessonId]` | Lesson player (renders `content/` Markdown) |
| `/login` `/register` `/profile` | Auth + progress |
| `/api/auth/*`, `/api/progress` | BFF routes |

## Batches (DOC-09 priorities; see PROJECT_STATE §8)

- B-01 ✅ structure, RTL UI, navigation, DB + seed, catalog, lesson player (this commit)
- B-02 auth (register/login/profile/sessions) — included
- B-03 lesson player + progress — included
- B-04 quiz system — next
- B-05 projects & certificates — next
- B-06 admin dashboard — next
- B-07 database consolidation — next

## Notes

- DB is derived data (regenerate with `npm run seed`); `content/` remains the SSOT.
- Set `DATABASE_URL` and run `npm run migrate` before `npm run seed`.
