# Unity Consult — Production-Readiness Verification Report

**Date:** 2026-06-09
**Method:** Live browser sweep (your Chrome, dev server on 127.0.0.1:3000) + console capture on every page + static code analysis. Logged in with seeded accounts (`Unity@12345`).
**Coverage:** 12 public pages, 10 admin pages, 4+ portal pages, 3 roles live (super_admin, finance, client) + permission logic verified, responsive CSS analyzed.

> This is the **findings report** you asked for. A proposed fix plan is in §6. No fixes were applied in this pass (per "report first, then plan"). The earlier `PROJECT_AUDIT_2026-06-08.md` covers items already fixed (menu scroll, auth consistency, heading sizes on auth/dashboard, dashboard parallax).

---

## 1. Headline

The app is **much healthier than a typical pre-launch build**: across ~26 pages I found **zero JavaScript console errors** and the backend serves live data cleanly. But there is **one critical, launch-blocking bug** (an intermittently invisible login form) plus a set of medium/minor polish issues. Mobile responsiveness is built-in at the code level but could not be visually confirmed in this environment (details in §4).

Overall: **not yet production-ready**, but close. One must-fix, then a polish pass.

---

## 2. 🔴 Critical (launch blocker)

### C1 — Login / register form is intermittently invisible

**What happens:** On some loads, the login card shows "Welcome back" but the **email, password, and Sign-in button are not visible** — the user sees an empty card and cannot log in. Reloading sometimes fixes it. I reproduced both states live and confirmed via computed styles that the fields are present in the DOM but an **ancestor is stuck at `opacity: 0`**.

**Root cause:** `StaggerContainer` (in `components/motion-primitives.tsx`) reveals its children with framer-motion `whileInView="visible"` + `viewport={{ once: true }}`, and `StaggerItem`'s hidden state is `opacity: 0`. These forms are wrapped in `SkeletonReveal`, which swaps skeleton → content after a timer. When the content mounts, the in-view trigger **intermittently never fires** (a race between the skeleton swap and the IntersectionObserver, latched by `once: true`), leaving the items stuck hidden.

**Impact:** Affects `login` and `register` (and any page using `StaggerContainer` inside `SkeletonReveal`). When it triggers, the primary auth flow is unusable. This is the single most important thing to fix before launch.

**Severity:** Critical — intermittent, but blocks login.

---

## 3. 🟠 / 🟡 Functional & visual issues

### H1 — Blanket heading rule oversizes non-hero headings (High)
`aurora.css:695` forces `h1 { font-size: …6rem !important }` and a sibling `h2 { …4.2rem !important }` on **every** heading site-wide. Already patched for the auth card title, dashboard page heading, and sidebar title (prior session), but **other `h1`/`h2` on marketing, legal, and content pages may still be forced to hero size** where a smaller size is intended. Fix at the source by scoping the rule to hero contexts.

### M1 — 404 page uses a dark background (Medium)
The custom 404 (`/not-found`) renders on a **dark navy background** while the entire rest of the site is the light green/navy theme — visually jarring. The page itself is well-designed and functional (Go home / Contact support buttons work).

### M2 — Admin Orders shows raw database IDs (Medium)
`/admin/orders` lists orders by their raw 24-character MongoDB ObjectId (e.g. `6a0e7a53b92ed722f2e642ed`) in the ORDER column. Other tables (invoices, finance) correctly use friendly numbers like `UC-2026-56276`. Orders should get a human-readable reference.

### M3 — Unstyled native file input (Medium)
`/admin/content` (cover image) uses the browser's default `<input type="file">` ("Choose File / No file chosen"), which looks unpolished against the otherwise-consistent design system.

### M4 — Logout-when-logged-out throws a console exception (Medium)
Navigating to `/logout` without an active session logs an uncaught `Error: Your session has expired. Please login again.` (from the `logout` API call). It should be swallowed like the dashboard logout handler already does.

### L1 — `/plans` duplicates `/pricing` (Low)
Both routes render identical content. If `/plans` is an intentional alias, consider a redirect; otherwise it's a leftover duplicate.

### L2 — Seed / smoke-test data throughout (Low, pre-launch)
Lists are full of `Smoke Booking Co`, `Smoke Test Lead`, etc. Expected for a test build — flagging so it's replaced/cleared before go-live.

---

## 4. 📱 Mobile responsiveness

**Could not be visually verified in this environment.** Driving a true mobile viewport requires resizing the browser; the resize command was a **no-op here** (the viewport stayed at 1536px regardless), and there's no device-emulation tool available, so I could not render the site at phone width.

**Static analysis is positive, however:**
- **33 responsive `@media` blocks** across `globals.css` (12) and `aurora.css` (21), at breakpoints 360 / 480 / 640 / 720 / 768 / 1024 / 1180px.
- A dedicated **`MobileNav` hamburger-drawer component** (`components/mobile-nav.tsx`) with proper open/close, nav links, and Portal / Book Service actions.
- The dashboard has explicit mobile CSS (`max-width: 720px`): a sticky mobile header, hamburger, and a fixed-overlay sidebar drawer.
- **No problematic fixed pixel widths** (largest are 290/160/130px — all fit a 360px phone).

**Conclusion:** the site is **built to be responsive**; the infrastructure is there and looks sound. It still needs a **visual mobile pass** (Chrome DevTools device mode or a real device) to confirm, focusing on: the dashboard mobile sidebar drawer, the hero orbit graphic on small screens, the data tables (need horizontal scroll), the badge marquees, and form layouts. I can do this pass if you can give me a way to run device mode, or you can spot-check it.

---

## 5. ✅ Verified working (no issues found)

- **Zero console errors** on all 26 pages opened: home, about, services, service-detail, pricing, plans, portfolio, blog, contact, book, 404 (public); dashboard, leads, orders, services, content, finance, users, tickets, audit, messages (admin); dashboard, projects, invoices, settings (portal).
- **Backend** boots cleanly; all `/api/v1/*` routes mapped; dashboards load **live data** (leads 34, tickets, revenue, invoices, projects, users, messages).
- **Permission-filtered menus work** — verified live: super_admin sees 12 admin items, finance sees exactly 3 (Dashboard, Orders, Finance), client sees 8 portal items. Role titles render correctly ("Super Admin's CRM", "Finance Dashboard", "Client Portal").
- **Menu-bar scroll fix** (prior session) holds on both `/admin` and `/portal`.
- **TypeScript + ESLint:** clean (frontend + backend).
- **Forms render and are interactive:** contact, booking wizard, settings toggles, admin messaging, user management, content editor.
- **404 handling** works with a custom branded page.

### Per-role menus (derived from seed permissions — rendering mechanism verified)
super_admin → all; admin → all; staff → Dashboard, Leads, Orders, Services, Content, Tickets; finance → Dashboard, Orders, Finance *(verified live)*; support → Dashboard, Support, Tickets, Messages; seo/design/content → Dashboard, Services, Content; hr → Dashboard, Team; operations → Dashboard, Leads, Orders; crm_ops → Dashboard, Leads, Orders, Services; client → Dashboard, Projects, Documents, Invoices, Payments, Messages, Settings, Support *(verified live)*.

---

## 6. Proposed implementation plan

**Phase 1 — Critical (do first, launch blocker)**
1. **Fix C1 (invisible form).** Make `StaggerContainer`/`StaggerItem` reveal reliably: animate on mount instead of `whileInView` + `once`, or guarantee a visible fallback (e.g. items default to `opacity: 1` and only animate down-then-up, or drop the in-view gate when inside `SkeletonReveal`). Then re-test login/register across many reloads.

**Phase 2 — High**
2. **Fix H1 at the source.** Scope `aurora.css`'s blanket `h1`/`h2 !important` rules to hero/marketing selectors; remove the per-component `!important` patches once scoped; sweep public pages for any now-wrong heading sizes.

**Phase 3 — Medium polish**
3. M1 404 background → light theme. 4. M2 friendly order numbers. 5. M3 style the file input. 6. M4 swallow the logout error. 7. L1 `/plans` redirect-or-remove.

**Phase 4 — Mobile + pre-launch**
8. Visual mobile QA pass (device mode) + fix anything found. 9. L2 replace seed data. 10. Final cross-browser/animation polish pass.

---

## 7. How to reproduce C1 (for your dev)
Open `/login`, hard-reload several times. On the bad loads the card shows the heading but no fields; inspecting the email input shows it present with an ancestor `opacity: 0`. Source: `frontend/src/components/motion-primitives.tsx` → `StaggerContainer` (`whileInView` + `viewport.once`) used by `frontend/src/app/login/page.tsx` inside `SkeletonReveal`.
