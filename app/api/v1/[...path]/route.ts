import {
  getAboutDetailDto,
  getAboutDtos,
  getArticleDetailDto,
  getArticleDtos,
  getArticleListByIssueDto,
  getAuthorDetailDto,
  getAuthorDtos,
  getVolumeDetailDto,
  getVolumeDtos,
  createArticleDto,
  createAuthorDto,
  createIssueDto,
  createPageDto,
  createVolumeDto,
  deleteArticleDto,
  deleteAuthorDto,
  deleteIssueDto,
  deletePageDto,
  deleteStaticAsset,
  deleteVolumeDto,
  getIssueDetailDto,
  getIssueDtos,
  getJournalDto,
  getPopularArticleDtos,
  getPublishDetailDto,
  getPublishDtos,
  getStaticAssetDtos,
  getUserByToken,
  loginUser,
  searchArticleDtos,
  updateArticleDto,
  updateAuthorDto,
  updateIssueCoverDto,
  updateIssueDto,
  updateJournalCoverDto,
  updateJournalDto,
  updatePageDto,
  updateStaticAsset,
  updateVolumeDto,
  type ArticleMutationInput,
  type AuthorMutationInput,
  type IssueMutationInput,
  type JournalMutationInput,
  type PageMutationInput,
  type VolumeMutationInput,
} from "@/server/repository";
import { saveIssueCoverUpload, saveJournalCoverUpload, saveStaticAssetUpload } from "@/server/uploads";

export const runtime = "nodejs";

const API_RESOURCES = {
  abouts: "abouts",
  articles: "articles",
  auth: "auth",
  authors: "authors",
  issues: "issues",
  journals: "journals",
  publishes: "publishes",
  staticAssets: "static-assets",
  volumes: "volumes",
} as const;

const API_ACTIONS = {
  download: "download",
  issue: "issue",
  login: "login",
  me: "me",
  popular: "popular",
  search: "search",
  upload: "upload",
  view: "view",
} as const;

const HTTP_STATUS = {
  badRequest: 400,
  created: 201,
  notFound: 404,
  unauthorized: 401,
} as const;

const DEFAULT_SEARCH_PAGE = 1;
const DEFAULT_SEARCH_PAGE_SIZE = 10;

interface RouteParams {
  params: Promise<{
    path: string[];
  }>;
}

function jsonNotFound() {
  return Response.json({ error: "Not found" }, { status: HTTP_STATUS.notFound });
}

function toUserDto(row: Record<string, unknown>) {
  return {
    id: Number(row.id),
    username: String(row.username),
    is_active: Boolean(row.is_active),
    is_superuser: Boolean(row.is_superuser),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function readBearerToken(request: Request): string {
  return (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
}

function isAdminRequest(request: Request): boolean {
  const user = getUserByToken(readBearerToken(request));
  return Boolean(user?.is_superuser);
}

async function readIssueMutationInput(request: Request): Promise<IssueMutationInput> {
  const body = (await request.json()) as Partial<{
    volume_id: number;
    volume_number: number;
    issue_number: number;
    title: string | null;
    cover_image: string | null;
    publish_date: string | null;
    is_current: boolean;
    published: boolean;
  }>;

  return {
    volumeId: Number(body.volume_id),
    volumeNumber: Number(body.volume_number),
    issueNumber: Number(body.issue_number),
    title: body.title?.trim() || null,
    coverImage: body.cover_image?.trim() || null,
    publishDate: body.publish_date?.trim() || null,
    isCurrent: body.is_current === true,
    published: body.published === true,
  };
}

function nullableText(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function textValue(value: string | null | undefined): string {
  return value?.trim() || "";
}

function nullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function numberValue(value: unknown, fallback = 0): number {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function nullableInteger(value: unknown): number | null {
  const parsed = nullableNumber(value);
  return parsed === null ? null : Math.trunc(parsed);
}

function booleanValue(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

function stringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function readJournalMutationInput(request: Request): Promise<JournalMutationInput> {
  const body = (await request.json()) as Partial<{
    title: string;
    description: string | null;
    cover_image: string | null;
    overview: string | null;
    issn: string | null;
    publisher: string | null;
    publishing_mode: string | null;
    impact_factor: number | string | null;
    impact_factor_5year: number | string | null;
    submission_to_decision_days: number | string | null;
  }>;

  return {
    title: textValue(body.title),
    description: textValue(body.description),
    coverImage: textValue(body.cover_image),
    overview: textValue(body.overview),
    issn: nullableText(body.issn),
    publisher: textValue(body.publisher),
    publishingMode: textValue(body.publishing_mode),
    impactFactor: nullableNumber(body.impact_factor),
    impactFactor5Year: nullableNumber(body.impact_factor_5year),
    submissionToDecisionDays: nullableNumber(body.submission_to_decision_days),
  };
}

async function readVolumeMutationInput(request: Request): Promise<VolumeMutationInput> {
  const body = (await request.json()) as Partial<{
    journal_id: number | string;
    volume_number: number | string;
    year: number | string;
    published: boolean | string | number;
  }>;

  return {
    journalId: numberValue(body.journal_id, 1),
    volumeNumber: numberValue(body.volume_number, 1),
    year: numberValue(body.year, new Date().getFullYear()),
    published: booleanValue(body.published),
  };
}

async function readArticleMutationInput(request: Request): Promise<ArticleMutationInput> {
  const body = (await request.json()) as Partial<{
    title: string;
    article_type: string;
    access: boolean | string | number;
    abstract: string;
    keywords: string[] | string;
    authors: string[] | string;
    issue_id: number | string | null;
    page_start: number | string | null;
    page_end: number | string | null;
    order_in_issue: number | string | null;
    published_date: string | null;
    view_count: number | string;
    download_count: number | string;
  }>;

  return {
    title: textValue(body.title),
    articleType: textValue(body.article_type) || "regular",
    access: body.access === undefined ? true : booleanValue(body.access),
    abstract: textValue(body.abstract),
    keywords: stringList(body.keywords),
    authors: stringList(body.authors),
    issueId: nullableInteger(body.issue_id),
    pageStart: nullableInteger(body.page_start),
    pageEnd: nullableInteger(body.page_end),
    orderInIssue: nullableInteger(body.order_in_issue),
    publishedDate: nullableText(body.published_date),
    viewCount: numberValue(body.view_count),
    downloadCount: numberValue(body.download_count),
  };
}

async function readAuthorMutationInput(request: Request): Promise<AuthorMutationInput> {
  const body = (await request.json()) as Partial<{
    first_name: string;
    middle_name: string | null;
    last_name: string;
    display_name: string;
    orcid: string | null;
    avatar: string | null;
    email: string | null;
    affiliation: string | null;
    bio: string | null;
  }>;
  const firstName = textValue(body.first_name);
  const lastName = textValue(body.last_name);
  const displayName = textValue(body.display_name) || [firstName, lastName].filter(Boolean).join(" ");

  return {
    firstName,
    middleName: nullableText(body.middle_name),
    lastName,
    displayName,
    orcid: nullableText(body.orcid),
    avatar: nullableText(body.avatar),
    email: nullableText(body.email),
    affiliation: nullableText(body.affiliation),
    bio: nullableText(body.bio),
  };
}

async function readPageMutationInput(request: Request): Promise<PageMutationInput> {
  const body = (await request.json()) as Partial<{
    journal_id: number | string;
    title: string;
    label: string;
    label_cn: string;
    title_cn: string;
    slug: string;
    content: string;
    content_cn: string;
    order_index: number | string;
  }>;

  return {
    journalId: numberValue(body.journal_id, 1),
    title: textValue(body.title),
    label: textValue(body.label),
    labelCn: textValue(body.label_cn),
    titleCn: textValue(body.title_cn),
    slug: textValue(body.slug),
    content: textValue(body.content),
    contentCn: textValue(body.content_cn),
    orderIndex: numberValue(body.order_index),
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { path } = await params;
  const [resource, id, action] = path;
  const url = new URL(request.url);

  if (resource === API_RESOURCES.journals && !id) {
    return Response.json(getJournalDto());
  }

  if (resource === API_RESOURCES.issues && !id) {
    return Response.json(getIssueDtos({ includeUnpublished: isAdminRequest(request) }));
  }

  if (resource === API_RESOURCES.volumes && !id) {
    return Response.json(getVolumeDtos());
  }

  if (resource === API_RESOURCES.volumes && id) {
    const volume = getVolumeDetailDto(id);
    return volume ? Response.json(volume) : jsonNotFound();
  }

  if (resource === API_RESOURCES.articles && !id) {
    return Response.json(getArticleDtos());
  }

  if (resource === API_RESOURCES.issues && id) {
    const issue = getIssueDetailDto(id, { includeUnpublished: isAdminRequest(request) });
    return issue ? Response.json(issue) : jsonNotFound();
  }

  if (resource === API_RESOURCES.articles && id === API_ACTIONS.search) {
    return Response.json(
      searchArticleDtos({
        q: url.searchParams.get("q"),
        keyword: url.searchParams.get("keyword"),
        page: Number(url.searchParams.get("page") ?? DEFAULT_SEARCH_PAGE),
        pageSize: Number(url.searchParams.get("page_size") ?? DEFAULT_SEARCH_PAGE_SIZE),
      }),
    );
  }

  if (resource === API_RESOURCES.articles && id === API_ACTIONS.popular) {
    return Response.json(
      getPopularArticleDtos(Number(url.searchParams.get("limit") ?? 10)),
    );
  }

  if (resource === API_RESOURCES.articles && id === API_ACTIONS.issue && action) {
    return Response.json(getArticleListByIssueDto(action));
  }

  if (resource === API_RESOURCES.articles && id && (action === API_ACTIONS.view || action === API_ACTIONS.download)) {
    const article = getArticleDetailDto(id);
    if (!article) {
      return jsonNotFound();
    }

    return Response.json({
      article_id: article.id,
      action,
      message: "PDF delivery is not implemented in the local SQLite backend.",
    });
  }

  if (resource === API_RESOURCES.articles && id) {
    const article = getArticleDetailDto(id);
    return article ? Response.json(article) : jsonNotFound();
  }

  if (resource === API_RESOURCES.authors && !id) {
    return Response.json(getAuthorDtos());
  }

  if (resource === API_RESOURCES.authors && id) {
    const author = getAuthorDetailDto(id);
    return author ? Response.json(author) : jsonNotFound();
  }

  if (resource === API_RESOURCES.abouts && !id) {
    return Response.json(getAboutDtos());
  }

  if (resource === API_RESOURCES.abouts && id) {
    const about = getAboutDetailDto(id);
    return about ? Response.json(about) : jsonNotFound();
  }

  if (resource === API_RESOURCES.publishes && !id) {
    return Response.json(getPublishDtos());
  }

  if (resource === API_RESOURCES.publishes && id) {
    const publish = getPublishDetailDto(id);
    return publish ? Response.json(publish) : jsonNotFound();
  }

  if (resource === API_RESOURCES.auth && id === API_ACTIONS.me) {
    const authorization = request.headers.get("authorization") ?? "";
    const token = authorization.replace(/^Bearer\s+/i, "");
    const user = getUserByToken(token);
    return user ? Response.json(toUserDto(user)) : Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
  }

  if (resource === API_RESOURCES.staticAssets && !id) {
    return Response.json(getStaticAssetDtos());
  }

  return jsonNotFound();
}

export async function POST(request: Request, { params }: RouteParams) {
  const { path } = await params;
  const [resource, action] = path;

  if (resource === API_RESOURCES.auth && action === API_ACTIONS.login) {
    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const user = loginUser(body.username ?? "", body.password ?? "");

    if (!user) {
      return Response.json({ error: "Invalid credentials" }, { status: HTTP_STATUS.unauthorized });
    }

    return Response.json({
      access_token: `local-token-${Number(user.id)}`,
      token_type: "bearer",
      user: toUserDto(user),
    });
  }

  if (resource === API_RESOURCES.staticAssets && !action) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const formData = await request.formData();
    const key = String(formData.get("key") ?? "");
    const label = String(formData.get("label") ?? key);
    const file = formData.get("file");

    if (!key || !(file instanceof File)) {
      return Response.json(
        { error: "Static asset upload requires key and file" },
        { status: HTTP_STATUS.badRequest },
      );
    }

    const upload = await saveStaticAssetUpload(file);
    return Response.json(
      updateStaticAsset({
        key,
        label,
        url: upload.url,
        mimeType: upload.mimeType,
        sizeBytes: upload.sizeBytes,
      }),
    );
  }

  if (resource === API_RESOURCES.issues && !action) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return Response.json(createIssueDto(await readIssueMutationInput(request)), {
      status: HTTP_STATUS.created,
    });
  }

  if (resource === API_RESOURCES.volumes && !action) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return Response.json(createVolumeDto(await readVolumeMutationInput(request)), {
      status: HTTP_STATUS.created,
    });
  }

  if (resource === API_RESOURCES.articles && !action) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return Response.json(createArticleDto(await readArticleMutationInput(request)), {
      status: HTTP_STATUS.created,
    });
  }

  if (resource === API_RESOURCES.authors && !action) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return Response.json(createAuthorDto(await readAuthorMutationInput(request)), {
      status: HTTP_STATUS.created,
    });
  }

  if (resource === API_RESOURCES.abouts && !action) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return Response.json(createPageDto(API_RESOURCES.abouts, await readPageMutationInput(request)), {
      status: HTTP_STATUS.created,
    });
  }

  if (resource === API_RESOURCES.publishes && !action) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return Response.json(createPageDto(API_RESOURCES.publishes, await readPageMutationInput(request)), {
      status: HTTP_STATUS.created,
    });
  }

  if (resource === API_RESOURCES.issues && action && path[2] === API_ACTIONS.upload) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Issue cover upload requires file" }, { status: HTTP_STATUS.badRequest });
    }

    const upload = await saveIssueCoverUpload(file);
    const issue = updateIssueCoverDto(action, upload.url);
    return issue ? Response.json(issue) : jsonNotFound();
  }

  if (resource === API_RESOURCES.journals && action && path[2] === API_ACTIONS.upload) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json({ error: "Journal cover upload requires file" }, { status: HTTP_STATUS.badRequest });
    }

    const upload = await saveJournalCoverUpload(file);
    const journal = updateJournalCoverDto(action, upload.url);
    return journal ? Response.json(journal) : jsonNotFound();
  }

  return jsonNotFound();
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { path } = await params;
  const [resource, id] = path;

  if (resource === API_RESOURCES.issues && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const issue = updateIssueDto(id, await readIssueMutationInput(request));
    return issue ? Response.json(issue) : jsonNotFound();
  }

  if (resource === API_RESOURCES.journals && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const journal = updateJournalDto(id, await readJournalMutationInput(request));
    return journal ? Response.json(journal) : jsonNotFound();
  }

  if (resource === API_RESOURCES.volumes && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const volume = updateVolumeDto(id, await readVolumeMutationInput(request));
    return volume ? Response.json(volume) : jsonNotFound();
  }

  if (resource === API_RESOURCES.articles && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const article = updateArticleDto(id, await readArticleMutationInput(request));
    return article ? Response.json(article) : jsonNotFound();
  }

  if (resource === API_RESOURCES.authors && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const author = updateAuthorDto(id, await readAuthorMutationInput(request));
    return author ? Response.json(author) : jsonNotFound();
  }

  if (resource === API_RESOURCES.abouts && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const about = updatePageDto(API_RESOURCES.abouts, id, await readPageMutationInput(request));
    return about ? Response.json(about) : jsonNotFound();
  }

  if (resource === API_RESOURCES.publishes && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    const publish = updatePageDto(API_RESOURCES.publishes, id, await readPageMutationInput(request));
    return publish ? Response.json(publish) : jsonNotFound();
  }

  return jsonNotFound();
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { path } = await params;
  const [resource, id] = path;

  if (resource === API_RESOURCES.issues && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return deleteIssueDto(id)
      ? Response.json({ deleted: true })
      : jsonNotFound();
  }

  if (resource === API_RESOURCES.volumes && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return deleteVolumeDto(id)
      ? Response.json({ deleted: true })
      : jsonNotFound();
  }

  if (resource === API_RESOURCES.articles && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return deleteArticleDto(id)
      ? Response.json({ deleted: true })
      : jsonNotFound();
  }

  if (resource === API_RESOURCES.authors && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return deleteAuthorDto(id)
      ? Response.json({ deleted: true })
      : jsonNotFound();
  }

  if (resource === API_RESOURCES.abouts && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return deletePageDto(API_RESOURCES.abouts, id)
      ? Response.json({ deleted: true })
      : jsonNotFound();
  }

  if (resource === API_RESOURCES.publishes && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return deletePageDto(API_RESOURCES.publishes, id)
      ? Response.json({ deleted: true })
      : jsonNotFound();
  }

  if (resource === API_RESOURCES.staticAssets && id) {
    if (!isAdminRequest(request)) {
      return Response.json({ error: "Unauthorized" }, { status: HTTP_STATUS.unauthorized });
    }

    return deleteStaticAsset(decodeURIComponent(id))
      ? Response.json({ deleted: true })
      : jsonNotFound();
  }

  return jsonNotFound();
}
