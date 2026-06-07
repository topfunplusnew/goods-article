import Link from "next/link";

import { getAuthors } from "@/features/author/api";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface AuthorsPageProps {
  searchParams?: Promise<{
    q?: string;
  }>;
}

export default async function AuthorsPage({ searchParams }: AuthorsPageProps) {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const authors = await getAuthors();
  const params = searchParams ? await searchParams : undefined;
  const query = typeof params?.q === "string" ? params.q.trim().toLowerCase() : "";
  const filteredAuthors = query
    ? authors.filter((author) => author.displayName.toLowerCase().includes(query))
    : authors;

  return (
    <div className="space-y-8">
      <section className="card rounded-xl p-6 md:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center rounded-full bg-primary-subtle px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              {dictionary.nav.authors}
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-primary-dark md:text-4xl">
              {dictionary.author.browse_authors}
            </h1>
            <p className="text-base leading-8 text-gray-600 md:text-lg">
              {dictionary.author.directory_hint}
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface px-6 py-5 text-center xl:min-w-[180px]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              {dictionary.nav.authors}
            </p>
            <p className="mt-3 text-3xl font-semibold text-primary-dark">
              {filteredAuthors.length}
            </p>
          </div>
        </div>

        <form className="mt-6 flex flex-col gap-3 md:flex-row" action="/authors">
          <input
            name="q"
            type="search"
            defaultValue={query}
            className="input flex-1"
            placeholder={dictionary.author.search_placeholder}
          />
          <button type="submit" className="btn btn-primary md:min-w-[140px]">
            {dictionary.common.search_button}
          </button>
        </form>
      </section>

      <section className="space-y-6">
        <p className="text-sm text-gray-500">
          {dictionary.author.page_summary
            .replace("{count}", String(filteredAuthors.length))
            .replace("{page}", "1")}
        </p>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredAuthors.map((author) => (
            <article key={author.id} className="card rounded-[24px] p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary-subtle text-lg font-semibold text-primary">
                  {author.displayName.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold text-primary-dark">
                    {author.displayName}
                  </h2>
                  <p className="mt-2 text-sm text-gray-500">
                    {author.email || dictionary.author.email_empty}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-400">
                    ID {author.id}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-border bg-surface px-4 py-4">
                <p className="text-xs uppercase tracking-[0.22em] text-gray-500">
                  {dictionary.article.created_at}
                </p>
                <p className="mt-2 text-sm font-medium text-primary-dark">
                  {new Date(author.createdAt).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <Link
                href={`/article/search?q=${encodeURIComponent(author.displayName)}`}
                className="mt-5 inline-flex items-center text-sm font-semibold text-primary transition hover:text-primary-dark hover:underline"
              >
                {dictionary.author.view_articles}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
