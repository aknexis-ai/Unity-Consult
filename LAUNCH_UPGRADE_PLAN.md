# Unity Consult Launch Upgrade Plan

This plan converts the team lead review into a practical implementation roadmap. The current project is functionally strong, but the review correctly identifies that launch quality needs stronger visuals, richer content/data contracts, production storage, expanded RBAC, and more premium UX.

## 1. Executive Summary

Current state:

- Public site, portal, admin CRM, backend API, auth, workflows, payments wiring, notifications wiring, documents, analytics, and docs are implemented.
- The application passes build, lint, tests, API smoke checks, and mobile audits.
- The main gap is launch polish: visual storytelling, premium brand system, real media/content, richer service/pricing/booking experiences, production-grade document storage, and more granular admin permissions.

Upgrade goal:

- Turn the app from a working PRD implementation into a polished, premium, production-ready consultancy platform.
- Preserve current working backend/frontend behavior while upgrading design, content contracts, data models, and operational depth.

## 2. Implementation Phases

## Phase 1: Premium Design System Foundation

Goal: Create a stricter visual system before redesigning pages.

Tasks:

- Define design tokens for spacing, radii, shadows, gradients, surfaces, typography scale, icon sizing, and motion timings.
- Create reusable visual primitives:
  - `VisualHero`
  - `MediaPanel`
  - `ProofStrip`
  - `SectionReveal`
  - `StatCounter`
  - `FeatureRail`
  - `CaseStudyCard`
  - `PremiumEmptyState`
  - `SkeletonPanel`
  - `DashboardChartCard`
- Add consistent category icon mapping for services, workflows, dashboard modules, and support states.
- Add motion rules:
  - page entrance
  - section reveal
  - staggered card grids
  - animated counters
  - marquee trust strip
  - dashboard card entrance
  - loading skeleton shimmer

Files likely affected:

- `frontend/src/app/globals.css`
- `frontend/src/components/*`
- new `frontend/src/components/visual/*`
- new `frontend/src/lib/visuals.ts`

Acceptance criteria:

- Pages no longer rely only on generic card grids.
- Motion is visible but not noisy.
- Mobile layout remains no-horizontal-scroll.
- Existing frontend build remains clean.

## Phase 2: Public Homepage Premium Redesign

Goal: Replace the text-first homepage with a visual-first premium landing system.

Tasks:

- Redesign hero with layered UI mockups, abstract brand visuals, service proof, and stronger CTA hierarchy.
- Add visual sections:
  - service command center preview
  - booking-to-delivery workflow visual
  - case-study/results strip
  - trust badge marquee
  - industry/service proof blocks
  - premium final CTA
- Add image/media placeholders through a structured media registry so real company assets can be swapped later.
- Replace generic implementation copy with stronger commercial copy.

Files likely affected:

- `frontend/src/app/page.tsx`
- `frontend/src/lib/mock-data.ts`
- `frontend/src/lib/company.ts`
- `frontend/src/components/*`
- `frontend/public/*` if assets are added

Acceptance criteria:

- Homepage feels like a premium consultancy landing page.
- It includes visual storytelling, not only text/cards.
- It uses `next/image` or structured visual components.
- CTA flow to `/book`, `/services`, and `/contact` is clear.

## Phase 3: Real Media And Asset System

Goal: Add production-ready image support everywhere PRD expects visuals.

Tasks:

- Add media registry for:
  - hero art
  - service illustrations
  - UI mockups
  - case-study images
  - blog covers
  - portfolio screenshots
  - team/office imagery
  - trust badges
- Use `next/image` across public pages.
- Add image alt text and dimensions.
- Add fallback SVG/gradient visuals for assets not yet provided by company.

Files likely affected:

- `frontend/public/images/*`
- `frontend/src/lib/media.ts`
- public pages in `frontend/src/app/*`

Dependencies:

- Real company assets from team, or temporary high-quality branded placeholders.

Acceptance criteria:

- Core pages use image/media components.
- Assets are replaceable from one registry.
- No layout shift or mobile overflow.

## Phase 4: Rich Service Detail Pages

Goal: Make every service page unique and commercially complete.

Frontend tasks:

- Add service-specific layouts with:
  - hero visual
  - pricing tiers
  - deliverables
  - add-ons
  - FAQ
  - process timeline
  - proof/case study block
  - conversion CTA
  - related services

Backend tasks:

- Expand service catalog schema:
  - `pricingTiers`
  - `addons`
  - `deliverables`
  - `faqs`
  - `intakeSchema`
  - `media`
  - `seo`
  - `caseStudyRefs`
- Update seed data.
- Update admin service editor.
- Update API types.

Files likely affected:

- `backend/src/modules/services/*`
- `backend/scripts/seed.ts`
- `frontend/src/app/services/[slug]/page.tsx`
- `frontend/src/app/admin/services/page.tsx`
- `frontend/src/lib/api/types.ts`

Acceptance criteria:

- Each service page is visually and structurally distinct.
- Service data comes from richer backend/static contracts.
- Admin can manage more than basic title/price.

## Phase 5: Pricing Page Upgrade

Goal: Convert pricing from a simple list into a full comparison page.

Tasks:

- Add plan cards with:
  - Starter/Growth/Scale or service-specific tiers
  - highlighted popular plan
  - add-ons
  - discount callouts
  - payment options
  - trust badges
  - FAQ
  - comparison table
- Add toggle for monthly/project/advance payment where applicable.
- Link pricing selections into booking flow.

Files likely affected:

- `frontend/src/app/pricing/page.tsx`
- `frontend/src/app/plans/page.tsx`
- `frontend/src/components/booking-wizard.tsx`
- service data model

Acceptance criteria:

- Pricing page reads as a premium buying page.
- Users can understand plan differences quickly.
- Booking flow can receive selected plan/payment mode.

## Phase 6: Booking Wizard Premium Onboarding

Goal: Make booking feel like a polished onboarding flow, not a plain form.

Tasks:

- Add visual service cards with icons/images.
- Add stronger stepper with progress state.
- Add payment mode selection:
  - full payment
  - advance payment
  - milestone billing
  - recurring/retainer
- Add live summary side panel.
- Add polished review screen.
- Add stronger success/pending-payment handoff screen.
- Validate service-specific intake fields.

Backend tasks:

- Expand booking DTO and workflow:
  - inquiry
  - quote
  - booking
  - advance payment
  - pending payment
  - in progress
  - review
  - revision
  - completed
  - cancelled
  - archived
- Add payment mode fields to order/invoice/payment records.

Files likely affected:

- `frontend/src/components/booking-wizard.tsx`
- `backend/src/modules/bookings/*`
- `backend/src/modules/orders/*`
- `backend/src/modules/invoices/*`
- `backend/src/modules/payments/*`

Acceptance criteria:

- Booking looks premium.
- Booking creates richer state data.
- Payment model is explicit.

## Phase 7: Contact Page Upgrade

Goal: Make contact a polished support and lead-conversion page.

Tasks:

- Add direct WhatsApp CTA.
- Add call CTA.
- Add map-first office/contact section.
- Add response SLA proof.
- Add support route/context selector.
- Replace reCAPTCHA placeholder with real configured integration or clear disabled state.
- Fix contact lead payload so message is not stored in budget.

Backend tasks:

- Split lead fields:
  - `message`
  - `budgetRange`
  - `inquiryType`
  - `source`
  - `serviceInterest`

Files likely affected:

- `frontend/src/app/contact/page.tsx`
- `backend/src/modules/leads/*`
- `backend/src/modules/bookings/*`
- API types

Acceptance criteria:

- Contact page feels like a real support/sales surface.
- Lead data is semantically correct.

## Phase 8: Portal And Admin Dashboard Upgrade

Goal: Make dashboards feel like enterprise operations software.

Frontend tasks:

- Add chart cards and mini visualizations.
- Add activity streams.
- Add workflow/status cards.
- Add project aging view.
- Add ticket SLA cards.
- Add revenue/payment status modules.
- Add richer empty/loading/error states.

Backend tasks:

- Add analytics endpoints:
  - service-wise revenue
  - lead source performance
  - project aging
  - ticket SLA summaries
  - payment state summary
  - report export
- Add CSV/JSON export endpoints.

Files likely affected:

- `frontend/src/app/admin/page.tsx`
- `frontend/src/app/portal/page.tsx`
- `backend/src/modules/analytics/*`
- new export endpoints/services

Acceptance criteria:

- Admin dashboard has real operational hierarchy.
- Portal dashboard feels useful for clients.
- Analytics are not just simple counts.

## Phase 9: Blog, Portfolio, Careers Editorial Upgrade

Goal: Make public content sections feel production/editorial instead of demo-driven.

Tasks:

- Add editorial layouts with images and filtering.
- Add portfolio case-study structure:
  - problem
  - process
  - solution
  - results
  - screenshots
  - metrics
- Add blog cover images, categories, author info, reading time, related posts.
- Add careers department filters and richer application CTA.

Backend tasks:

- Expand content data contracts:
  - blog rich blocks
  - portfolio case-study fields
  - testimonials
  - local SEO content
  - CMS section blocks

Files likely affected:

- `frontend/src/app/blog/*`
- `frontend/src/app/portfolio/*`
- `frontend/src/app/careers/*`
- `backend/src/modules/content/*`

Acceptance criteria:

- Content pages look editorial and credible.
- Data contracts support real content, not generic CRUD only.

## Phase 10: Expanded RBAC

Goal: Replace coarse roles with function-based permissions.

Current roles:

- admin
- staff
- client

Target roles/permissions:

- Super Admin
- Finance
- Support
- SEO
- Design
- Content
- HR
- CRM/Operations
- Client

Tasks:

- Add role/permission schema.
- Add permission guard or extend role guard.
- Add route/module permission map.
- Add admin UI awareness for restricted modules.
- Update seed users and docs.

Files likely affected:

- `backend/src/modules/users/*`
- `backend/src/modules/auth/*`
- `backend/src/modules/team/*`
- frontend auth gate and nav filtering

Acceptance criteria:

- Admin modules can be controlled by function.
- Staff users see only allowed areas.
- Existing admin/client behavior remains stable.

## Phase 11: Cloud Document Storage

Goal: Replace local disk document storage with production cloud storage.

Target:

- S3-compatible object storage.
- Presigned upload URLs.
- Presigned download URLs.
- Metadata stored in MongoDB.

Tasks:

- Add storage provider abstraction.
- Add S3 config:
  - bucket
  - region
  - access key
  - secret key
  - endpoint for S3-compatible providers
- Add presigned upload endpoint.
- Add presigned download endpoint.
- Validate file size/type.
- Detect duplicate documents if required.
- Keep local storage only as optional development fallback.

Files likely affected:

- `backend/src/modules/documents/*`
- `backend/src/config/app.config.ts`
- `frontend/src/app/portal/documents/page.tsx`
- `.env.example`
- setup docs

Acceptance criteria:

- No production dependency on local filesystem uploads.
- Uploads are direct-to-cloud or presigned.
- Metadata remains in MongoDB.

## Phase 12: Production Content Removal And CMS Alignment

Goal: Stop relying on static mock data for launch-critical surfaces.

Tasks:

- Move homepage sections, testimonials, portfolio, blog, careers, and local SEO content into structured CMS/data endpoints where practical.
- Keep static fallback only for build safety.
- Add admin editing where needed.
- Mark all remaining placeholders clearly in `PLACEHOLDER_MAPPING.md`.

Acceptance criteria:

- Launch pages can be updated without code changes where practical.
- Mock/demo content is either removed or clearly isolated.

## 3. Priority Order

Recommended execution order:

1. Design system foundation.
2. Homepage premium redesign.
3. Media registry and visual assets.
4. Service detail + service catalog schema upgrade.
5. Pricing page upgrade.
6. Booking wizard + payment-mode upgrade.
7. Contact page and lead model cleanup.
8. Dashboard analytics upgrade.
9. Blog/portfolio/careers editorial upgrade.
10. Expanded RBAC.
11. S3/presigned document storage.
12. CMS/content migration and mock-data removal.

## 4. External Inputs Needed

From company/team lead:

- Final logo.
- Brand colors if different from current direction.
- Service pricing and package details.
- Real portfolio/case-study screenshots.
- Team/office photos.
- Testimonials and client logos.
- Razorpay keys.
- Resend verified domain and key.
- Twilio WhatsApp credentials.
- Redis/Upstash URL.
- S3-compatible storage credentials.
- Final role/permission matrix.
- Production domains.
- Decision on admin VPN/2FA enforcement.

## 5. Verification Plan

After each phase:

```bash
npm run frontend:lint
npm run frontend:build
```

After backend changes:

```bash
npm run backend:lint
npm run backend:typecheck
npm run backend:build
npm run backend:test
npm run backend:test:e2e
```

Full final gate:

```bash
npm run verify
npm run smoke:api
npm run backend:providers
```

Manual QA:

- Desktop public routes.
- Mobile public routes.
- Client portal.
- Admin CRM.
- Booking workflow.
- Contact workflow.
- Document upload/download.
- Payment mode flow.
- Role-restricted admin access.

## 6. Implementation Notes

- Do not break the current passing baseline.
- Introduce backend schema changes with backward-compatible defaults where possible.
- Avoid committing real media licenses unless company owns them.
- Keep real `.env` files ignored.
- For visual assets, prefer a replaceable media registry so placeholders can be swapped with final company assets quickly.
- For S3, implement provider abstraction so local development can still run without cloud credentials if needed.
