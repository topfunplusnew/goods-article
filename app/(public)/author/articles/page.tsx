import { PageSection } from "@/shared/components/common/PageSection";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function AuthorArticlesPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.nav.submit_manuscript}
      title={dictionary.nav.submit_manuscript}
      description={dictionary.user.login_required_hint}
    />
  );
}
