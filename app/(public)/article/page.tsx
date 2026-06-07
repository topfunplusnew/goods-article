import Link from "next/link";

import { searchArticles } from "@/features/article/api";
import { Breadcrumb } from "@/shared/components/common/Breadcrumb";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function ArticleIndexPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const articles = await searchArticles({
    page: 1,
    pageSize: 10,
  });

  return (
    <div className="space-y-8">
      <section className="section-shell">
        <div className="grid gap-0 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
          <aside className="section-muted border-b border-border px-6 py-8 xl:sticky xl:top-6 xl:self-start xl:border-b-0 xl:border-r md:px-8">
            <p className="eyebrow">{locale === "zh" ? "文章筛选" : "Article Filters"}</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-primary-dark">
              {locale === "zh" ? "文章" : "Article"}
            </h1>
            <p className="mt-3 text-justify text-sm leading-7 text-gray-600">
              {dictionary.home.latest_articles_hint}
            </p>

            <form className="mt-6 space-y-4" action="/article/search">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-700">
                  {locale === "zh" ? "标题或全文关键词" : "Title or full-text keyword"}
                </span>
                <input
                  name="q"
                  type="search"
                  className="input text-sm"
                  placeholder={locale === "zh" ? "输入标题关键词" : "Search by title keyword"}
                />
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" className="btn btn-primary flex-1 justify-center">
                  {locale === "zh" ? "应用筛选" : "Apply Filters"}
                </button>
              </div>
            </form>
          </aside>

          <div className="px-6 py-8 md:px-8">
            <Breadcrumb items={[{ label: dictionary.nav.home, to: "/" }, { label: dictionary.nav.journal }]} />

            <div className="mt-6 flex flex-col gap-4 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow">{locale === "zh" ? "文章索引" : "Article Index"}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-primary-dark">
                  {locale === "zh" ? "文章" : "Article"}
                </h2>
              </div>
            </div>

            <section className="space-y-6 py-6">
              <div className="overflow-hidden rounded-2xl border border-border bg-white">
                {articles.map((article) => (
                  <article
                    key={article.id}
                    className="border-b border-border px-6 py-5 transition hover:bg-surface/40 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/article/${article.id}`}
                        className="block text-[1.45rem] font-semibold leading-8 text-primary transition hover:text-primary-light hover:underline md:text-[1.55rem] md:leading-9"
                      >
                        {article.title}
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] leading-7 text-gray-700">
                        {article.authors.length
                          ? article.authors.map((author, authorIndex) => (
                              <span key={`${article.id}-${author}`} className="inline-flex items-center gap-1.5">
                                <Link href={`/article/search?q=${encodeURIComponent(author)}`} className="transition hover:text-primary hover:underline">
                                  {author}
                                </Link>
                                {authorIndex < article.authors.length - 1 ? <span className="text-gray-400">;</span> : null}
                              </span>
                            ))
                          : dictionary.common.none}
                      </div>

                      <p className="mt-1 text-[15px] leading-7 text-gray-700">
                        <span className="font-medium text-gray-600">{locale === "zh" ? "浏览" : "Views"}:</span>
                        <span className="ml-1">{article.viewCount}</span>
                        <span className="mx-1 text-gray-400">,</span>
                        <span className="font-medium text-gray-600">{locale === "zh" ? "下载" : "Downloads"}:</span>
                        <span className="ml-1">{article.downloadCount}</span>
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-border pt-3 text-[15px]">
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
          </div>
        </div>
      </section>
    </div>
  );
}
