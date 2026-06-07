---
name: replicate-ai4e-site
description: Use when recreating the ai4e-site project or a functionally identical journal site in another stack and the result must match current behavior without guessed contracts, fallback logic, or generic wrapper abstractions
---

# Replicate ai4e-site

## Overview

Replicate the current on-disk `ai4e-site` project exactly at the behavior level, but implement it as native code for the target stack.

This skill is for strict replica work, not redesigns or approximate migrations.

## Non-Negotiable Rules

1. Treat the current source code as the behavior truth.
2. Do not infer backend fields that are not evidenced in code or live responses.
3. Do not add fallback parsing, alternate envelope handling, or compatibility wrappers.
4. Do not hide endpoint behavior behind generic request helpers.
5. Do not rename or restructure user-facing behavior unless the target framework requires a native equivalent.

## Required Workflow

### 1. Inventory before implementation

Capture these before writing any feature code:

- Route inventory
- Endpoint inventory
- Dictionary inventory
- Asset inventory
- Public vs admin route split
- Server route and metadata route responsibilities

### 2. Verify live contract shape

When backend access is available:

- Request the exact live endpoints currently used by the source project
- Record the real JSON payload shape
- Use those payloads as DTOs

Do not use OpenAPI to override live source behavior when the source application is already wired to different payloads.

### 3. Build per-feature contracts

For each domain:

- `contracts.ts`
- `model.ts`
- `mapper.ts`
- `api.ts`

Each endpoint gets one explicit DTO. Each page consumes one explicit page-facing model.

### 4. Keep transport explicit

Allowed:

- Direct `fetch` in feature-local `api.ts`
- Explicit environment reads
- Explicit error throwing on non-OK responses

Forbidden:

- Global `apiFetch`
- Shared envelope unwrappers
- Retry chains
- Alternate field probing
- Silent provider fallback chains

### 5. Rebuild route tree natively

Use the target framework's first-class routing conventions:

- Public routes
- Admin routes
- Protected admin sub-tree
- Metadata routes
- Route handlers

Do not preserve source-framework routing patterns when the target framework already has a canonical way to do the same thing.

### 6. Preserve style with configurable tokens

- Copy the visual language
- Move colors, spacing, radii, shadows, and typography into one theme configuration module
- Keep CSS consuming semantic variables instead of raw repeated literals

### 7. Configure static assets through the admin database

Static front-end assets are managed through `/admin/static-assets` and stored in
the SQLite `static_assets` table. Future agents must update the database/admin
flow instead of hardcoding image paths in components or reintroducing a
TypeScript static asset configuration file.

Use these asset keys:

- `brand.logoSvg`: primary SVG logo used by the navigation.
- `brand.logoPng`: PNG logo variant available for places that need raster artwork.
- `journal.fallbackCover`: local fallback journal cover image.
- `metadata.favicon`: favicon path served by the Next app.

Uploaded files are saved under `data/uploads/static-assets/` and served from
`/uploads/static-assets/*`. Components should receive asset URLs from server
layouts or API responses.

### 8. Verify incrementally

After each phase:

- Run unit-style tests
- Run typecheck
- Run lint
- Hit the affected routes over HTTP

Do not claim progress without fresh verification output.

## Route Priority

Replicate these in order:

1. Config and environment
2. Layouts and dictionaries
3. Public read-only routes
4. Metadata routes and route handlers
5. Admin read routes
6. Admin write flows
7. README and final docs

## Output Standard

A replica is acceptable only if:

- Route surface matches the source project
- Live data shape matches the current backend actually used by the source
- Theme changes are centralized
- Public pages render real data
- Admin pages preserve the source structure
- No fallback logic or wrapper abstractions were introduced
