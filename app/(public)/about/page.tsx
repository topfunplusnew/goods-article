import { getAboutList } from "@/features/about/api";
import { getIssues } from "@/features/issue/api";
import { getJournal } from "@/features/journal/api";
import { getPublishList } from "@/features/publish/api";
import { getDictionary, getServerLocale } from "@/i18n/server";
import Link from "next/link";

export default async function AboutIndexPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const [aboutList, issues, journal, publishList] = await Promise.all([
    getAboutList(),
    getIssues(),
    getJournal(),
    getPublishList(),
  ]);
  const currentIssue = issues.find((issue) => issue.isCurrent) ?? issues[0] ?? null;

  return (
    <div className="space-y-8">
      <section className="section-shell overflow-hidden border-t-4 border-t-primary">
        <div className="grid gap-8 px-6 py-8 md:px-8 md:py-10 xl:grid-cols-[minmax(0,1.15fr)_340px]">
          <div>
            <span className="eyebrow">{dictionary.nav.about}</span>
            <h1 className="page-title mt-5">{journal.title || dictionary.nav.about}</h1>
            {journal.description ? (
              <p className="mt-5 max-w-4xl text-base leading-8 text-gray-600 md:text-lg">
                {journal.description}
              </p>
            ) : null}

            <dl className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-xl border border-border bg-surface p-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{dictionary.archive.total_volumes}</dt>
                <dd className="mt-3 text-3xl font-semibold text-primary-dark">{new Set(issues.map((issue) => issue.volumeNumber)).size}</dd>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{dictionary.archive.total_issues}</dt>
                <dd className="mt-3 text-3xl font-semibold text-primary-dark">{issues.length}</dd>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{dictionary.archive.years_covered}</dt>
                <dd className="mt-3 text-3xl font-semibold text-primary-dark">{new Set(issues.map((issue) => issue.volumeNumber)).size}</dd>
              </div>
              <div className="rounded-xl border border-border bg-surface p-5">
                <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{dictionary.nav.about}</dt>
                <dd className="mt-3 text-3xl font-semibold text-primary-dark">{aboutList.length}</dd>
              </div>
            </dl>
          </div>

          <aside className="section-muted self-start">
            <p className="eyebrow">{dictionary.nav.publish}</p>
            <h2 className="mt-4 text-2xl font-semibold text-primary-dark">{dictionary.nav.publish}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              {dictionary.common.journal} / {currentIssue ? dictionary.archive.volume_issue_label.replace("{volume}", String(currentIssue.volumeNumber)).replace("{issue}", String(currentIssue.issueNumber)) : dictionary.common.none}
            </p>

            <div className="mt-6 space-y-3">
              {publishList.map((item) => (
                <Link
                  key={item.id}
                  href={`/publish/${item.id}`}
                  className="block rounded-xl border border-border bg-white px-4 py-4 transition hover:border-primary hover:bg-primary-subtle"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{dictionary.nav.publish}</p>
                  <h3 className="mt-2 text-base font-semibold text-primary-dark">{locale === "zh" ? item.labelCn || item.label : item.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{item.slug}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-shell p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{dictionary.about.sections_title}</p>
            <h2 className="section-title mt-3">{dictionary.about.sections_heading}</h2>
            <p className="mt-3 text-sm leading-7 text-gray-500">{dictionary.about.sections_description}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {aboutList.map((about) => (
            <Link
              key={about.id}
              href={`/about/${about.slug}`}
              className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary hover:bg-white"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{dictionary.nav.about}</p>
              <h3 className="mt-3 text-xl font-semibold text-primary-dark">{locale === "zh" ? about.labelCn || about.label : about.label}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-500">{about.slug}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
