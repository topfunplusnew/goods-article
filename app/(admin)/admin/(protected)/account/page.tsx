import { PageSection } from "@/shared/components/common/PageSection";
import { getDictionary, getServerLocale } from "@/i18n/server";

export default async function AdminAccountPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.admin.title}
      title={dictionary.admin.account_security}
      description={dictionary.admin.change_password_description}
    />
  );
}
