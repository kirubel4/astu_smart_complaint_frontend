# ASTU Frontend (Next.js 14)

Production-ready frontend for the ASTU Smart Complaint & Issue Tracking System.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn-style UI components
- Zustand
- Axios
- React Hook Form + Zod
- Recharts
- React Hot Toast

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create local env:

```bash
cp .env.local.example .env.local
```

3. Start dev server:

```bash
npm run dev
```

4. Open:

- http://localhost:3000/login

## Environment

- `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000/api/v1`)

## Auth & Protection

- Login stores JWT in Zustand for client API interceptor.
- JWT is also written into secure `httpOnly` cookie via `/api/auth/session` route.
- Middleware enforces role-based access on `/student/*`, `/staff/*`, `/admin/*`, and `/notifications`.

## Modules

- Auth: `/login`, `/admin/create-user`, `/admin/users/create`
- Student: dashboard, complaints, create, detail, profile, chatbot
- Staff: dashboard, assigned complaints, complaint detail with status + remarks
- Admin: analytics dashboard, users, create user, complaints, categories CRUD
- Notifications: dropdown + polling + `/notifications` page

## Backend Routes Used

All API services target the required `/api/v1/*` routes:

- Auth, Categories, Complaints, Remarks, Student, Staff, Admin, Notifications, Chatbot

