import { AdminJournalManager } from "@/features/journal/AdminJournalManager";
import type { JournalDto } from "@/features/journal/contracts";
import { getDictionary, getServerLocale } from "@/i18n/server";
import { getJournalDto } from "@/server/repository";
import { PageSection } from "@/shared/components/common/PageSection";

export default async function AdminJournalPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);
  const journal = getJournalDto();
  const initialJournal = journal
    ? JSON.parse(JSON.stringify(journal)) as JournalDto
    : null;

  return (
    <PageSection
      eyebrow={dictionary.admin.title}
      title={dictionary.admin.journal_settings}
      description={dictionary.admin.journal_settings_hint}
    >
      <AdminJournalManager
        initialJournal={initialJournal}
        labels={{
          back: dictionary.admin.back,
          cancel: dictionary.common.cancel,
          coverImageClear: dictionary.admin.cover_image_clear,
          coverImageUrl: dictionary.admin.cover_image_url,
          coverImageUrlPlaceholder: dictionary.admin.cover_image_url_placeholder,
          editJournal: dictionary.admin.edit_journal,
          error: dictionary.common.error,
          issn: dictionary.admin.issn,
          journalCoverImage: dictionary.admin.journal_cover_image,
          journalCoverImageFieldHint: dictionary.admin.journal_cover_image_field_hint,
          journalCoverImageUpload: dictionary.admin.journal_cover_image_upload,
          journalCoverImageUploading: dictionary.admin.journal_cover_image_uploading,
          journalCoverImageUploadSuccess: dictionary.admin.journal_cover_image_upload_success,
          journalCoverImageUploadFailed: dictionary.admin.journal_cover_image_upload_failed,
          journalDescription: dictionary.admin.journal_description,
          journalDownloads: dictionary.admin.journal_downloads,
          journalDownloadsReadonly: dictionary.admin.journal_downloads_readonly,
          journalImpactFactor: dictionary.admin.journal_impact_factor,
          journalImpactFactor5Year: dictionary.admin.journal_impact_factor_5y,
          journalName: dictionary.admin.journal_name,
          journalOverview: dictionary.admin.journal_overview,
          journalOverviewHint: dictionary.admin.journal_overview_hint,
          journalPublisher: dictionary.admin.journal_publisher,
          journalPublishingMode: dictionary.admin.journal_publishing_mode,
          journalPublishingModeHint: dictionary.admin.journal_publishing_mode_hint,
          journalSubmissionDays: dictionary.admin.journal_submission_days,
          loading: dictionary.common.loading,
          noResults: dictionary.common.no_results,
          required: dictionary.admin.required,
          retry: dictionary.common.retry,
          save: dictionary.common.save,
          success: dictionary.admin.success,
        }}
      />
    </PageSection>
  );
}
