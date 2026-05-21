<div align="center">

# Unity Consult

### PRD v7 full-stack consulting platform: public website, client portal, admin CRM, and NestJS API

[![CI](https://github.com/Rajeshponnapure/Aknexis_Unity_Consult/actions/workflows/ci.yml/badge.svg)](https://github.com/Rajeshponnapure/Aknexis_Unity_Consult/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-production--intent-0f766e)

Built from `Unity_Consult_Master_PRD_v7.pdf` as a production-intent web application for service sales, client delivery, CRM operations, payments, notifications, and post-purchase support.

</div>

---

## Table Of Contents

- [Overview](#overview)
- [What Is Included](#what-is-included)
- [Platform Map](#platform-map)
- [Tech Stack](#tech-stack)
- [Core Workflows](#core-workflows)
- [Services Covered](#services-covered)
- [Implemented Routes](#implemented-routes)
- [Backend Modules](#backend-modules)
- [Provider Integrations](#provider-integrations)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Verification Status](#verification-status)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [GitHub And Secret Safety](#github-and-secret-safety)

---

## Overview

Unity Consult is a complete digital consulting platform for managing the journey from visitor to lead, from booking to payment, and from project delivery to support.

The repository contains:

| Surface | Purpose | Status |
| --- | --- | --- |
| Public Website | Marketing, SEO, service education, portfolio, blog, careers, booking, contact | Implemented |
| Client Portal | Projects, documents, invoices, payments, messages, support, settings | Implemented |
| Admin CRM | Leads, orders, services, content, finance, team, tickets, audit, analytics | Implemented |
| Backend API | Auth, business data, workflows, payments, notifications, health, realtime | Implemented |
| Provider Wiring | MongoDB, Redis, Razorpay, Resend, Twilio, Socket.io | Code implemented; live keys pending |

> [!IMPORTANT]
> Real Razorpay, Resend, Twilio, and Redis behavior requires company-owned credentials. MongoDB Atlas is configured locally; the remaining provider keys are expected to be added by the team leader.

> [!NOTE]
> Staff users are intentionally routed to Admin CRM. PRD v7 describes Admin CRM as the operational command center for Unity Consult staff; it does not define a separate Staff Portal route.

---

## What Is Included

### Public Website

- Homepage with service positioning, trust signals, and conversion sections.
- Service catalog and service detail pages.
- `/plans` PRD-friendly pricing route plus `/pricing`.
- Local SEO pages at `/location/bangalore`, `/location/mumbai`, `/location/delhi-ncr`, and `/location/hyderabad`.
- Blog, portfolio, careers, about, contact, privacy policy, and terms pages.
- Booking wizard that creates backend lead, order, project, and draft invoice records.
- Contact form that creates backend leads.
- Sitemap and robots routes.
- Responsive navigation and mobile menu behavior.

### Client Portal

- Auth-protected portal shell.
- Dashboard analytics.
- Projects and project detail pages.
- Document upload/download hub.
- Invoices, finance, payment list, and payment detail routes.
- Messages.
- Support ticket creation.
- Account settings.
- Mobile-first tables rendered as labeled cards.
- Compact sticky mobile header and overlay navigation menu.

### Admin CRM

- Auth/RBAC-protected admin workspace.
- Dashboard metrics.
- Lead Kanban with desktop drag/drop and mobile `Move stage` fallback.
- Orders and order details.
- Service catalog management.
- CMS/content management.
- Finance/invoice view.
- Team management.
- Support/tickets.
- Audit trail for sensitive operational events.

---

## Platform Map

```mermaid
flowchart LR
  Visitor["Visitor"] --> Public["Public Website"]
  Public --> Booking["Booking Wizard"]
  Public --> Contact["Contact Lead Form"]
  Booking --> API["NestJS API /api/v1"]
  Contact --> API
  Client["Client User"] --> Portal["Client Portal"]
  Staff["Admin / Staff"] --> CRM["Admin CRM"]
  Portal --> API
  CRM --> API
  API --> Mongo["MongoDB Atlas"]
  API --> Razorpay["Razorpay"]
  API --> Resend["Resend Email"]
  API --> Twilio["Twilio WhatsApp"]
  API --> Redis["Redis"]
  API --> Realtime["Socket.io Events"]
```

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, React Query, Zustand |
| Backend | NestJS 11, Fastify, TypeScript |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT access tokens, HttpOnly refresh cookies, RBAC guards |
| Security | CSRF double-submit, CORS, Helmet, throttling |
| Payments | Razorpay order, verification, webhook, refund code paths |
| Email | Resend |
| WhatsApp | Twilio WhatsApp |
| Realtime | Socket.io, Redis-ready architecture |
| Testing | Jest, SuperTest, API smoke script |
| CI | GitHub Actions |

---

## Core Workflows

| Workflow | Implementation |
| --- | --- |
| Visitor submits contact form | Creates backend lead |
| Visitor completes booking | Creates lead, order, project, and invoice |
| Client logs in | Enters client portal |
| Staff/admin logs in | Enters Admin CRM |
| Admin manages leads | Kanban stage updates and detail view |
| Client uploads document | Stores document metadata and local file URL |
| Client opens ticket | Creates backend support ticket |
| Admin refunds payment | Payment/audit code path is implemented |
| Provider health check | Shows configured/missing provider state |

---

## Services Covered

| Service | Purpose |
| --- | --- |
| Web Development | Conversion websites, portals, dashboards, and business web platforms |
| CRM Development | Lead pipelines, dashboards, internal tools, and operational workflows |
| SEO Services | Local SEO, technical SEO, content structure, and reporting |
| Digital Marketing | Paid funnels, conversion strategy, and growth retainers |
| Legal Registration | Business registration and compliance-oriented service intake |
| Branding & Design | Identity systems, marketing assets, and brand direction |

---

## Implemented Routes

### Public

`/`, `/about`, `/services`, `/services/[slug]`, `/pricing`, `/plans`, `/portfolio`, `/portfolio/[slug]`, `/blog`, `/blog/[slug]`, `/book`, `/contact`, `/careers`, `/careers/[role]`, `/location/[city]`, `/privacy-policy`, `/terms-of-service`, `/sitemap.xml`, `/robots.txt`

### Auth

`/login`, `/register`, `/logout`, `/forgot-password`, `/reset-password`, `/verify-email`

### Client Portal

`/portal`, `/portal/projects`, `/portal/projects/[id]`, `/portal/documents`, `/portal/invoices`, `/portal/invoices/[id]`, `/portal/payments`, `/portal/payments/[id]`, `/portal/finance`, `/portal/finance/[id]`, `/portal/messages`, `/portal/settings`, `/portal/support`

### Admin CRM

`/admin`, `/admin/leads`, `/admin/leads/[id]`, `/admin/orders`, `/admin/orders/[id]`, `/admin/services`, `/admin/content`, `/admin/finance`, `/admin/team`, `/admin/support`, `/admin/tickets`, `/admin/audit`

---

## Backend Modules

| Domain | Module |
| --- | --- |
| Authentication | `auth` |
| Users and RBAC | `users` |
| Booking workflow | `bookings` |
| CRM pipeline | `leads` |
| Orders and delivery | `orders`, `projects` |
| Finance | `invoices`, `payments` |
| Client files | `documents` |
| Support | `tickets`, `messages` |
| Operations | `team`, `settings`, `content`, `services`, `audit` |
| Insights | `analytics`, lightweight `graphql` |
| Infrastructure | `database`, `redis`, `realtime`, `notifications`, `health` |

API base:

```text
http://127.0.0.1:4000/api/v1
```

Swagger, when enabled:

```text
http://127.0.0.1:4000/api/v1/docs
```

---

## Provider Integrations

| Provider | Purpose | Current Handoff State |
| --- | --- | --- |
| MongoDB Atlas | Main database | Configured locally |
| Redis / Upstash | Cache/pubsub readiness | Waiting for company key |
| Razorpay | Orders, verification, webhooks, refunds | Code ready; keys pending |
| Resend | Transactional email | Code ready; key/domain pending |
| Twilio WhatsApp | WhatsApp notifications | Code ready; credentials pending |
| Socket.io | Realtime admin updates | Implemented |

Missing provider keys are handled with clear setup errors. They are not silently ignored.

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Create local environment files

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

On macOS/Linux:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### 3. Add MongoDB Atlas URI

Open `backend/.env` and set:

```env
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/unity-consult
```

### 4. Seed demo data

```bash
npm run backend:seed
```

Demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@unityconsult.local` | `Unity@12345` |
| Staff | `staff@unityconsult.local` | `Unity@12345` |
| Client | `client@unityconsult.local` | `Unity@12345` |

### 5. Run locally

```bash
npm run dev
```

Open:

```text
Frontend: http://127.0.0.1:3000
Backend health: http://127.0.0.1:4000/api/v1/health
Provider health: http://127.0.0.1:4000/api/v1/health/providers
```

---

## Environment Variables

Backend keys live in `backend/.env`.

```env
NODE_ENV=development
PORT=4000
APP_ORIGIN=http://127.0.0.1:3000
API_PREFIX=api/v1
ENABLE_SWAGGER=true
SWAGGER_PATH=api/v1/docs
THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=120
MONGODB_URI=
REDIS_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
```

Frontend keys live in `frontend/.env`.

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:4000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://127.0.0.1:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

> [!CAUTION]
> Do not commit real `.env` files. Only `.env.example` files belong in GitHub.

---

## Verification Status

Final local verification completed on May 21, 2026.

| Check | Result |
| --- | --- |
| `npm run verify` | Passed |
| `npm run smoke:api` | Passed, 31 API checks |
| `npm run frontend:build` | Passed, 60 routes generated |
| Backend lint/typecheck/build/tests/e2e | Passed |
| Mobile responsive audit | Passed across 29 routes |
| Provider check | MongoDB configured; Redis/Razorpay/Resend/Twilio keys pending |

Run checks:

```bash
npm run verify
npm run smoke:api
npm run backend:providers
```

Smoke test coverage includes health, provider health, auth, users, leads, orders, projects, invoices, documents, tickets, messages, team, settings, analytics, content, audit, payments, GraphQL aggregate query, document upload, public lead creation, booking workflow, and Razorpay missing-key guard.

---

## Project Structure

```text
unity consult/
  backend/
    scripts/
    src/
      common/
      config/
      modules/
      main.ts
    test/
  frontend/
    src/
      app/
      components/
      lib/
  scripts/
    api-smoke.mjs
    dev.mjs
    start-production.mjs
  .github/workflows/
  README.md
  SETUP.md
  PLACEHOLDER_MAPPING.md
  requirements.txt
```

---

## Documentation

| File | Purpose |
| --- | --- |
| [`SETUP.md`](SETUP.md) | Detailed beginner-friendly setup and deployment guide |
| [`PLACEHOLDER_MAPPING.md`](PLACEHOLDER_MAPPING.md) | Every placeholder/company value to replace before production |
| [`requirements.txt`](requirements.txt) | Handoff checklist for software, accounts, keys, and commands |
| [`PRD_IMPLEMENTATION_CHECKLIST.md`](PRD_IMPLEMENTATION_CHECKLIST.md) | PRD alignment note |

---

## GitHub And Secret Safety

The repository is configured to ignore:

- `.env` files
- `node_modules`
- build output
- upload folders
- logs
- local browser/Codex state
- generated PRD extraction scratch files
- temporary caches

Before every push:

```bash
git status
npm run verify
```

If a real secret ever appears in Git, rotate the secret immediately.

---

## Production Handoff Notes

Before live launch, the company/team leader should:

- Add real provider keys.
- Configure production domains.
- Set production CORS origin.
- Configure Razorpay webhook URL.
- Verify Resend sender domain.
- Configure Twilio WhatsApp sender.
- Replace demo content, service pricing, testimonials, case studies, careers, and company identity values.
- Delete or isolate seed data.
- Run live payment, email, WhatsApp, and realtime QA.

---

<div align="center">

Built as a PRD-aligned Unity Consult implementation for private team handoff.

</div>
