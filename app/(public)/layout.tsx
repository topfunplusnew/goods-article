import type { ReactNode } from "react";

import { getIssues } from "@/features/issue/api";
import { getJournal } from "@/features/journal/api";
import { resolveJournalCoverImageUrl } from "@/features/journal/assets";
import { TheFooter } from "@/shared/components/layout/TheFooter";
import { TheNavbar } from "@/shared/components/layout/TheNavbar";
import { getDictionary, getServerLocale } from "@/i18n/server";
import { getStaticAssetMap } from "@/server/repository";

interface PublicLayoutProps {
  children: ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const locale = getServerLocale();
  const [dictionary, journal, issues] = await Promise.all([
    getDictionary(locale),
    getJournal(),
    getIssues(),
  ]);
  const staticAssets = getStaticAssetMap();
  const currentIssue = issues.find((issue) => issue.isCurrent) ?? issues[0] ?? null;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <TheNavbar
        dictionary={dictionary}
        showHero
        journalTitle={journal.title}
        journalPublishingMode={journal.publishingMode}
        logoUrl={staticAssets["brand.logoSvg"]}
        journalCoverImageUrl={resolveJournalCoverImageUrl(journal.coverImage) || staticAssets["journal.fallbackCover"]}
        currentIssueLabel={currentIssue ? dictionary.archive.volume_issue_label.replace("{volume}", String(currentIssue.volumeNumber)).replace("{issue}", String(currentIssue.issueNumber)) : undefined}
        currentIssueDateLabel={currentIssue?.publishDate ?? undefined}
        submissionPortalUrl="https://author.ai4e.org/"
      />
      <main className="flex-1 px-0 py-8 sm:py-10 lg:py-12">
        <div className="page-container">{children}</div>
      </main>
      <TheFooter runtimeNote={dictionary.footer.runtime_note} siteName={dictionary.common.site_name} />
    </div>
  );
}
