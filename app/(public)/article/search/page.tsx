import Link from "next/link";

import { searchArticles } from "@/features/article/api";
import { Breadcrumb } from "@/shared/components/common/Breadcrumb";
import { SearchBar } from "@/shared/components/common/SearchBar";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface ArticleSearchPageProps {
  searchParams?: Promise<{
    q?: string;
    keyword?: string;
  }>;
}

export default async function ArticleSearchPage({
  searchParams,
}: ArticleSearchPageProps) {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const params = searchParams ? await searchParams : undefined;
  const queryText = typeof params?.q === "string" ? params.q.trim() : "";
  const queryKeyword = typeof params?.keyword === "string" ? params.keyword.trim() : "";
  const searchRequest: {
    q?: string;
    keyword?: string;
    page: number;
    pageSize: number;
  } = {
    page: 1,
    pageSize: 10,
  };

  if (queryText) {
    searchRequest.q = queryText;
  }
  if (queryKeyword) {
    searchRequest.keyword = queryKeyword;
  }

  const articles = await searchArticles({
    ...searchRequest,
  });
  const searchSummary = queryKeyword
    ? dictionary.article.search_results_for_keyword.replace("{keyword}", queryKeyword)
    : queryText
      ? dictionary.article.search_results_for_query.replace("{query}", queryText)
      : dictionary.article.search_results_hint;

  return (
    <div className="space-y-8">
      <section className="section-shell overflow-hidden">
        <div className="grid gap-0 xl:grid-cols-[minmax(0,1.1fr)_320px]">
          <div className="px-6 py-8 md:px-8 md:py-10">
            <Breadcrumb items={[{ label: dictionary.nav.home, to: "/" }, { label: dictionary.common.search }]} />
            <span className="eyebrow mt-6">{dictionary.common.search}</span>
            <h1 className="page-title mt-5">{dictionary.article.search_results}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
              {searchSummary}
            </p>

            <div className="mt-8 max-w-3xl">
              <SearchBar
                searchPlaceholder={dictionary.common.search_placeholder}
                searchButtonLabel={dictionary.common.search_button}
              />
            </div>
          </div>

          <aside className="gradient-secondary px-6 py-8 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {dictionary.article.search_controls}
            </p>

            <div className="mt-5 rounded-xl border border-white/60 bg-white/70 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-gray-400">{dictionary.article.current_page_count}</p>
              <p className="mt-2 text-3xl font-semibold text-primary-dark">{articles.length}</p>
              <p className="mt-2 text-sm leading-7 text-gray-500">{dictionary.article.search_sort_hint}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {articles.map((article) => (
            <article key={article.id} className="card p-6">
              <Link
                href={`/article/${article.id}`}
                className="block text-[1.45rem] font-semibold leading-8 text-primary transition hover:text-primary-light hover:underline"
              >
                {article.title}
              </Link>

              <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[15px] leading-7 text-gray-700">
                {article.authors.map((author, authorIndex) => (
                  <span key={`${article.id}-${author}`} className="inline-flex items-center gap-1.5">
                    <Link href={`/article/search?q=${encodeURIComponent(author)}`} className="transition hover:text-primary hover:underline">
                      {author}
                    </Link>
                    {authorIndex < article.authors.length - 1 ? <span className="text-gray-400">;</span> : null}
                  </span>
                ))}
              </div>

              <p className="mt-1 text-[15px] leading-7 text-gray-700">
                <span className="font-medium text-gray-600">{locale === "zh" ? "浏览" : "Views"}:</span>
                <span className="ml-1">{article.viewCount}</span>
                <span className="mx-1 text-gray-400">,</span>
                <span className="font-medium text-gray-600">{locale === "zh" ? "下载" : "Downloads"}:</span>
                <span className="ml-1">{article.downloadCount}</span>
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
