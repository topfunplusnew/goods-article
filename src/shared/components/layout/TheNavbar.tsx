"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { PUBLIC_ROUTES } from "@/config/routes";
import type { Dictionary } from "@/i18n/server";
import { SearchBar } from "@/shared/components/common/SearchBar";

interface TheNavbarProps {
  dictionary: Dictionary;
  showHero?: boolean;
  journalTitle?: string | undefined;
  journalPublishingMode?: string | undefined;
  logoUrl?: string | undefined;
  journalCoverImageUrl?: string | undefined;
  aboutItems?: Array<{ to: string; label: string }>;
  publishItems?: Array<{ to: string; label: string }>;
  currentIssueLabel?: string | undefined;
  currentIssueDateLabel?: string | undefined;
  submissionPortalUrl?: string | undefined;
}

export function TheNavbar({
  dictionary,
  showHero = false,
  journalTitle,
  journalPublishingMode,
  logoUrl = "/logo.svg",
  journalCoverImageUrl,
  aboutItems = [],
  publishItems = [],
  currentIssueLabel,
  currentIssueDateLabel,
  submissionPortalUrl,
}: TheNavbarProps) {
  const pathname = usePathname();
  const aboutNavHref = aboutItems[0]?.to ?? PUBLIC_ROUTES.about;
  const publishNavHref = publishItems[0]?.to ?? PUBLIC_ROUTES.publish;
  const isAboutSectionActive =
    pathname === "/about" || pathname.startsWith("/about/");
  const isPublishSectionActive =
    pathname === "/publish" || pathname.startsWith("/publish/");

  return (
    <header className="relative z-40 border-b border-border bg-white">
      {showHero ? (
        <div className="relative overflow-hidden border-b border-slate-600/20 bg-slate-100 text-primary-dark">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc_0%,#e2e8f0_42%,#cbd5e1_100%)]" />
            <div className="absolute -left-14 top-[-24px] h-56 w-56 rounded-full bg-blue-500/30 blur-2xl" />
            <div className="absolute left-[10%] top-[22%] h-72 w-72 rounded-full bg-sky-400/25 blur-3xl" />
            <div className="absolute left-[38%] bottom-[-106px] h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
            <div className="absolute right-[10%] top-[-74px] h-80 w-80 rounded-full bg-indigo-400/22 blur-3xl" />
            <div className="absolute right-[-24px] bottom-[8%] h-64 w-64 rounded-full bg-slate-500/18 blur-3xl" />
            <div className="absolute inset-y-0 left-[24%] w-[42%] rounded-full bg-white/30 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_30%),radial-gradient(circle_at_82%_16%,rgba(37,99,235,0.12),transparent_24%),linear-gradient(112deg,rgba(255,255,255,0.16),rgba(148,163,184,0.06))]" />
          </div>

          <div className="page-container relative py-6 sm:py-8 lg:py-9">
            <div className="mb-6 hidden items-center justify-between gap-6 lg:flex">
              <div className="flex min-w-0 flex-1 items-center justify-end gap-6">
                <Link
                  href="/"
                  className="flex h-11 shrink-0 items-center justify-end gap-2"
                  aria-label={dictionary.common.site_name}
                >
                  <Image
                    src={logoUrl}
                    alt=""
                    width={42}
                    height={40}
                    unoptimized
                    className="h-10 w-auto max-w-[42px] object-contain"
                  />
                </Link>

                {currentIssueLabel ? (
                  <div className="hidden items-center gap-2 text-sm text-gray-600 xl:flex">
                    <span className="font-semibold text-primary">
                      {dictionary.issue.current_issue}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span>{currentIssueLabel}</span>
                    {currentIssueDateLabel ? (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>{currentIssueDateLabel}</span>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center xl:gap-10">
              {journalCoverImageUrl ? (
                <div className="group mx-auto block w-full max-w-[220px] shrink-0 lg:mx-0 lg:basis-[220px]">
                  <div className="overflow-hidden rounded-[28px] border border-white/80 bg-white/88 p-3 shadow-[0_26px_64px_rgba(37,99,235,0.14)] backdrop-blur-[6px] transition duration-200 group-hover:-translate-y-1 group-hover:shadow-[0_32px_76px_rgba(30,58,138,0.2)]">
                    <Image
                      src={journalCoverImageUrl}
                      alt={`${journalTitle} ${dictionary.issue.cover_image}`}
                      width={220}
                      height={293}
                      unoptimized
                      className="aspect-[3/4] w-full rounded-[18px] object-cover"
                    />
                  </div>
                </div>
              ) : null}

              <div className="min-w-0 flex-1">
                <h1 className="max-w-5xl text-3xl font-semibold tracking-tight text-primary-dark sm:text-4xl xl:text-[4rem] xl:leading-[1.02]">
                  {journalTitle ?? dictionary.common.site_name}
                </h1>

                {journalPublishingMode ? (
                  <div className="mt-6 inline-flex max-w-full flex-col rounded-[22px] border border-white/80 bg-white/74 px-5 py-4 shadow-[0_18px_36px_rgba(37,99,235,0.1)] backdrop-blur-[8px]">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {dictionary.publish.publishing_model}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-primary-dark sm:text-2xl">
                      {journalPublishingMode}
                    </p>
                  </div>
                ) : null}

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  {submissionPortalUrl ? (
                    <a
                      href={submissionPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 text-base font-semibold text-white transition hover:bg-primary-light hover:text-white"
                      style={{ color: "var(--site-white)" }}
                    >
                      <span>{dictionary.nav.article_preparation}</span>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="hidden bg-surface/70 lg:block">
        <div className="page-container flex h-[58px] items-center justify-between gap-8">
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className={`border-b-2 border-transparent py-4 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary ${pathname === "/" ? "border-primary text-primary" : ""}`}
            >
              {dictionary.nav.home}
            </Link>

            <div className="group relative">
              <div className="inline-flex items-center gap-0.5">
                <Link
                  href={aboutNavHref}
                  className={`border-b-2 border-transparent py-4 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary ${isAboutSectionActive ? "border-primary text-primary" : ""}`}
                >
                  {dictionary.nav.about}
                </Link>
                <span className="select-none text-gray-400 transition group-hover:text-primary" aria-hidden="true">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              <div className="invisible absolute left-0 top-full z-50 mt-0.5 min-w-[260px] rounded-xl border border-border bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {aboutItems.map((item) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={`block px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary ${pathname === item.to ? "bg-primary-subtle text-primary" : ""}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="group relative">
              <div className="inline-flex items-center gap-0.5">
                <Link
                  href={publishNavHref}
                  className={`border-b-2 border-transparent py-4 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary ${isPublishSectionActive ? "border-primary text-primary" : ""}`}
                >
                  {dictionary.nav.publish}
                </Link>
                <span className="select-none text-gray-400 transition group-hover:text-primary" aria-hidden="true">
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>

              <div className="invisible absolute left-0 top-full z-50 mt-0.5 min-w-[260px] rounded-xl border border-border bg-white py-2 opacity-0 shadow-lg transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {publishItems.map((item) => (
                  <Link
                    key={item.to}
                    href={item.to}
                    className={`block px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-primary-subtle hover:text-primary ${pathname === item.to ? "bg-primary-subtle text-primary" : ""}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href={PUBLIC_ROUTES.issues}
              className={`border-b-2 border-transparent py-4 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary ${pathname === "/all-issues" || pathname.startsWith("/issue/") ? "border-primary text-primary" : ""}`}
            >
              {dictionary.common.issue}
            </Link>

            <Link
              href={PUBLIC_ROUTES.authors}
              className={`border-b-2 border-transparent py-4 text-sm font-semibold text-gray-600 transition hover:border-primary hover:text-primary ${pathname === "/authors" ? "border-primary text-primary" : ""}`}
            >
              {dictionary.nav.authors}
            </Link>
          </nav>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-4">
            <SearchBar
              className="w-full max-w-[420px]"
              searchPlaceholder={dictionary.common.search_placeholder}
              searchButtonLabel={dictionary.common.search_button}
            />
          </div>
        </div>
      </div>

    </header>
  );
}
