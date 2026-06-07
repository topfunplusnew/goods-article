import { getDatabase } from "@/server/database";

type Row = Record<string, unknown>;

function asNumber(value: unknown): number {
  return Number(value);
}

function asString(value: unknown): string {
  return String(value);
}

function asNullableString(value: unknown): string | null {
  return value === null || value === undefined ? null : String(value);
}

function asBoolean(value: unknown): boolean {
  return Boolean(value);
}

function parseJson<T>(value: unknown): T {
  return JSON.parse(asString(value)) as T;
}

function nowIso(): string {
  return new Date().toISOString();
}

function stringifyJson(value: unknown): string {
  return JSON.stringify(value);
}

function issueArticlesCount(issueId: number): number {
  const row = getDatabase()
    .prepare("SELECT COUNT(*) AS count FROM articles WHERE issue_id = ?")
    .get(issueId);

  return asNumber(row?.count ?? 0);
}

function mapArticleListRow(row: Row) {
  return {
    id: asNumber(row.id),
    title: asString(row.title),
    article_type: asString(row.article_type),
    access: asBoolean(row.access),
    authors: parseJson<string[]>(row.authors_json),
    page_start: row.page_start === null ? null : asNumber(row.page_start),
    page_end: row.page_end === null ? null : asNumber(row.page_end),
    order_in_issue: row.order_in_issue === null ? null : asNumber(row.order_in_issue),
    published_date: asNullableString(row.published_date),
    view_count: asNumber(row.view_count),
    download_count: asNumber(row.download_count),
  };
}

function mapIssueListRow(row: Row) {
  const id = asNumber(row.id);

  return {
    volume_id: asNumber(row.volume_id),
    issue_number: asNumber(row.issue_number),
    title: asNullableString(row.title),
    cover_image: asNullableString(row.cover_image),
    publish_date: asNullableString(row.publish_date),
    id,
    volume_number: asNumber(row.volume_number),
    is_current: asBoolean(row.is_current),
    published: asBoolean(row.published),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    articles_count: issueArticlesCount(id),
  };
}

export function getJournalDto() {
  return getDatabase().prepare("SELECT * FROM journals ORDER BY id LIMIT 1").get();
}

export interface JournalMutationInput {
  title: string;
  description: string;
  coverImage: string;
  overview: string;
  issn: string | null;
  publisher: string;
  publishingMode: string;
  impactFactor: number | null;
  impactFactor5Year: number | null;
  submissionToDecisionDays: number | null;
}

export function updateJournalDto(journalId: string, input: JournalMutationInput) {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE journals SET
        title = ?,
        description = ?,
        cover_image = ?,
        overview = ?,
        issn = ?,
        publisher = ?,
        publishing_mode = ?,
        impact_factor = ?,
        impact_factor_5year = ?,
        submission_to_decision_days = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(
      input.title,
      input.description,
      input.coverImage,
      input.overview,
      input.issn,
      input.publisher,
      input.publishingMode,
      input.impactFactor,
      input.impactFactor5Year,
      input.submissionToDecisionDays,
      now,
      Number(journalId),
    );

  return getDatabase()
    .prepare("SELECT * FROM journals WHERE id = ?")
    .get(Number(journalId));
}

export function updateJournalCoverDto(journalId: string, coverImage: string) {
  const journal = getDatabase()
    .prepare("SELECT * FROM journals WHERE id = ?")
    .get(Number(journalId));

  if (!journal) {
    return null;
  }

  return updateJournalDto(journalId, {
    title: asString(journal.title),
    description: asString(journal.description),
    coverImage,
    overview: asString(journal.overview),
    issn: asNullableString(journal.issn),
    publisher: asString(journal.publisher),
    publishingMode: asString(journal.publishing_mode),
    impactFactor: journal.impact_factor === null ? null : asNumber(journal.impact_factor),
    impactFactor5Year: journal.impact_factor_5year === null ? null : asNumber(journal.impact_factor_5year),
    submissionToDecisionDays: journal.submission_to_decision_days === null ? null : asNumber(journal.submission_to_decision_days),
  });
}

export function getIssueDtos(options: { includeUnpublished?: boolean } = {}) {
  const whereClause = options.includeUnpublished ? "" : "WHERE published = 1";
  return getDatabase()
    .prepare(`SELECT * FROM issues ${whereClause} ORDER BY volume_number DESC, issue_number DESC`)
    .all()
    .map(mapIssueListRow);
}

export function getIssueDetailDto(
  issueId: string,
  options: { includeUnpublished?: boolean } = {},
) {
  const whereClause = options.includeUnpublished ? "id = ?" : "id = ? AND published = 1";
  const issue = getDatabase()
    .prepare(`SELECT * FROM issues WHERE ${whereClause}`)
    .get(Number(issueId));

  if (!issue) {
    return null;
  }

  return {
    ...mapIssueListRow(issue),
    articles: getArticleListByIssueDto(issueId),
  };
}

export interface IssueMutationInput {
  volumeId: number;
  volumeNumber: number;
  issueNumber: number;
  title: string | null;
  coverImage: string | null;
  publishDate: string | null;
  isCurrent: boolean;
  published: boolean;
}

export function createIssueDto(input: IssueMutationInput) {
  const now = new Date().toISOString();
  const result = getDatabase()
    .prepare(
      `INSERT INTO issues (
        volume_id,
        volume_number,
        issue_number,
        title,
        cover_image,
        publish_date,
        is_current,
        published,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.volumeId,
      input.volumeNumber,
      input.issueNumber,
      input.title,
      input.coverImage,
      input.publishDate,
      input.isCurrent ? 1 : 0,
      input.published ? 1 : 0,
      now,
      now,
    );

  const row = getDatabase()
    .prepare("SELECT * FROM issues WHERE id = last_insert_rowid()")
    .get();

  return row ? mapIssueListRow(row) : result;
}

export function updateIssueDto(issueId: string, input: IssueMutationInput) {
  const now = new Date().toISOString();
  getDatabase()
    .prepare(
      `UPDATE issues SET
        volume_id = ?,
        volume_number = ?,
        issue_number = ?,
        title = ?,
        cover_image = ?,
        publish_date = ?,
        is_current = ?,
        published = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(
      input.volumeId,
      input.volumeNumber,
      input.issueNumber,
      input.title,
      input.coverImage,
      input.publishDate,
      input.isCurrent ? 1 : 0,
      input.published ? 1 : 0,
      now,
      Number(issueId),
    );

  return getIssueDetailDto(issueId, { includeUnpublished: true });
}

export function deleteIssueDto(issueId: string): boolean {
  getDatabase()
    .prepare("DELETE FROM issues WHERE id = ?")
    .run(Number(issueId));

  return !getDatabase()
    .prepare("SELECT id FROM issues WHERE id = ?")
    .get(Number(issueId));
}

export function updateIssueCoverDto(issueId: string, coverImage: string) {
  const issue = getIssueDetailDto(issueId, { includeUnpublished: true });
  if (!issue) {
    return null;
  }

  const input: IssueMutationInput = {
    volumeId: issue.volume_id,
    volumeNumber: issue.volume_number,
    issueNumber: issue.issue_number,
    title: issue.title,
    coverImage,
    publishDate: issue.publish_date,
    isCurrent: issue.is_current,
    published: issue.published,
  };

  return updateIssueDto(issueId, input);
}

export interface VolumeMutationInput {
  journalId: number;
  volumeNumber: number;
  year: number;
  published: boolean;
}

function mapVolumeRow(row: Row) {
  const id = asNumber(row.id);
  const issueCount = getDatabase()
    .prepare("SELECT COUNT(*) AS count FROM issues WHERE volume_id = ?")
    .get(id);

  return {
    id,
    journal_id: asNumber(row.journal_id),
    volume_number: asNumber(row.volume_number),
    year: asNumber(row.year),
    published: asBoolean(row.published),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
    issues_count: asNumber(issueCount?.count ?? 0),
  };
}

export function getVolumeDtos() {
  return getDatabase()
    .prepare("SELECT * FROM volumes ORDER BY year DESC, volume_number DESC")
    .all()
    .map(mapVolumeRow);
}

export function getVolumeDetailDto(volumeId: string) {
  const row = getDatabase()
    .prepare("SELECT * FROM volumes WHERE id = ?")
    .get(Number(volumeId));

  return row ? mapVolumeRow(row) : null;
}

export function createVolumeDto(input: VolumeMutationInput) {
  const now = nowIso();
  getDatabase()
    .prepare(
      `INSERT INTO volumes (
        journal_id,
        volume_number,
        year,
        published,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
    )
    .run(input.journalId, input.volumeNumber, input.year, input.published ? 1 : 0, now, now);

  const row = getDatabase()
    .prepare("SELECT * FROM volumes WHERE id = last_insert_rowid()")
    .get();

  return row ? mapVolumeRow(row) : null;
}

export function updateVolumeDto(volumeId: string, input: VolumeMutationInput) {
  const now = nowIso();
  getDatabase()
    .prepare(
      `UPDATE volumes SET
        journal_id = ?,
        volume_number = ?,
        year = ?,
        published = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(input.journalId, input.volumeNumber, input.year, input.published ? 1 : 0, now, Number(volumeId));

  return getVolumeDetailDto(volumeId);
}

export function deleteVolumeDto(volumeId: string): boolean {
  getDatabase()
    .prepare("DELETE FROM volumes WHERE id = ?")
    .run(Number(volumeId));

  return !getDatabase()
    .prepare("SELECT id FROM volumes WHERE id = ?")
    .get(Number(volumeId));
}

export interface ArticleMutationInput {
  title: string;
  articleType: string;
  access: boolean;
  abstract: string;
  keywords: string[];
  authors: string[];
  issueId: number | null;
  pageStart: number | null;
  pageEnd: number | null;
  orderInIssue: number | null;
  publishedDate: string | null;
  viewCount: number;
  downloadCount: number;
}

function detailAuthorsFor(names: string[]) {
  return names.map((name, index) => {
    const parts = name.trim().split(/\s+/);
    const firstName = parts.slice(0, -1).join(" ") || name.trim();
    const lastName = parts.at(-1) ?? "";

    return {
      id: index + 1,
      first_name: firstName,
      last_name: lastName,
      display_name: name.trim(),
      is_corresponding: index === 0,
    };
  });
}

export function getArticleDtos() {
  return getDatabase()
    .prepare("SELECT * FROM articles ORDER BY published_date DESC, id DESC")
    .all()
    .map(mapArticleListRow);
}

export function createArticleDto(input: ArticleMutationInput) {
  const now = nowIso();
  getDatabase()
    .prepare(
      `INSERT INTO articles (
        title,
        article_type,
        access,
        abstract,
        keywords_json,
        authors_json,
        detail_authors_json,
        issue_id,
        page_start,
        page_end,
        order_in_issue,
        published_date,
        view_count,
        download_count,
        created_at,
        funds_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.title,
      input.articleType,
      input.access ? 1 : 0,
      input.abstract,
      stringifyJson(input.keywords),
      stringifyJson(input.authors),
      stringifyJson(detailAuthorsFor(input.authors)),
      input.issueId,
      input.pageStart,
      input.pageEnd,
      input.orderInIssue,
      input.publishedDate,
      input.viewCount,
      input.downloadCount,
      now,
      stringifyJson([]),
    );

  const row = getDatabase()
    .prepare("SELECT * FROM articles WHERE id = last_insert_rowid()")
    .get();

  return row ? getArticleDetailDto(String(asNumber(row.id))) : null;
}

export function updateArticleDto(articleId: string, input: ArticleMutationInput) {
  getDatabase()
    .prepare(
      `UPDATE articles SET
        title = ?,
        article_type = ?,
        access = ?,
        abstract = ?,
        keywords_json = ?,
        authors_json = ?,
        detail_authors_json = ?,
        issue_id = ?,
        page_start = ?,
        page_end = ?,
        order_in_issue = ?,
        published_date = ?,
        view_count = ?,
        download_count = ?
       WHERE id = ?`,
    )
    .run(
      input.title,
      input.articleType,
      input.access ? 1 : 0,
      input.abstract,
      stringifyJson(input.keywords),
      stringifyJson(input.authors),
      stringifyJson(detailAuthorsFor(input.authors)),
      input.issueId,
      input.pageStart,
      input.pageEnd,
      input.orderInIssue,
      input.publishedDate,
      input.viewCount,
      input.downloadCount,
      Number(articleId),
    );

  return getArticleDetailDto(articleId);
}

export function deleteArticleDto(articleId: string): boolean {
  getDatabase()
    .prepare("DELETE FROM articles WHERE id = ?")
    .run(Number(articleId));

  return !getDatabase()
    .prepare("SELECT id FROM articles WHERE id = ?")
    .get(Number(articleId));
}

export function searchArticleDtos(params: {
  q?: string | null;
  keyword?: string | null;
  page: number;
  pageSize: number;
}) {
  const query = params.q || params.keyword || "";
  const offset = Math.max(params.page - 1, 0) * params.pageSize;
  const likeQuery = `%${query}%`;

  return getDatabase()
    .prepare(
      `SELECT * FROM articles
       WHERE ? = ''
          OR title LIKE ?
          OR abstract LIKE ?
          OR authors_json LIKE ?
          OR keywords_json LIKE ?
       ORDER BY published_date DESC, id DESC
       LIMIT ? OFFSET ?`,
    )
    .all(query, likeQuery, likeQuery, likeQuery, likeQuery, params.pageSize, offset)
    .map(mapArticleListRow);
}

export function getPopularArticleDtos(limit: number) {
  return getDatabase()
    .prepare("SELECT * FROM articles ORDER BY view_count DESC, id DESC LIMIT ?")
    .all(limit)
    .map(mapArticleListRow);
}

export function getArticleListByIssueDto(issueId: string) {
  return getDatabase()
    .prepare("SELECT * FROM articles WHERE issue_id = ? ORDER BY order_in_issue ASC, id ASC")
    .all(Number(issueId))
    .map(mapArticleListRow);
}

export function getArticleDetailDto(articleId: string) {
  const row = getDatabase()
    .prepare(
      `SELECT articles.*, issues.id AS issue_id, issues.issue_number, issues.cover_image,
              issues.is_current, issues.volume_id, issues.volume_number
       FROM articles
       LEFT JOIN issues ON issues.id = articles.issue_id
       WHERE articles.id = ?`,
    )
    .get(Number(articleId));

  if (!row) {
    return null;
  }

  return {
    id: asNumber(row.id),
    title: asString(row.title),
    article_type: asString(row.article_type),
    access: asBoolean(row.access),
    abstract: asString(row.abstract),
    keywords: parseJson<string[]>(row.keywords_json),
    authors: parseJson<unknown[]>(row.detail_authors_json),
    issue:
      row.issue_id === null
        ? undefined
        : {
            id: asNumber(row.issue_id),
            issue_number: asNumber(row.issue_number),
            cover_image: asNullableString(row.cover_image) ?? undefined,
            is_current: asBoolean(row.is_current),
          },
    volume:
      row.volume_id === null
        ? undefined
        : {
            id: asNumber(row.volume_id),
            volume_number: asNumber(row.volume_number),
            year: new Date(asString(row.published_date)).getUTCFullYear(),
          },
    page_start: row.page_start === null ? null : asNumber(row.page_start),
    page_end: row.page_end === null ? null : asNumber(row.page_end),
    order_in_issue: row.order_in_issue === null ? null : asNumber(row.order_in_issue),
    published_date: asNullableString(row.published_date),
    view_count: asNumber(row.view_count),
    download_count: asNumber(row.download_count),
    created_at: asString(row.created_at),
    funds: parseJson<unknown[]>(row.funds_json),
  };
}

export function getAuthorDtos() {
  return getDatabase()
    .prepare("SELECT * FROM authors ORDER BY display_name ASC")
    .all();
}

export interface AuthorMutationInput {
  firstName: string;
  middleName: string | null;
  lastName: string;
  displayName: string;
  orcid: string | null;
  avatar: string | null;
  email: string | null;
  affiliation: string | null;
  bio: string | null;
}

export function getAuthorDetailDto(authorId: string) {
  const author = getDatabase()
    .prepare("SELECT * FROM authors WHERE id = ?")
    .get(Number(authorId));

  if (!author) {
    return null;
  }

  const articleRows = getDatabase()
    .prepare("SELECT * FROM articles WHERE detail_authors_json LIKE ? ORDER BY published_date DESC")
    .all(`%"id":${Number(authorId)}%`);

  return {
    ...author,
    affiliations: [],
    articles: articleRows.map((articleRow, index) => ({
      article_id: asNumber(articleRow.id),
      author_id: Number(authorId),
      is_corresponding: index === 0,
      author_order: index + 1,
      article: {
        id: asNumber(articleRow.id),
        title: asString(articleRow.title),
        doi: null,
      },
    })),
  };
}

export function createAuthorDto(input: AuthorMutationInput) {
  const now = nowIso();
  getDatabase()
    .prepare(
      `INSERT INTO authors (
        first_name,
        middle_name,
        last_name,
        display_name,
        orcid,
        avatar,
        email,
        affiliation,
        bio,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.firstName,
      input.middleName,
      input.lastName,
      input.displayName,
      input.orcid,
      input.avatar,
      input.email,
      input.affiliation,
      input.bio,
      now,
      now,
    );

  const row = getDatabase()
    .prepare("SELECT * FROM authors WHERE id = last_insert_rowid()")
    .get();

  return row ? getAuthorDetailDto(String(asNumber(row.id))) : null;
}

export function updateAuthorDto(authorId: string, input: AuthorMutationInput) {
  const now = nowIso();
  getDatabase()
    .prepare(
      `UPDATE authors SET
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        display_name = ?,
        orcid = ?,
        avatar = ?,
        email = ?,
        affiliation = ?,
        bio = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(
      input.firstName,
      input.middleName,
      input.lastName,
      input.displayName,
      input.orcid,
      input.avatar,
      input.email,
      input.affiliation,
      input.bio,
      now,
      Number(authorId),
    );

  return getAuthorDetailDto(authorId);
}

export function deleteAuthorDto(authorId: string): boolean {
  getDatabase()
    .prepare("DELETE FROM authors WHERE id = ?")
    .run(Number(authorId));

  return !getDatabase()
    .prepare("SELECT id FROM authors WHERE id = ?")
    .get(Number(authorId));
}

export interface PageMutationInput {
  journalId: number;
  title: string;
  label: string;
  labelCn: string;
  titleCn: string;
  slug: string;
  content: string;
  contentCn: string;
  orderIndex: number;
}

function mapPageInput(input: PageMutationInput) {
  return [
    input.journalId,
    input.title,
    input.label,
    input.labelCn,
    input.titleCn,
    input.slug,
    input.content,
    input.contentCn,
    input.orderIndex,
  ] as const;
}

function pageTableName(resource: "abouts" | "publishes") {
  return resource;
}

export function createPageDto(resource: "abouts" | "publishes", input: PageMutationInput) {
  const now = nowIso();
  getDatabase()
    .prepare(
      `INSERT INTO ${pageTableName(resource)} (
        journal_id,
        title,
        label,
        label_cn,
        title_cn,
        slug,
        content,
        content_cn,
        order_index,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(...mapPageInput(input), now, now);

  const row = getDatabase()
    .prepare(`SELECT * FROM ${pageTableName(resource)} WHERE id = last_insert_rowid()`)
    .get();

  return row ?? null;
}

export function updatePageDto(resource: "abouts" | "publishes", pageId: string, input: PageMutationInput) {
  const now = nowIso();
  getDatabase()
    .prepare(
      `UPDATE ${pageTableName(resource)} SET
        journal_id = ?,
        title = ?,
        label = ?,
        label_cn = ?,
        title_cn = ?,
        slug = ?,
        content = ?,
        content_cn = ?,
        order_index = ?,
        updated_at = ?
       WHERE id = ?`,
    )
    .run(...mapPageInput(input), now, Number(pageId));

  return getDatabase()
    .prepare(`SELECT * FROM ${pageTableName(resource)} WHERE id = ?`)
    .get(Number(pageId)) ?? null;
}

export function deletePageDto(resource: "abouts" | "publishes", pageId: string): boolean {
  getDatabase()
    .prepare(`DELETE FROM ${pageTableName(resource)} WHERE id = ?`)
    .run(Number(pageId));

  return !getDatabase()
    .prepare(`SELECT id FROM ${pageTableName(resource)} WHERE id = ?`)
    .get(Number(pageId));
}

export function getAboutDtos() {
  return getDatabase()
    .prepare("SELECT id, slug, label, label_cn, order_index FROM abouts ORDER BY order_index ASC")
    .all();
}

export function getAboutDetailDto(aboutId: string) {
  return getDatabase()
    .prepare("SELECT * FROM abouts WHERE id = ? OR slug = ?")
    .get(Number(aboutId), aboutId);
}

export function getPublishDtos() {
  return getDatabase()
    .prepare("SELECT id, slug, label, label_cn, order_index FROM publishes ORDER BY order_index ASC")
    .all();
}

export function getPublishDetailDto(publishId: string) {
  return getDatabase()
    .prepare("SELECT * FROM publishes WHERE id = ? OR slug = ?")
    .get(Number(publishId), publishId);
}

export function loginUser(username: string, password: string) {
  return getDatabase()
    .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
    .get(username, password);
}

export function getUserByToken(token: string) {
  if (!token.startsWith("local-token-")) {
    return null;
  }

  const userId = Number(token.replace("local-token-", ""));
  return getDatabase().prepare("SELECT * FROM users WHERE id = ?").get(userId);
}

export interface StaticAssetDto {
  key: string;
  label: string;
  url: string;
  mime_type: string | null;
  size_bytes: number | null;
  updated_at: string;
}

function mapStaticAssetRow(row: Row): StaticAssetDto {
  return {
    key: asString(row.key),
    label: asString(row.label),
    url: asString(row.url),
    mime_type: asNullableString(row.mime_type),
    size_bytes: row.size_bytes === null ? null : asNumber(row.size_bytes),
    updated_at: asString(row.updated_at),
  };
}

export function getStaticAssetDtos(): StaticAssetDto[] {
  return getDatabase()
    .prepare("SELECT * FROM static_assets ORDER BY key ASC")
    .all()
    .map(mapStaticAssetRow);
}

export function getStaticAssetMap(): Record<string, string> {
  return Object.fromEntries(
    getStaticAssetDtos().map((asset) => [asset.key, asset.url]),
  );
}

export function updateStaticAsset(input: {
  key: string;
  label: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}): StaticAssetDto {
  const updatedAt = new Date().toISOString();
  getDatabase()
    .prepare(
      `INSERT INTO static_assets (key, label, url, mime_type, size_bytes, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
         label = excluded.label,
         url = excluded.url,
         mime_type = excluded.mime_type,
         size_bytes = excluded.size_bytes,
         updated_at = excluded.updated_at`,
    )
    .run(input.key, input.label, input.url, input.mimeType, input.sizeBytes, updatedAt);

  const row = getDatabase()
    .prepare("SELECT * FROM static_assets WHERE key = ?")
    .get(input.key);

  if (!row) {
    throw new Error(`Static asset update failed for key: ${input.key}`);
  }

  return mapStaticAssetRow(row);
}

export function deleteStaticAsset(key: string): boolean {
  getDatabase()
    .prepare("DELETE FROM static_assets WHERE key = ?")
    .run(key);

  return !getDatabase()
    .prepare("SELECT key FROM static_assets WHERE key = ?")
    .get(key);
}
