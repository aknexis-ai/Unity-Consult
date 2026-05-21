# Placeholder And Company Data Mapping

This file tells the team leader exactly what must be replaced before production launch. These are not missing code features. They are demo values, secrets, provider credentials, brand copy, or production decisions.

Last updated: May 21, 2026.

## 1. Secret Files

These files must exist locally or in the deployment platform, but must not be pushed to GitHub:

- `backend/.env`
- `frontend/.env`
- root `.env` if ever created

Safe template files that can be pushed:

- `backend/.env.example`
- `frontend/.env.example`

The `.gitignore` already blocks real `.env` files.

## 2. Backend Provider Placeholders

Location: `backend/.env`

| Key | Current Expected State | Production Replacement |
| --- | --- | --- |
| `MONGODB_URI` | Real local Atlas URI if developer has access | Company MongoDB Atlas production URI |
| `REDIS_URL` | Missing until company provides it | Redis/Upstash production URL |
| `JWT_ACCESS_SECRET` | Local random string | Long secret from production secret manager |
| `JWT_REFRESH_SECRET` | Local random string | Long secret from production secret manager |
| `RAZORPAY_KEY_ID` | Missing until company provides it | Razorpay test/live key ID |
| `RAZORPAY_KEY_SECRET` | Missing until company provides it | Razorpay test/live key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Missing until company provides it | Razorpay webhook signing secret |
| `RESEND_API_KEY` | Missing until company provides it | Resend API key |
| `TWILIO_ACCOUNT_SID` | Missing until company provides it | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Missing until company provides it | Twilio Auth Token |
| `TWILIO_WHATSAPP_FROM` | Missing until company provides it | Approved `whatsapp:+...` sender |

## 3. Frontend Provider Placeholders

Location: `frontend/.env`

| Key | Current Expected State | Production Replacement |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:4000/api/v1` | Deployed backend API URL ending in `/api/v1` |
| `NEXT_PUBLIC_SOCKET_URL` | `http://127.0.0.1:4000` | Deployed backend/socket origin |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Missing until company provides it | Razorpay public key ID |

## 4. Company Identity Placeholders

Location: `frontend/src/lib/company.ts`

Replace or confirm:

- Company display name.
- Legal company name.
- Tagline.
- Marketing description.
- Sales email.
- Support email.
- Phone number.
- WhatsApp number.
- Office address.
- Support hours.
- Public website domain.
- Client portal domain.
- Admin CRM domain.
- Social proof rating.
- Project count.
- Client count.
- Countries/markets served.

Current demo-style examples include:

- `Unity Consult`
- `hello@unityconsult.com`
- `+91 98765 43210`
- `Bangalore Tech Park, 5th Floor, Bangalore, India`
- `www.unityconsult.com`
- `app.unityconsult.com`
- `admin.unityconsult.com`

## 5. Logo And Brand Replacement

Places to check:

- `frontend/src/lib/company.ts`
- `frontend/src/components/site-shell.tsx`
- `frontend/src/components/mobile-nav.tsx`
- `frontend/src/app/layout.tsx`
- `frontend/public` if image/logo assets are added later

To change the name:

1. Update `frontend/src/lib/company.ts`.
2. Search for hardcoded `Unity Consult`.
3. Replace only where the company wants the new name.
4. Run `npm run frontend:build`.

To change logo:

1. Add logo file to `frontend/public`.
2. Update header/site shell components to use the logo image.
3. Update favicon/open graph metadata if needed.
4. Run `npm run frontend:build`.

## 6. Service Catalog Placeholders

Locations:

- `frontend/src/lib/services.ts`
- `backend/scripts/seed.ts`
- Admin UI: `/admin/services`
- API: `/api/v1/services`

Current PRD service families:

- Web Development
- CRM Development
- SEO Services
- Digital Marketing
- Legal Registration
- Branding & Design

Replace or confirm for each service:

- service name
- slug
- short description
- long description
- pricing
- delivery timeline
- features
- outcomes
- booking fields
- add-ons
- plan tiers

The admin service editor can update live database service records after login.

## 7. Public Content Placeholders

Locations:

- `frontend/src/lib/mock-data.ts`
- `frontend/src/lib/locations.ts`
- `/admin/content`
- public route files under `frontend/src/app`

Replace or confirm:

- portfolio projects
- case studies
- testimonials
- review metrics
- blog posts
- local SEO city copy
- careers/open roles
- team names and bios
- homepage statistics
- pricing copy
- legal policy text
- contact page office/map details

## 8. Local SEO Placeholders

Location: `frontend/src/lib/locations.ts`

Implemented city pages:

- `/location/bangalore`
- `/location/mumbai`
- `/location/delhi-ncr`
- `/location/hyderabad`

Replace or confirm:

- city-specific headlines
- local service keywords
- local testimonials
- local business details
- Google Business/map embed
- SEO metadata

## 9. Demo Seed Data

Location: `backend/scripts/seed.ts`

Seed data exists for demo and QA. Remove or replace before production.

Demo users:

| Role | Email | Notes |
| --- | --- | --- |
| Admin | `admin@unityconsult.local` | Demo admin |
| Staff | `staff@unityconsult.local` | Demo staff; routes to Admin CRM |
| Client | `client@unityconsult.local` | Demo client |

Demo password:

```text
Unity@12345
```

Seeded demo data includes:

- leads
- orders
- projects
- invoices
- documents
- tickets
- messages
- team members
- content records
- service catalog
- settings/audit-related records

## 10. How To Delete Seed Data

Safest option:

1. Create a new production MongoDB database.
2. Point production `MONGODB_URI` to the new database.
3. Do not run `npm run backend:seed` in production.

Atlas UI option:

1. Open MongoDB Atlas.
2. Open the cluster.
3. Click `Browse Collections`.
4. Choose the development database.
5. Delete demo documents or collections.

Mongo shell option:

```javascript
db.users.deleteMany({ email: /@unityconsult\.local$/ })
db.leads.deleteMany({})
db.orders.deleteMany({})
db.projects.deleteMany({})
db.invoices.deleteMany({})
db.payments.deleteMany({})
db.documents.deleteMany({})
db.tickets.deleteMany({})
db.messages.deleteMany({})
db.teammembers.deleteMany({})
db.contentitems.deleteMany({})
db.servicecatalogs.deleteMany({})
db.auditlogs.deleteMany({})
db.settings.deleteMany({})
```

Before deleting anything, confirm the database name. Do not run deletion commands against production data unless the team leader approves.

## 11. Notification Sender Placeholder

Location: `backend/src/modules/notifications/notifications.service.ts`

Current sender placeholder:

```text
Unity Consult <onboarding@resend.dev>
```

Replace with verified sender:

```text
Unity Consult <support@company-domain.com>
```

Resend requires the sender domain to be verified.

## 12. Contact And Form Placeholder Text

These are field examples, not unfinished features.

Examples:

- `you@company.com`
- `+91 98765 43210`
- `Acme Technologies Pvt Ltd`
- `admin@unityconsult.local`
- `Unity@12345`
- `Describe your goals, scope, and current bottlenecks`

Common locations:

- `frontend/src/app/login/page.tsx`
- `frontend/src/app/register/page.tsx`
- `frontend/src/app/contact/page.tsx`
- `frontend/src/components/booking-wizard.tsx`
- `frontend/src/app/forgot-password/page.tsx`
- `frontend/src/app/reset-password/page.tsx`
- `frontend/src/app/verify-email/page.tsx`
- `frontend/src/app/admin/services/page.tsx`
- `frontend/src/app/admin/content/page.tsx`
- `frontend/src/app/portal/messages/page.tsx`

## 13. API And Deployment Placeholders

Replace before production:

- production frontend domain
- production backend/API domain
- production socket URL
- production CORS origin
- deployment secret variables
- Razorpay webhook URL
- production database URI
- production Redis URL

Recommended deployed URL shape:

```text
Frontend: https://www.company-domain.com
Client portal: https://app.company-domain.com
Admin CRM: https://admin.company-domain.com
Backend: https://api.company-domain.com
API prefix: https://api.company-domain.com/api/v1
Razorpay webhook: https://api.company-domain.com/api/v1/payments/webhook
```

## 14. Implemented PRD Items That Are Not Placeholders

Do not treat these as missing:

- public website
- service catalog
- service detail pages
- `/plans`
- `/location/[city]`
- portfolio
- blog
- careers
- contact
- legal pages
- sitemap
- robots
- booking workflow
- contact lead creation
- client portal dashboard
- client projects
- client documents
- client invoices
- client payments
- client finance
- client messages
- client support
- client settings
- admin dashboard
- admin leads Kanban
- admin orders
- admin service management
- admin content management
- admin finance
- admin team
- admin support
- admin tickets
- admin audit
- mobile compact sticky header
- mobile overlay menu
- mobile vertical table cards
- mobile Kanban stage dropdown
- REST API under `/api/v1/*`
- JWT auth
- refresh cookies
- RBAC
- CSRF
- CORS
- Helmet
- throttling
- MongoDB/Mongoose schemas
- provider health checks
- Razorpay integration code
- Resend integration code
- Twilio integration code
- Redis module
- Socket.io realtime gateway
- lightweight GraphQL aggregate endpoint
- CI workflow

## 15. Known Production Decisions

These are company decisions, not code gaps:

- Whether Swagger should be enabled in production.
- Whether admin CRM must be restricted by VPN.
- Which 2FA provider should enforce admin login.
- Which deployment platform will host frontend/backend.
- Which object storage should replace or extend local document storage for production.
- Whether a native mobile app/APK is required. This repo is a web app; an APK would require a wrapper such as Capacitor or a separate mobile project.

## 16. Final Verification Snapshot

Final local verification completed on May 21, 2026:

- `npm run verify`: passed.
- `npm run smoke:api`: passed 31 checks.
- `npm run frontend:build`: passed and generated 60 routes.
- API smoke covered auth, health, provider health, services, users, leads, orders, projects, invoices, documents, tickets, messages, team, settings, analytics, content, audit, payments, GraphQL aggregate query, document upload, public lead creation, booking workflow, and Razorpay missing-key guard.
- Mobile audits passed after the compact sticky header and overlay menu changes.

Expected provider status before company keys:

- MongoDB Atlas: configured if `MONGODB_URI` is present.
- Redis: missing until company key is provided.
- Razorpay: missing until company keys are provided.
- Resend: missing until company key is provided.
- Twilio WhatsApp: missing until company keys are provided.

## 17. Final Replacement Checklist

Before production:

- Add real backend provider keys.
- Add real frontend public keys/URLs.
- Replace company identity values.
- Replace logo if final logo is available.
- Replace demo service pricing/scope if needed.
- Replace demo content, blogs, portfolio, testimonials, careers, and team details.
- Delete or isolate seed data.
- Create real admin/staff/client accounts.
- Configure Razorpay webhook.
- Verify Resend sender domain.
- Verify Twilio WhatsApp sender.
- Configure production domains and CORS.
- Run `npm run verify`.
- Run `npm run smoke:api`.
- Run `npm run backend:providers`.
- Perform live payment/email/WhatsApp QA with real keys.
