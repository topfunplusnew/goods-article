"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { readAuthTokenFromDocument } from "@/features/auth/client";
import type { ArticleDetailDto, ArticleListDto } from "@/features/article/contracts";
import type { IssueListDto } from "@/features/issue/contracts";
import { AdminModal } from "@/shared/components/admin/AdminModal";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Textarea } from "@/shared/components/ui/textarea";

interface ArticleFormState {
  id: number | null;
  title: string;
  articleType: string;
  access: boolean;
  abstract: string;
  keywords: string;
  authors: string;
  issueId: string;
  pageStart: string;
  pageEnd: string;
  orderInIssue: string;
  publishedDate: string;
  viewCount: number;
  downloadCount: number;
}

interface AdminArticlesManagerProps {
  initialArticles: ArticleListDto[];
  issues: IssueListDto[];
  labels: {
    abstract: string;
    add: string;
    authors: string;
    delete: string;
    deleteAction: string;
    downloadCount: string;
    edit: string;
    editAction: string;
    issue: string;
    keywords: string;
    pageEnd: string;
    pageStart: string;
    publishedDate: string;
    reset: string;
    save: string;
    title: string;
    type: string;
    viewCount: string;
  };
}

function authorizationHeaders(): HeadersInit {
  const token = readAuthTokenFromDocument();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function defaultForm(): ArticleFormState {
  return {
    id: null,
    title: "",
    articleType: "regular",
    access: true,
    abstract: "",
    keywords: "",
    authors: "",
    issueId: "",
    pageStart: "",
    pageEnd: "",
    orderInIssue: "",
    publishedDate: "",
    viewCount: 0,
    downloadCount: 0,
  };
}

function articleDetailToForm(article: ArticleDetailDto): ArticleFormState {
  return {
    id: article.id,
    title: article.title,
    articleType: article.article_type,
    access: article.access,
    abstract: article.abstract,
    keywords: article.keywords.join(", "),
    authors: article.authors.map((author) => author.display_name).join(", "),
    issueId: article.issue?.id == null ? "" : String(article.issue.id),
    pageStart: article.page_start == null ? "" : String(article.page_start),
    pageEnd: article.page_end == null ? "" : String(article.page_end),
    orderInIssue: article.order_in_issue == null ? "" : String(article.order_in_issue),
    publishedDate: article.published_date ?? "",
    viewCount: article.view_count,
    downloadCount: article.download_count,
  };
}

function nullableNumber(value: string): number | null {
  return value.trim() ? Number(value) : null;
}

function listValue(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function toPayload(form: ArticleFormState) {
  return {
    title: form.title,
    article_type: form.articleType,
    access: form.access,
    abstract: form.abstract,
    keywords: listValue(form.keywords),
    authors: listValue(form.authors),
    issue_id: nullableNumber(form.issueId),
    page_start: nullableNumber(form.pageStart),
    page_end: nullableNumber(form.pageEnd),
    order_in_issue: nullableNumber(form.orderInIssue),
    published_date: form.publishedDate || null,
    view_count: form.viewCount,
    download_count: form.downloadCount,
  };
}

export function AdminArticlesManager({
  initialArticles,
  issues,
  labels,
}: AdminArticlesManagerProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [form, setForm] = useState<ArticleFormState>(() => defaultForm());
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const sortedArticles = useMemo(
    () => [...articles].sort((left, right) => right.id - left.id),
    [articles],
  );

  async function reloadArticles() {
    const response = await fetch("/api/v1/articles", {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Article list failed: ${response.status}`);
    }

    setArticles((await response.json()) as ArticleListDto[]);
  }

  async function editArticle(articleId: number) {
    const response = await fetch(`/api/v1/articles/${articleId}`, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Article detail failed: ${response.status}`);
    }

    setForm(articleDetailToForm((await response.json()) as ArticleDetailDto));
    setModalOpen(true);
  }

  async function saveArticle() {
    const response = await fetch(form.id ? `/api/v1/articles/${form.id}` : "/api/v1/articles", {
      method: form.id ? "PUT" : "POST",
      headers: {
        ...authorizationHeaders(),
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(toPayload(form)),
    });

    if (!response.ok) {
      throw new Error(`Article save failed: ${response.status}`);
    }

    await reloadArticles();
    setForm(defaultForm());
    setModalOpen(false);
    setMessage(labels.save);
  }

  async function deleteArticle(articleId: number) {
    const response = await fetch(`/api/v1/articles/${articleId}`, {
      method: "DELETE",
      headers: authorizationHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Article delete failed: ${response.status}`);
    }

    await reloadArticles();
    setMessage(labels.delete);
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {message ? <p className="mt-4 rounded-lg bg-primary-subtle px-3 py-2 text-sm text-primary">{message}</p> : null}
        <Button type="button" className="ml-auto" onClick={() => {
          setForm(defaultForm());
          setModalOpen(true);
        }}>
          <Plus className="h-4 w-4" />
          {labels.add}
        </Button>
      </div>

      <section className="admin-table-shell">
        <Table className="admin-crud-table min-w-[1220px] table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[420px]">{labels.title}</TableHead>
              <TableHead className="w-[150px]">{labels.type}</TableHead>
              <TableHead className="w-[260px]">{labels.authors}</TableHead>
              <TableHead className="w-[150px]">{labels.publishedDate}</TableHead>
              <TableHead className="admin-action-header w-[240px] text-right">{labels.edit}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="truncate font-semibold text-primary-dark">{article.title}</TableCell>
                <TableCell className="truncate text-gray-600">{article.article_type}</TableCell>
                <TableCell className="truncate text-gray-600">{article.authors.join(", ")}</TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">{article.published_date ?? ""}</TableCell>
                <TableCell className="admin-action-cell">
                  <div className="flex flex-nowrap justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => void editArticle(article.id)}>
                      <Pencil className="h-4 w-4" />
                      {labels.editAction}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => void deleteArticle(article.id)}>
                      <Trash2 className="h-4 w-4" />
                      {labels.deleteAction}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <AdminModal open={modalOpen} title={form.id ? labels.edit : labels.add} onClose={() => setModalOpen(false)}>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>{labels.title}</Label>
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{labels.type}</Label>
              <Input value={form.articleType} onChange={(event) => setForm({ ...form, articleType: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.publishedDate}</Label>
              <Input type="date" value={form.publishedDate} onChange={(event) => setForm({ ...form, publishedDate: event.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{labels.authors}</Label>
            <Input value={form.authors} onChange={(event) => setForm({ ...form, authors: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{labels.keywords}</Label>
            <Input value={form.keywords} onChange={(event) => setForm({ ...form, keywords: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{labels.abstract}</Label>
            <Textarea className="min-h-[140px] resize-y" value={form.abstract} onChange={(event) => setForm({ ...form, abstract: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{labels.issue}</Label>
            <Select value={form.issueId} onChange={(event) => setForm({ ...form, issueId: event.target.value })}>
              <option value="">None</option>
              {issues.map((issue) => (
                <option key={issue.id} value={issue.id}>
                  Vol. {issue.volume_number}, Issue {issue.issue_number}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{labels.pageStart}</Label>
              <Input value={form.pageStart} onChange={(event) => setForm({ ...form, pageStart: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.pageEnd}</Label>
              <Input value={form.pageEnd} onChange={(event) => setForm({ ...form, pageEnd: event.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{labels.viewCount}</Label>
              <Input type="number" value={form.viewCount} onChange={(event) => setForm({ ...form, viewCount: Number(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.downloadCount}</Label>
              <Input type="number" value={form.downloadCount} onChange={(event) => setForm({ ...form, downloadCount: Number(event.target.value) })} />
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input className="h-4 w-4 rounded border-border accent-primary" type="checkbox" checked={form.access} onChange={(event) => setForm({ ...form, access: event.target.checked })} />
            Open access
          </label>
          <div className="flex flex-wrap gap-3 border-t border-border pt-5">
            <Button type="button" onClick={() => void saveArticle()}>
              <Save className="h-4 w-4" />
              {labels.save}
            </Button>
            <Button type="button" variant="outline" onClick={() => setForm(defaultForm())}>
              <RotateCcw className="h-4 w-4" />
              {labels.reset}
            </Button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
