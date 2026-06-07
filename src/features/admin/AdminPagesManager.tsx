"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { readAuthTokenFromDocument } from "@/features/auth/client";
import type { AboutDetailDto, AboutListDto } from "@/features/about/contracts";
import type { PublishDetailDto, PublishListDto } from "@/features/publish/contracts";
import { AdminModal } from "@/shared/components/admin/AdminModal";
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
import { Textarea } from "@/shared/components/ui/textarea";

type PageResource = "abouts" | "publishes";
type PageListDto = AboutListDto | PublishListDto;
type PageDetailDto = AboutDetailDto | PublishDetailDto;

interface PageFormState {
  id: number | null;
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

interface AdminPagesManagerProps {
  initialPages: PageListDto[];
  resource: PageResource;
  labels: {
    add: string;
    content: string;
    contentCn: string;
    delete: string;
    deleteAction: string;
    edit: string;
    editAction: string;
    journalId: string;
    label: string;
    labelCn: string;
    order: string;
    reset: string;
    save: string;
    slug: string;
    title: string;
    titleCn: string;
  };
}

function authorizationHeaders(): HeadersInit {
  const token = readAuthTokenFromDocument();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function defaultForm(): PageFormState {
  return {
    id: null,
    journalId: 1,
    title: "",
    label: "",
    labelCn: "",
    titleCn: "",
    slug: "",
    content: "",
    contentCn: "",
    orderIndex: 0,
  };
}

function pageToForm(page: PageDetailDto): PageFormState {
  return {
    id: page.id,
    journalId: page.journal_id,
    title: page.title,
    label: page.label,
    labelCn: page.label_cn,
    titleCn: page.title_cn,
    slug: page.slug,
    content: page.content,
    contentCn: page.content_cn,
    orderIndex: page.order_index,
  };
}

function toPayload(form: PageFormState) {
  return {
    journal_id: form.journalId,
    title: form.title,
    label: form.label,
    label_cn: form.labelCn,
    title_cn: form.titleCn,
    slug: form.slug,
    content: form.content,
    content_cn: form.contentCn,
    order_index: form.orderIndex,
  };
}

export function AdminPagesManager({
  initialPages,
  resource,
  labels,
}: AdminPagesManagerProps) {
  const [pages, setPages] = useState(initialPages);
  const [form, setForm] = useState<PageFormState>(() => defaultForm());
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const sortedPages = useMemo(
    () => [...pages].sort((left, right) => left.order_index - right.order_index || left.id - right.id),
    [pages],
  );

  async function reloadPages() {
    const response = await fetch(`/api/v1/${resource}`, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Page list failed: ${response.status}`);
    }

    setPages((await response.json()) as PageListDto[]);
  }

  async function editPage(pageId: number) {
    const response = await fetch(`/api/v1/${resource}/${pageId}`, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Page detail failed: ${response.status}`);
    }

    setForm(pageToForm((await response.json()) as PageDetailDto));
    setModalOpen(true);
  }

  async function savePage() {
    const response = await fetch(form.id ? `/api/v1/${resource}/${form.id}` : `/api/v1/${resource}`, {
      method: form.id ? "PUT" : "POST",
      headers: {
        ...authorizationHeaders(),
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(toPayload(form)),
    });

    if (!response.ok) {
      throw new Error(`Page save failed: ${response.status}`);
    }

    await reloadPages();
    setForm(defaultForm());
    setModalOpen(false);
    setMessage(labels.save);
  }

  async function deletePage(pageId: number) {
    const response = await fetch(`/api/v1/${resource}/${pageId}`, {
      method: "DELETE",
      headers: authorizationHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Page delete failed: ${response.status}`);
    }

    await reloadPages();
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
        <Table className="admin-crud-table min-w-[1080px] table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[280px]">{labels.label}</TableHead>
              <TableHead className="w-[260px]">{labels.slug}</TableHead>
              <TableHead className="w-[180px]">{labels.labelCn}</TableHead>
              <TableHead className="w-[120px]">{labels.order}</TableHead>
              <TableHead className="admin-action-header w-[240px] text-right">{labels.edit}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="truncate font-semibold text-primary-dark">{page.label}</TableCell>
                <TableCell className="truncate text-gray-600">{page.slug}</TableCell>
                <TableCell className="truncate text-gray-600">{page.label_cn}</TableCell>
                <TableCell className="text-gray-600">{page.order_index}</TableCell>
                <TableCell className="admin-action-cell">
                  <div className="flex flex-nowrap justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => void editPage(page.id)}>
                      <Pencil className="h-4 w-4" />
                      {labels.editAction}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => void deletePage(page.id)}>
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
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_140px]">
            <div className="space-y-2">
              <Label>{labels.journalId}</Label>
              <Input type="number" value={form.journalId} onChange={(event) => setForm({ ...form, journalId: Number(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.slug}</Label>
              <Input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.order}</Label>
              <Input type="number" value={form.orderIndex} onChange={(event) => setForm({ ...form, orderIndex: Number(event.target.value) })} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{labels.label}</Label>
              <Input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.labelCn}</Label>
              <Input value={form.labelCn} onChange={(event) => setForm({ ...form, labelCn: event.target.value })} />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>{labels.title}</Label>
              <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.titleCn}</Label>
              <Input value={form.titleCn} onChange={(event) => setForm({ ...form, titleCn: event.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{labels.content}</Label>
            <Textarea className="min-h-[150px] resize-y" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>{labels.contentCn}</Label>
            <Textarea className="min-h-[150px] resize-y" value={form.contentCn} onChange={(event) => setForm({ ...form, contentCn: event.target.value })} />
          </div>
          <div className="flex flex-wrap gap-3 border-t border-border pt-5">
            <Button type="button" onClick={() => void savePage()}>
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
