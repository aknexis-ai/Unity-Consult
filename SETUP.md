# Unity Consult Setup Guide

This guide is intentionally detailed. Follow it from top to bottom when setting up the project on a new laptop.

## 1. What This Project Is

Unity Consult is a full-stack web application built from the Unity Consult PRD v7.

It has three parts:

- Public website: visitors read services, view content, submit contact forms, and book services.
- Client portal: clients log in to see projects, documents, invoices, payments, messages, support, and settings.
- Admin CRM: Unity Consult admin/staff users log in to manage leads, orders, services, content, finance, team, support, tickets, audit logs, and analytics.

It also has a backend API:

- Backend framework: NestJS with Fastify.
- Database: MongoDB Atlas.
- Frontend framework: Next.js.
- Authentication: JWT access tokens plus refresh cookies.
- Provider integrations: Razorpay, Resend, Twilio WhatsApp, Redis, Socket.io.

## 2. What You Need Before Starting

Install these first:

- Node.js 20 or newer.
- npm.
- Git.
- A code editor such as VS Code.
- MongoDB Atlas account.

Optional but needed for full production testing:

- Redis or Upstash account.
- Razorpay account.
- Resend account.
- Twilio account with WhatsApp sender.
- GitHub account.

Check Node and npm:

```bash
node -v
npm -v
```

If these commands do not work, install Node.js from `https://nodejs.org/`.

## 3. Download From GitHub

If the repository already exists on GitHub:

```bash
git clone YOUR_PRIVATE_REPOSITORY_URL
cd "unity consult"
```

If you receive the project as a ZIP:

1. Extract the ZIP.
2. Open the extracted folder.
3. Open a terminal inside the project root.
4. Confirm you can see `package.json`, `frontend`, and `backend`.

The project root is the folder that contains:

```text
package.json
frontend/
backend/
scripts/
README.md
SETUP.md
PLACEHOLDER_MAPPING.md
```

## 4. Install Packages

From the project root, run:

```bash
npm install
```

This installs packages for:

- root workspace
- frontend workspace
- backend workspace

Do not manually install packages inside random folders unless a maintainer asks you to.

## 5. Create Environment Files

Real `.env` files are not committed to GitHub. You must create them locally.

Backend:

```bash
copy backend\.env.example backend\.env
```

Frontend:

```bash
copy frontend\.env.example frontend\.env
```

On macOS/Linux, use:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

## 6. Backend Environment Variables

Open `backend/.env`.

Minimum local backend setup:

```env
NODE_ENV=development
PORT=4000
APP_ORIGIN=http://127.0.0.1:3000
API_PREFIX=api/v1
ENABLE_SWAGGER=true
SWAGGER_PATH=api/v1/docs
THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=120

MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/unity-consult

JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

Provider keys:

```env
REDIS_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RESEND_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
```

For local development, MongoDB must be real. Redis, Razorpay, Resend, and Twilio can stay empty until the company provides keys. Related provider actions will show setup errors until keys are added.

## 7. Frontend Environment Variables

Open `frontend/.env`.

Use:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:4000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://127.0.0.1:4000
NEXT_PUBLIC_RAZORPAY_KEY_ID=
```

Add `NEXT_PUBLIC_RAZORPAY_KEY_ID` after Razorpay keys are available.

## 8. How To Get MongoDB Atlas Credentials

1. Go to `https://www.mongodb.com/atlas`.
2. Create an account or sign in.
3. Create a project.
4. Create a free or paid cluster.
5. Go to `Database Access`.
6. Create a database user.
7. Save the username and password.
8. Go to `Network Access`.
9. Add your current IP address.
10. For temporary development only, `0.0.0.0/0` allows access from anywhere. Use carefully.
11. Go to `Database`.
12. Click `Connect`.
13. Choose `Drivers`.
14. Copy the connection string.
15. Replace username and password.
16. Paste it into `backend/.env` as `MONGODB_URI`.

Example shape:

```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/unity-consult?retryWrites=true&w=majority
```

If connection fails on Windows, test the Atlas port:

```powershell
Test-NetConnection YOUR_ATLAS_SHARD_HOST -Port 27017
```

You want:

```text
TcpTestSucceeded : True
```

## 9. How To Get Redis Credentials

Option A: Upstash

1. Go to `https://upstash.com/`.
2. Create an account.
3. Create a Redis database.
4. Copy the Redis URL.
5. Paste it into `backend/.env`:

```env
REDIS_URL=redis://...
```

Option B: Self-hosted Redis

1. Start Redis on your server.
2. Copy the connection URL.
3. Paste it into `REDIS_URL`.

## 10. How To Get Razorpay Keys

1. Go to `https://dashboard.razorpay.com/`.
2. Sign in.
3. Use test mode first.
4. Go to account settings or developer/API keys.
5. Generate a key pair.
6. Add backend keys:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
```

7. Add frontend public key:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

8. Create a webhook in Razorpay after backend is deployed.
9. Webhook URL:

```text
https://YOUR_API_DOMAIN/api/v1/payments/webhook
```

10. Copy the webhook secret:

```env
RAZORPAY_WEBHOOK_SECRET=xxxxx
```

Test these before production:

- order creation
- payment success
- payment failure
- webhook signature verification
- refund flow

## 11. How To Get Resend Key

1. Go to `https://resend.com/`.
2. Create an account.
3. Verify the company sending domain.
4. Create an API key.
5. Add it to `backend/.env`:

```env
RESEND_API_KEY=re_xxxxx
```

6. Replace the sender placeholder in `backend/src/modules/notifications/notifications.service.ts` after the company confirms the sender email.

## 12. How To Get Twilio WhatsApp Keys

1. Go to `https://www.twilio.com/`.
2. Create an account.
3. Open the Twilio Console.
4. Copy Account SID.
5. Copy Auth Token.
6. Configure WhatsApp Sandbox or approved WhatsApp sender.
7. Add:

```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
```

Use the real approved sender in production.

## 13. Run Provider Check

Run:

```bash
npm run backend:providers
```

Expected before all company keys:

- MongoDB Atlas: configured.
- Redis: missing until key is added.
- Razorpay: missing until keys are added.
- Resend: missing until key is added.
- Twilio WhatsApp: missing until keys are added.

This is okay during development.

## 14. Seed Demo Data

After MongoDB Atlas works:

```bash
npm run backend:seed
```

This creates demo data:

- users
- leads
- orders
- projects
- invoices
- payments-related records
- documents
- tickets
- messages
- team members
- content
- service catalog

Demo login:

```text
Admin: admin@unityconsult.local
Staff: staff@unityconsult.local
Client: client@unityconsult.local
Password: Unity@12345
```

Staff login opens Admin CRM. That is correct because the PRD defines Admin CRM as the staff operations command center.

## 15. Delete Demo Seed Data

Use this only when you are ready to clean the demo database.

Option A: easiest from MongoDB Atlas UI

1. Open MongoDB Atlas.
2. Go to your cluster.
3. Click `Browse Collections`.
4. Select the `unity-consult` database.
5. Delete demo collections or delete only demo documents.
6. Keep production users/data if already created.

Option B: MongoDB shell

Use this only if you know you are connected to the correct database:

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

Safer production approach:

1. Create a fresh production database.
2. Put the production database name in `MONGODB_URI`.
3. Do not run the seed script in production.

## 16. Start Development Servers

Run both backend and frontend:

```bash
npm run dev
```

This starts:

- Backend: `http://127.0.0.1:4000`
- Frontend: `http://127.0.0.1:3000`

Run separately:

```bash
npm run backend:dev
npm run frontend:dev
```

If port `4000` is already used:

1. Close the existing backend terminal, or
2. Find and stop the process using port 4000, or
3. Change `PORT` in `backend/.env`.

## 17. Production Build

Build both apps:

```bash
npm run build
```

Start built production servers:

```bash
npm start
```

Production environment changes:

- `NODE_ENV=production`
- `APP_ORIGIN=https://YOUR_FRONTEND_DOMAIN`
- `NEXT_PUBLIC_API_URL=https://YOUR_API_DOMAIN/api/v1`
- `NEXT_PUBLIC_SOCKET_URL=https://YOUR_API_DOMAIN`
- `ENABLE_SWAGGER=false` unless the team wants docs public/protected.

## 18. Verification Commands

Full check:

```bash
npm run verify
```

This runs:

- backend lint
- frontend lint
- backend typecheck
- backend build
- backend unit tests
- backend e2e tests
- frontend production build

API smoke check:

```bash
npm run smoke:api
```

Provider check:

```bash
npm run backend:providers
```

Final local result on May 21, 2026:

- `npm run verify`: passed.
- `npm run smoke:api`: passed 31 checks.
- `npm run frontend:build`: generated 60 routes.

## 19. Manual Workflow Checklist

Public:

- Open `/`.
- Open `/services`.
- Open each service detail page.
- Open `/plans`.
- Open `/location/bangalore`.
- Open `/book` and create a booking.
- Open `/contact` and create a lead.

Client:

- Login as `client@unityconsult.local`.
- Open `/portal`.
- Check projects.
- Upload/download documents.
- Check invoices.
- Check payments page.
- Send a message.
- Create support ticket.
- Update settings.

Admin/staff:

- Login as `admin@unityconsult.local` or `staff@unityconsult.local`.
- Open `/admin`.
- Move leads in Kanban on desktop.
- Use mobile `Move stage` dropdown on phone size.
- Check orders.
- Edit services.
- Edit content.
- Check finance.
- Check team.
- Check support/tickets.
- Check audit logs.

Mobile:

- Header should be compact and sticky.
- Hamburger opens an overlay menu.
- Selecting a menu item closes the menu.
- Tables should become vertical cards.
- No horizontal scrolling should be needed.

## 20. API Route Groups

Main API groups:

- `GET /api/v1/health`
- `GET /api/v1/health/providers`
- `/api/v1/auth/*`
- `/api/v1/users`
- `/api/v1/bookings`
- `/api/v1/leads`
- `/api/v1/orders`
- `/api/v1/projects`
- `/api/v1/invoices`
- `/api/v1/payments`
- `/api/v1/documents`
- `/api/v1/tickets`
- `/api/v1/messages`
- `/api/v1/team`
- `/api/v1/settings`
- `/api/v1/content`
- `/api/v1/services`
- `/api/v1/analytics`
- `/api/v1/notifications`
- `/api/v1/audit`
- `/api/v1/graphql`

Swagger is available locally at:

```text
http://127.0.0.1:4000/api/v1/docs
```

Only when:

```env
ENABLE_SWAGGER=true
```

## 21. GitHub Private Repository Handoff

This local folder is not currently initialized as a Git repository. To push it privately:

1. Open GitHub.
2. Click `New repository`.
3. Choose repository name, for example `unity-consult`.
4. Select `Private`.
5. Do not add README/gitignore/license on GitHub because this project already has them.
6. Create repository.
7. In this project root, run:

```bash
git init
git add .
git status
git commit -m "Initial Unity Consult PRD implementation"
git branch -M main
git remote add origin YOUR_PRIVATE_REPOSITORY_URL
git push -u origin main
```

Before `git commit`, check that these are not staged:

- `backend/.env`
- `frontend/.env`
- `.env`
- `node_modules`
- `.next`
- `backend/dist`
- logs
- uploaded files

The `.gitignore` is configured to exclude them.

## 22. Give Team Leader Access

In GitHub:

1. Open the private repository.
2. Go to `Settings`.
3. Go to `Collaborators and teams`.
4. Click `Add people`.
5. Enter team leader GitHub username or email.
6. Choose permission:
   - `Read` if they only need to clone/review.
   - `Write` if they need to push changes.
   - `Admin` only if they should manage repository settings.
7. Send invitation.

The team leader can clone using:

```bash
git clone YOUR_PRIVATE_REPOSITORY_URL
```

## 23. What Not To Push

Never push:

- API keys.
- Real database passwords.
- `backend/.env`.
- `frontend/.env`.
- `node_modules`.
- build output.
- uploaded client documents.
- local logs.

Only push `.env.example` files.

## 24. If Something Breaks

Backend cannot start:

- Check `backend/.env`.
- Check `MONGODB_URI`.
- Check Atlas IP whitelist.
- Check port 4000.
- Run `npm run backend:providers`.

Frontend login says network error:

- Confirm backend is running on port 4000.
- Open `http://127.0.0.1:4000/api/v1/health`.
- Check `NEXT_PUBLIC_API_URL`.
- Check backend `APP_ORIGIN`.

Settings update blocked by CORS:

- Confirm `APP_ORIGIN=http://127.0.0.1:3000` locally.
- Restart backend after changing `.env`.

Razorpay action fails:

- Add Razorpay keys.
- Add frontend public Razorpay key.
- Configure webhook.
- Restart backend/frontend.

Email/WhatsApp fails:

- Add Resend/Twilio keys.
- Verify sender/domain.
- Restart backend.

## 25. Final Handoff Commands

Run before sending to manager:

```bash
npm run verify
npm run smoke:api
npm run backend:providers
git status
```

Expected before real provider keys:

- Verify passes.
- Smoke passes.
- MongoDB configured.
- Redis/Razorpay/Resend/Twilio may show missing until team leader adds keys.
