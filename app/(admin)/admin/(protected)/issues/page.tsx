import { PageSection } from "@/shared/components/common/PageSection";
import { AdminIssuesManager } from "@/features/issue/AdminIssuesManager";
import { getDictionary, getServerLocale } from "@/i18n/server";
import { getIssueDtos } from "@/server/repository";

export default async function AdminIssuesPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.admin.title}
      title={dictionary.admin.issue_list}
      description={dictionary.admin.volume_issue_shortcuts_hint}
    >
      <AdminIssuesManager
        initialIssues={getIssueDtos({ includeUnpublished: true })}
        labels={{
          addIssue: dictionary.admin.add_issue,
          editIssue: dictionary.admin.edit_issue,
          editAction: dictionary.common.edit,
          deleteIssue: dictionary.admin.delete_issue,
          deleteAction: dictionary.common.delete,
          deleteConfirm: dictionary.admin.delete_issue_confirm,
          issueNumber: dictionary.admin.issue_number,
          issueTitle: dictionary.admin.issue_title,
          volume: dictionary.common.volume,
          issue: dictionary.common.issue,
          volumeId: dictionary.admin.volume_id_label,
          volumeNumber: dictionary.admin.volume_number_label,
          coverImage: dictionary.admin.cover_image,
          coverImageUrl: dictionary.admin.cover_image_url,
          coverImageUpload: dictionary.admin.cover_image_upload,
          publishDate: dictionary.admin.publish_date,
          isCurrent: dictionary.admin.is_current,
          published: dictionary.archive.published,
          unpublished: dictionary.archive.unpublished,
          save: dictionary.common.save,
          reset: dictionary.admin.reset,
        }}
      />
    </PageSection>
  );
}
