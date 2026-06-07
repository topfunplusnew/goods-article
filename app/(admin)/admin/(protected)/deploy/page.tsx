import { PageSection } from "@/shared/components/common/PageSection";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function AdminDeployPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.admin.title}
      title={dictionary.admin.deploy_center}
      description={dictionary.admin.deploy_staging_description}
    />
  );
}
