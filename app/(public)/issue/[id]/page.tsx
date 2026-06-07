import Link from "next/link";

import { getArticleById } from "@/features/article/api";
import type { ArticleDetail } from "@/features/article/model";
import { getIssueById, getIssues } from "@/features/issue/api";
import { resolveIssueCoverImageUrl } from "@/features/issue/assets";
import type { IssueDetail } from "@/features/issue/model";
import { Breadcrumb } from "@/shared/components/common/Breadcrumb";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface IssueDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ArticleGroup {
  type: string;
  label: string;
  articles: ArticleDetail[];
}

function formatIssueDate(value: string | null, locale: "en" | "zh"): string {
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
    day: "numeric",
  });
}

function getArticleYear(article: ArticleDetail): string {
  const date = new Date(article.createdAt);
  return Number.isNaN(date.getTime()) ? "" : String(date.getUTCFullYear());
}

function getArticlePageValue(): string {
  return "-";
}

function groupArticles(articles: ArticleDetail[]): ArticleGroup[] {
  const groups = new Map<string, ArticleDetail[]>();

  for (const article of articles) {
    const list = groups.get(article.type) ?? [];
    list.push(article);
    groups.set(article.type, list);
  }

  return [...groups.entries()].map(([type, list]) => ({
    type,
    label: type,
    articles: list,
  }));
}

async function resolveIssue(segment: string): Promise<IssueDetail> {
  const issues = await getIssues();
  const numericSegment = Number(segment);
  const issueByNumber = Number.isFinite(numericSegment)
    ? [...issues]
        .filter((issue) => issue.issueNumber === numericSegment)
        .sort((left, right) => right.volumeNumber - left.volumeNumber)[0]
    : undefined;

  return getIssueById(String(issueByNumber?.id ?? segment));
}

export default async function IssueDetailPage({
  params,
}: IssueDetailPageProps) {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const { id } = await params;
  const issue = await resolveIssue(id);
  const articleDetails = await Promise.all(
    issue.articles.map((article) => getArticleById(String(article.id))),
  );
  const headingTitle = dictionary.archive.volume_issue_label
    .replace("{volume}", String(issue.volumeNumber))
    .replace("{issue}", String(issue.issueNumber));
  const issueEyebrow = dictionary.archive.volume.replace("{number}", String(issue.volumeNumber));
  const issueDateLabel = formatIssueDate(issue.publishDate, locale);
  const formatIssueMeta = [issue.title, issueDateLabel].filter(Boolean).join(" | ");
  const articleCountLabel = `${issue.articles.length} ${dictionary.common.article}`;
  const issuePageSummary = `${headingTitle} | ${articleCountLabel}`;
  const issueArticleGroups = groupArticles(articleDetails);
  const issueCoverUrl = resolveIssueCoverImageUrl(issue.coverImage);

  return (
    <div className="space-y-8">
      <section className="section-shell overflow-hidden">
        <div className="border-b border-border px-6 py-6 md:px-8 md:py-8">
          <Breadcrumb items={[{ label: dictionary.nav.home, to: "/" }, { label: dictionary.nav.issues, to: "/all-issues" }, { label: headingTitle }]} />

          <div className="mt-8 grid gap-6 lg:grid-cols-[170px_minmax(0,1fr)] lg:items-start xl:grid-cols-[190px_minmax(0,1fr)] xl:gap-8">
            <div className="mx-auto w-full max-w-[190px] lg:mx-0">
              <div className="overflow-hidden rounded-[20px] border border-border bg-white shadow-sm">
                {issueCoverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={issueCoverUrl}
                    alt={`${headingTitle} ${dictionary.issue.cover_image}`}
                    className="aspect-[3/4] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[3/4] flex-col justify-between bg-[linear-gradient(180deg,#edf4ff_0%,#f8fbff_100%)] p-5">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70">
                      {issueEyebrow}
                    </span>
                    <p className="text-sm leading-6 text-gray-500">
                      {issueDateLabel}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-primary/80">
                {issueEyebrow}
              </p>

              <h1 className="mt-3 max-w-5xl text-balance text-[1.75rem] font-semibold leading-[1.28] text-primary-dark md:text-[2.15rem] md:leading-[1.24]">
                {headingTitle}
              </h1>

              <p className="mt-4 text-sm text-gray-500">
                {formatIssueMeta}
              </p>

              <div className="mt-7">
                <Link
                  href="/all-issues"
                  className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-full border-2 border-primary bg-white px-6 py-3 text-lg font-semibold text-primary transition hover:bg-primary-subtle"
                >
                  <span>{dictionary.issue.view_all_volumes_and_issues}</span>
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 md:px-8 md:pb-10">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
                {dictionary.issue.table_of_contents}
              </h2>
            </div>
            <span className="text-sm text-gray-500">
              {articleCountLabel}
            </span>
          </div>

          {!issueArticleGroups.length ? (
            <div className="py-10 text-center text-sm text-gray-500">
              {dictionary.common.no_results}
            </div>
          ) : (
            <section className="space-y-12 py-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <p className="text-sm text-gray-500">
                  {issuePageSummary}
                </p>
              </div>

              {issueArticleGroups.map((group) => (
                <section key={group.type} className="space-y-6">
                  <div className="border-b border-border pb-5">
                    <h3 className="inline-flex rounded-md bg-primary px-6 py-3 text-xl font-semibold uppercase tracking-wide text-white md:text-2xl">
                      {group.label}
                    </h3>
                  </div>

                  <div className="space-y-8">
                    {group.articles.map((article) => (
                      <article
                        key={article.id}
                        className="bg-white px-6 py-7 shadow-[0_14px_45px_rgba(15,23,42,0.04)] transition hover:shadow-[0_18px_55px_rgba(15,23,42,0.08)] md:px-8"
                      >
                        <div className="min-w-0">
                          <Link
                            href={`/article/${article.id}?issue_id=${issue.id}`}
                            className="block text-[1.35rem] font-semibold leading-8 text-primary-dark transition hover:text-primary hover:underline md:text-[1.55rem] md:leading-9"
                          >
                            <span className="block">{article.title}</span>
                          </Link>

                          <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] leading-7 text-gray-700">
                            {article.authors.length ? article.authors.map((author, authorIndex) => (
                              <span key={`${article.id}-${author.id}`} className="contents">
                                <Link
                                  href={`/article/search?q=${encodeURIComponent(author.displayName)}`}
                                  className="transition hover:text-primary hover:underline"
                                >
                                  {author.displayName}
                                </Link>
                                {authorIndex < article.authors.length - 1 ? (
                                  <span className="text-gray-400">;</span>
                                ) : null}
                              </span>
                            )) : <span>{dictionary.common.none}</span>}
                          </div>

                          <p className="mt-1 text-[15px] leading-7 text-gray-700">
                            <span className="font-medium text-gray-600">{locale === "zh" ? "发表年份" : "Publication Year"}:</span>
                            <span className="ml-1">{getArticleYear(article)}</span>
                            <span className="mx-1 text-gray-400">,</span>
                            <span className="font-medium text-gray-600">{locale === "zh" ? "页码" : "Page(s)"}:</span>
                            <span className="ml-1">{getArticlePageValue()}</span>
                          </p>

                          <p className="mt-1 text-[15px] leading-7 text-gray-700">
                            <span className="font-medium text-gray-600">{locale === "zh" ? "浏览" : "Views"}:</span>
                            <span className="ml-1">{article.viewCount}</span>
                            <span className="mx-1 text-gray-400">,</span>
                            <span className="font-medium text-gray-600">{locale === "zh" ? "下载" : "Downloads"}:</span>
                            <span className="ml-1">{article.downloadCount}</span>
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-border pt-3 text-[15px]">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 font-medium text-primary transition hover:text-primary-light"
                            >
                              <svg className="h-4 w-4 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                              <span>{locale === "zh" ? "摘要" : "Abstract"}</span>
                            </button>

                            <a
                              href={`/api/v1/articles/${article.id}/download`}
                              className="inline-flex items-center text-[#c3382b] transition hover:text-[#a92f24]"
                              aria-label={dictionary.article.download_pdf}
                              title={dictionary.article.download_pdf}
                            >
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M6 2.75A1.75 1.75 0 0 0 4.25 4.5v15c0 .966.784 1.75 1.75 1.75h12c.966 0 1.75-.784 1.75-1.75V8.56a2.75 2.75 0 0 0-.806-1.944l-3.06-3.06A2.75 2.75 0 0 0 13.94 2.75H6Zm7 1.8c.462 0 .905.183 1.232.51l2.458 2.458a.75.75 0 0 1-.53 1.28h-2.41A1.75 1.75 0 0 1 12 7.048v-2.5Zm-5 7.45c0-.414.336-.75.75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 12Zm0 3c0-.414.336-.75.75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 8 15Zm0 3c0-.414.336-.75.75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 8 18Z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </section>
          )}

          <div className="mt-10 border-t border-border pt-8">
            <Link href="/all-issues" className="btn btn-secondary">
              {dictionary.issue.back_to_archive}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
