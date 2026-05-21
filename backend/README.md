# Unity Consult API

Phase 2 backend foundation for Unity Consult.

## What Exists

- Nest-style backend structure under `src/`
- MongoDB connection through Mongoose
- User schema
- Lead schema
- Order schema
- Auth module with:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`
  - `GET /api/v1/auth/me`
- Health route:
  - `GET /api/v1/health`

## Environment Setup

1. Copy `.env.example` to `.env`
2. Replace secrets with strong real values
3. Point `MONGODB_URI` to a running MongoDB instance

## Install

```bash
npm install
```

## Development

```bash
npm run start:dev
```

Default backend port:

```text
http://127.0.0.1:4000
```

## Build Checks

```bash
npm run build
npm run typecheck
npm run lint
```

## Notes

- Refresh token support is wired through an httpOnly cookie
- Access token support is wired through bearer auth
- The current backend is the proper starting point for:
  - RBAC expansion
  - lead/order APIs
  - invoice/payment modules
  - document handling
  - real portal/admin integration
