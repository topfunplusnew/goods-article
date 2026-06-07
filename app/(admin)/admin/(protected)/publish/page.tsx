import { AdminPagesManager } from "@/features/admin/AdminPagesManager";
import { PageSection } from "@/shared/components/common/PageSection";
import { getDictionary, getServerLocale } from "@/i18n/server";
import { getPublishDtos } from "@/server/repository";

export default async function AdminPublishPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.admin.title}
      title={dictionary.admin.publish_pages}
      description={dictionary.admin.about_storage_hint}
    >
      <AdminPagesManager
        initialPages={JSON.parse(JSON.stringify(getPublishDtos()))}
        resource="publishes"
        labels={{
          add: dictionary.admin.add_page,
          content: dictionary.admin.custom_about_body_en,
          contentCn: dictionary.admin.custom_about_body_zh,
          delete: dictionary.common.delete,
          deleteAction: dictionary.common.delete,
          edit: dictionary.admin.edit_publish_page,
          editAction: dictionary.common.edit,
          journalId: "Journal ID",
          label: dictionary.admin.custom_about_label_en,
          labelCn: dictionary.admin.custom_about_label_zh,
          order: dictionary.admin.page_order_index,
          reset: dictionary.admin.reset,
          save: dictionary.common.save,
          slug: dictionary.admin.custom_about_slug,
          title: dictionary.admin.custom_about_title_en,
          titleCn: dictionary.admin.custom_about_title_zh,
        }}
      />
    </PageSection>
  );
}
