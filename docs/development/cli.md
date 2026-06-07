# Good Papers CLI

The project ships with a local CLI at `bin/good-papers.mjs`.

## Initialize

```bash
pnpm init:project
```

`pnpm init:project` performs these steps:

- Creates `.env.local` from `.env.example` unless it already exists.
- Ensures `data/` and upload directories exist.
- Installs `skills/replicate-article-website/SKILL.md` into `.codex/skills/`.
- Runs `pnpm install`.
- Runs `pnpm exec tsx scripts/seed-database.ts` to create and seed SQLite data.

## One-Script Bootstrap

Inside an existing checkout:

```bash
sh scripts/bootstrap.sh
```

From an empty directory:

```bash
curl -fsSL <raw-bootstrap-url> | sh -s -- <repo-url> good-papers
```

The bootstrap script clones the repository when needed, ensures `pnpm` is
available through `corepack` when possible, and then delegates to
the project CLI. If the cloned repository does not yet contain the CLI, it uses
a compatibility initialization path for env files, data directories, dependency
installation, SKILL installation, and SQLite seeding when the relevant files
exist.

If `<repo-url>` is omitted, the script prompts for the remote repository URL.
Press Enter to use the default repository:
`https://github.com/topfunplusnew/goods-article`.
If `[target-dir]` is omitted, the script uses the repository name.

To pass initialization flags through the shell script:

```bash
GOOD_PAPERS_INIT_ARGS="--skip-install --skip-db" sh scripts/bootstrap.sh
```

Useful flags:

```bash
pnpm init:project -- --skip-install
pnpm init:project -- --skip-db
pnpm init:project -- --skip-skill-install
pnpm init:project -- --force-env
```

## Use the Project SKILL

```bash
pnpm cli -- skill --print
pnpm cli -- dev
```

Use the SKILL before AI-assisted work that changes routes, endpoint contracts,
public/admin data parity, static assets, or admin write flows.

## Database Seed

```bash
pnpm seed
```

The seed command imports repository read functions, which initializes
`data/good-papers.sqlite` through the same database path used by the app.
