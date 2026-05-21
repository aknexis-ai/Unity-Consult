# UNITY CONSULT - COMPLETE IMPLEMENTATION PLAN
**Enterprise Platform Development Roadmap**  
**Version 1.0 | May 19, 2026 | 4-Phase Implementation**

---

## 📋 PROJECT OVERVIEW

### Business Purpose
Unity Consult is a premium **B2B digital consulting platform** that simultaneously serves as:
1. **Digital Headquarters** - Primary operational interface for clients and staff
2. **High-Conversion Sales Engine** - Target: 4.5%+ visitor-to-lead conversion
3. **Service Management Entry Point** - Authenticated client portal for project lifecycle
4. **CRM-Connected Booking System** - Automated lead capture → payment → project activation
5. **Portfolio & Trust Showcase** - Cinematic case studies, live metrics, social proof
6. **Support & Communication Hub** - Omnichannel: tickets, WhatsApp, live chat, email
7. **Growth & Analytics Platform** - Real-time KPI dashboards for clients and operations

### 6 Core Services
| Service | Category | Price | Duration | Target |
|---------|----------|-------|----------|--------|
| Web Development | Technology | ₹99,999 | 4-10 weeks | Startups, SMEs |
| CRM Development | Operations | ₹2,49,999 | 6-12 weeks | Mid-market |
| SEO Services | Growth | ₹19,999/mo | Ongoing | All segments |
| Digital Marketing | Growth | ₹29,999/mo | 2-4 weeks | All segments |
| Legal Registration | Compliance | ₹9,999 | 1-3 weeks | Startups |
| Branding & Design | Brand | ₹49,999 | 2-6 weeks | All segments |

### Key Metrics Targets (Pre-Launch)
- Visitor-to-lead conversion: > 4.5%
- Page load time: < 2 seconds
- Lighthouse score: > 90
- Mobile responsiveness: 100%
- Accessibility (WCAG 2.1): AA compliance

---

## 🏗️ ARCHITECTURE OVERVIEW

### Domain Structure (Multi-Subdomain)
```
www.unityconsult.com    → Public marketing website (Next.js)
app.unityconsult.com    → Client portal (Next.js SSR)
admin.unityconsult.com  → Admin CRM (Next.js SSR)
api.unityconsult.com    → Backend API (NestJS + Express)
cdn.unityconsult.com    → Static assets (Cloudflare/S3)
```

### Technology Stack

**Frontend (All Subdomains)**
- Next.js 16.2.6 (React 19.2.6)
- TypeScript 6.0.3
- Tailwind CSS 3.4.0 (or pure CSS with CSS-in-JS)
- Lucide React 1.16.0 (icons)
- Framer Motion 10.16.0 (animations)
- React Query 5.x (data fetching)
- Zustand 4.4.0 (state management)
- Axios 1.6.0 (HTTP client)

**Backend**
- NestJS 10.x (TypeScript framework)
- Express.js (HTTP server)
- Node.js 20.x LTS
- JWT (authentication)
- Bcrypt (password hashing)
- Validation libraries: class-validator, joi

**Database**
- MongoDB Atlas (Cloud)
- Mongoose 8.x (ODM)
- Redis 7.x (caching & sessions)
- Elasticsearch (search & analytics)

**Integrations**
- Razorpay (Payment processing)
- SendGrid (Email service)
- Twilio (WhatsApp & SMS)
- Google Analytics 4 (Analytics)
- Cloudflare (CDN & security)
- AWS S3 (File storage)
- Crisp or Drift (Live chat)
- Sentry (Error tracking)

**DevOps & Deployment**
- GitHub (Version control)
- GitHub Actions (CI/CD)
- Vercel (Frontend hosting)
- DigitalOcean or AWS EC2 (Backend hosting)
- Docker (Containerization)
- Nginx (Reverse proxy)
- PM2 (Process management)

---

# PHASE 1: FRONTEND SCAFFOLD & UI FOUNDATION (40-60 HOURS)

## ✅ Phase 1 Status: COMPLETE

### 1.1 Project Setup & Configuration

**Completed Tasks:**
- ✅ Next.js 16 project initialized
- ✅ TypeScript configuration
- ✅ Global styles and CSS variables
- ✅ Responsive breakpoints setup
- ✅ Font imports (@fontsource packages)

**Configuration Details:**

**next.config.ts**
```typescript
module.exports = {
  compiler: { styledComponents: true },
  images: { domains: ['cdn.unityconsult.com'] },
  i18n: { locales: ['en'], defaultLocale: 'en' },
  env: { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL }
}
```

**tsconfig.json** (Strict mode enabled)
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node"
  }
}
```

---

### 1.2 Global Design System

#### Color Palette (CSS Variables)

**File:** `src/app/globals.css`

```css
:root {
  /* Primary Colors */
  --color-navy: #0A1628;
  --color-royal-blue: #1E3A8A;
  --color-vivid-blue: #3B82F6;
  --color-violet: #7C3AED;
  
  /* Status Colors */
  --color-success: #059669;
  --color-warning: #D97706;
  --color-error: #DC2626;
  
  /* Neutral */
  --color-surface: #F8FAFC;
  --color-border: #E2E8F0;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  
  /* Glass Morphism */
  --glass-bg: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-blur: 12px;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  --spacing-2xl: 96px;
  
  /* Typography */
  --font-primary: 'Plus Jakarta Sans', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

#### Typography Hierarchy

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Hero H1 | Plus Jakarta Sans | 52-64px | 800 | Homepage hero, major sections |
| Section H2 | Plus Jakarta Sans | 36-42px | 700 | Page sections, features |
| Sub-heading H3 | Plus Jakarta Sans | 24-28px | 600 | Subsections, cards |
| Card Title H4 | Plus Jakarta Sans | 18px | 600 | Service cards, tiles |
| Body Copy | Plus Jakarta Sans | 16px | 400 | Main content, paragraphs |
| Small/Meta | Plus Jakarta Sans | 13-14px | 400 | Metadata, labels, captions |
| Button Text | Plus Jakarta Sans | 15px | 600 | All button labels |
| Dashboard Data | JetBrains Mono | 14-20px | 500-700 | KPIs, metrics, numbers |
| Code/API | JetBrains Mono | 13px | 400 | Code blocks, API docs |

#### Component Styling System

**Glass Panel Component**
```css
.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: var(--spacing-lg);
}

.glass-panel:hover {
  background: rgba(255, 255, 255, 0.06);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Elevation Levels**
```css
/* Elevation 1 (Cards) */
.elevation-1 {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Elevation 2 (Modals) */
.elevation-2 {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Elevation 3 (Top nav) */
.elevation-3 {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}
```

**Responsive Breakpoints**
```css
/* Mobile First */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

### 1.3 Component Architecture

**Reusable Component Structure:**

```
src/components/
├── Layout/
│   ├── SiteShell.tsx (Main layout wrapper)
│   ├── Header.tsx (Top navigation)
│   ├── Footer.tsx (Footer with columns)
│   ├── MobileNav.tsx (Hamburger menu)
│   └── Sidebar.tsx (Admin/Portal sidebar)
├── Sections/
│   ├── Section.tsx (Generic section wrapper)
│   ├── HeroSection.tsx
│   ├── FeatureGrid.tsx
│   └── CTA.tsx
├── Cards/
│   ├── ServiceCard.tsx
│   ├── PortfolioCard.tsx
│   ├── BlogCard.tsx
│   └── MetricCard.tsx
├── Forms/
│   ├── BookingWizard.tsx (4-step booking)
│   ├── ContactForm.tsx
│   ├── LoginForm.tsx
│   └── SearchBar.tsx
├── Dashboard/
│   ├── DashboardShell.tsx (Sidebar + Content)
│   ├── KPICard.tsx
│   ├── ProjectCard.tsx
│   └── InvoiceList.tsx
├── Common/
│   ├── Button.tsx (Primary, secondary, ghost)
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   ├── Loading.tsx
│   └── EmptyState.tsx
└── Animations/
    ├── FadeIn.tsx
    ├── SlideUp.tsx
    └── CountUp.tsx
```

**Key Component Props & Types:**

```typescript
// src/types/index.ts

export interface Service {
  slug: string;
  name: string;
  short: string;
  description: string;
  category: 'Technology' | 'Operations' | 'Growth' | 'Compliance' | 'Brand';
  priceFrom: string;
  delivery: string;
  outcomes: string[];
  workflow: string[];
  bookingFields: string[];
  related: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  slug: string;
  description: string;
  result: string;
  images: string[];
  testimonial?: string;
  client: string;
  year: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  readTime: number;
  tags: string[];
  image: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  source: 'Organic' | 'Paid' | 'Referral' | 'Direct' | 'WhatsApp';
  stage: 'new' | 'qualified' | 'proposal' | 'won';
  createdAt: Date;
}

export interface Order {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  stage: string;
  owner: string;
  startDate: Date;
  dueDate: Date;
  budget: number;
  paid: number;
  status: 'active' | 'completed' | 'on-hold';
}
```

---

### 1.4 Routing Structure (23/32 Routes Complete)

#### Public Routes (www.unityconsult.com)

| Route | Component | Status | Details |
|-------|-----------|--------|---------|
| / | HomePage | ✅ | Hero, trust strip, services grid, portfolio, CTA |
| /services | ServiceCatalog | ✅ | All 6 services, category tabs, search |
| /services/[slug] | ServiceDetail | ✅ | Service overview, pricing, workflow, FAQ |
| /pricing | PricingPage | 🔄 | Service tiers, toggle monthly/one-time |
| /portfolio | PortfolioCatalog | ✅ | Case studies grid, filters |
| /portfolio/[slug] | CaseStudy | ✅ | Detailed project, testimonial, metrics |
| /about | AboutPage | ✅ | Company story, team, values |
| /blog | BlogIndex | ✅ | Blog posts list, pagination |
| /blog/[slug] | BlogPost | ✅ | Article, author, related posts |
| /contact | ContactPage | ✅ | Contact form, office map |
| /careers | CareersPage | ✅ | Job listings, application form |
| /careers/[role] | JobDetail | ✅ | Job description, apply button |
| /privacy-policy | PrivacyPage | ⏳ | Legal page (not created) |
| /terms-of-service | TermsPage | ⏳ | Legal page (not created) |
| /book | BookingWizard | ✅ | 4-step booking flow |

#### Client Portal Routes (app.unityconsult.com)

| Route | Component | Status | Details |
|-------|-----------|--------|---------|
| /portal | Dashboard | ✅ | KPI cards, recent projects, quick actions |
| /portal/projects | ProjectList | ✅ | All projects, status filters, search |
| /portal/projects/[id] | ProjectDetail | ✅ | Milestones, deliverables, chat |
| /portal/documents | DocumentHub | ✅ | Files by category, upload, download |
| /portal/finance | InvoiceList | ✅ | Invoices, payment status, download |
| /portal/finance/[id] | InvoiceDetail | ✅ | Invoice details, payment method |
| /portal/messages | Messages | ⏳ | Chat with team (not created) |
| /portal/settings | AccountSettings | ⏳ | Profile, billing, preferences (not created) |

#### Admin CRM Routes (admin.unityconsult.com)

| Route | Component | Status | Details |
|-------|-----------|--------|---------|
| /admin | Dashboard | ✅ | KPIs, revenue, conversion funnel |
| /admin/leads | LeadKanban | ✅ | 4-stage pipeline: New, Qualified, Proposal, Won |
| /admin/leads/[id] | LeadDetail | ✅ | Lead profile, history, notes, activity |
| /admin/orders | OrderList | ✅ | All orders/projects, status, owner |
| /admin/orders/[id] | OrderDetail | ✅ | Project details, milestones, team |
| /admin/services | ServiceMgmt | ⏳ | Create/edit services (not created) |
| /admin/content | ContentEditor | ⏳ | CMS editor for pages (not created) |
| /admin/finance | FinanceDash | ⏳ | Revenue, invoices, payments (not created) |
| /admin/team | TeamMgmt | ⏳ | Staff, roles, permissions (not created) |
| /admin/support | TicketQueue | ⏳ | Support tickets, chat (not created) |

---

### 1.5 Homepage Architecture

#### Hero Section (100% Viewport Height)
```
┌─────────────────────────────────────┐
│  Header (Sticky)                    │
│  Logo | Nav | Portal | Book Service │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│                                     │
│  Animated Gradient Background       │
│  + Floating Geometric Shapes        │
│                                     │
│  H1: "Trusted Digital Business"     │
│       "Partner for Growth"          │
│                                     │
│  Subheading: Value proposition      │
│                                     │
│  CTA Buttons:                       │
│  [Book Service] [View Portfolio]    │
│                                     │
│  Metrics Strip (Fade-in):           │
│  4.9/5 ★ | 250+ Projects | 120+ Cl │
│                                     │
└─────────────────────────────────────┘
```

**Hero Section Content:**
- **H1 Text:** "Digital Transformation Partner for Growth-Focused Companies"
- **Subheading:** "Enterprise-grade consulting, technology, and brand solutions for scale"
- **Hero CTA 1:** "Book a Consultation" (Primary button → /book)
- **Hero CTA 2:** "Explore Our Work" (Secondary button → /portfolio)
- **Background:** Animated gradient (Navy → Royal Blue) with floating shapes
- **Trust Metrics:** 4.9★ rating | 250+ projects | 120+ clients | 8+ countries

#### Featured Services Section

**Layout:** 3-column grid (responsive to 1 column on mobile)

```
Service Card Template:
┌─────────────────────────────┐
│ [Category Label]            │
│                             │
│ Service Name                │
│ Short description           │
│                             │
│ ₹Price | Duration           │
│                             │
│ • Outcome 1                 │
│ • Outcome 2                 │
│ • Outcome 3                 │
│                             │
│ [View Details] →            │
└─────────────────────────────┘
```

**6 Services Displayed:**
1. **Web Development** - ₹99,999 | 4-10 weeks
2. **CRM Development** - ₹2,49,999 | 6-12 weeks
3. **SEO Services** - ₹19,999/mo | Ongoing
4. **Digital Marketing** - ₹29,999/mo | 2-4 weeks
5. **Legal Registration** - ₹9,999 | 1-3 weeks
6. **Branding & Design** - ₹49,999 | 2-6 weeks

#### Portfolio Preview Section

**Layout:** 3 featured case studies in a carousel/grid

```
Case Study Card:
┌─────────────────────────────┐
│ [Hero Image]                │
│ Category Badge              │
│                             │
│ Project Title               │
│ "Tagline of project"        │
│                             │
│ Results: "123% increase"    │
│                             │
│ [Read Case Study]           │
└─────────────────────────────┘
```

#### Why Choose Us Section

**Layout:** 6 benefit cards (2 rows, 3 columns)

Benefits:
1. Enterprise-Grade Infrastructure
2. Expert-Centric Consulting
3. Proven Track Record
4. Real-Time Transparency
5. Scalable Solutions
6. Full-Spectrum Support

#### Blog Preview Section

**Layout:** 3 latest blog posts

```
Blog Card:
┌─────────────────────────────┐
│ [Featured Image]            │
│ Read Time: 5 min            │
│                             │
│ "Blog Post Title"           │
│ Article excerpt (2 lines)   │
│                             │
│ [Read Article]              │
└─────────────────────────────┘
```

#### Final CTA Section

**Dark gradient background with centered messaging:**
- **Heading:** "Ready to Transform Your Business?"
- **Subheading:** "Start with a consultation call or explore our service catalog"
- **CTA Buttons:** [Schedule Now] [View Services]

#### Footer

**4-Column Layout:**

Column 1: **Brand**
- Company name & description
- Social media links

Column 2: **Services**
- Web Development
- CRM Development
- SEO Services
- Digital Marketing
- Legal Registration
- Branding & Design

Column 3: **Company**
- About Us
- Blog
- Careers
- Contact

Column 4: **Contact**
- Email: hello@unityconsult.com
- Phone: +91 98765 43210
- Address: Bangalore Tech Park
- Hours: Mon-Sat, 9AM-7PM IST

---

### 1.6 Service Catalog Page

**URL:** `/services`

**Page Structure:**

```
┌─────────────────────────────────┐
│ Header (Sticky Navigation)      │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Page Title: "Service Catalog"   │
│ Subtitle: "All 6 service ctgs"  │
│ Description paragraph           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Category Tabs (Optional Filter) │
│ [All] [Technology] [Growth]...  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Service Cards Grid (3 cols)     │
│                                 │
│ [Card 1] [Card 2] [Card 3]     │
│ [Card 4] [Card 5] [Card 6]     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ CTA Section: "Book a Service"   │
└─────────────────────────────────┘
```

---

### 1.7 Service Detail Page Template

**URL:** `/services/[slug]` (e.g., `/services/web-development`)

**Page Layout:**

```
┌──────────────────────────────────┐
│ Service Hero Section             │
│ [Large banner image/gradient]    │
│ Service category badge           │
│ H1: Service Name                 │
│ Subheading                       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Service Overview (3-column)      │
│                                  │
│ [Description] [Pricing] [Impact] │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Outcomes Section                 │
│ ✓ Outcome 1                      │
│ ✓ Outcome 2                      │
│ ✓ Outcome 3                      │
│ ✓ Outcome 4                      │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Process Timeline                 │
│ Step 1 → Step 2 → Step 3 → ...  │
│ Week 1-2  Week 3-4  Week 5-6    │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Pricing & Delivery Info          │
│ From ₹[Price]                    │
│ Delivery: [X] weeks              │
│ [Book Now] [Request Quote]       │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ FAQ Accordion                    │
│ [Q] What's included?             │
│ [A] ...                          │
│                                  │
│ [Q] How does billing work?       │
│ [A] ...                          │
└──────────────────────────────────┘

┌──────────────────────────────────┐
│ Related Services (3 cards)       │
│ [Card 1] [Card 2] [Card 3]      │
└──────────────────────────────────┘
```

**Service Detail Page Content (Per Service):**

#### Web Development Service

**Hero:** "Custom websites built for trust, speed, and measurable outcomes"

**Pricing:** ₹99,999 (Base project price)

**Delivery:** 4-10 weeks

**Outcomes:**
1. Responsive website optimized for mobile, tablet, desktop
2. CMS-ready content management system
3. Google Analytics & conversion tracking setup
4. Launch support and training

**Process Timeline:**
1. **Discovery** (Week 1-2) - Business goals, audience, features mapping
2. **Architecture** (Week 2-3) - Technical setup, database design
3. **Design** (Week 3-4) - Wireframes, design mockups, client approval
4. **Development** (Week 5-8) - Frontend & backend development
5. **QA & Testing** (Week 8-9) - Bug fixes, performance optimization
6. **Launch** (Week 9-10) - Deployment, monitoring, post-launch support

**Booking Fields:**
- Business name
- Project goals
- Approximate page count
- Feature list
- Budget range

**FAQ:**
- What's included in the package?
- How is the project priced?
- Can we modify the design during development?
- What about post-launch support?
- Do you provide hosting?

**Related Services:**
- CRM Development
- SEO Services
- Branding & Design

---

### 1.8 Booking Wizard (4-Step Flow)

**URL:** `/book`

**4-Step Journey:**

```
Step 1: Choose Service
┌─────────────────────────────────┐
│ Which service interests you?    │
│                                 │
│ [Card 1] [Card 2] [Card 3]     │
│ [Card 4] [Card 5] [Card 6]     │
│                                 │
│ [← Back] [Next →]               │
└─────────────────────────────────┘

Step 2: Business Context
┌─────────────────────────────────┐
│ Tell us about your business     │
│                                 │
│ [Company Name input]            │
│ [Industry dropdown]             │
│ [Team Size slider]              │
│ [Current Challenges textarea]   │
│                                 │
│ [← Back] [Next →]               │
└─────────────────────────────────┘

Step 3: Project Details
┌─────────────────────────────────┐
│ Specific requirements?          │
│                                 │
│ [Service-specific fields]       │
│ [Budget Range dropdown]         │
│ [Timeline preference]           │
│ [Attachments upload]            │
│                                 │
│ [← Back] [Next →]               │
└─────────────────────────────────┘

Step 4: Review & Submit
┌─────────────────────────────────┐
│ Review Your Booking             │
│                                 │
│ Service: [Selected Service]     │
│ Budget: [Selected Budget]       │
│ Timeline: [Selected Timeline]   │
│                                 │
│ Contact Details:                │
│ [Name] [Email] [Phone]          │
│                                 │
│ [← Back] [Complete Booking]     │
└─────────────────────────────────┘
```

**Booking Wizard Data Flow:**

```typescript
interface BookingState {
  step: 1 | 2 | 3 | 4;
  serviceId: string;
  businessName: string;
  industry: string;
  teamSize: number;
  challenges: string;
  specificRequirements: string;
  budgetRange: string;
  timeline: string;
  attachments: File[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}
```

**Booking Wizard Actions:**
1. Next step (validate current step data)
2. Previous step (go back)
3. Submit booking (create lead + send confirmation email)

---

### 1.9 Client Portal Dashboard

**URL:** `/portal`

**Dashboard Components:**

```
┌─────────────────────────────────┐
│ Welcome Back, [Name]!           │
│ Last login: 2 hours ago         │
└─────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ KPI Cards Row (4 cards)                     │
│                                             │
│ [Active Projects] [Total Spent]             │
│ [Deliverables Due] [Support Tickets]        │
└─────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┐
│ Recent Projects      │ Quick Actions        │
│                      │                      │
│ [Project 1]          │ [View All Projects]  │
│ [Project 2]          │ [Upload Document]    │
│ [Project 3]          │ [Contact Support]    │
│                      │ [Schedule Call]      │
└──────────────────────┴──────────────────────┘

┌─────────────────────────────────┐
│ Upcoming Milestones             │
│ • Milestone 1 - Due 23 May      │
│ • Milestone 2 - Due 30 May      │
│ • Milestone 3 - Due 15 June     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Invoices & Finance              │
│ • Invoice INV-001 - ₹1,25,000   │
│   Status: PAID                  │
│                                 │
│ • Invoice INV-002 - ₹19,999     │
│   Status: UNPAID - [Pay Now]    │
└─────────────────────────────────┘
```

**Portal Dashboard Metrics:**

| Metric | Example Value | Update Frequency |
|--------|---------------|------------------|
| Active Projects | 2 | Real-time |
| Total Amount Spent | ₹1,44,999 | Real-time |
| Deliverables Due | 3 | Real-time |
| Open Support Tickets | 1 | Real-time |

---

### 1.10 Admin CRM Dashboard

**URL:** `/admin`

**Admin Dashboard Components:**

```
┌─────────────────────────────────────────────┐
│ Admin Dashboard Overview                    │
│ Updated: Just now                           │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ KPI Cards Row (4 cards)                     │
│                                             │
│ [Total Revenue] [Active Deals]              │
│ [New Leads] [Conversion Rate]               │
└─────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┐
│ Lead Pipeline        │ Revenue Metrics      │
│ Kanban 4 stages:     │                      │
│                      │ Monthly Revenue      │
│ 📌 New: 5 leads      │ ₹28,50,000           │
│ ✓ Qualified: 3       │                      │
│ 📋 Proposal: 2       │ Avg. Deal Size       │
│ 🏆 Won: 8            │ ₹3,12,500            │
└──────────────────────┴──────────────────────┘

┌─────────────────────────────────┐
│ Recent Orders                   │
│ [Order 1] | [Order 2] | ...     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Team Activity                   │
│ • Priya Sharma: 2 leads closed  │
│ • Rajesh Kumar: 1 proposal sent │
│ • Amit Patel: 3 calls scheduled │
└─────────────────────────────────┘
```

**Admin KPI Metrics:**

| Metric | Format | Target |
|--------|--------|--------|
| Total Revenue (Monthly) | ₹Amount | ₹28,50,000+ |
| Active Deals | Count | 40+ |
| New Leads (This Week) | Count | 10+ |
| Conversion Rate | Percentage | > 15% |
| Avg. Proposal Cycle | Days | < 3.5 days |
| Customer Satisfaction | Rating | > 4.5/5 |

---

### 1.11 Admin Kanban Pipeline (Lead Management)

**URL:** `/admin/leads`

**4-Stage Kanban Board:**

```
┌─────────────┬──────────────┬──────────────┬──────────┐
│   New       │ Qualified    │  Proposal    │   Won    │
│  (5 leads)  │  (3 leads)   │  (2 leads)   │ (8 leads)│
├─────────────┼──────────────┼──────────────┼──────────┤
│             │              │              │          │
│ [Lead Card] │ [Lead Card]  │ [Lead Card]  │ [Lead]   │
│             │              │              │          │
│ [Lead Card] │ [Lead Card]  │ [Lead Card]  │ [Lead]   │
│             │              │              │          │
│ [Lead Card] │ [Lead Card]  │              │ [Lead]   │
│             │              │              │          │
│ [Lead Card] │              │              │ [Lead]   │
│             │              │              │          │
│ [Lead Card] │              │              │ [Lead]   │
│             │              │              │          │
│             │              │              │ [Lead]   │
│             │              │              │          │
│             │              │              │ [Lead]   │
│             │              │              │          │
│             │              │              │ [Lead]   │
└─────────────┴──────────────┴──────────────┴──────────┘
```

**Lead Card Template:**

```
┌─────────────────────────┐
│ Lead Name               │
│ Company Name            │
│                         │
│ Service: Web Dev        │
│ Budget: ₹1,50,000       │
│ Source: Organic         │
│                         │
│ Created: 2 days ago     │
│                         │
│ [Contact] [Notes] [Move]│
└─────────────────────────┘
```

**Drag-and-Drop Functionality:**
- Drag leads between stages to update status
- Drag triggers webhook to update database
- Real-time sync across all admin users

---

## PHASE 2: BACKEND API & DATABASE SETUP (120-160 HOURS)

### 2.1 Database Schema (MongoDB)

#### Collections & Documents

**Users Collection**
```json
{
  "_id": "ObjectId",
  "email": "string",
  "password": "string (hashed)",
  "name": "string",
  "role": "admin | client | staff",
  "phone": "string",
  "company": "string",
  "profileImage": "URL",
  "status": "active | inactive | suspended",
  "twoFactorEnabled": "boolean",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "lastLogin": "ISO8601"
}
```

**Leads Collection**
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "service": "ObjectId (ref: Services)",
  "budget": "string",
  "source": "organic | paid | referral | direct | whatsapp",
  "stage": "new | qualified | proposal | won | lost",
  "notes": "string",
  "attachments": ["URL"],
  "assignedTo": "ObjectId (ref: Users)",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "followUpDate": "ISO8601"
}
```

**Orders Collection**
```json
{
  "_id": "ObjectId",
  "leadId": "ObjectId (ref: Leads)",
  "clientId": "ObjectId (ref: Users)",
  "serviceId": "ObjectId (ref: Services)",
  "orderId": "string (ORD-XXXX)",
  "stage": "discovery | design | development | review | launch | completed",
  "status": "active | on-hold | completed | cancelled",
  "startDate": "ISO8601",
  "expectedEndDate": "ISO8601",
  "actualEndDate": "ISO8601",
  "budget": "number",
  "amountPaid": "number",
  "assignedTo": "ObjectId (ref: Users)",
  "milestones": [
    {
      "id": "ObjectId",
      "name": "string",
      "description": "string",
      "dueDate": "ISO8601",
      "status": "pending | in-progress | completed",
      "deliverables": ["string"]
    }
  ],
  "documents": ["ObjectId (ref: Documents)"],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

**Invoices Collection**
```json
{
  "_id": "ObjectId",
  "invoiceNumber": "string (INV-XXX)",
  "orderId": "ObjectId (ref: Orders)",
  "clientId": "ObjectId (ref: Users)",
  "serviceId": "ObjectId (ref: Services)",
  "amount": "number",
  "tax": "number",
  "total": "number",
  "currency": "INR",
  "dueDate": "ISO8601",
  "status": "draft | sent | viewed | paid | overdue | cancelled",
  "paidAt": "ISO8601",
  "paymentMethod": "credit_card | bank_transfer | razorpay",
  "paymentId": "string (Razorpay payment ID)",
  "lineItems": [
    {
      "description": "string",
      "quantity": "number",
      "rate": "number",
      "amount": "number"
    }
  ],
  "notes": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

**Documents Collection**
```json
{
  "_id": "ObjectId",
  "orderId": "ObjectId (ref: Orders)",
  "clientId": "ObjectId (ref: Users)",
  "name": "string",
  "fileName": "string",
  "fileType": "string",
  "fileSize": "number",
  "category": "commercial | project | finance | deliverable",
  "s3Url": "URL",
  "uploadedBy": "ObjectId (ref: Users)",
  "uploadedAt": "ISO8601",
  "version": "number",
  "isPublic": "boolean"
}
```

**Services Collection**
```json
{
  "_id": "ObjectId",
  "slug": "string",
  "name": "string",
  "short": "string",
  "description": "string",
  "category": "Technology | Operations | Growth | Compliance | Brand",
  "priceFrom": "number",
  "priceFromFormatted": "string (₹99,999)",
  "deliveryTime": "string",
  "outcomes": ["string"],
  "workflow": ["string"],
  "bookingFields": ["string"],
  "relatedServices": ["ObjectId (ref: Services)"],
  "image": "URL",
  "isActive": "boolean",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

**Tickets Collection**
```json
{
  "_id": "ObjectId",
  "ticketNumber": "string (TKT-XXXX)",
  "orderId": "ObjectId (ref: Orders)",
  "clientId": "ObjectId (ref: Users)",
  "subject": "string",
  "description": "string",
  "priority": "low | medium | high | urgent",
  "status": "open | in-progress | waiting | resolved | closed",
  "assignedTo": "ObjectId (ref: Users)",
  "messages": [
    {
      "author": "ObjectId (ref: Users)",
      "content": "string",
      "attachments": ["URL"],
      "createdAt": "ISO8601"
    }
  ],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "resolvedAt": "ISO8601"
}
```

**Payments Collection**
```json
{
  "_id": "ObjectId",
  "invoiceId": "ObjectId (ref: Invoices)",
  "razorpayPaymentId": "string",
  "razorpayOrderId": "string",
  "amount": "number",
  "status": "created | authorized | captured | failed | refunded",
  "method": "card | netbanking | upi | wallet",
  "cardLast4": "string",
  "description": "string",
  "receipt": "string (Razorpay receipt)",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

**Portfolio Collection**
```json
{
  "_id": "ObjectId",
  "slug": "string",
  "title": "string",
  "category": "string",
  "description": "string",
  "client": "string",
  "result": "string (Result achieved)",
  "images": ["URL"],
  "videoUrl": "URL (optional)",
  "testimonial": {
    "text": "string",
    "author": "string",
    "title": "string",
    "image": "URL"
  },
  "services": ["ObjectId (ref: Services)"],
  "year": "number",
  "isPublished": "boolean",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

**Blog Posts Collection**
```json
{
  "_id": "ObjectId",
  "slug": "string",
  "title": "string",
  "excerpt": "string",
  "content": "string (Markdown)",
  "author": "ObjectId (ref: Users)",
  "tags": ["string"],
  "featuredImage": "URL",
  "readTime": "number",
  "status": "draft | published | archived",
  "publishedAt": "ISO8601",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "views": "number"
}
```

---

### 2.2 Backend API Architecture (NestJS)

#### Project Structure

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── env.config.ts
│   │   └── jwt.config.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── refresh-token.dto.ts
│   ├── users/
│   │   ├── users.module.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.schema.ts
│   │   └── dto/
│   │       ├── create-user.dto.ts
│   │       ├── update-user.dto.ts
│   │       └── user.dto.ts
│   ├── leads/
│   │   ├── leads.module.ts
│   │   ├── leads.controller.ts
│   │   ├── leads.service.ts
│   │   ├── leads.schema.ts
│   │   └── dto/
│   │       ├── create-lead.dto.ts
│   │       ├── update-lead.dto.ts
│   │       └── lead.dto.ts
│   ├── orders/
│   │   ├── orders.module.ts
│   │   ├── orders.controller.ts
│   │   ├── orders.service.ts
│   │   ├── orders.schema.ts
│   │   └── dto/
│   │       ├── create-order.dto.ts
│   │       ├── update-order.dto.ts
│   │       └── order.dto.ts
│   ├── invoices/
│   │   ├── invoices.module.ts
│   │   ├── invoices.controller.ts
│   │   ├── invoices.service.ts
│   │   ├── invoices.schema.ts
│   │   └── dto/
│   │       ├── create-invoice.dto.ts
│   │       ├── update-invoice.dto.ts
│   │       └── invoice.dto.ts
│   ├── payments/
│   │   ├── payments.module.ts
│   │   ├── payments.controller.ts
│   │   ├── payments.service.ts
│   │   ├── razorpay.service.ts
│   │   ├── payments.schema.ts
│   │   └── dto/
│   │       ├── create-payment.dto.ts
│   │       └── payment-webhook.dto.ts
│   ├── documents/
│   │   ├── documents.module.ts
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   ├── s3.service.ts
│   │   ├── documents.schema.ts
│   │   └── dto/
│   │       ├── upload-document.dto.ts
│   │       └── document.dto.ts
│   ├── tickets/
│   │   ├── tickets.module.ts
│   │   ├── tickets.controller.ts
│   │   ├── tickets.service.ts
│   │   ├── tickets.schema.ts
│   │   └── dto/
│   │       ├── create-ticket.dto.ts
│   │       ├── update-ticket.dto.ts
│   │       └── ticket.dto.ts
│   ├── services/
│   │   ├── services.module.ts
│   │   ├── services.controller.ts
│   │   ├── services.service.ts
│   │   ├── services.schema.ts
│   │   └── dto/
│   │       └── service.dto.ts
│   ├── portfolio/
│   │   ├── portfolio.module.ts
│   │   ├── portfolio.controller.ts
│   │   ├── portfolio.service.ts
│   │   ├── portfolio.schema.ts
│   │   └── dto/
│   │       └── portfolio-item.dto.ts
│   ├── blog/
│   │   ├── blog.module.ts
│   │   ├── blog.controller.ts
│   │   ├── blog.service.ts
│   │   ├── blog.schema.ts
│   │   └── dto/
│   │       └── blog-post.dto.ts
│   ├── notifications/
│   │   ├── notifications.module.ts
│   │   ├── email.service.ts (SendGrid)
│   │   ├── sms.service.ts (Twilio)
│   │   └── webhook.service.ts
│   ├── webhooks/
│   │   ├── webhooks.module.ts
│   │   ├── webhooks.controller.ts
│   │   └── razorpay-webhook.controller.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── decorators/
│   │   ├── filters/
│   │   └── middleware/
│   └── pipes/
│       └── validation.pipe.ts
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

---

### 2.3 API Endpoints Specification

#### Authentication Endpoints

**POST /auth/register**
```
Request:
{
  "email": "string",
  "password": "string",
  "name": "string",
  "company": "string",
  "role": "client | admin"
}

Response:
{
  "id": "string",
  "email": "string",
  "name": "string",
  "token": "JWT",
  "refreshToken": "JWT"
}

Error Codes:
- 400: Invalid input
- 409: Email already exists
- 500: Server error
```

**POST /auth/login**
```
Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "string",
  "token": "JWT",
  "refreshToken": "JWT"
}

Error Codes:
- 400: Invalid credentials
- 401: Unauthorized
- 404: User not found
```

**POST /auth/refresh-token**
```
Request:
{
  "refreshToken": "JWT"
}

Response:
{
  "token": "JWT",
  "refreshToken": "JWT"
}

Error Codes:
- 401: Invalid refresh token
- 403: Token expired
```

**POST /auth/password-reset**
```
Request:
{
  "email": "string"
}

Response:
{
  "message": "Password reset email sent"
}

Webhook: Reset link sent via email
```

**POST /auth/verify-email**
```
Request:
{
  "token": "string"
}

Response:
{
  "message": "Email verified",
  "verified": true
}
```

---

#### Leads Endpoints (CRM)

**GET /leads**
```
Query Parameters:
- stage: "new | qualified | proposal | won"
- assignedTo: "user_id"
- service: "service_id"
- sortBy: "createdAt | budget | name"
- limit: 20
- skip: 0

Response:
{
  "data": [Lead],
  "total": number,
  "page": number
}
```

**POST /leads**
```
Request:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "service": "service_id",
  "budget": "string",
  "source": "organic | paid | referral",
  "notes": "string"
}

Response:
{
  "id": "string",
  "name": "string",
  "stage": "new",
  "createdAt": "ISO8601"
}

Webhook: Trigger "lead.created" event
```

**GET /leads/:id**
```
Response:
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "service": "Service",
  "budget": "string",
  "source": "string",
  "stage": "string",
  "notes": "string",
  "history": [Activity],
  "assignedTo": "User"
}
```

**PATCH /leads/:id**
```
Request:
{
  "stage": "qualified | proposal | won",
  "notes": "string",
  "assignedTo": "user_id"
}

Response:
{
  "id": "string",
  "stage": "string",
  "updatedAt": "ISO8601"
}

Webhook: Trigger "lead.updated" event
```

**DELETE /leads/:id**
```
Response:
{
  "message": "Lead deleted"
}
```

---

#### Orders Endpoints

**GET /orders**
```
Query Parameters:
- status: "active | completed | on-hold"
- clientId: "user_id"
- assignedTo: "user_id"
- sortBy: "createdAt | dueDate"
- limit: 20
- skip: 0

Response:
{
  "data": [Order],
  "total": number
}
```

**POST /orders**
```
Request:
{
  "leadId": "lead_id",
  "clientId": "user_id",
  "serviceId": "service_id",
  "startDate": "ISO8601",
  "expectedEndDate": "ISO8601",
  "budget": number,
  "assignedTo": "user_id"
}

Response:
{
  "id": "string",
  "orderId": "ORD-XXXX",
  "stage": "discovery",
  "status": "active",
  "createdAt": "ISO8601"
}

Webhook: Trigger "order.created" event
```

**GET /orders/:id**
```
Response:
{
  "id": "string",
  "orderId": "ORD-XXXX",
  "client": "User",
  "service": "Service",
  "stage": "string",
  "status": "string",
  "milestones": [Milestone],
  "documents": [Document],
  "budget": number,
  "amountPaid": number,
  "timeline": { start, end, duration }
}
```

**PATCH /orders/:id**
```
Request:
{
  "stage": "string",
  "status": "string",
  "milestone_completed": "milestone_id"
}

Response:
{
  "id": "string",
  "stage": "string",
  "updatedAt": "ISO8601"
}

Webhook: Trigger "order.updated" or "milestone.completed" event
```

---

#### Invoices Endpoints

**GET /invoices**
```
Query Parameters:
- status: "sent | paid | overdue"
- clientId: "user_id"
- sortBy: "createdAt | dueDate"

Response:
{
  "data": [Invoice],
  "total": number
}
```

**POST /invoices**
```
Request:
{
  "orderId": "order_id",
  "clientId": "user_id",
  "lineItems": [
    { description, quantity, rate }
  ],
  "dueDate": "ISO8601"
}

Response:
{
  "id": "string",
  "invoiceNumber": "INV-XXX",
  "status": "draft",
  "createdAt": "ISO8601"
}

Action: Saved as draft
```

**POST /invoices/:id/send**
```
Request:
{}

Response:
{
  "message": "Invoice sent",
  "sentAt": "ISO8601"
}

Webhook: 
- Send email to client
- Trigger "invoice.sent" event
```

**GET /invoices/:id/pdf**
```
Response:
Binary PDF file

Header:
- Content-Type: application/pdf
- Content-Disposition: attachment
```

---

#### Payments Endpoints (Razorpay)

**POST /payments/create-order**
```
Request:
{
  "invoiceId": "invoice_id",
  "amount": number,
  "description": "string"
}

Response:
{
  "razorpayOrderId": "string",
  "amount": number,
  "currency": "INR"
}

Action: Create Razorpay order, save to database
```

**POST /payments/verify**
```
Request:
{
  "razorpayOrderId": "string",
  "razorpayPaymentId": "string",
  "razorpaySignature": "string"
}

Response:
{
  "verified": true,
  "invoiceId": "string",
  "status": "paid"
}

Action: 
- Verify signature
- Update invoice status to "paid"
- Update order amountPaid
- Send confirmation email
- Trigger "payment.successful" webhook
```

**POST /payments/webhook**
```
Received from Razorpay for:
- payment.authorized
- payment.failed
- payment.captured
- refund.created

Action: Process webhook, update database, send notifications
```

---

#### Documents Endpoints (File Upload/Download)

**POST /documents/upload**
```
Request:
- FormData with file + metadata
- invoiceId or orderId (required)
- category: "commercial | project | finance"

Response:
{
  "id": "string",
  "fileName": "string",
  "s3Url": "URL",
  "uploadedAt": "ISO8601"
}

Action:
- Upload to AWS S3
- Save metadata to MongoDB
- Generate signed download URL
```

**GET /documents/:id/download**
```
Response:
Binary file with Content-Disposition header
```

**DELETE /documents/:id**
```
Response:
{
  "message": "Document deleted"
}

Action: Delete from S3 and MongoDB
```

---

#### Support Tickets Endpoints

**POST /tickets**
```
Request:
{
  "orderId": "order_id",
  "subject": "string",
  "description": "string",
  "priority": "low | medium | high | urgent",
  "attachments": ["URLs"]
}

Response:
{
  "id": "string",
  "ticketNumber": "TKT-XXXX",
  "status": "open",
  "createdAt": "ISO8601"
}

Webhook: Trigger "ticket.created" + send email to support team
```

**GET /tickets/:id**
```
Response:
{
  "id": "string",
  "ticketNumber": "TKT-XXXX",
  "subject": "string",
  "status": "string",
  "priority": "string",
  "messages": [Message],
  "assignedTo": "User",
  "createdAt": "ISO8601"
}
```

**POST /tickets/:id/reply**
```
Request:
{
  "message": "string",
  "attachments": ["URLs"]
}

Response:
{
  "id": "string",
  "messageId": "string",
  "createdAt": "ISO8601"
}

Webhook: 
- Send email notification
- Trigger "ticket.updated" event
```

**PATCH /tickets/:id**
```
Request:
{
  "status": "in-progress | resolved | closed",
  "assignedTo": "user_id"
}

Response:
{
  "id": "string",
  "status": "string",
  "updatedAt": "ISO8601"
}

Webhook: Trigger "ticket.{status}" event
```

---

#### Portal Client Endpoints

**GET /portal/dashboard**
```
Response:
{
  "activeProjects": number,
  "totalSpent": number,
  "upcomingDeliverables": number,
  "openTickets": number,
  "recentProjects": [Order],
  "upcomingMilestones": [Milestone],
  "invoices": [Invoice]
}
```

**GET /portal/projects**
```
Query Parameters:
- status: "active | completed"

Response:
{
  "data": [Order],
  "total": number
}
```

**GET /portal/finance**
```
Response:
{
  "invoices": [Invoice],
  "totalSpent": number,
  "totalPending": number
}
```

**GET /portal/documents**
```
Response:
{
  "data": [Document],
  "grouped": { category: [Document] }
}
```

---

#### Admin Dashboard Endpoints

**GET /admin/dashboard**
```
Response:
{
  "totalRevenue": number,
  "activeDeals": number,
  "newLeads": number,
  "conversionRate": number,
  "leadsByStage": {
    new: number,
    qualified: number,
    proposal: number,
    won: number
  },
  "topServices": [{ service, count }],
  "teamPerformance": [{ name, dealsWon, revenue }]
}
```

**GET /admin/analytics**
```
Query Parameters:
- period: "today | week | month | year"
- metric: "revenue | leads | conversion | satisfaction"

Response:
{
  "data": [{ date, value }],
  "trend": "up | down",
  "percentageChange": number
}
```

---

### 2.4 Webhook Events & Real-Time Communication

#### Webhook Events (Sent from Backend to External Services)

**Lead Webhooks:**
```
- lead.created: When new lead added
- lead.updated: When lead stage changed
- lead.qualified: When lead moves to qualified stage
- lead.won: When deal closes
- lead.lost: When lead is marked as lost
```

**Order Webhooks:**
```
- order.created: When new project/order created
- order.started: When work begins
- milestone.completed: When milestone achieved
- order.completed: When project finishes
- order.updated: When any order field changes
```

**Invoice Webhooks:**
```
- invoice.created: When invoice drafted
- invoice.sent: When sent to client
- invoice.viewed: When client opens email
- invoice.paid: When payment received
- invoice.overdue: When due date passes
```

**Payment Webhooks (From Razorpay):**
```
- payment.authorized: Authorization success
- payment.failed: Payment failed
- payment.captured: Payment captured
- refund.created: Refund initiated
- refund.failed: Refund failed
```

**Ticket Webhooks:**
```
- ticket.created: New support ticket
- ticket.assigned: Ticket assigned to team
- ticket.updated: Message or status change
- ticket.resolved: Ticket resolved
- ticket.closed: Ticket closed
```

#### WebSocket Events (Real-Time Updates to Frontend)

**Connection:** `wss://api.unityconsult.com/socket.io`

**Events:**
```
// Admin receives
- lead:updated → Updated lead data
- order:milestone-completed → Milestone progress
- ticket:new-message → Chat messages
- invoice:paid → Payment received
- order:updated → Order status changed

// Client receives
- order:milestone-completed → Project progress
- ticket:new-message → Support chat
- invoice:paid → Payment confirmation
- document:uploaded → New deliverable ready
- message:from-team → Team communication
```

---

### 2.5 Authentication & Authorization (JWT + RBAC)

#### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin | client | staff",
  "iat": 1626048000,
  "exp": 1626134400,
  "permissions": ["read:leads", "write:leads", ...]
}

Signature: HMAC-SHA256(base64Header.base64Payload, SECRET_KEY)
```

#### Role-Based Access Control (RBAC)

**Admin Role Permissions:**
```
- read:all-data
- write:leads
- write:orders
- write:invoices
- write:users
- write:services
- read:analytics
- read:reports
```

**Client Role Permissions:**
```
- read:own-projects
- read:own-invoices
- read:own-documents
- create:support-tickets
- read:own-tickets
- upload:documents
```

**Staff Role Permissions:**
```
- read:leads
- write:leads (own assignments)
- read:orders
- write:orders (own assignments)
- read:clients
- create:invoices
- read:analytics
```

---

### 2.6 Environment Configuration

**.env File Structure**

```
# Node Environment
NODE_ENV=production
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unity_consult
MONGODB_DB_NAME=unity_consult
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=3600
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRATION=2592000

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# SendGrid Email
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@unityconsult.com
SENDGRID_TEMPLATE_ID_WELCOME=d-xxxxx
SENDGRID_TEMPLATE_ID_INVOICE=d-xxxxx
SENDGRID_TEMPLATE_ID_RESET=d-xxxxx

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_NUMBER=+1234567890

# AWS S3 (File Storage)
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET_NAME=unity-consult-files
AWS_S3_REGION=ap-south-1

# Google Analytics
GOOGLE_ANALYTICS_ID=G-xxxxxx

# Sentry (Error Tracking)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx

# Frontend URL (CORS)
FRONTEND_URL=https://www.unityconsult.com
PORTAL_URL=https://app.unityconsult.com
ADMIN_URL=https://admin.unityconsult.com

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx
```

---

## PHASE 3: FRONTEND-BACKEND INTEGRATION (80-100 HOURS)

### 3.1 API Client Setup (Frontend)

**File:** `src/lib/api-client.ts`

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Refresh token
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken }
        );
        localStorage.setItem('accessToken', data.token);
        return apiClient.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 3.2 State Management (Zustand Stores)

**File:** `src/store/auth.ts`

```typescript
import { create } from 'zustand';

interface AuthState {
  user: any | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  token: null,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      set({ user: response.data, token: response.data.token });
      localStorage.setItem('accessToken', response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      set({ loading: false });
    }
  },
  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem('accessToken');
  },
}));
```

---

### 3.3 Data Fetching Hooks (React Query)

**File:** `src/hooks/useLeads.ts`

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export const useLeads = (filters?: any) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const { data } = await apiClient.get('/leads', { params: filters });
      return data;
    },
  });
};

export const useCreateLead = () => {
  return useMutation({
    mutationFn: async (leadData) => {
      const { data } = await apiClient.post('/leads', leadData);
      return data;
    },
  });
};

export const useUpdateLead = () => {
  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data } = await apiClient.patch(`/leads/${id}`, updates);
      return data;
    },
  });
};
```

---

### 3.4 Form Handling & Validation

**File:** `src/components/Forms/BookingForm.tsx`

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const bookingSchema = z.object({
  serviceId: z.string().min(1, 'Service required'),
  businessName: z.string().min(2, 'Business name required'),
  industry: z.string().min(1, 'Industry required'),
  budget: z.string().min(1, 'Budget required'),
  timeline: z.string().min(1, 'Timeline required'),
});

export function BookingForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const createLead = useCreateLead();

  const onSubmit = async (data) => {
    try {
      await createLead.mutateAsync(data);
      // Success
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

---

### 3.5 Error Handling & Loading States

**File:** `src/components/Common/AsyncBoundary.tsx`

```typescript
export function AsyncBoundary({ 
  isLoading, 
  isError, 
  error, 
  children 
}) {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorAlert error={error} />;
  return children;
}
```

---

## PHASE 4: ADVANCED FEATURES & INTEGRATIONS (100-150 HOURS)

### 4.1 Payment Integration (Razorpay)

#### Payment Flow

```
1. Client clicks "Pay Now" on invoice
2. Frontend calls POST /payments/create-order
3. Backend creates Razorpay order
4. Frontend opens Razorpay checkout modal
5. Client enters payment details
6. Razorpay processes payment
7. Razorpay sends webhook to backend
8. Backend verifies and updates invoice
9. Frontend receives confirmation
10. Send email receipt to client
```

#### Frontend Implementation

**File:** `src/components/Payments/RazorpayCheckout.tsx`

```typescript
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayCheckout({ invoiceId, amount }) {
  const handlePayment = async () => {
    // 1. Create order on backend
    const orderResponse = await apiClient.post('/payments/create-order', {
      invoiceId,
      amount,
    });

    // 2. Initialize Razorpay
    const razorpay = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      order_id: orderResponse.data.razorpayOrderId,
      amount: amount * 100,
      currency: 'INR',
      handler: async (response) => {
        // 3. Verify on backend
        const verifyResponse = await apiClient.post('/payments/verify', response);
        
        if (verifyResponse.data.verified) {
          toast.success('Payment successful!');
          // Refresh invoice data
        }
      },
    });

    razorpay.open();
  };

  return (
    <button onClick={handlePayment} className="btn-primary">
      Pay Now ₹{amount}
    </button>
  );
}
```

---

### 4.2 Email Notifications (SendGrid)

#### Email Templates

**Invoice Email Template**
```
From: noreply@unityconsult.com
To: client@example.com
Subject: Invoice INV-001 Ready for Payment

Dear [Client Name],

Your invoice INV-001 is ready for payment.

Invoice Details:
- Amount: ₹[amount]
- Due Date: [date]
- Service: [service name]

[Pay Online Button → Link to payment]

View Full Invoice: [PDF Download Link]

Best regards,
Unity Consult
```

**SendGrid Integration**

**File:** `src/services/email.service.ts` (Backend)

```typescript
import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendInvoiceEmail(to: string, invoiceData: any) {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: process.env.SENDGRID_TEMPLATE_ID_INVOICE,
      dynamicTemplateData: {
        client_name: invoiceData.clientName,
        invoice_number: invoiceData.invoiceNumber,
        amount: invoiceData.amount,
        due_date: invoiceData.dueDate,
        payment_link: invoiceData.paymentLink,
      },
    });
  }

  async sendLeadConfirmationEmail(to: string, leadData: any) {
    await sgMail.send({
      to,
      from: process.env.SENDGRID_FROM_EMAIL,
      templateId: process.env.SENDGRID_TEMPLATE_ID_LEAD,
      dynamicTemplateData: {
        name: leadData.name,
        service: leadData.service,
        reference_id: leadData.referenceId,
      },
    });
  }
}
```

---

### 4.3 WhatsApp Integration (Twilio)

#### WhatsApp Message Templates

**New Lead Notification**
```
Hi [Name]!

Thank you for your interest in [Service].

Your reference ID: [ID]

We'll contact you within 24 hours to discuss your project.

🔗 View your booking: [Portal Link]
```

**Invoice Payment Reminder**
```
Hi [Name],

Invoice [INV-001] is due on [Date].

Amount: ₹[Amount]

💳 Pay Online: [Payment Link]

Questions? Reply to this message.
```

#### Twilio Integration

**File:** `src/services/whatsapp.service.ts` (Backend)

```typescript
import twilio from 'twilio';

export class WhatsAppService {
  private client: twilio.Twilio;

  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  async sendLeadNotification(phone: string, leadData: any) {
    await this.client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
      body: `Hi ${leadData.name}! Thank you for your interest in ${leadData.service}. Your reference ID: ${leadData.referenceId}. We'll contact you within 24 hours.`,
    });
  }

  async sendInvoiceReminder(phone: string, invoiceData: any) {
    await this.client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
      body: `Hi ${invoiceData.clientName}, Invoice ${invoiceData.invoiceNumber} is due on ${invoiceData.dueDate}. Amount: ₹${invoiceData.amount}. Pay Online: [Link]`,
    });
  }

  async sendTicketNotification(phone: string, ticketData: any) {
    await this.client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
      body: `Support Ticket ${ticketData.ticketNumber} has been created. We'll respond soon.`,
    });
  }
}
```

---

### 4.4 Real-Time Updates (WebSocket)

#### Socket.io Setup

**File:** `src/gateway/events.gateway.ts` (Backend)

```typescript
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connection', 'Successfully connected to the server');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('subscribe-leads')
  handleSubscribeLeads(client: Socket, data: any) {
    client.join('leads');
  }

  broadcastLeadUpdate(leadData: any) {
    this.server.to('leads').emit('lead:updated', leadData);
  }

  broadcastOrderMilestone(orderData: any) {
    this.server.to('orders').emit('milestone:completed', orderData);
  }

  broadcastTicketMessage(ticketData: any) {
    this.server.to(`ticket:${ticketData.ticketId}`).emit('message:new', ticketData);
  }
}
```

#### Frontend Socket Connection

**File:** `src/lib/socket.ts`

```typescript
import io from 'socket.io-client';

export const socket = io(process.env.NEXT_PUBLIC_API_URL, {
  auth: {
    token: localStorage.getItem('accessToken'),
  },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
});

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('subscribe-leads');
});

socket.on('lead:updated', (data) => {
  // Update UI with new lead data
});

socket.on('milestone:completed', (data) => {
  // Update project progress
});
```

---

### 4.5 Live Chat Integration (Crisp)

**File:** `src/components/ChatWidget.tsx`

```typescript
import { useEffect } from 'react';

export function ChatWidget() {
  useEffect(() => {
    // Initialize Crisp chat widget
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_ID;

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
    };
  }, []);

  return null;
}
```

---

### 4.6 Analytics Integration (Google Analytics 4)

**File:** `src/lib/ga.ts`

```typescript
export const pageview = (url: string) => {
  window.gtag?.config('G_MEASUREMENT_ID', {
    page_path: url,
  });
};

export const event = (action: string, category: string, label: string) => {
  window.gtag?.event(action, {
    event_category: category,
    event_label: label,
  });
};
```

#### Key Analytics Events

```
Conversions:
- booking:started (Step 1 of booking wizard)
- booking:completed (Lead captured)
- payment:initiated (Payment started)
- payment:completed (Payment success)

Engagement:
- page:viewed
- service:viewed
- portfolio:viewed
- blog:read
- contact:form:submitted

Support:
- ticket:created
- support:message:sent
- chat:initiated
```

---

### 4.7 Admin Panel Features

#### Service Management (`/admin/services`)

```
Features:
- Create/Edit/Delete services
- Update pricing
- Manage delivery times
- Add outcomes and workflows
- Set booking fields
- Track service performance (revenue, count)
```

#### Content Management (`/admin/content`)

```
Features:
- Edit homepage sections
- Manage portfolio projects
- Create/edit blog posts
- Update FAQ
- Manage testimonials
- SEO metadata editing
```

#### Finance Dashboard (`/admin/finance`)

```
Features:
- Revenue charts by service
- Invoice tracking
- Payment reconciliation
- Expense management
- Tax calculation
- Financial reports export
```

#### Team Management (`/admin/team`)

```
Features:
- Add/remove team members
- Assign roles and permissions
- Track individual performance
- Manage work assignments
- Team calendar
```

---

## USER INTERFACE SPECIFICATION

### 4.8 Component Design Library

#### Button Component

**Variants:**
1. **Primary** - Blue (#3B82F6) background, white text
2. **Secondary** - Transparent, blue border and text
3. **Ghost** - Minimal, underline on hover
4. **Danger** - Red background (#DC2626)
5. **Success** - Green background (#059669)

**Sizes:**
- Small: 12px font, 8px padding
- Medium: 15px font, 12px padding (default)
- Large: 18px font, 16px padding

**States:**
- Normal
- Hover (scale 1.03, shadow)
- Active (scale 0.98)
- Disabled (opacity 0.5, cursor not-allowed)
- Loading (spinner icon)

---

#### Card Component

```
Structure:
┌──────────────────────────┐
│ Card Header (optional)   │
│ ┌──────────────────────┐ │
│ │ Content Area         │ │
│ │                      │ │
│ │                      │ │
│ └──────────────────────┘ │
│ Card Footer (optional)   │
└──────────────────────────┘

Styling:
- Glass panel: rgba(255,255,255,0.04) + blur(12px)
- Border: 1px solid rgba(255,255,255,0.06)
- Border-radius: 12px
- Padding: 24px
- Box-shadow: elevation-1

Hover State:
- Background: rgba(255,255,255,0.06)
- Transition: 200ms cubic-bezier
```

---

#### Modal Component

```
Structure:
┌─────────────────────────────────────┐
│ [X] Modal Title                     │
├─────────────────────────────────────┤
│ Modal Content                       │
│                                     │
├─────────────────────────────────────┤
│ [Cancel] [Action Button]            │
└─────────────────────────────────────┘

Features:
- Backdrop blur
- Smooth entrance animation (scale + fade)
- Trap focus inside modal
- Close on Escape key
- Close on backdrop click (optional)
```

---

#### Form Input Component

```
Structure:
┌─────────────────────────┐
│ Label                   │
├─────────────────────────┤
│ [Input field]           │
│ Helper text             │
│ Error message (if any)  │
└─────────────────────────┘

Variations:
- Text input
- Email input
- Phone number (with formatting)
- Textarea
- Dropdown select
- Multi-select
- Radio buttons
- Checkboxes
- Date picker
- Time picker
- File upload
- Combobox (searchable select)

Styling:
- Border: 1px solid #E2E8F0
- Border-radius: 8px
- Padding: 12px
- Focus: border-color #3B82F6, box-shadow: 0 0 0 3px rgba(59,130,246,0.1)
```

---

#### Notification/Toast Component

```
Variants:
1. Success (Green background)
   "✓ Action completed successfully"

2. Error (Red background)
   "✕ Something went wrong. Please try again"

3. Warning (Amber background)
   "⚠ Please review before proceeding"

4. Info (Blue background)
   "ℹ New updates available"

Auto-dismiss: 4 seconds
Position: Top-right corner
Animation: Slide in from right + fade out
```

---

#### Data Table Component

```
Features:
- Sortable columns (click header)
- Pagination (10/25/50 items per page)
- Row selection (checkboxes)
- Row actions (edit, delete, view)
- Search/filter across columns
- Column visibility toggle
- Export to CSV
- Responsive (horizontal scroll on mobile)

Columns:
- Checkbox (multi-select)
- Data columns
- Actions column (3-dot menu)
```

---

#### Dashboard KPI Card

```
┌──────────────────────────┐
│ Metric Name              │
│                          │
│ 42                       │
│ ↑ 12% from last month    │
│                          │
│ Breakdown (optional):    │
│ • Category A: 28         │
│ • Category B: 14         │
└──────────────────────────┘

Colors by trend:
- Up: Green (#059669)
- Down: Red (#DC2626)
- Neutral: Gray (#64748B)
```

---

## PAYMENT FLOW DETAIL

### 4.9 Payment User Journey

**Step 1: Invoice Generation**
- Order completed → Invoice auto-generated
- Invoice marked as "draft"
- Admin reviews and sends

**Step 2: Invoice Sent to Client**
- Email sent with invoice PDF + payment link
- Invoice status → "sent"
- Client receives email notification + WhatsApp notification

**Step 3: Client Views Invoice**
- Client clicks email link → Opens portal
- Portal shows invoice with [Pay Now] button
- Invoice status → "viewed"

**Step 4: Initiate Payment**
- Client clicks [Pay Now]
- Frontend calls backend: `POST /payments/create-order`
- Backend creates Razorpay order
- Returns `razorpayOrderId` to frontend

**Step 5: Razorpay Checkout**
- Frontend loads Razorpay checkout modal
- Client enters payment details
- Razorpay processes payment
- Success/failure response to frontend

**Step 6: Verify Payment**
- Frontend receives payment response
- Calls backend: `POST /payments/verify`
- Backend verifies signature with Razorpay
- If valid, updates invoice status → "paid"

**Step 7: Post-Payment Notifications**
- Email receipt sent to client
- WhatsApp confirmation sent
- Webhook triggers for internal systems
- Portal dashboard shows payment confirmed

**Step 8: Reconciliation**
- Admin sees invoice marked as paid
- Order amountPaid updated
- Finance reports updated
- Client finance dashboard updated

---

## WEBHOOK ARCHITECTURE

### 4.10 Webhook Event Mapping

#### Incoming Webhooks (From External Services)

**Razorpay Webhooks**
```
Event: payment.captured
└─→ Handler: onPaymentCaptured()
    ├─ Verify signature
    ├─ Find invoice by razorpayOrderId
    ├─ Update invoice status → paid
    ├─ Update order amountPaid
    ├─ Send email receipt
    ├─ Send WhatsApp confirmation
    └─ Emit socket event to admin

Event: payment.failed
└─→ Handler: onPaymentFailed()
    ├─ Find invoice
    ├─ Update payment status → failed
    ├─ Notify client via email/WhatsApp
    └─ Alert support team

Event: refund.created
└─→ Handler: onRefundCreated()
    ├─ Update payment status → refunded
    ├─ Revert invoice to pending
    ├─ Log refund transaction
    └─ Notify client
```

#### Outgoing Webhooks (From Unity Consult)

```
Event: lead.created
Sent to: Zapier, Make.com (if configured)
Data: { leadId, name, email, service, budget, source }

Event: order.created
Sent to: Zapier, Google Sheets (if configured)
Data: { orderId, clientName, service, startDate, budget }

Event: invoice.paid
Sent to: Accounting software (if connected)
Data: { invoiceId, amount, paymentDate }

Event: ticket.created
Sent to: Support systems (if connected)
Data: { ticketId, subject, priority, createdAt }
```

---

## DEPLOYMENT & DEVOPS

### 4.11 Deployment Architecture

#### Frontend Deployment (Vercel)

```
Trigger: Git push to main branch
├─ GitHub Actions workflow starts
├─ Runs tests
├─ Builds Next.js project
├─ Deploys to Vercel
└─ Automatic DNS routing to subdomain

Sites:
- www.unityconsult.com (Public)
- app.unityconsult.com (Client Portal)
- admin.unityconsult.com (Admin CRM)

Environment Variables:
- NEXT_PUBLIC_API_URL
- NEXT_PUBLIC_RAZORPAY_KEY
- NEXT_PUBLIC_CRISP_ID
- NEXT_PUBLIC_GA_ID
```

#### Backend Deployment (DigitalOcean / AWS)

```
Option 1: DigitalOcean App Platform
├─ Docker container deployed
├─ Auto-scaling enabled
├─ Environment variables configured
└─ Domain: api.unityconsult.com

Option 2: AWS EC2 + ECS
├─ Docker image to ECR
├─ ECS task definition
├─ Auto-scaling group
├─ Load balancer
└─ CloudFront CDN

Process:
1. Git push to backend repo
2. GitHub Actions builds Docker image
3. Push to registry (ECR/Docker Hub)
4. Deploy to hosting platform
5. Health checks verify deployment
6. Swap traffic to new version
```

---

### 4.12 CI/CD Pipeline

**.github/workflows/deploy.yml**

```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  build-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/next.js-action@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  build-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: docker build -t api:${{ github.sha }} .
      - run: docker push api:${{ github.sha }}
      - run: |
          curl -X POST ${{ secrets.DEPLOYMENT_WEBHOOK }} \
            -H "Content-Type: application/json" \
            -d "{\"image\": \"api:${{ github.sha }}\"}"
```

---

## SECURITY SPECIFICATIONS

### 4.13 Security Measures

#### Frontend Security
```
- HTTPS only (enforced via HSTS header)
- CSP (Content Security Policy) headers
- XSS protection
- CSRF token validation
- Secure cookies (httpOnly, Secure, SameSite)
- Input sanitization
- Output encoding
```

#### Backend Security
```
- JWT signature verification
- Rate limiting per IP (100 req/min)
- Rate limiting per user (1000 req/hour)
- CORS whitelist configuration
- SQL injection prevention (Mongoose)
- Password hashing (bcrypt, salt rounds: 12)
- Secure password reset with time-limited tokens
- API key rotation
- Webhook signature verification
- SSL/TLS certificate (auto-renewal with Let's Encrypt)
```

#### Database Security
```
- MongoDB encryption at rest
- Network access restricted to backend
- Connection pooling with SSL
- Backup encryption
- Read replicas for redundancy
- Index optimization
```

#### Third-Party API Security
```
- Razorpay: Signature verification on every webhook
- SendGrid: API key stored in environment variables
- Twilio: Phone number validation before SMS/WhatsApp
- AWS S3: Signed URLs with 1-hour expiration
- Google Analytics: Data anonymization enabled
```

---

## MONITORING & LOGGING

### 4.14 Monitoring Stack

#### Application Monitoring
```
Tool: Sentry
Events tracked:
- Exceptions and errors
- Performance issues
- Slow API calls
- Database query performance
- Memory leaks
```

#### Uptime Monitoring
```
Tool: Uptimerobot or Healthchecks.io
Checks:
- www.unityconsult.com every 5 minutes
- app.unityconsult.com every 5 minutes
- admin.unityconsult.com every 5 minutes
- api.unityconsult.com every 5 minutes
- Database connectivity every 10 minutes

Alert channels:
- Email
- Slack
- SMS (for critical failures)
```

#### Performance Monitoring
```
Tool: Vercel Analytics, New Relic
Metrics:
- Page load time
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)
- API response times
- Database query times
- Redis cache hit rate
```

#### Log Aggregation
```
Tool: Vercel Logs (frontend), ELK Stack or CloudWatch (backend)
Events logged:
- API requests/responses
- Authentication events
- Payment transactions
- Email sending
- WhatsApp messages
- Database queries (slow queries > 1s)
- Error stack traces
```

---

## PROJECT TIMELINE

### Phase 1: Frontend (40-60 hours) ✅ COMPLETE

**Week 1-2:**
- Project setup, design system
- Component architecture
- Route structure
- Basic pages (homepage, services, about)

**Week 3:**
- Portal and admin scaffolding
- Forms and booking wizard
- Responsive design
- Mobile navigation

### Phase 2: Backend & Database (120-160 hours) ⏳ PLANNED

**Week 4-6:**
- NestJS project setup
- Database schema design
- API endpoints
- JWT authentication
- User management

**Week 7-8:**
- Lead management APIs
- Order management APIs
- Invoice generation
- Document handling

**Week 9:**
- Razorpay integration
- SendGrid setup
- Webhook handlers
- Testing

### Phase 3: Frontend-Backend Integration (80-100 hours) ⏳ PLANNED

**Week 10-11:**
- API client setup
- State management
- Data fetching hooks
- Authentication flow
- Form integration

**Week 12:**
- Error handling
- Loading states
- Real-time updates (WebSocket)
- Analytics tracking

### Phase 4: Advanced Features (100-150 hours) ⏳ PLANNED

**Week 13-14:**
- WhatsApp integration
- Email templates
- Admin panels
- Finance dashboard
- Live chat

**Week 15-16:**
- Performance optimization
- Security hardening
- Load testing
- SEO optimization
- Documentation

**Week 17:**
- Staging environment testing
- UAT (User Acceptance Testing)
- Bug fixes
- Pre-launch review

**Week 18:**
- Production deployment
- Launch day support
- Monitoring setup
- Post-launch optimization

---

## LAUNCH READINESS CHECKLIST

### Pre-Launch

- [ ] All routes tested (manual + automated)
- [ ] Mobile responsiveness verified (all devices)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance audit (Lighthouse > 90)
- [ ] SEO audit (meta tags, schema, sitemap)
- [ ] Security scan (no exposed secrets, proper headers)
- [ ] All APIs documented (Swagger/Postman)
- [ ] Error handling tested (all edge cases)
- [ ] Load testing passed (target: 10k concurrent users)
- [ ] Database backups automated
- [ ] Monitoring & alerts configured
- [ ] Disaster recovery plan documented
- [ ] Terms of Service & Privacy Policy finalized
- [ ] Support email configured
- [ ] Payment processor tested (sandbox → production)
- [ ] Email templates tested
- [ ] WhatsApp integration tested
- [ ] Third-party integrations verified
- [ ] SSL certificate installed
- [ ] DNS records configured
- [ ] CDN configured
- [ ] Analytics tracking verified
- [ ] Legal compliance checked (GDPR, privacy laws)
- [ ] Data protection measures verified
- [ ] Team training completed
- [ ] Runbook prepared for production support

### Go-Live Procedure

```
Time: Friday 9 AM (Low traffic period)

1. Final backup of database (T-1 hour)
2. Deploy to staging, run all tests
3. Deploy to production
4. Verify all subdomains accessible
5. Run smoke tests on key flows
6. Monitor error tracking (Sentry)
7. Monitor uptime (Uptimerobot)
8. Monitor performance (Vercel Analytics)
9. Enable full logging
10. Have team on standby for 24 hours
11. Post-launch review meeting
```

---

## SUPPORT & MAINTENANCE

### 4.15 Post-Launch Activities

**Week 1 (Launch Week)**
- 24/7 monitoring
- Daily standup for any issues
- Performance optimization
- Bug fixes
- User feedback collection

**Week 2-4 (First Month)**
- Weekly performance reviews
- Feature usage analytics
- User feedback implementation
- Database optimization
- Cache optimization

**Ongoing (Monthly)**
- Security updates for dependencies
- Performance monitoring
- Feature enhancements
- User support
- Documentation updates

---

## DOCUMENTATION & TRAINING

### 4.16 Knowledge Base

**Technical Documentation**
- API documentation (Swagger)
- Database schema documentation
- Architecture diagrams
- Deployment procedures
- Troubleshooting guide
- Performance tuning guide

**User Documentation**
## SUMMARY & QUICK REFERENCE

| Phase | Duration | Tasks | Status |
|-------|----------|-------|--------|
| Phase 1 | 40-60 hrs | Frontend scaffold, UI, routing | ✅ COMPLETE |
| Phase 2 | 120-160 hrs | Backend, database, APIs | ⏳ PLANNED |
| Phase 3 | 80-100 hrs | Integration, forms, state mgmt | ⏳ PLANNED |
| Phase 4 | 100-150 hrs | Payments, emails, WebSocket, admin | ⏳ PLANNED |
| **Total** | **340-470 hrs** | **Complete platform** | **8-12 weeks** |

---

## KEY RESOURCES CREATED

| Document | Purpose | Status |
|----------|---------|--------|
| PLACEHOLDER_MAPPING.md | Placeholder tracking | ✅ Complete |
| PRD_IMPLEMENTATION_CHECKLIST.md | PRD compliance tracking | ✅ Complete |
| PROJECT_SUMMARY.md | Project overview | ✅ Complete |
| IMPLEMENTATION_PLAN.md | This document - Complete implementation guide | ✅ Complete |

---

**Next Step:** Begin Phase 2 backend development when approved.  
**Questions?** Refer to SETUP.md for project structure or PRD for business requirements.  
**Contact:** Development team or project manager

**Document Version:** 1.0  
**Last Updated:** May 19, 2026  
**Prepared By:** Development Team
