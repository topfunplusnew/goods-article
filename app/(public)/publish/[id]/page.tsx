import Link from "next/link";

import { getPublishList } from "@/features/publish/api";
import { HtmlContent } from "@/shared/components/common/HtmlContent";
import { getPublishById } from "@/features/publish/api";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface PublishDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublishDetailPage({
  params,
}: PublishDetailPageProps) {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const { id } = await params;
  const [publish, publishList] = await Promise.all([
    getPublishById(id),
    getPublishList(),
  ]);

  return (
    <div className="space-y-8">
      <section className="section-shell overflow-hidden">
        <div className="border-b border-border bg-surface/80 px-6 py-4 md:px-8">
          <nav className="flex flex-wrap gap-3" aria-label={dictionary.nav.publish}>
            {publishList.map((item) => (
              <Link
                key={item.id}
                href={`/publish/${item.id}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${item.id === publish.id ? "border-primary bg-primary text-white" : "border-border bg-white text-gray-600 hover:border-primary hover:text-primary"}`}
              >
                {locale === "zh" ? item.labelCn || item.label : item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-6 py-8 md:px-8 md:py-10">
          <article>
            <h1 className="page-title">{locale === "zh" ? publish.titleCn || publish.title : publish.title}</h1>
            <HtmlContent
              html={locale === "zh" ? publish.contentCn : publish.content}
              className="mt-8"
            />
          </article>
        </div>
      </section>
    </div>
  );
}
