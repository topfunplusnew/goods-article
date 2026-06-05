# Good Papers Replica Design

Date: `2026-06-05`
Target project: `/Users/zhangming/Code/Projects/good-papers`
Source project: `/Users/zhangming/Code/Projects/ai4edu/ai4e-site`

## Objective

Rebuild the current `ai4e-site` project in Next.js with React and TypeScript under `good-papers`, preserving the source project's current on-disk behavior and structure at the feature level.

This is a full replica, not a partial port. Scope includes:

- Public site routes
- Admin routes
- Server-side APIs used by the frontend
- Internationalization behavior
- SEO and metadata behavior
- Authentication flow currently implemented by the source project
- Styling parity with theme tokens moved into explicit configuration
- Documentation
- A reusable skill that instructs another AI how to reproduce the same project faithfully

## Fixed Constraints

These constraints are mandatory and define the implementation.

1. Source of truth is the current on-disk state of `ai4e-site`, including uncommitted changes.
2. API truth comes from the structures actually consumed and emitted by the current Nuxt project, not from OpenAPI files.
3. Deployment target is a standard Next.js Node server using the App Router.
4. No magic values in feature code. Constants must live in configuration modules.
5. No fallback logic. The new project must not try alternate field names, alternate response envelopes, or secondary endpoints when the primary contract fails.
6. No wrapper logic. The new project must not introduce generic transport wrappers such as a universal `apiFetch`, envelope unwrappers, or compatibility helpers that hide real endpoint contracts.
7. No guessing. Every implemented route, field, request payload, and response mapping must be traced back to the source project's current code.

## Architecture

The project will use Next.js App Router and TypeScript with explicit feature boundaries.

```text
good-papers/
  app/
    (public)/
      page.tsx
      article/
      issue/
      authors/
      author/
      about/
      publish/
      all-issues/
      login/
      user/me/
    (admin)/
      admin/
        page.tsx
        login/
        articles/
        issues/
        volumes/
        journal/
        about/
        publish/
        publishing/
        deploy/
        account/
    api/
      locale-translate/
        route.ts
    favicon.ico
    layout.tsx
    not-found.tsx
    robots.ts
    sitemap.ts
    globals.css
  src/
    config/
    features/
    shared/
    i18n/
  public/
  docs/
  skills/
  tests/
```

### Responsibility Boundaries

- `app/` contains route files, layouts, metadata exports, and page-level composition only.
- `src/features/<domain>/` contains domain-specific contracts, models, endpoint functions, mapping functions, and domain UI.
- `src/shared/` contains shared UI primitives, cross-domain utilities, and cross-domain types only.
- `src/config/` contains all environment access, route fragments, theme tokens, cookie keys, SEO constants, pagination sizes, and other fixed values.
- `src/i18n/` contains dictionaries and locale loading logic.

## Route Mapping

The following source routes must be replicated:

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

### Server-Side Endpoints

- `app/api/locale-translate/route.ts`
- `app/robots.ts`
- `app/sitemap.ts`

`robots` and `sitemap` must use Next.js metadata route conventions instead of generic route handlers.

## Backend and Asset URL Strategy

The source project exposes backend API and media through frontend-facing paths. The replica must preserve that behavior intentionally.

Rules:

- Public API access path remains `/api/v1/...`.
- Public media access path remains `/images/...`.
- Server-side code may call the configured internal backend base URL directly when request-local proxying is not required.
- Browser-visible links for article view, article download, and uploaded assets must preserve the same frontend-facing path style used by the source project.
- Path behavior must be defined in configuration and routing, not hidden behind a generic transport wrapper.

Implementation direction:

- Use explicit Next.js configuration for path rewrites or proxy behavior where path preservation is required.
- Use explicit environment variables for public API base URL, internal API base URL, and backend origin.
- Do not switch between multiple URL shapes at runtime except where the source project already defines separate public and internal bases.

## Data Contract Rules

The migration will use a two-layer data model per feature.

### Layer 1: Transport DTO

Each endpoint gets a single explicit request type and a single explicit response type based on the source project's actual usage.

Examples:

- `ArticleSearchResponseDto`
- `ArticleDetailResponseDto`
- `UpdateArticleRequestDto`

Rules:

- No union envelopes to support legacy variants
- No alternate field name probing
- No "best effort" parsing

### Layer 2: View Model

Each page or component consumes a stable model that is mapped from the DTO.

Examples:

- `ArticleListItem`
- `ArticleDetailViewModel`
- `IssueArchiveEntry`

Rules:

- Pages and components do not consume raw transport shapes directly
- Mapping functions are deterministic field-to-field transforms or explicit field composition
- Missing required data must fail explicitly through `notFound()` or thrown errors

## Endpoint Access Pattern

Each feature owns its endpoint calls directly.

```text
src/features/article/
  contracts.ts
  model.ts
  api.ts
  mapper.ts
  queries.ts
  components/
```

Implementation rules:

- `api.ts` functions call `fetch` directly
- Request URLs are assembled from explicit route constants
- Request headers use explicit named constants
- Each function checks `response.ok`
- Each function parses the exact expected body shape
- Each function maps the body to the domain view model or throws a typed error

Forbidden patterns:

- Global `apiFetch`
- Generic list unwrappers
- Compatibility normalizers
- Shared response envelope handlers
- Retry chains that mask contract mismatches

## Styling and Theme Strategy

The rendered appearance must match the source project, but theme values must move into explicit configuration.

### Theme Structure

```text
src/config/
  theme.ts
```

`theme.ts` will define named tokens for:

- Colors
- Typography families
- Font sizes
- Spacing scale
- Border radii
- Shadows
- Container widths
- Transition durations

### CSS Strategy

- `app/globals.css` will carry the migrated style rules and semantic utility classes.
- Raw color, radius, spacing, and shadow values must be expressed through CSS variables sourced from `theme.ts`.
- Components use semantic class names and variables, not duplicated literal style values.

The intent is visual parity with centralized theming, not redesign.

## Internationalization

The replica will preserve the source project's current locale behavior instead of adopting sub-path locale routing.

Rules:

- Locale is not part of the URL structure.
- Dictionaries are explicit modules under `src/i18n/dictionaries/`.
- Locale reads from a single defined storage source and key matching the source project's behavior.
- Server Components read locale on the server.
- Client Components receive locale and message subsets as props when needed.
- No locale fallback chain based on browser detection.

## SEO and Metadata

Next.js metadata APIs will be used according to App Router conventions.

Rules:

- Global metadata lives in explicit builders under `src/config/seo.ts`.
- Static routes export `metadata`.
- Dynamic routes export `generateMetadata`.
- Shared data fetches used by both page and metadata may use React `cache` when this removes duplicate deterministic fetches without introducing a wrapper layer.
- `app/robots.ts` and `app/sitemap.ts` replicate the source project's public crawling behavior.
- Article and issue routes preserve the academic SEO surface currently implemented by the source project.

## Authentication and Authorization

The implementation will preserve the source project's current cookie/token model rather than inventing a new auth system.

Rules:

- Auth-related constants live in `src/config/auth.ts`.
- Admin route groups perform server-side access checks through cookies.
- Unauthorized access redirects to `/admin/login`.
- Auth state transitions are explicit in auth feature code.
- No generic auth middleware wrapper is introduced around all data access.

## Error Handling

Error handling is explicit and narrow.

Allowed outcomes:

- Successful response mapped to a view model
- Known request failure mapped to a typed error state
- Missing resource mapped to `notFound()`
- Unauthorized state mapped to redirect or login flow

Forbidden outcomes:

- Silent alternate endpoint attempts
- Silent alternate field extraction
- Implicit default objects that hide contract failures

## Migration Process

The migration must execute in this order.

1. Inventory every source route and server endpoint currently present.
2. Inventory every source API call and the exact request and response fields actually used.
3. Define per-feature DTOs and view models.
4. Build the Next.js route tree and layouts.
5. Implement public read-only features.
6. Implement admin read and write features.
7. Implement server-side endpoints and metadata routes.
8. Migrate style rules into themed CSS variables.
9. Migrate dictionaries and locale switching behavior.
10. Write verification tests, README, and replica skill.

## Verification Requirements

The replica is only complete when all of the following pass:

- Route coverage matches the source route inventory
- API coverage matches the source endpoint inventory
- TypeScript passes
- ESLint passes
- Public routes render with expected data and styling
- Admin routes authenticate and protect access correctly
- Locale switching matches source behavior
- `robots` and `sitemap` outputs match source intent
- Theme tokens can be changed in one configuration location without editing component logic

## README Requirements

The target project README must include:

- Project purpose
- Replica scope
- Technology stack
- Directory structure
- Route mapping from source to target
- Environment variable contract
- Theme configuration usage
- i18n behavior
- Authentication model
- Development and build commands
- Verification checklist
- Replica constraints: no magic values, no fallback logic, no wrapper logic, no guessing

## Skill Requirements

Create a skill inside the target project:

```text
skills/replicate-ai4e-site/SKILL.md
```

The skill must instruct an AI to reproduce this project faithfully under the following rules:

- Start from route and endpoint inventory
- Use the source project's current code as the only behavior truth
- Do not infer backend fields that are not evidenced in source code
- Do not add fallback parsing or compatibility wrappers
- Do not introduce generic transport abstractions
- Keep theme tokens configurable and centralized
- Verify route parity, contract parity, and style parity before declaring completion

The skill should be procedural, checklist-driven, and optimized for reliable triggering when a user asks to replicate the `ai4e-site` project or an exact equivalent.

## Out of Scope

The following are explicitly out of scope unless new instructions change the objective:

- Redesigning the visual language
- Replacing the current authentication model with a new provider
- Making the project static-export-first
- Rewriting backend contracts to match OpenAPI instead of source behavior
- Preserving Nuxt-specific implementation patterns

## Implementation Principle

This project is a replica at the feature and behavior level, not a syntax translation exercise. The implementation must read as a native Next.js App Router project while remaining observably aligned with the source project's current behavior.
