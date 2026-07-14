# MamaConnect

**CareCode Hackathon by HelpMum — 2026**

A human-centered, AI-assisted maternal health platform connecting pregnant and postpartum women with Community Health Extension Workers (CHEWs) and healthcare facilities for timely maternal care.

> Deployed: [mama-connect-demo.vercel.app](https://mama-connect-demo.vercel.app)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State/Data:** React Query (TanStack Query v5)
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **Animations:** Framer Motion
- **UI Components:** Lucide React, Radix UI, Sonner

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Webpack) |
| `npm run dev:turbo` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment

Copy `.env.example` to `.env.local` and set:

```
NEXT_PUBLIC_API_URL=https://mamaconnect.onrender.com/v1
```

## Project Structure

```
app/
├── (auth)/          # Auth layout (centered card)
├── admin/           # Admin portal (CHEW mgmt, patient mgmt, documents)
├── components/      # Shared UI components
├── dashboard/       # CHEW dashboard (mothers, referrals, profile, settings)
├── login/           # Unified login
├── register/        # CHEW registration
├── pending-approval/# Post-registration pending screen
├── about/           # About page
├── faq/             # FAQ page
├── mothers/         # Mothers landing page
├── chew/            # CHEW landing page
├── partners/        # Partners page
└── layout.tsx       # Root layout
```
