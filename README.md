# Unity Consult

Production-intent implementation of the Unity Consult PRD v7 platform.

Unity Consult is a full-stack digital consulting platform for selling, delivering, tracking, and supporting business services from one web application. The project includes the public marketing website, booking engine, authenticated client portal, internal admin CRM, MongoDB-backed NestJS API, provider integrations, verification scripts, and documentation needed for team-leader handoff.

The implementation follows `Unity_Consult_Master_PRD_v7.pdf`. Real provider keys are intentionally not committed. MongoDB Atlas is required for real data; Razorpay, Resend, Twilio, and Redis are wired and ready to activate once the company provides credentials.

## Project Scope

The platform covers three main product surfaces:

- Public website: lead generation, service education, SEO pages, case-study style content, careers, contact, booking, policies, sitemap, and robots.
- Client portal: authenticated workspace for clients to track projects, documents, invoices, payments, messages, support, and account settings.
- Admin CRM: internal Unity Consult operations center for staff/admin users to manage leads, orders, services, content, finance, team, support, tickets, analytics, and audit history.

Staff users are routed to Admin CRM by design. The PRD describes Admin CRM as the operational command center for Unity Consult staff; there is no separate Staff Portal route in PRD v7.

## Services Covered

The service catalog implements the six PRD service families:

- Web Development: conversion websites, portals, dashboards, and business web platforms.
- CRM Development: lead pipelines, operations dashboards, internal tooling, and automated workflows.
- SEO Services: local SEO, technical SEO, keyword strategy, content structure, and reporting.
- Digital Marketing: paid campaigns, funnel setup, conversion strategy, and growth retainers.
- Legal Registration: business registration and compliance-oriented service intake.
- Branding & Design: identity, brand systems, marketing assets, and design direction.

Services appear in the public website, booking flow, backend service catalog, seed data, and admin service management module.

## Implemented Frontend

Public routes include:

- `/`
- `/about`
- `/services`
- `/services/[slug]`
- `/pricing`
- `/plans`
- `/portfolio`
- `/portfolio/[slug]`
- `/blog`
- `/blog/[slug]`
- `/book`
- `/contact`
- `/careers`
- `/careers/[role]`
- `/location/[city]`
- `/privacy-policy`
- `/terms-of-service`
- `/sitemap.xml`
- `/robots.txt`

Client portal routes include:

- `/portal`
- `/portal/projects`
- `/portal/projects/[id]`
- `/portal/documents`
- `/portal/invoices`
- `/portal/invoices/[id]`
- `/portal/payments`
- `/portal/payments/[id]`
- `/portal/finance`
- `/portal/finance/[id]`
- `/portal/messages`
- `/portal/settings`
- `/portal/support`

Admin CRM routes include:

- `/admin`
- `/admin/leads`
- `/admin/leads/[id]`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/services`
- `/admin/content`
- `/admin/finance`
- `/admin/team`
- `/admin/support`
- `/admin/tickets`
- `/admin/audit`

Auth routes include:

- `/login`
- `/register`
- `/logout`
- `/forgot-password`
- `/reset-password`
- `/verify-email`

The production frontend build currently generates 60 routes.

## Implemented Backend

The backend is a NestJS/Fastify API under `/api/v1/*`.

Implemented modules:

- Auth
- Users
- Bookings
- Leads
- Orders
- Projects
- Invoices
- Payments
- Documents
- Tickets
- Messages
- Team
- Settings
- Content
- Services
- Analytics
- Health
- Redis
- Realtime
- Notifications
- Audit
- Lightweight GraphQL aggregate endpoint

Core backend capabilities:

- MongoDB Atlas with Mongoose schemas.
- JWT access token authentication.
- HttpOnly refresh-cookie flow.
- Role-based access control for `admin`, `staff`, and `client`.
- CSRF double-submit protection for unsafe browser requests.
- CORS controlled by `APP_ORIGIN`.
- Helmet security headers.
- Rate limiting through Nest Throttler.
- Swagger UI when `ENABLE_SWAGGER=true`.
- Provider health checks.
- Demo seed script.
- API smoke test script.

## Provider Integrations

The codebase is wired for:

- MongoDB Atlas: database and Mongoose persistence.
- Redis: production cache/pubsub readiness.
- Razorpay: order creation, payment verification, webhook signature verification, payment failure handling, and refunds.
- Resend: transactional email sending.
- Twilio WhatsApp: WhatsApp notifications.
- Socket.io: realtime admin events for lead/order/ticket/payment changes.

Without real provider keys, external actions return clear setup errors instead of silently failing. This is expected until the team leader adds production credentials.

## Important Environment Keys

Backend:

- `MONGODB_URI`
- `REDIS_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`

Frontend:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SOCKET_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`

Real `.env` files are ignored by Git. Only `.env.example` templates should be committed.

## Quick Start

Install dependencies:

```bash
npm install
```

Copy environment templates:

```bash
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Add a real MongoDB Atlas URI to `backend/.env`, then seed demo data:

```bash
npm run backend:seed
```

Run frontend and backend together:

```bash
npm run dev
```

Open:

- Frontend: `http://127.0.0.1:3000`
- Backend health: `http://127.0.0.1:4000/api/v1/health`
- Provider health: `http://127.0.0.1:4000/api/v1/health/providers`
- Swagger: `http://127.0.0.1:4000/api/v1/docs`

Demo users after seeding:

- Admin: `admin@unityconsult.local`
- Staff: `staff@unityconsult.local`
- Client: `client@unityconsult.local`
- Password: `Unity@12345`

## Verification

Run the complete verification gate:

```bash
npm run verify
```

Run API smoke checks after the backend is running:

```bash
npm run smoke:api
```

Check provider configuration:

```bash
npm run backend:providers
```

Latest final verification completed on May 21, 2026:

- `npm run verify` passed.
- `npm run smoke:api` passed 31 checks.
- `npm run frontend:build` generated 60 routes.
- Mobile audits passed for portal/admin responsive behavior.
- Mobile dashboard header is compact and sticky.
- Mobile menu opens as an overlay popover and closes after selecting a route.
- Tables render as labeled vertical cards on mobile.
- Lead Kanban uses desktop drag/drop and mobile stage dropdown.

## PRD Coverage Summary

Implemented:

- Public marketing website and navigation.
- Local SEO pages at `/location/bangalore`, `/location/mumbai`, `/location/delhi-ncr`, and `/location/hyderabad`.
- `/plans` route in addition to `/pricing`.
- Booking flow that creates lead, order, project, and invoice records.
- Contact form lead capture.
- Client portal dashboard, projects, documents, invoices, payments, finance, messages, support, and settings.
- Admin CRM dashboard, lead Kanban, orders, service catalog management, content management, finance, team, support, tickets, and audit.
- REST API under `/api/v1/*`.
- JWT, refresh cookies, RBAC, CSRF, CORS, Helmet, and throttling.
- MongoDB/Mongoose domain schemas.
- Razorpay/Resend/Twilio/Redis integration code paths.
- Socket.io realtime gateway.
- Provider health checks.
- Lightweight GraphQL aggregate endpoint.
- CI workflow.
- Setup, requirements, and placeholder handoff documentation.

Provider-backed features requiring company credentials before live validation:

- Real Razorpay checkout and production webhooks.
- Real Resend email delivery from verified domain.
- Real Twilio WhatsApp sending.
- Real Redis production connection.

Production/security items that require company infrastructure decisions:

- Final deployed domains.
- Secret manager or deployment environment variables.
- Production CORS origin.
- Razorpay dashboard webhook URL.
- VPN/2FA enforcement around the admin domain if required by company policy.
- Final live payment/email/WhatsApp QA with real keys.

## Documentation

- `SETUP.md`: detailed setup guide written step by step for a fresh laptop.
- `PLACEHOLDER_MAPPING.md`: every placeholder/company value that must be replaced before launch.
- `requirements.txt`: handoff checklist of software, accounts, keys, and commands.
- `PRD_IMPLEMENTATION_CHECKLIST.md`: PRD alignment status note.

## GitHub Safety

The root `.gitignore` excludes:

- `node_modules`
- build outputs
- backend uploads
- logs
- local Codex/browser state
- all real `.env` files
- editor/OS files

Before pushing, run:

```bash
npm run verify
npm run smoke:api
git status
```

Do not commit `backend/.env`, `frontend/.env`, real API keys, uploaded documents, or local logs.
