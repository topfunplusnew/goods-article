import { AdminVolumesManager } from "@/features/volume/AdminVolumesManager";
import { PageSection } from "@/shared/components/common/PageSection";
import { getDictionary, getServerLocale } from "@/i18n/server";
import { getVolumeDtos } from "@/server/repository";

export default async function AdminVolumesPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.admin.title}
      title={dictionary.admin.volume_list}
      description={dictionary.admin.volume_manage_hint}
    >
      <AdminVolumesManager
        initialVolumes={getVolumeDtos()}
        labels={{
          add: dictionary.admin.add_volume,
          delete: dictionary.common.delete,
          edit: dictionary.common.edit,
          issues: dictionary.admin.issues,
          journalId: "Journal ID",
          published: dictionary.archive.published,
          reset: dictionary.admin.reset,
          save: dictionary.common.save,
          title: dictionary.common.volume,
          unpublished: dictionary.archive.unpublished,
          volumeNumber: dictionary.admin.volume_number_label,
          year: dictionary.archive.year,
        }}
      />
    </PageSection>
  );
}
