import Link from "next/link";

import { getIssues } from "@/features/issue/api";
import { getJournal } from "@/features/journal/api";
import type { IssueListItem } from "@/features/issue/model";
import { Breadcrumb } from "@/shared/components/common/Breadcrumb";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface ArchiveVolume {
  id: number;
  volumeNumber: number;
  year: number;
  issues: IssueListItem[];
}

interface ArchiveYearGroup {
  year: number;
  volumes: ArchiveVolume[];
  issueCount: number;
}

function getIssueYear(issue: IssueListItem): number {
  if (!issue.publishDate) {
    return new Date().getFullYear();
  }

  const date = new Date(issue.publishDate);
  return Number.isNaN(date.getTime()) ? new Date().getFullYear() : date.getFullYear();
}

function formatMonthYear(value: string | null, locale: "en" | "zh"): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
  });
}

function volumePeriodLabel(volume: ArchiveVolume, locale: "en" | "zh"): string {
  const timestamps = volume.issues
    .map((issue) => issue.publishDate ? new Date(issue.publishDate).getTime() : Number.NaN)
    .filter((value) => Number.isFinite(value))
    .sort((left, right) => left - right);

  if (!timestamps.length) {
    return String(volume.year);
  }

  const first = new Date(timestamps[0] ?? Date.now()).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
  });
  const last = new Date(timestamps[timestamps.length - 1] ?? Date.now()).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
  });

  return first === last ? first : `${first} - ${last}`;
}

function groupArchive(issues: IssueListItem[]): ArchiveYearGroup[] {
  const volumeMap = new Map<number, ArchiveVolume>();

  for (const issue of issues) {
    const year = getIssueYear(issue);
    const current = volumeMap.get(issue.volumeId) ?? {
      id: issue.volumeId,
      volumeNumber: issue.volumeNumber,
      year,
      issues: [],
    };
    current.issues.push(issue);
    current.year = Math.max(current.year, year);
    volumeMap.set(issue.volumeId, current);
  }

  const yearMap = new Map<number, ArchiveVolume[]>();

  for (const volume of volumeMap.values()) {
    volume.issues.sort((left, right) => {
      const rightTime = right.publishDate ? new Date(right.publishDate).getTime() : 0;
      const leftTime = left.publishDate ? new Date(left.publishDate).getTime() : 0;
      return rightTime - leftTime || right.issueNumber - left.issueNumber;
    });

    const volumes = yearMap.get(volume.year) ?? [];
    volumes.push(volume);
    yearMap.set(volume.year, volumes);
  }

  return [...yearMap.entries()]
    .sort(([left], [right]) => right - left)
    .map(([year, volumes]) => ({
      year,
      volumes: volumes.sort((left, right) => right.volumeNumber - left.volumeNumber),
      issueCount: volumes.reduce((count, volume) => count + volume.issues.length, 0),
    }));
}

export default async function AllIssuesPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const [issues, journal] = await Promise.all([getIssues(), getJournal()]);
  const archiveGroups = groupArchive(issues);
  const archiveVolumeTotal = archiveGroups.reduce((count, group) => count + group.volumes.length, 0);
  const archiveIssueTotal = archiveGroups.reduce((count, group) => count + group.issueCount, 0);
  const archiveYearOptions = archiveGroups.map((group) => group.year);

  return (
    <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="section-muted space-y-6 px-6 py-8 md:px-8 xl:sticky xl:top-6 xl:self-start">
        <Breadcrumb items={[{ label: dictionary.nav.home, to: "/" }, { label: dictionary.nav.issues, to: "/all-issues" }]} />

        <div>
          <p className="eyebrow">{dictionary.nav.issues}</p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-primary-dark md:text-3xl">
            {dictionary.archive.volumes_and_issues_title}
          </h1>
          <p className="mt-5 text-justify text-sm leading-6 text-gray-600 md:leading-7">
            {dictionary.archive.volumes_and_issues_lead}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {journal.issn ? <span className="meta-chip">ISSN {journal.issn}</span> : null}
            {journal.publisher ? <span className="meta-chip">{journal.publisher}</span> : null}
          </div>

          <section className="section-shell mt-8 p-6">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <div className="min-w-0 rounded-xl border border-border bg-white px-4 py-4">
                <dt className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.archive.total_volumes}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-primary-dark">
                  {archiveVolumeTotal}
                </dd>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-white px-4 py-4">
                <dt className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.archive.total_issues}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-primary-dark">
                  {archiveIssueTotal}
                </dd>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-white px-4 py-4">
                <dt className="break-words text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.archive.years_covered}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-primary-dark">
                  {archiveGroups.length}
                </dd>
              </div>
            </dl>
          </section>

          <section className="section-shell p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">
                  {dictionary.archive.filters}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-primary-dark">
                  {dictionary.archive.browse_archive}
                </h2>
              </div>
              <button
                type="button"
                className="text-sm font-semibold text-primary transition hover:text-primary-light"
              >
                {dictionary.archive.clear_filters}
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  {dictionary.common.search}
                </span>
                <input
                  type="search"
                  className="input text-sm"
                  placeholder={dictionary.archive.search_placeholder}
                />
              </label>

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {dictionary.archive.year}
                  </span>
                  <span className="text-xs text-gray-400">
                    {archiveYearOptions.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-[4px] border border-primary bg-primary px-3 py-1.5 text-sm text-white transition"
                  >
                    {dictionary.archive.all_years}
                  </button>
                  {archiveYearOptions.map((year) => (
                    <button
                      key={year}
                      type="button"
                      className="rounded-[4px] border border-border bg-white px-3 py-1.5 text-sm text-gray-600 transition hover:border-primary hover:text-primary"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface px-4 py-4 transition hover:border-primary">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span>
                  <span className="block text-sm font-medium text-primary-dark">
                    {dictionary.issue.current_issue}
                  </span>
                  <span className="mt-1 block text-xs leading-6 text-gray-500">
                    {dictionary.archive.current_only_hint}
                  </span>
                </span>
              </label>
            </div>
          </section>
        </div>
      </aside>

      <div className="min-w-0 space-y-8 px-6 md:px-8 xl:px-0">
        {archiveGroups.length === 0 ? (
          <div className="section-shell px-6 py-12 text-center">
            <h2 className="text-2xl font-semibold text-primary-dark">
              {dictionary.archive.no_issues}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              {dictionary.archive.no_issues_hint}
            </p>
          </div>
        ) : (
          <section className="section-shell p-6 md:p-8">
            <p className="eyebrow text-primary">
              {dictionary.archive.volume_issue_index_eyebrow}
            </p>
            <h2 className="page-title mt-2">
              {dictionary.archive.volumes_and_issues_title}
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
              {dictionary.archive.index_live_summary
                .replace("{volumes}", String(archiveVolumeTotal))
                .replace("{issues}", String(archiveIssueTotal))}
            </p>

            <div className="mt-10 space-y-12">
              {archiveGroups.map((group) => (
                <div
                  key={group.year}
                  id={`archive-year-${group.year}`}
                  className="scroll-mt-36 space-y-8"
                >
                  {archiveGroups.length > 1 ? (
                    <h3 className="border-b border-border pb-3 text-2xl font-semibold text-primary-dark">
                      {group.year}
                    </h3>
                  ) : null}

                  {group.volumes.map((volume) => (
                    <div key={volume.id} className="space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                        <span className="text-lg font-semibold text-primary-dark md:text-xl">
                          {dictionary.archive.volume.replace("{number}", String(volume.volumeNumber))}
                        </span>
                        <span className="text-sm font-medium text-gray-500 md:text-base">
                          {volumePeriodLabel(volume, locale)}
                        </span>
                      </div>

                      <div className="divide-y divide-border">
                        {volume.issues.map((issue) => (
                          <div
                            key={issue.id}
                            id={`issue-${issue.id}`}
                            className="scroll-mt-36 py-4 first:pt-0"
                          >
                            <Link
                              href={`/issue/${issue.issueNumber}`}
                              className="group block"
                            >
                              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                <span className="text-base font-semibold text-primary transition group-hover:text-primary-light group-hover:underline md:text-lg">
                                  {dictionary.archive.issue.replace("{number}", String(issue.issueNumber))}
                                </span>
                                <span className="text-gray-300">|</span>
                                <span className="text-sm text-gray-600 md:text-base">
                                  {formatMonthYear(issue.publishDate, locale)}
                                </span>
                                {issue.isCurrent ? (
                                  <span className="rounded-[4px] bg-primary-subtle px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                    {dictionary.issue.current_issue}
                                  </span>
                                ) : null}
                              </div>
                              {issue.title ? (
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                  {issue.title}
                                </p>
                              ) : null}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
