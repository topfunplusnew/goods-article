# Good Papers

Next.js replica of the current `ai4e-site` project in `/Users/zhangming/Code/Projects/ai4edu/ai4e-site`.

## Scope

- Public site routes
- Admin route tree
- Route handlers and metadata routes
- Internationalization dictionaries
- Theme-driven styling
- Source route and endpoint inventory
- Replica guidance skill

## Constraints

- No magic values in feature code
- No fallback logic in feature contracts
- No generic wrapper transport layer
- No guessed backend fields
- Current on-disk `ai4e-site` is the behavior source of truth

## Tech Stack

- Next.js 16 App Router
- Next Route Handlers for the local API backend
- React 19
- TypeScript
- Tailwind CSS 4
- SQLite via Node's built-in `node:sqlite`
- `tsx --test` for unit-style tests
- Playwright for browser verification

## Directory Structure

```text
app/
  (public)/
  (admin)/
  api/
src/
  config/
  features/
  i18n/
  shared/
docs/
  source-inventory/
  superpowers/
tests/
skills/
```

## Route Mapping

### Public

- `/`
- `/article`
- `/article/search`
- `/article/[id]`
- `/issue` -> redirect to `/all-issues`
- `/issue/[id]`
- `/all-issues`
- `/authors`
- `/author/articles`
- `/about`
- `/about/[...slug]`
- `/publish`
- `/publish/[id]`
- `/login`
- `/user/me`

### Admin

- `/admin`
- `/admin/login`
- `/admin/account`
- `/admin/articles`
- `/admin/articles/new`
- `/admin/articles/[id]/edit`
- `/admin/issues`
- `/admin/issues/new`
- `/admin/issues/[id]/edit`
- `/admin/volumes`
- `/admin/journal`
- `/admin/about`
- `/admin/about/new`
- `/admin/about/[slug]`
- `/admin/about/custom/[id]`
- `/admin/publish`
- `/admin/publish/new`
- `/admin/publish/[slug]`
- `/admin/publish/custom/[id]`
- `/admin/publishing`
- `/admin/publishing/new`
- `/admin/publishing/[slug]`
- `/admin/publishing/custom/[id]`
- `/admin/deploy`

## Environment Variables

Required variables for the local full-stack app:

```bash
BACKEND_ORIGIN=http://127.0.0.1:3000
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3000
NEXT_PUBLIC_API_BASE_URL=/api/v1
INTERNAL_API_BASE_URL=http://127.0.0.1:3000/api/v1
NEXT_PUBLIC_LOCALE_TRANSLATE=true
LOCALE_TRANSLATION_PROVIDER=google_gtx
```

Optional variables:

```bash
DEEPL_AUTH_KEY=
DEEPL_API_URL=https://api-free.deepl.com
GOOGLE_TRANSLATE_API_KEY=
```

Use `.env.local` for machine-local values. `.env.example` documents the expected keys.

## Theme Configuration

Theme tokens live in [theme.ts](/Users/zhangming/Code/Projects/good-papers/src/config/theme.ts).

Change colors, typography, radii, shadows, and container widths there. `app/globals.css` consumes those values through CSS variables.

## i18n Behavior

- Dictionaries are copied from the source project into `src/i18n/dictionaries/`
- Locale persistence follows the source project storage key: `article-vue-i18n-locale`
- The current server implementation defaults to `en` until client-side locale switching is wired further

## Development

Initialize the project in one command:

```bash
pnpm init:project
```

This creates `.env.local` from `.env.example` when needed, ensures SQLite and
upload directories exist, installs the project development SKILL into
`.codex/skills/replicate-ai4e-site/SKILL.md`, installs dependencies, and
preheats the SQLite seed data.

Initialize from a shell script:

```bash
sh scripts/bootstrap.sh
```

From an empty directory, pass the repository URL:

```bash
curl -fsSL <raw-bootstrap-url> | sh -s -- <repo-url> good-papers
```

If the repository URL is omitted, the script prompts for it interactively.
Press Enter to use the default repository:
`https://github.com/topfunplusnew/goods-article`.
If the target directory is omitted, it uses the repository name.

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

The Next app also serves the backend under `/api/v1/*`. The SQLite database
is created and seeded automatically at `data/good-papers.sqlite` on first API
access. The default local admin credentials are `admin` / `admin`.

Static front-end assets are managed from `/admin/static-assets`. Uploaded files
are stored under `data/uploads/static-assets/` and served from
`/uploads/static-assets/*`.

Start with Docker Compose:

```bash
docker compose up -d --build
```

Run verification:

```bash
pnpm test
pnpm run typecheck
pnpm run lint
```

Inspect the project CLI and development SKILL:

```bash
pnpm cli -- help
pnpm cli -- skill --print
pnpm cli -- dev
```

## Verification Checklist

- Public routes respond
- `robots.txt` responds
- `sitemap.xml` responds
- Public article, issue, author, about, and publish pages render live data
- `pnpm test` passes
- `pnpm run typecheck` passes
- `pnpm run lint` passes

## Current Status

Implemented now:

- Config layer
- Theme layer
- Source dictionaries
- Public route shells
- Public read-only data for journal, issue, article, author, about, and publish
- `robots.txt`
- `sitemap.xml`
- Explicit translation provider route behavior

Still in progress:

- Admin write flows
- Auth-backed submission flow
- Full article and issue metadata parity
- Final skill verification loop
