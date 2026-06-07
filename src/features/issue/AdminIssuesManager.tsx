"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { ISSUE_FORM_DEFAULTS } from "@/config/issues";
import { readAuthTokenFromDocument } from "@/features/auth/client";
import { resolveIssueCoverImageUrl } from "@/features/issue/assets";
import type { IssueDetailDto, IssueListDto } from "@/features/issue/contracts";
import { AdminModal } from "@/shared/components/admin/AdminModal";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

interface AdminIssuesManagerProps {
  initialIssues: IssueListDto[];
  labels: {
    addIssue: string;
    editIssue: string;
    editAction: string;
    deleteIssue: string;
    deleteAction: string;
    deleteConfirm: string;
    issueNumber: string;
    issueTitle: string;
    volume: string;
    issue: string;
    volumeId: string;
    volumeNumber: string;
    coverImage: string;
    coverImageUrl: string;
    coverImageUpload: string;
    publishDate: string;
    isCurrent: string;
    published: string;
    unpublished: string;
    save: string;
    reset: string;
  };
}

interface IssueFormState {
  id: number | null;
  volumeId: number;
  volumeNumber: number;
  issueNumber: number;
  title: string;
  coverImage: string;
  publishDate: string;
  isCurrent: boolean;
  published: boolean;
}

function issueToForm(issue: IssueListDto): IssueFormState {
  return {
    id: issue.id,
    volumeId: issue.volume_id,
    volumeNumber: issue.volume_number,
    issueNumber: issue.issue_number,
    title: issue.title ?? "",
    coverImage: issue.cover_image ?? "",
    publishDate: issue.publish_date ?? "",
    isCurrent: issue.is_current,
    published: issue.published,
  };
}

function defaultForm(): IssueFormState {
  return {
    id: null,
    volumeId: ISSUE_FORM_DEFAULTS.volumeId,
    volumeNumber: ISSUE_FORM_DEFAULTS.volumeNumber,
    issueNumber: ISSUE_FORM_DEFAULTS.issueNumber,
    title: ISSUE_FORM_DEFAULTS.title,
    coverImage: ISSUE_FORM_DEFAULTS.coverImage,
    publishDate: ISSUE_FORM_DEFAULTS.publishDate,
    isCurrent: ISSUE_FORM_DEFAULTS.isCurrent,
    published: ISSUE_FORM_DEFAULTS.published,
  };
}

function toPayload(form: IssueFormState) {
  return {
    volume_id: form.volumeId,
    volume_number: form.volumeNumber,
    issue_number: form.issueNumber,
    title: form.title || null,
    cover_image: form.coverImage || null,
    publish_date: form.publishDate || null,
    is_current: form.isCurrent,
    published: form.published,
  };
}

function authorizationHeaders(): HeadersInit {
  const token = readAuthTokenFromDocument();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AdminIssuesManager({
  initialIssues,
  labels,
}: AdminIssuesManagerProps) {
  const [issues, setIssues] = useState(initialIssues);
  const [form, setForm] = useState<IssueFormState>(() => defaultForm());
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const sortedIssues = useMemo(
    () => [...issues].sort((left, right) => right.volume_number - left.volume_number || right.issue_number - left.issue_number),
    [issues],
  );

  async function reloadIssues() {
    const response = await fetch("/api/v1/issues", {
      headers: {
        ...authorizationHeaders(),
        accept: "application/json",
      },
    });
    const body = (await response.json()) as IssueListDto[];
    setIssues(body);
  }

  async function saveIssue() {
    const response = await fetch(form.id ? `/api/v1/issues/${form.id}` : "/api/v1/issues", {
      method: form.id ? "PUT" : "POST",
      headers: {
        ...authorizationHeaders(),
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(toPayload(form)),
    });

    if (!response.ok) {
      throw new Error(`Issue save failed: ${response.status}`);
    }

    await reloadIssues();
    setForm(defaultForm());
    setModalOpen(false);
    setMessage(labels.save);
  }

  async function deleteIssue(issue: IssueListDto) {
    if (!window.confirm(labels.deleteConfirm.replace("{title}", issue.title ?? String(issue.id)))) {
      return;
    }

    const response = await fetch(`/api/v1/issues/${issue.id}`, {
      method: "DELETE",
      headers: authorizationHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Issue delete failed: ${response.status}`);
    }

    await reloadIssues();
    setMessage(labels.deleteIssue);
  }

  async function uploadCover(file: File) {
    if (!form.id) {
      return;
    }

    const formData = new FormData();
    formData.set("file", file);
    const response = await fetch(`/api/v1/issues/${form.id}/upload`, {
      method: "POST",
      headers: authorizationHeaders(),
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Issue cover upload failed: ${response.status}`);
    }

    const issue = (await response.json()) as IssueDetailDto;
    setForm((current) => ({
      ...current,
      coverImage: issue.cover_image ?? "",
    }));
    await reloadIssues();
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
          {labels.addIssue}
        </Button>
      </div>

      <section className="admin-table-shell">
        <Table className="admin-crud-table min-w-[1180px] table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[110px]">{labels.coverImage}</TableHead>
              <TableHead className="w-[210px]">{labels.volume}</TableHead>
              <TableHead className="w-[300px]">{labels.issueTitle}</TableHead>
              <TableHead className="w-[160px]">{labels.publishDate}</TableHead>
              <TableHead className="w-[160px]">{labels.published}</TableHead>
              <TableHead className="admin-action-header w-[240px] text-right">{labels.editIssue}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedIssues.map((issue) => (
              <TableRow key={issue.id}>
                <TableCell>
                  <div className="h-14 w-11 overflow-hidden rounded-md border border-border bg-surface">
                    {issue.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveIssueCoverImageUrl(issue.cover_image)} alt={issue.title ?? ""} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-primary-subtle" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">{labels.volume} {issue.volume_number}, {labels.issue} {issue.issue_number}</TableCell>
                <TableCell className="truncate font-semibold text-primary-dark">{issue.title || labels.issueTitle}</TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">{issue.publish_date || ""}</TableCell>
                <TableCell className="whitespace-nowrap text-gray-600">
                  <Badge variant={issue.published ? "success" : "neutral"}>
                    {issue.published ? labels.published : labels.unpublished}
                  </Badge>
                </TableCell>
                <TableCell className="admin-action-cell">
                  <div className="flex flex-nowrap justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      setForm(issueToForm(issue));
                      setModalOpen(true);
                    }}>
                      <Pencil className="h-4 w-4" />
                      {labels.editAction}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => void deleteIssue(issue)}>
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

      <AdminModal open={modalOpen} title={form.id ? labels.editIssue : labels.addIssue} onClose={() => setModalOpen(false)}>

        <div className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{labels.volumeId}</Label>
              <Input type="number" value={form.volumeId} onChange={(event) => setForm({ ...form, volumeId: Number(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.volumeNumber}</Label>
              <Input type="number" value={form.volumeNumber} onChange={(event) => setForm({ ...form, volumeNumber: Number(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.issueNumber}</Label>
              <Input type="number" value={form.issueNumber} onChange={(event) => setForm({ ...form, issueNumber: Number(event.target.value) })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{labels.issueTitle}</Label>
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{labels.publishDate}</Label>
            <Input type="date" value={form.publishDate} onChange={(event) => setForm({ ...form, publishDate: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{labels.coverImageUrl}</Label>
            <Input value={form.coverImage} onChange={(event) => setForm({ ...form, coverImage: event.target.value })} />
          </div>

          {form.id ? (
            <div className="space-y-2">
              <Label>{labels.coverImageUpload}</Label>
              <Input className="cursor-pointer text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-subtle file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary" type="file" accept="image/*" onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadCover(file);
                }
              }} />
            </div>
          ) : null}

          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input className="h-4 w-4 rounded border-border accent-primary" type="checkbox" checked={form.isCurrent} onChange={(event) => setForm({ ...form, isCurrent: event.target.checked })} />
            {labels.isCurrent}
          </label>
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input className="h-4 w-4 rounded border-border accent-primary" type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
            {labels.published}
          </label>

          <div className="flex flex-wrap gap-3 border-t border-border pt-5">
            <Button type="button" onClick={() => void saveIssue()}>
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
