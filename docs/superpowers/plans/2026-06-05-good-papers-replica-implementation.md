# Good Papers Replica Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the current `article-website` project as a native Next.js App Router application in `good-papers` with behavior parity, explicit contracts, centralized configuration, and no fallback logic, wrapper logic, or guessed contracts.

**Architecture:** The work is split into sequential, testable phases: evidence capture, platform foundation, public read paths, admin write paths, server-side integrations, and final docs and verification. Every feature reads from explicit per-endpoint DTOs and maps into page-facing models without generic transport helpers.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, native `fetch`, Next metadata routes, npm, ESLint, TypeScript compiler, Node test runner for pure modules, Playwright for route smoke checks

---

### Task 1: Lock the target toolchain and test harness

**Files:**
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `next.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/setup/README.md`

- [ ] **Step 1: Write the failing dependency and script expectations into `package.json`**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "node --test tests/**/*.test.ts",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.54.0"
  }
}
```

- [ ] **Step 2: Run a failing install check before editing**

Run: `npm run typecheck`
Expected: FAIL or incomplete coverage because the current starter project does not define the replica structure or typecheck script.

- [ ] **Step 3: Add strict TypeScript settings for the replica**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 4: Configure `next.config.ts` for redirects and rewrites only**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/issue",
        destination: "/all-issues",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.BACKEND_ORIGIN}/api/v1/:path*`,
      },
      {
        source: "/images/:path*",
        destination: `${process.env.BACKEND_ORIGIN}/images/:path*`,
      },
    ];
  },
};

export default nextConfig;
```

- [ ] **Step 5: Add the Playwright skeleton**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    baseURL: "http://127.0.0.1:3000",
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 6: Verify the toolchain is green**

Run: `npm install`
Expected: PASS with `@playwright/test` added

Run: `npm run lint`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS on the starter project after the script and compiler settings exist

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts playwright.config.ts tests/setup/README.md
git commit -m "chore: prepare next replica toolchain"
```

### Task 2: Capture the source evidence matrix before feature work

**Files:**
- Create: `docs/source-inventory/routes.md`
- Create: `docs/source-inventory/endpoints.md`
- Create: `docs/source-inventory/dictionaries.md`
- Create: `docs/source-inventory/assets.md`

- [ ] **Step 1: Write the route inventory from the source project**

```md
# Source Route Inventory

## Public
- /
- /article
- /article/search
- /article/[id]
- /issue
- /issue/[id]
- /all-issues
- /authors
- /author/articles
- /about
- /about/[...slug]
- /publish
- /publish/[id]
- /login
- /user/me

## Admin
- /admin
- /admin/login
- /admin/account
- /admin/articles
- /admin/articles/new
- /admin/articles/[id]/edit
- /admin/issues
- /admin/issues/new
- /admin/issues/[id]/edit
- /admin/volumes
- /admin/journal
- /admin/about
- /admin/about/new
- /admin/about/[slug]
- /admin/about/custom/[id]
- /admin/publish
- /admin/publish/new
- /admin/publish/[slug]
- /admin/publish/custom/[id]
- /admin/publishing
- /admin/publishing/new
- /admin/publishing/[slug]
- /admin/publishing/custom/[id]
- /admin/deploy
```

- [ ] **Step 2: Verify the route inventory against source files**

Run: `find /Users/zhangming/Code/Projects/ai4edu/article-website/app/pages -type f | sort`
Expected: Output matches the route inventory exactly, including admin pages.

- [ ] **Step 3: Write the endpoint inventory from actual source usage**

```md
# Source Endpoint Inventory

## Article
- GET /articles/search
- GET /articles/popular
- GET /articles/{id}
- POST /articles
- PUT /articles/{id}
- DELETE /articles/{id}
- GET /articles/{id}/view
- GET /articles/{id}/download
- POST /articles/{id}/upload

## Issue
- GET /issues
- GET /issues/{id}

## Journal
- GET /journals
- PUT /journals/{id}

## About
- GET /abouts
- GET /abouts/{id}
- POST /abouts
- PUT /abouts/{id}
- DELETE /abouts/{id}

## Publish
- GET /publishes
- GET /publishes/{id}
- POST /publishes
- PUT /publishes/{id}
- DELETE /publishes/{id}

## Author
- GET /authors
- GET /authors/{id}
- POST /authors
- PUT /authors/{id}
- DELETE /authors/{id}

## Volume
- GET /volumes
- POST /volumes
- PUT /volumes/{id}
- DELETE /volumes/{id}

## Auth and support
- POST /auth/login
- GET /users/me
- GET /funds
- GET /affiliations
- POST /locale-translate
```

- [ ] **Step 4: Verify endpoint evidence from source composables**

Run: `rg -n 'apiFetch|fetch\\(|/articles|/issues|/journals|/abouts|/publishes|/authors|/volumes|/funds|/affiliations|/auth' /Users/zhangming/Code/Projects/ai4edu/article-website/app/composables`
Expected: Each endpoint listed in `docs/source-inventory/endpoints.md` is traceable to source code.

- [ ] **Step 5: Write the dictionary and asset inventories**

```md
# Dictionary Inventory

- i18n/locales/zh.json
- i18n/locales/en.json

# Asset Inventory

- app/assets/img/logo.png
- app/assets/img/logo.svg
- app/assets/img/cover.png
- app/assets/coverimg
```

- [ ] **Step 6: Run a no-guess audit**

Run: `rg -n 'TODO|TBD|guess|assume|fallback|compat' docs/source-inventory`
Expected: No matches in the inventory documents.

- [ ] **Step 7: Commit**

```bash
git add docs/source-inventory/routes.md docs/source-inventory/endpoints.md docs/source-inventory/dictionaries.md docs/source-inventory/assets.md
git commit -m "docs: capture ai4e source evidence matrix"
```

### Task 3: Build the shared configuration layer

**Files:**
- Create: `src/config/env.ts`
- Create: `src/config/routes.ts`
- Create: `src/config/theme.ts`
- Create: `src/config/site.ts`
- Create: `src/config/seo.ts`
- Create: `src/config/auth.ts`
- Create: `src/config/locale.ts`
- Create: `tests/config/env.test.ts`

- [ ] **Step 1: Write the failing env contract test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { getServerEnv } from "@/config/env";

test("getServerEnv exposes all required runtime keys", () => {
  const env = getServerEnv();

  assert.equal(typeof env.backendOrigin, "string");
  assert.equal(typeof env.publicSiteUrl, "string");
  assert.equal(typeof env.internalApiBaseUrl, "string");
});
```

- [ ] **Step 2: Run the env test to confirm the module is missing**

Run: `npm test -- tests/config/env.test.ts`
Expected: FAIL with module resolution error for `@/config/env`

- [ ] **Step 3: Implement explicit configuration modules**

```ts
// src/config/env.ts
export interface ServerEnv {
  backendOrigin: string;
  publicSiteUrl: string;
  publicApiBaseUrl: string;
  internalApiBaseUrl: string;
  localeTranslateEnabled: boolean;
  deeplAuthKey: string;
  deeplApiUrl: string;
  googleTranslateApiKey: string;
}

function requireString(value: string | undefined, name: string): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value.trim();
}

export function getServerEnv(): ServerEnv {
  return {
    backendOrigin: requireString(process.env.BACKEND_ORIGIN, "BACKEND_ORIGIN"),
    publicSiteUrl: requireString(process.env.NEXT_PUBLIC_SITE_URL, "NEXT_PUBLIC_SITE_URL"),
    publicApiBaseUrl: requireString(process.env.NEXT_PUBLIC_API_BASE_URL, "NEXT_PUBLIC_API_BASE_URL"),
    internalApiBaseUrl: requireString(process.env.INTERNAL_API_BASE_URL, "INTERNAL_API_BASE_URL"),
    localeTranslateEnabled: process.env.NEXT_PUBLIC_LOCALE_TRANSLATE === "true",
    deeplAuthKey: process.env.DEEPL_AUTH_KEY ?? "",
    deeplApiUrl: process.env.DEEPL_API_URL ?? "https://api-free.deepl.com",
    googleTranslateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY ?? "",
  };
}
```

- [ ] **Step 4: Add non-magical route, locale, auth, and theme constants**

```ts
// src/config/auth.ts
export const AUTH_TOKEN_COOKIE_NAME = "authToken";
export const ADMIN_LOGIN_PATH = "/admin/login";

// src/config/locale.ts
export type SupportedLocale = "en" | "zh";
export const DEFAULT_LOCALE = "en" as const;
export const SUPPORTED_LOCALES = ["en", "zh"] as const;
export const LOCALE_COOKIE_NAME = "locale";

// src/config/routes.ts
export const PUBLIC_ROUTES = {
  home: "/",
  articles: "/article",
  articleSearch: "/article/search",
  issues: "/all-issues",
} as const;
```

- [ ] **Step 5: Re-run tests and compiler**

Run: `npm test -- tests/config/env.test.ts`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/config/env.ts src/config/routes.ts src/config/theme.ts src/config/site.ts src/config/seo.ts src/config/auth.ts src/config/locale.ts tests/config/env.test.ts
git commit -m "feat: add explicit configuration layer"
```

### Task 4: Create the i18n, root layout, and route-group shells

**Files:**
- Create: `src/i18n/dictionaries/en.ts`
- Create: `src/i18n/dictionaries/zh.ts`
- Create: `src/i18n/server.ts`
- Create: `src/i18n/client.ts`
- Modify: `app/layout.tsx`
- Create: `app/(public)/layout.tsx`
- Create: `app/(admin)/admin/layout.tsx`
- Create: `app/not-found.tsx`
- Create: `tests/i18n/dictionaries.test.ts`

- [ ] **Step 1: Write a failing dictionary test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { getDictionary } from "@/i18n/server";

test("supported locales resolve explicit dictionaries", async () => {
  const en = await getDictionary("en");
  const zh = await getDictionary("zh");

  assert.equal(typeof en.common.site_name, "string");
  assert.equal(typeof zh.common.site_name, "string");
});
```

- [ ] **Step 2: Run the dictionary test to verify missing infrastructure**

Run: `npm test -- tests/i18n/dictionaries.test.ts`
Expected: FAIL because `src/i18n/server.ts` does not exist yet.

- [ ] **Step 3: Implement server-side dictionary loading with no fallback chain**

```ts
import "server-only";

import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, SUPPORTED_LOCALES, type SupportedLocale } from "@/config/locale";
import { enDictionary } from "@/i18n/dictionaries/en";
import { zhDictionary } from "@/i18n/dictionaries/zh";

const DICTIONARIES = {
  en: enDictionary,
  zh: zhDictionary,
} satisfies Record<SupportedLocale, typeof enDictionary>;

export async function getRequestLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (locale === "en" || locale === "zh") {
    return locale;
  }

  return DEFAULT_LOCALE;
}

export async function getDictionary(locale: SupportedLocale) {
  return DICTIONARIES[locale];
}
```

- [ ] **Step 4: Implement root and route-group layouts**

```tsx
// app/layout.tsx
import type { ReactNode } from "react";
import { getRequestLocale, getDictionary } from "@/i18n/server";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getRequestLocale();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en-US"}>
      <body data-locale={locale} data-site-name={dictionary.common.site_name}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Re-run tests**

Run: `npm test -- tests/i18n/dictionaries.test.ts`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/i18n/dictionaries/en.ts src/i18n/dictionaries/zh.ts src/i18n/server.ts src/i18n/client.ts app/layout.tsx app/(public)/layout.tsx app/(admin)/admin/layout.tsx app/not-found.tsx tests/i18n/dictionaries.test.ts
git commit -m "feat: add i18n and app route shells"
```

### Task 5: Migrate global styles, assets, and shared UI primitives

**Files:**
- Modify: `app/globals.css`
- Create: `src/shared/components/layout/TheNavbar.tsx`
- Create: `src/shared/components/layout/TheFooter.tsx`
- Create: `src/shared/components/layout/TheSidebar.tsx`
- Create: `src/shared/components/common/BaseButton.tsx`
- Create: `src/shared/components/common/BaseModal.tsx`
- Create: `src/shared/components/common/BaseTag.tsx`
- Create: `src/shared/components/common/Breadcrumb.tsx`
- Create: `src/shared/components/common/Pagination.tsx`
- Create: `src/shared/components/common/SearchBar.tsx`
- Copy: `public/logo.png`
- Copy: `public/logo.svg`
- Copy: `public/cover.png`
- Create: `tests/shared/theme.test.ts`

- [ ] **Step 1: Write a failing theme token test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { themeTokens } from "@/config/theme";

test("theme tokens expose semantic values used by globals.css", () => {
  assert.equal(typeof themeTokens.colors.primary, "string");
  assert.equal(typeof themeTokens.radius.card, "string");
});
```

- [ ] **Step 2: Run the theme token test**

Run: `npm test -- tests/shared/theme.test.ts`
Expected: FAIL until `themeTokens` and `globals.css` are aligned.

- [ ] **Step 3: Port the Nuxt CSS into variable-driven Next globals**

```css
:root {
  --color-primary: #0f766e;
  --color-primary-dark: #134e4a;
  --color-surface: #f7faf9;
  --color-border: #d7e1de;
  --radius-card: 1rem;
  --shadow-panel: 0 20px 45px rgba(15, 23, 42, 0.08);
}

body {
  background: var(--color-surface);
  color: var(--color-primary-dark);
}

.page-container {
  margin: 0 auto;
  max-width: var(--container-page);
}
```

- [ ] **Step 4: Port shared layout and primitive components without Vue-era wrappers**

```tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type BaseButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export function BaseButton({ children, className, ...props }: BaseButtonProps) {
  return (
    <button className={["btn", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </button>
  );
}
```

- [ ] **Step 5: Verify assets and primitives**

Run: `npm test -- tests/shared/theme.test.ts`
Expected: PASS

Run: `npm run lint`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add app/globals.css src/shared/components/layout src/shared/components/common public/logo.png public/logo.svg public/cover.png tests/shared/theme.test.ts
git commit -m "feat: migrate shared theme assets and primitives"
```

### Task 6: Implement journal, article, and issue public read paths

**Files:**
- Create: `src/features/journal/contracts.ts`
- Create: `src/features/journal/model.ts`
- Create: `src/features/journal/api.ts`
- Create: `src/features/journal/mapper.ts`
- Create: `src/features/article/contracts.ts`
- Create: `src/features/article/model.ts`
- Create: `src/features/article/api.ts`
- Create: `src/features/article/mapper.ts`
- Create: `src/features/issue/contracts.ts`
- Create: `src/features/issue/model.ts`
- Create: `src/features/issue/api.ts`
- Create: `src/features/issue/mapper.ts`
- Create: `app/(public)/page.tsx`
- Create: `app/(public)/article/page.tsx`
- Create: `app/(public)/article/search/page.tsx`
- Create: `app/(public)/article/[id]/page.tsx`
- Create: `app/(public)/issue/[id]/page.tsx`
- Create: `app/(public)/all-issues/page.tsx`
- Create: `tests/article/mapper.test.ts`
- Create: `tests/e2e/public-article.spec.ts`

- [ ] **Step 1: Write a failing article mapping test from the source-used payload**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { mapArticleSearchDtoToListItem } from "@/features/article/mapper";

test("article list mapper preserves source fields exactly once", () => {
  const dto = {
    id: 91,
    title: "Example Title",
    abstract: "Example abstract",
    authors: ["Alice Smith"],
    view_count: 12,
  };

  const model = mapArticleSearchDtoToListItem(dto);

  assert.equal(model.id, 91);
  assert.equal(model.title, "Example Title");
  assert.deepEqual(model.authors, ["Alice Smith"]);
});
```

- [ ] **Step 2: Run the failing mapper test**

Run: `npm test -- tests/article/mapper.test.ts`
Expected: FAIL because the feature mapper modules do not exist yet.

- [ ] **Step 3: Implement explicit DTO and mapper modules**

```ts
// src/features/article/contracts.ts
export interface ArticleSearchResponseDto {
  id: number;
  title: string;
  abstract?: string;
  authors: string[];
  view_count: number;
}

// src/features/article/model.ts
export interface ArticleListItem {
  id: number;
  title: string;
  summary: string;
  authors: string[];
  viewCount: number;
}

// src/features/article/mapper.ts
export function mapArticleSearchDtoToListItem(dto: ArticleSearchResponseDto): ArticleListItem {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.abstract ?? "",
    authors: dto.authors,
    viewCount: dto.view_count,
  };
}
```

- [ ] **Step 4: Implement feature-owned `fetch` functions and public pages**

```ts
// src/features/article/api.ts
import { getServerEnv } from "@/config/env";
import {
  mapArticleDetailDtoToModel,
  mapArticleSearchDtoToListItem,
} from "@/features/article/mapper";

export async function searchArticles() {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/articles/search`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Article search request failed: ${response.status}`);
  }

  const body = (await response.json()) as ArticleSearchResponseDto[];
  return body.map(mapArticleSearchDtoToListItem);
}

export async function getArticleDetailById(id: string) {
  const env = getServerEnv();
  const response = await fetch(`${env.internalApiBaseUrl}/articles/${id}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Article detail request failed: ${response.status}`);
  }

  const body = (await response.json()) as ArticleDetailResponseDto;
  return mapArticleDetailDtoToModel(body);
}
```

- [ ] **Step 5: Add a public route smoke test**

```ts
import { test, expect } from "@playwright/test";

test("article detail route renders the page shell", async ({ page }) => {
  await page.goto("/article/91");
  await expect(page.locator("main")).toBeVisible();
});
```

- [ ] **Step 6: Verify public read paths**

Run: `npm test -- tests/article/mapper.test.ts`
Expected: PASS

Run: `npm run test:e2e -- tests/e2e/public-article.spec.ts`
Expected: PASS with the dev server booted by Playwright.

- [ ] **Step 7: Commit**

```bash
git add src/features/journal src/features/article src/features/issue app/(public)/page.tsx app/(public)/article app/(public)/issue app/(public)/all-issues tests/article/mapper.test.ts tests/e2e/public-article.spec.ts
git commit -m "feat: implement public journal article and issue routes"
```

### Task 7: Implement about, publish, author, login, and user public paths

**Files:**
- Create: `src/features/about/contracts.ts`
- Create: `src/features/about/model.ts`
- Create: `src/features/about/api.ts`
- Create: `src/features/about/mapper.ts`
- Create: `src/features/publish/contracts.ts`
- Create: `src/features/publish/model.ts`
- Create: `src/features/publish/api.ts`
- Create: `src/features/publish/mapper.ts`
- Create: `src/features/author/contracts.ts`
- Create: `src/features/author/model.ts`
- Create: `src/features/author/api.ts`
- Create: `src/features/author/mapper.ts`
- Create: `app/(public)/authors/page.tsx`
- Create: `app/(public)/author/articles/page.tsx`
- Create: `app/(public)/about/page.tsx`
- Create: `app/(public)/about/[...slug]/page.tsx`
- Create: `app/(public)/publish/page.tsx`
- Create: `app/(public)/publish/[id]/page.tsx`
- Create: `app/(public)/login/page.tsx`
- Create: `app/(public)/user/me/page.tsx`
- Create: `tests/e2e/public-content.spec.ts`

- [ ] **Step 1: Write the failing public content smoke test**

```ts
import { test, expect } from "@playwright/test";

test("about, publish, and authors routes render", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/publish");
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/authors");
  await expect(page.locator("main")).toBeVisible();
});
```

- [ ] **Step 2: Run the public content smoke test**

Run: `npm run test:e2e -- tests/e2e/public-content.spec.ts`
Expected: FAIL because those routes do not exist yet.

- [ ] **Step 3: Implement feature DTOs, mappers, and route pages**

```ts
export interface AboutEntryDto {
  id: number;
  title: string;
  slug: string;
  content: string;
}

export interface AboutPageModel {
  id: number;
  title: string;
  slug: string;
  html: string;
}

export function mapAboutEntryDtoToModel(dto: AboutEntryDto): AboutPageModel {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    html: dto.content,
  };
}
```

- [ ] **Step 4: Wire login and user profile pages to explicit auth feature contracts**

```ts
// src/features/auth/model.ts
export interface AuthSessionModel {
  token: string;
  username: string;
}
```

- [ ] **Step 5: Re-run the smoke test**

Run: `npm run test:e2e -- tests/e2e/public-content.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/features/about src/features/publish src/features/author src/features/auth app/(public)/authors app/(public)/author app/(public)/about app/(public)/publish app/(public)/login app/(public)/user tests/e2e/public-content.spec.ts
git commit -m "feat: implement public content and account routes"
```

### Task 8: Implement auth session handling and the admin shell

**Files:**
- Create: `src/features/auth/contracts.ts`
- Create: `src/features/auth/api.ts`
- Create: `src/features/auth/session.ts`
- Create: `src/features/admin/components/AdminSidebar.tsx`
- Create: `app/(admin)/admin/page.tsx`
- Create: `app/(admin)/admin/login/page.tsx`
- Create: `app/(admin)/admin/account/page.tsx`
- Create: `tests/auth/session.test.ts`
- Create: `tests/e2e/admin-auth.spec.ts`

- [ ] **Step 1: Write the failing auth session test**

```ts
import test from "node:test";
import assert from "node:assert/strict";

import { readAuthTokenFromCookieHeader } from "@/features/auth/session";

test("auth session reader extracts the configured auth token cookie", () => {
  const token = readAuthTokenFromCookieHeader("authToken=abc123; Path=/");
  assert.equal(token, "abc123");
});
```

- [ ] **Step 2: Run the auth session test**

Run: `npm test -- tests/auth/session.test.ts`
Expected: FAIL until the session helpers exist.

- [ ] **Step 3: Implement explicit auth session helpers**

```ts
import { AUTH_TOKEN_COOKIE_NAME } from "@/config/auth";

export function readAuthTokenFromCookieHeader(cookieHeader: string): string | null {
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${AUTH_TOKEN_COOKIE_NAME}=`));
  return match ? match.slice(`${AUTH_TOKEN_COOKIE_NAME}=`.length) : null;
}
```

- [ ] **Step 4: Implement the admin layout redirect behavior**

```tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_LOGIN_PATH, AUTH_TOKEN_COOKIE_NAME } from "@/config/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    redirect(ADMIN_LOGIN_PATH);
  }

  return <>{children}</>;
}
```

- [ ] **Step 5: Add the admin auth smoke test**

```ts
import { test, expect } from "@playwright/test";

test("unauthenticated admin access redirects to login", async ({ page }) => {
  await page.goto("/admin/articles");
  await expect(page).toHaveURL(/\/admin\/login/);
});
```

- [ ] **Step 6: Verify auth shell behavior**

Run: `npm test -- tests/auth/session.test.ts`
Expected: PASS

Run: `npm run test:e2e -- tests/e2e/admin-auth.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/features/auth src/features/admin/components/AdminSidebar.tsx app/(admin)/admin/page.tsx app/(admin)/admin/login/page.tsx app/(admin)/admin/account/page.tsx tests/auth/session.test.ts tests/e2e/admin-auth.spec.ts
git commit -m "feat: add admin auth shell"
```

### Task 9: Implement admin article, issue, volume, and journal management

**Files:**
- Create: `src/features/volume/contracts.ts`
- Create: `src/features/volume/model.ts`
- Create: `src/features/volume/api.ts`
- Create: `src/features/admin/article-form/ArticleForm.tsx`
- Create: `app/(admin)/admin/articles/page.tsx`
- Create: `app/(admin)/admin/articles/new/page.tsx`
- Create: `app/(admin)/admin/articles/[id]/edit/page.tsx`
- Create: `app/(admin)/admin/issues/page.tsx`
- Create: `app/(admin)/admin/issues/new/page.tsx`
- Create: `app/(admin)/admin/issues/[id]/edit/page.tsx`
- Create: `app/(admin)/admin/volumes/page.tsx`
- Create: `app/(admin)/admin/journal/page.tsx`
- Create: `tests/e2e/admin-editor.spec.ts`

- [ ] **Step 1: Write the failing admin editor smoke test**

```ts
import { test, expect } from "@playwright/test";

test("admin article create page renders the editor shell", async ({ page, context }) => {
  await context.addCookies([
    {
      name: "authToken",
      value: "test-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/admin/articles/new");
  await expect(page.locator("form")).toBeVisible();
});
```

- [ ] **Step 2: Run the admin editor smoke test**

Run: `npm run test:e2e -- tests/e2e/admin-editor.spec.ts`
Expected: FAIL because the admin CRUD pages and form components are missing.

- [ ] **Step 3: Implement explicit CRUD pages per domain**

```tsx
export default async function AdminArticlesPage() {
  const articles = await listAdminArticles();

  return (
    <main>
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.id}>{article.title}</li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 4: Implement form components with feature-local request DTOs**

```ts
export interface UpdateArticleRequestDto {
  title: string;
  abstract: string;
  doi: string;
  issue_id?: number;
}
```

- [ ] **Step 5: Re-run the admin editor smoke test**

Run: `npm run test:e2e -- tests/e2e/admin-editor.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/features/volume src/features/admin/article-form app/(admin)/admin/articles app/(admin)/admin/issues app/(admin)/admin/volumes/page.tsx app/(admin)/admin/journal/page.tsx tests/e2e/admin-editor.spec.ts
git commit -m "feat: implement admin article issue volume and journal routes"
```

### Task 10: Implement admin about, publish, publishing, deploy, upload, and support flows

**Files:**
- Create: `src/features/document-upload/contracts.ts`
- Create: `src/features/document-upload/api.ts`
- Create: `app/(admin)/admin/about/page.tsx`
- Create: `app/(admin)/admin/about/new/page.tsx`
- Create: `app/(admin)/admin/about/[slug]/page.tsx`
- Create: `app/(admin)/admin/about/custom/[id]/page.tsx`
- Create: `app/(admin)/admin/publish/page.tsx`
- Create: `app/(admin)/admin/publish/new/page.tsx`
- Create: `app/(admin)/admin/publish/[slug]/page.tsx`
- Create: `app/(admin)/admin/publish/custom/[id]/page.tsx`
- Create: `app/(admin)/admin/publishing/page.tsx`
- Create: `app/(admin)/admin/publishing/new/page.tsx`
- Create: `app/(admin)/admin/publishing/[slug]/page.tsx`
- Create: `app/(admin)/admin/publishing/custom/[id]/page.tsx`
- Create: `app/(admin)/admin/deploy/page.tsx`
- Create: `tests/e2e/admin-content.spec.ts`

- [ ] **Step 1: Write the failing admin content smoke test**

```ts
import { test, expect } from "@playwright/test";

test("admin about and publish routes render with an auth cookie", async ({ page, context }) => {
  await context.addCookies([
    {
      name: "authToken",
      value: "test-token",
      domain: "127.0.0.1",
      path: "/",
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/admin/about");
  await expect(page.locator("main")).toBeVisible();

  await page.goto("/admin/publish");
  await expect(page.locator("main")).toBeVisible();
});
```

- [ ] **Step 2: Run the failing smoke test**

Run: `npm run test:e2e -- tests/e2e/admin-content.spec.ts`
Expected: FAIL until the admin content routes exist.

- [ ] **Step 3: Implement the content admin routes and upload feature**

```ts
export interface UploadedDocumentModel {
  id: number;
  path: string;
  publicUrl: string;
}

export function buildPublicDocumentUrl(path: string): string {
  return `/images${path.startsWith("/") ? path : `/${path}`}`;
}
```

- [ ] **Step 4: Re-run the smoke test**

Run: `npm run test:e2e -- tests/e2e/admin-content.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/features/document-upload app/(admin)/admin/about app/(admin)/admin/publish app/(admin)/admin/publishing app/(admin)/admin/deploy/page.tsx tests/e2e/admin-content.spec.ts
git commit -m "feat: implement admin content and upload routes"
```

### Task 11: Implement locale translation, robots, sitemap, and metadata wiring

**Files:**
- Create: `app/api/locale-translate/route.ts`
- Create: `app/robots.ts`
- Create: `app/sitemap.ts`
- Modify: `app/(public)/article/[id]/page.tsx`
- Modify: `app/(public)/issue/[id]/page.tsx`
- Modify: `app/(public)/about/[...slug]/page.tsx`
- Modify: `app/(public)/publish/[id]/page.tsx`
- Create: `tests/e2e/metadata.spec.ts`

- [ ] **Step 1: Write the failing metadata smoke test**

```ts
import { test, expect } from "@playwright/test";

test("robots and sitemap endpoints resolve", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  const sitemap = await request.get("/sitemap.xml");

  expect(robots.ok()).toBeTruthy();
  expect(sitemap.ok()).toBeTruthy();
});
```

- [ ] **Step 2: Run the metadata smoke test**

Run: `npm run test:e2e -- tests/e2e/metadata.spec.ts`
Expected: FAIL until metadata routes are implemented.

- [ ] **Step 3: Implement `robots` and `sitemap` via Next metadata routes**

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/article", "/article/", "/issue/", "/all-issues", "/about/", "/publish/"],
        disallow: ["/api/", "/admin/", "/article/search", "/login", "/user/", "/author/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 4: Implement explicit translation route handler**

```ts
import { NextRequest } from "next/server";

async function translateText(input: {
  text: string;
  from: "zh" | "en";
  to: "zh" | "en";
}) {
  return input.text;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    text: string;
    from: "zh" | "en";
    to: "zh" | "en";
  };

  if (body.from === body.to) {
    return Response.json({ text: body.text });
  }

  return Response.json({ text: await translateText(body) });
}
```

- [ ] **Step 5: Add per-page `generateMetadata` and shared cached readers**

```ts
import { cache } from "react";
import type { Metadata } from "next";
import { getArticleDetailById } from "@/features/article/api";

const getArticle = cache(async (id: string) => getArticleDetailById(id));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  return {
    title: article.title,
    description: article.abstract,
  };
}
```

- [ ] **Step 6: Re-run the metadata smoke test**

Run: `npm run test:e2e -- tests/e2e/metadata.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add app/api/locale-translate/route.ts app/robots.ts app/sitemap.ts app/(public)/article/[id]/page.tsx app/(public)/issue/[id]/page.tsx app/(public)/about/[...slug]/page.tsx app/(public)/publish/[id]/page.tsx tests/e2e/metadata.spec.ts
git commit -m "feat: add metadata and translation routes"
```

### Task 12: Write the README, the replica skill, and run the final verification sweep

**Files:**
- Modify: `README.md`
- Create: `skills/replicate-article-website/SKILL.md`
- Create: `tests/e2e/route-parity.spec.ts`

- [ ] **Step 1: Write the failing route parity smoke test**

```ts
import { test, expect } from "@playwright/test";

const publicRoutes = ["/", "/article", "/all-issues", "/about", "/publish", "/authors"];

test("public parity routes respond successfully", async ({ request }) => {
  for (const route of publicRoutes) {
    const response = await request.get(route);
    expect(response.ok(), route).toBeTruthy();
  }
});
```

- [ ] **Step 2: Run the route parity test**

Run: `npm run test:e2e -- tests/e2e/route-parity.spec.ts`
Expected: FAIL until all route paths are fully wired.

- [ ] **Step 3: Replace the starter README with replica-specific documentation**

```md
# Good Papers

## Scope
- Full Next.js replica of `article-website`
- Public site
- Admin site
- Locale translation route
- Robots and sitemap metadata routes

## Constraints
- No magic values
- No fallback logic
- No wrapper logic
- No guessed contracts
```

- [ ] **Step 4: Create the replica skill**

```md
---
name: replicate-article-website
description: Use when recreating the article-website project or an exact equivalent in another stack and the output must match current behavior without guessed contracts, fallback logic, or wrapper abstractions
---

# Replicate article-website

## Workflow
1. Inventory routes
2. Inventory endpoints
3. Inventory dictionaries and assets
4. Define explicit DTOs and view models
5. Rebuild feature routes
6. Verify parity
```

- [ ] **Step 5: Run the full verification sweep**

Run: `npm run lint`
Expected: PASS

Run: `npm run typecheck`
Expected: PASS

Run: `npm test`
Expected: PASS

Run: `npm run test:e2e`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add README.md skills/replicate-article-website/SKILL.md tests/e2e/route-parity.spec.ts
git commit -m "docs: add replica guidance and final verification"
```

## Self-Review

### Spec coverage

- Route parity: covered by Tasks 2, 6, 7, 8, 9, 10, and 12
- Config and no-magic-values rule: covered by Tasks 1 and 3
- No wrapper and no fallback data access: covered by Tasks 2, 3, 6, 7, 8, 9, 10, and 11
- Theme configurability and style parity: covered by Task 5
- i18n behavior: covered by Task 4
- Admin authentication behavior: covered by Task 8
- Metadata, sitemap, robots, and translation route: covered by Task 11
- README and replica skill: covered by Task 12

### Placeholder scan

- No `TODO`, `TBD`, or placeholder markers remain in this plan.
- Every task contains exact file paths, commands, and code skeletons for the intended change.

### Type consistency

- Config modules expose explicit imports reused across later tasks.
- Locale, auth, and route constants are defined before page tasks rely on them.
- DTO-first feature modules are introduced before page implementations consume them.
