import { AdminArticlesManager } from "@/features/article/AdminArticlesManager";
import { PageSection } from "@/shared/components/common/PageSection";
import { getDictionary, getServerLocale } from "@/i18n/server";
import { getArticleDtos, getIssueDtos } from "@/server/repository";

export default async function AdminArticlesPage() {
  const locale = getServerLocale();
  const dictionary = await getDictionary(locale);

  return (
    <PageSection
      eyebrow={dictionary.admin.title}
      title={dictionary.admin.article_list}
      description={dictionary.admin.edit_optional_fields_hint}
    >
      <AdminArticlesManager
        initialArticles={getArticleDtos()}
        issues={getIssueDtos({ includeUnpublished: true })}
        labels={{
          abstract: dictionary.admin.abstract,
          add: dictionary.admin.add_article,
          authors: dictionary.admin.authors,
          delete: dictionary.admin.delete_article,
          deleteAction: dictionary.common.delete,
          downloadCount: dictionary.article.download_count,
          edit: dictionary.admin.edit_article,
          editAction: dictionary.common.edit,
          issue: dictionary.common.issue,
          keywords: dictionary.admin.keywords,
          pageEnd: dictionary.admin.page_end,
          pageStart: dictionary.admin.page_start,
          publishedDate: dictionary.admin.publish_date,
          reset: dictionary.admin.reset,
          save: dictionary.common.save,
          title: dictionary.admin.article_title,
          type: dictionary.admin.article_type,
          viewCount: dictionary.article.view_count,
        }}
      />
    </PageSection>
  );
}
