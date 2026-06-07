import Link from "next/link";

import { getArticleById } from "@/features/article/api";
import { getJournal } from "@/features/journal/api";
import { Breadcrumb } from "@/shared/components/common/Breadcrumb";
import { SocialShare } from "@/shared/components/common/SocialShare";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface ArticleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const { id } = await params;
  const [article, journal] = await Promise.all([getArticleById(id), getJournal()]);
  const issueArchiveHref = article.issue ? `/issue/${article.issue.id}` : "";
  const publishDateLabel = article.createdAt
    ? new Date(article.createdAt).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : dictionary.common.none;
  const pageRangeLabel =
    article.issue && article.issue.issueNumber
      ? dictionary.common.none
      : dictionary.common.none;

  return (
    <div className="space-y-10">
      <section className="section-shell overflow-hidden">
        <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 xl:grid-cols-[minmax(0,1.15fr)_320px]">
          <div>
            <Breadcrumb
              items={[
                { label: dictionary.nav.home, to: "/" },
                { label: dictionary.nav.issues, to: "/all-issues" },
                ...(article.issue
                  ? [
                      { label: dictionary.archive.volume.replace("{number}", String(article.issue.volumeNumber)), to: "/all-issues" },
                      { label: dictionary.archive.issue.replace("{number}", String(article.issue.issueNumber)), to: issueArchiveHref },
                    ]
                  : []),
                { label: article.title },
              ]}
            />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="eyebrow">{journal.title}</span>
            </div>

            <h1 className="page-title mt-5 text-balance">{article.title}</h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-base text-gray-600">
              {article.authors.map((author, index) => (
                <span key={author.id} className="inline-flex items-center gap-x-3">
                  <Link
                    href={`/article/search?q=${encodeURIComponent(author.displayName)}`}
                    className="transition hover:text-primary hover:underline"
                  >
                    {author.displayName}
                  </Link>
                  {index < article.authors.length - 1 ? (
                    <span className="text-gray-300">|</span>
                  ) : null}
                </span>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-500">
              <span className="meta-chip">{article.viewCount} {dictionary.article.view_count}</span>
              <span className="meta-chip">{article.downloadCount} {dictionary.article.download_count}</span>
            </div>

            <article className="section-shell mt-8 p-6 md:p-8">
              <h2 className="section-title">{dictionary.article.abstract}</h2>
              <p className="mt-5 text-justify text-base leading-8 text-gray-600">
                {article.abstract || dictionary.common.none}
              </p>
            </article>
          </div>

          <aside className="section-muted self-start xl:sticky xl:top-6">
            <p className="eyebrow">{dictionary.article.metadata}</p>

            <dl className="mt-5 space-y-4 text-sm text-gray-600">
              <div className="border-t border-border pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.article.belongs_to_journal}
                </dt>
                <dd className="mt-2 break-words text-base text-primary-dark">
                  {journal.title || dictionary.common.none}
                </dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.article.belongs_to_volume}
                </dt>
                <dd className="mt-2 text-base text-primary-dark">
                  {article.issue ? dictionary.archive.volume.replace("{number}", String(article.issue.volumeNumber)) : dictionary.common.none}
                </dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.article.belongs_to_issue}
                </dt>
                <dd className="mt-2 text-base text-primary-dark">
                  {article.issue ? dictionary.archive.issue.replace("{number}", String(article.issue.issueNumber)) : dictionary.common.none}
                </dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.publish.publishing_model}
                </dt>
                <dd className="mt-2 break-words text-base text-primary-dark">
                  {journal.publishingMode || dictionary.common.none}
                </dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.article.publish_date}
                </dt>
                <dd className="mt-2 text-base text-primary-dark">
                  {publishDateLabel}
                </dd>
              </div>
              <div className="border-t border-border pt-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {dictionary.article.pages}
                </dt>
                <dd className="mt-2 text-base text-primary-dark">
                  {pageRangeLabel}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3">
              {issueArchiveHref ? (
                <Link href={issueArchiveHref} className="btn btn-secondary w-full justify-center">
                  {dictionary.article.back_to_issue}
                </Link>
              ) : null}
              <a href={`/api/v1/articles/${article.id}/view`} className="btn btn-primary w-full justify-center">
                {dictionary.article.view_pdf}
              </a>
              <a href={`/api/v1/articles/${article.id}/download`} className="btn btn-secondary w-full justify-center">
                {dictionary.article.download_pdf}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_320px]">
        <div className="space-y-8">
          <article className="section-shell p-6 md:p-8">
            <h2 className="section-title">{dictionary.common.share}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-500">
              {dictionary.share.description}
            </p>
            <div className="mt-6">
              <SocialShare
                url={`http://localhost:3000/article/${article.id}`}
                title={article.title}
                labels={{
                  copy: dictionary.share.copy,
                  facebook: dictionary.share.facebook,
                  email: dictionary.share.email,
                }}
              />
            </div>
          </article>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <section className="section-shell p-6">
            <h2 className="text-2xl font-semibold text-primary-dark">
              {dictionary.article.keywords}
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.keywords.length ? article.keywords.map((keyword) => (
                <Link
                  key={keyword}
                  href={`/article/search?q=${encodeURIComponent(keyword)}`}
                  className="rounded-[4px] border border-border bg-surface px-2.5 py-1.5 text-sm text-gray-600 transition hover:border-primary hover:text-primary"
                >
                  {keyword}
                </Link>
              )) : <p className="text-sm leading-7 text-gray-500">{dictionary.article.keywords_empty}</p>}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
