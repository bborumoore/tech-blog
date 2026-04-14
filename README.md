# Tech Blog
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A secure MVC tech blog/CMS built with Express, Sequelize, Handlebars, and session auth.

## Features
- Public homepage with recent posts.
- User signup/login/logout with server-side sessions.
- Authenticated dashboard to create, edit, and delete your own posts.
- Commenting on posts for authenticated users.
- CSRF protection on state-changing requests.
- Rate-limiting and security headers via Helmet.

## Tech Stack
- Node.js + Express
- Sequelize ORM
- MySQL (default) or SQLite (supported for test/dev workflows)
- express-session + connect-session-sequelize
- express-handlebars
- Jest + Supertest (integration tests)

## Setup
1. Clone and install:
   ```bash
   npm install
   ```
2. Copy env template and configure:
   ```bash
   cp .env.EXAMPLE .env
   ```
3. For MySQL local dev, create the DB:
   ```bash
   mysql -u <user> -p < db/schema.sql
   ```
4. Run migrations and optional seed data:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```
5. Start the app:
   ```bash
   npm start
   ```

## Environment Variables
See `.env.EXAMPLE` for full values. Core variables:
- `SESSION_SECRET` (required in production)
- `DB_DIALECT` (`mysql` or `sqlite`)
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` (MySQL)
- `DB_STORAGE` (SQLite file path or `:memory:`)
- `JAWSDB_URL` (optional hosted MySQL connection URL)

## Available Scripts
- `npm start` - start app
- `npm run dev` - start app in development mode
- `npm test` - run Jest integration tests in SQLite memory DB
- `npm run db:migrate` - apply migrations
- `npm run db:migrate:undo` - roll back migrations
- `npm run db:seed` - run seeders
- `npm run db:reset` - full migration reset + seed
- `npm run db:migrate:test` - apply migrations in sqlite test DB
- `npm run db:migrate:undo:test` - roll back sqlite test DB migrations
- `npm run db:seed:test` - seed sqlite test DB
- `npm run db:reset:test` - reset + seed sqlite test DB
- `npm run db:migrate:test` - apply migrations for local SQLite test DB (`./db/test.sqlite`)
- `npm run db:seed:test` - run seeders for local SQLite test DB (`./db/test.sqlite`)
- `npm run db:reset:test` - reset SQLite test DB lifecycle

## Security Notes
- Session secrets and DB credentials are environment-driven.
- Session cookies are hardened (`httpOnly`, `sameSite`, secure in production).
- CSRF token is required for mutating routes.
- Rate-limits are applied globally and to API/auth paths.

## Contribution
Issues and PRs are welcome.

## License
MIT
