import Link from "next/link";

import { getLatestArticles, getPopularArticles } from "@/features/article/api";
import { getJournal } from "@/features/journal/api";
import { HtmlContent } from "@/shared/components/common/HtmlContent";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function HomePage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const [journal, latestArticles, popularArticles] = await Promise.all([
    getJournal(),
    getLatestArticles(6),
    getPopularArticles(6),
  ]);

  const journalDetails = [
    journal.issn ? { label: "ISSN", value: journal.issn } : null,
    journal.publisher ? { label: dictionary.admin.journal_publisher, value: journal.publisher } : null,
    journal.description ? { label: dictionary.admin.journal_description, value: journal.description, multiline: true } : null,
  ].filter(Boolean) as Array<{ label: string; value: string; multiline?: boolean }>;

  return (
    <div className="space-y-10">
      {journal.overview || journalDetails.length ? (
        <section className="section-shell p-6 md:p-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_320px]">
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-semibold text-primary-dark md:text-[28px]">
                  {locale === "zh" ? "期刊概览" : "Journal Overview"}
                </h2>
              </div>

              {journal.overview ? (
                <HtmlContent html={journal.overview} className="mt-4 overflow-hidden" />
              ) : null}
            </div>

            <aside className="section-muted self-start">
              <div className="mt-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-primary-dark">
                  {locale === "zh" ? "期刊信息" : "Journal details"}
                </h2>
              </div>

              <dl className="mt-6 space-y-4 text-sm text-gray-600">
                {journalDetails.map((item, index) => (
                  <div key={`${item.label}-${index}`}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      {item.label}
                    </dt>
                    <dd className={`mt-1 text-base text-primary-dark ${item.multiline ? "whitespace-pre-line break-words" : ""}`}>
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="space-y-8">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="eyebrow">{dictionary.home.latest_articles}</p>
              <h2 className="section-title mt-3">{dictionary.home.latest_articles}</h2>
              <p className="mt-3 text-sm leading-7 text-gray-500">{dictionary.home.latest_articles_hint}</p>
            </div>
            <Link href="/article" className="text-sm font-semibold text-primary">
              {dictionary.common.search}
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            {latestArticles.map((article) => (
              <article
                key={article.id}
                className="border-b border-border px-5 py-5 transition hover:bg-surface/70 last:border-b-0"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  <span className="rounded-full bg-primary-subtle px-3 py-1 text-primary">
                    {article.type}
                  </span>
                  <span>{article.viewCount} {dictionary.article.view_count}</span>
                </div>

                <Link
                  href={`/article/${article.id}`}
                  className="mt-3 block text-xl font-semibold leading-8 text-primary-dark transition hover:text-primary hover:underline"
                >
                  {article.title}
                </Link>

                <div className="mt-3 flex flex-wrap gap-2">
                  {article.authors.slice(0, 4).map((author) => (
                    <Link
                      key={`${article.id}-${author}`}
                      href={`/article/search?q=${encodeURIComponent(author)}`}
                      className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-gray-600 transition hover:border-primary hover:text-primary"
                    >
                      {author}
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
                  <a
                    href={`/api/v1/articles/${article.id}/download`}
                    className="font-medium text-gray-600 transition hover:text-primary"
                  >
                    {dictionary.article.download_pdf}
                  </a>
                  <Link
                    href={`/article/${article.id}`}
                    className="ml-auto font-semibold text-primary transition hover:text-primary-light"
                  >
                    {dictionary.article.view_details}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{dictionary.home.popular_articles}</p>
            <h2 className="section-title mt-3">{dictionary.home.popular_articles}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-500">{dictionary.home.popular_articles_hint}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-white">
          {popularArticles.map((article, index) => (
            <article
              key={article.id}
              className="border-b border-border px-5 py-5 transition hover:bg-surface/70 last:border-b-0"
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-sm font-semibold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                    <span className="rounded-full bg-primary-subtle px-3 py-1 text-primary">
                      {article.type}
                    </span>
                    <span>{article.viewCount} {dictionary.article.view_count}</span>
                  </div>

                  <Link
                    href={`/article/${article.id}`}
                    className="mt-3 block text-xl font-semibold leading-8 text-primary-dark transition hover:text-primary hover:underline"
                  >
                    {article.title}
                  </Link>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {article.authors.slice(0, 4).map((author) => (
                      <Link
                        key={`${article.id}-${author}`}
                        href={`/article/search?q=${encodeURIComponent(author)}`}
                        className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-gray-600 transition hover:border-primary hover:text-primary"
                      >
                        {author}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
