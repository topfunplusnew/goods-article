import { PageSection } from "@/shared/components/common/PageSection";
import { getAboutById, getAboutList } from "@/features/about/api";
import { getDictionary, getServerLocale } from "@/i18n/server";

interface AboutSlugPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export default async function AboutSlugPage({ params }: AboutSlugPageProps) {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const { slug } = await params;
  const aboutList = await getAboutList();
  const joinedSlug = (slug ?? []).join("/");
  const currentAbout = aboutList.find((item) => item.slug === joinedSlug);

  if (!currentAbout) {
    return (
      <PageSection
        eyebrow={dictionary.nav.about}
        title={dictionary.about.overview_title}
        description={joinedSlug}
      />
    );
  }

  const about = await getAboutById(String(currentAbout.id));

  return (
    <PageSection
      eyebrow={dictionary.nav.about}
      title={about.title}
      description={about.slug}
    >
      <div
        className="html-preview-render"
        dangerouslySetInnerHTML={{ __html: locale === "zh" ? about.contentCn : about.content }}
      />
    </PageSection>
  );
}
