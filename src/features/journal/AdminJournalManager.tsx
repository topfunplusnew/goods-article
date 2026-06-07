"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Pencil, Save, XCircle } from "lucide-react";

import { readAuthTokenFromDocument } from "@/features/auth/client";
import { resolveJournalCoverImageUrl } from "@/features/journal/assets";
import type { JournalDto } from "@/features/journal/contracts";
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

type OverviewEditorMode = "text" | "code" | "html";

interface AdminJournalManagerProps {
  initialJournal: JournalDto | null;
  labels: {
    back: string;
    cancel: string;
    coverImageClear: string;
    coverImageUrl: string;
    coverImageUrlPlaceholder: string;
    error: string;
    editJournal: string;
    issn: string;
    journalCoverImage: string;
    journalCoverImageFieldHint: string;
    journalCoverImageUpload: string;
    journalCoverImageUploading: string;
    journalCoverImageUploadSuccess: string;
    journalCoverImageUploadFailed: string;
    journalDescription: string;
    journalDownloads: string;
    journalDownloadsReadonly: string;
    journalImpactFactor: string;
    journalImpactFactor5Year: string;
    journalName: string;
    journalOverview: string;
    journalOverviewHint: string;
    journalPublisher: string;
    journalPublishingMode: string;
    journalPublishingModeHint: string;
    journalSubmissionDays: string;
    loading: string;
    noResults: string;
    required: string;
    retry: string;
    save: string;
    success: string;
  };
}

interface JournalFormState {
  title: string;
  description: string;
  coverImage: string;
  overview: string;
  publisher: string;
  publishingMode: string;
  impactFactor: string;
  impactFactor5Year: string;
  submissionToDecisionDays: string;
  issn: string;
}

function journalToForm(journal: JournalDto): JournalFormState {
  return {
    title: journal.title,
    description: journal.description ?? "",
    coverImage: resolveJournalCoverImageUrl(journal.cover_image),
    overview: journal.overview ?? "",
    publisher: journal.publisher ?? "",
    publishingMode: journal.publishing_mode ?? "",
    impactFactor: journal.impact_factor == null ? "" : String(journal.impact_factor),
    impactFactor5Year: journal.impact_factor_5year == null ? "" : String(journal.impact_factor_5year),
    submissionToDecisionDays: journal.submission_to_decision_days == null ? "" : String(journal.submission_to_decision_days),
    issn: journal.issn ?? "",
  };
}

function nullableFiniteNumber(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function nullableInt(raw: string): number | null | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function authorizationHeaders(): HeadersInit {
  const token = readAuthTokenFromDocument();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function AdminJournalManager({
  initialJournal,
  labels,
}: AdminJournalManagerProps) {
  const [journal, setJournal] = useState(initialJournal);
  const [form, setForm] = useState<JournalFormState | null>(() => initialJournal ? journalToForm(initialJournal) : null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadedName, setCoverUploadedName] = useState("");
  const [coverUploadError, setCoverUploadError] = useState("");
  const [coverInputKey, setCoverInputKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [overviewEditorMode, setOverviewEditorMode] = useState<OverviewEditorMode>("text");
  const [overviewCodeContent, setOverviewCodeContent] = useState(initialJournal?.overview ?? "");

  const journalCoverUrl = useMemo(
    () => resolveJournalCoverImageUrl(journal?.cover_image ?? ""),
    [journal?.cover_image],
  );
  const coverPreviewUrl = useMemo(
    () => resolveJournalCoverImageUrl(form?.coverImage ?? ""),
    [form?.coverImage],
  );

  async function fetchJournal() {
    setLoading(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/v1/journals", {
        headers: { accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Journal request failed: ${response.status}`);
      }

      const nextJournal = (await response.json()) as JournalDto;
      setJournal(nextJournal);
      setForm(journalToForm(nextJournal));
      setOverviewCodeContent(nextJournal.overview ?? "");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : labels.error);
    } finally {
      setLoading(false);
    }
  }

  function buildPayload(current: JournalFormState) {
    const payload = {
      title: current.title.trim(),
      issn: current.issn.trim(),
      description: current.description.trim(),
      cover_image: current.coverImage.trim(),
      overview: current.overview.trim(),
      publisher: current.publisher.trim(),
      publishing_mode: current.publishingMode.trim(),
      impact_factor: null as number | null,
      impact_factor_5year: null as number | null,
      submission_to_decision_days: null as number | null,
    };
    const impactFactor = nullableFiniteNumber(current.impactFactor);
    const impactFactor5Year = nullableFiniteNumber(current.impactFactor5Year);
    const submissionDays = nullableInt(current.submissionToDecisionDays);

    if (impactFactor !== undefined) {
      payload.impact_factor = impactFactor;
    }
    if (impactFactor5Year !== undefined) {
      payload.impact_factor_5year = impactFactor5Year;
    }
    if (submissionDays !== undefined) {
      payload.submission_to_decision_days = submissionDays;
    }

    return payload;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    setSuccessMessage("");

    if (!journal || !form) {
      return;
    }

    if (!form.title.trim()) {
      setErrors({ title: labels.required });
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch(`/api/v1/journals/${journal.id}`, {
        method: "PUT",
        headers: {
          ...authorizationHeaders(),
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(buildPayload(form)),
      });

      if (!response.ok) {
        throw new Error(`Journal save failed: ${response.status}`);
      }

      await fetchJournal();
      setSuccessMessage(labels.success);
      setModalOpen(false);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : labels.error);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCoverChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setCoverInputKey((current) => current + 1);

    if (!file || !journal) {
      return;
    }

    setCoverUploading(true);
    setCoverUploadError("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.set("file", file);
      const response = await fetch(`/api/v1/journals/${journal.id}/upload`, {
        method: "POST",
        headers: authorizationHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Journal cover upload failed: ${response.status}`);
      }

      const updated = (await response.json()) as JournalDto;
      const nextForm = journalToForm(updated);
      setJournal(updated);
      setForm(nextForm);
      setOverviewCodeContent(nextForm.overview);
      setCoverUploadedName(file.name);
    } catch (error) {
      setCoverUploadError(error instanceof Error ? error.message : labels.journalCoverImageUploadFailed);
    } finally {
      setCoverUploading(false);
    }
  }

  function clearCoverImage() {
    setForm((current) => current ? { ...current, coverImage: "" } : current);
    setCoverUploadedName("");
    setCoverUploadError("");
  }

  function enterOverviewCodeMode() {
    if (form) {
      setOverviewCodeContent(form.overview);
    }
    setOverviewEditorMode("code");
  }

  function updateOverview(value: string) {
    setForm((current) => current ? { ...current, overview: value } : current);
    setOverviewCodeContent(value);
  }

  function openEditModal() {
    if (!journal) {
      return;
    }

    setForm(journalToForm(journal));
    setOverviewCodeContent(journal.overview ?? "");
    setCoverUploadedName("");
    setCoverUploadError("");
    setSubmitError("");
    setSuccessMessage("");
    setErrors({});
    setModalOpen(true);
  }

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <p className="text-gray-500">{labels.loading}</p>
      </div>
    );
  }

  if (!journal || !form) {
    return (
      <div className="card max-w-3xl rounded-xl border-warning/30 bg-warning/5 p-6 text-warning">
        {labels.noResults}
        <Button asChild variant="outline" className="mt-4">
          <Link href="/admin">
            <ArrowLeft className="h-4 w-4" />
            {labels.back}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {successMessage ? (
          <p className="rounded-lg bg-primary-subtle px-3 py-2 text-sm text-primary">
            {successMessage}
          </p>
        ) : null}

        {submitError && !modalOpen ? (
          <p className="rounded-lg border border-error/30 bg-error/5 px-3 py-2 text-sm text-error">
            {submitError}
          </p>
        ) : null}

        <Button type="button" className="ml-auto" onClick={openEditModal}>
          <Pencil className="h-4 w-4" />
          {labels.editJournal}
        </Button>
      </div>

      <section className="admin-table-shell">
        <Table className="admin-crud-table min-w-[1080px] table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[130px]">{labels.journalCoverImage}</TableHead>
              <TableHead className="w-[300px]">{labels.journalName}</TableHead>
              <TableHead className="w-[190px]">{labels.journalPublisher}</TableHead>
              <TableHead className="w-[140px]">{labels.issn}</TableHead>
              <TableHead className="w-[120px]">{labels.journalDownloads}</TableHead>
              <TableHead className="admin-action-header w-[200px] text-right">{labels.editJournal}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface">
                  {journal.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={journalCoverUrl} alt={journal.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-gray-400">{labels.journalCoverImage}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <p className="truncate font-semibold text-primary-dark">{journal.title}</p>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">{journal.description ?? ""}</p>
              </TableCell>
              <TableCell className="truncate text-gray-600">{journal.publisher ?? ""}</TableCell>
              <TableCell className="truncate text-gray-600">{journal.issn ?? ""}</TableCell>
              <TableCell className="text-gray-600">{journal.downloads ?? 0}</TableCell>
              <TableCell className="admin-action-cell">
                <div className="flex flex-nowrap justify-end">
                  <Button type="button" variant="outline" size="sm" onClick={openEditModal}>
                    <Pencil className="h-4 w-4" />
                    {labels.editJournal}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <AdminModal open={modalOpen} title={labels.editJournal} onClose={() => setModalOpen(false)}>
        <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-dark">{labels.journalName}</h2>
            <div className="space-y-2">
              <Input
                value={form.title}
                type="text"
                className={errors.title ? "border-error" : ""}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
              {errors.title ? <p className="mt-1 text-sm text-error">{errors.title}</p> : null}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-dark">{labels.journalDescription}</h2>
            <div className="space-y-2">
              <Textarea
                value={form.description}
                className="min-h-[120px] resize-y"
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-dark">{labels.journalCoverImage}</h2>
            <p className="text-xs text-gray-500">{labels.journalCoverImageFieldHint}</p>

            <div className="space-y-2">
              <Label>{labels.journalCoverImageUpload}</Label>
              <Input
                key={coverInputKey}
                type="file"
                className="cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary-subtle file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary"
                accept="image/*"
                disabled={coverUploading || submitting}
                onChange={(event) => void handleCoverChange(event)}
              />
              {coverUploading ? <p className="mt-2 text-sm text-gray-500">{labels.journalCoverImageUploading}</p> : null}
              {!coverUploading && coverUploadedName ? (
                <p className="mt-2 text-sm text-gray-500">
                  {labels.journalCoverImageUploadSuccess}: {coverUploadedName}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label>{labels.coverImageUrl}</Label>
              <Input
                value={form.coverImage}
                type="text"
                readOnly
                placeholder={labels.coverImageUrlPlaceholder}
              />
            </div>

            {form.coverImage.trim() ? (
              <div className="overflow-hidden rounded-lg border border-border bg-surface/30 p-3">
                <p className="text-xs font-medium text-gray-600">{labels.journalCoverImage}</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverPreviewUrl}
                  alt="journal cover"
                  className="mt-2 max-h-56 rounded-md border border-border object-contain"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 px-0 text-error hover:bg-transparent hover:text-error"
                  onClick={clearCoverImage}
                >
                  <XCircle className="h-4 w-4" />
                  {labels.coverImageClear}
                </Button>
              </div>
            ) : null}

            {coverUploadError ? (
              <div className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
                {coverUploadError}
              </div>
            ) : null}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-dark">{labels.journalOverview}</h2>
            <p className="text-xs text-gray-500">
              {labels.journalOverviewHint}
            </p>
            <div className="mb-2 inline-flex rounded-lg border border-border bg-surface p-0.5 text-sm">
              <Button
                type="button"
                variant={overviewEditorMode === "text" ? "default" : "ghost"}
                size="sm"
                className="h-8 rounded-md px-3"
                onClick={() => setOverviewEditorMode("text")}
              >
                富文本编辑
              </Button>
              <Button
                type="button"
                variant={overviewEditorMode === "code" ? "default" : "ghost"}
                size="sm"
                className="h-8 rounded-md px-3"
                onClick={enterOverviewCodeMode}
              >
                源码编辑
              </Button>
              <Button
                type="button"
                variant={overviewEditorMode === "html" ? "default" : "ghost"}
                size="sm"
                className="h-8 rounded-md px-3"
                onClick={() => setOverviewEditorMode("html")}
              >
                HTML预览
              </Button>
            </div>
            {overviewEditorMode === "text" ? (
              <Textarea
                value={form.overview}
                className="min-h-[260px] resize-y"
                placeholder={labels.journalOverviewHint}
                onChange={(event) => updateOverview(event.target.value)}
              />
            ) : null}
            {overviewEditorMode === "code" ? (
              <div className="space-y-2">
                <Textarea
                  value={overviewCodeContent}
                  className="min-h-[260px] resize-y font-mono text-sm"
                  onChange={(event) => updateOverview(event.target.value)}
                />
              </div>
            ) : null}
            {overviewEditorMode === "html" ? (
              <div className="overflow-hidden rounded-xl border border-border bg-white">
                <p className="border-b border-border bg-surface px-4 py-2 text-xs font-medium text-gray-600">HTML 预览</p>
                <div className="min-h-[260px] overflow-auto bg-surface p-4">
                  {form.overview.trim() ? (
                    <div className="html-preview-render" dangerouslySetInnerHTML={{ __html: form.overview }} />
                  ) : (
                    <p className="text-sm text-gray-500">{labels.journalOverviewHint}</p>
                  )}
                </div>
              </div>
            ) : null}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-dark">{labels.journalPublisher}</h2>
            <Input value={form.publisher} type="text" onChange={(event) => setForm({ ...form, publisher: event.target.value })} />
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-dark">{labels.journalPublishingMode}</h2>
            <p className="text-xs text-gray-500">{labels.journalPublishingModeHint}</p>
            <Input value={form.publishingMode} type="text" onChange={(event) => setForm({ ...form, publishingMode: event.target.value })} />
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>{labels.journalImpactFactor}</Label>
              <Input value={form.impactFactor} type="text" inputMode="decimal" placeholder="e.g. 3.2" onChange={(event) => setForm({ ...form, impactFactor: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.journalImpactFactor5Year}</Label>
              <Input value={form.impactFactor5Year} type="text" inputMode="decimal" onChange={(event) => setForm({ ...form, impactFactor5Year: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.journalSubmissionDays}</Label>
              <Input value={form.submissionToDecisionDays} type="text" inputMode="numeric" onChange={(event) => setForm({ ...form, submissionToDecisionDays: event.target.value })} />
            </div>
          </section>

          {typeof journal.downloads === "number" ? (
            <section className="rounded-lg border border-border bg-surface/60 px-4 py-3 text-sm text-gray-600">
              <p>
                <span className="font-medium text-primary-dark">{labels.journalDownloads}</span>
                : {journal.downloads}
              </p>
              <p className="mt-1 text-xs">{labels.journalDownloadsReadonly}</p>
            </section>
          ) : null}

          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-primary-dark">{labels.issn}</h2>
            <Input value={form.issn} type="text" onChange={(event) => setForm({ ...form, issn: event.target.value })} />
          </section>

          {successMessage ? (
            <div className="rounded-lg border border-primary/20 bg-primary-subtle px-4 py-3 text-sm text-primary">
              {successMessage}
            </div>
          ) : null}

          {submitError ? (
            <div className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={submitting}>
              <Save className="h-4 w-4" />
              {submitting ? labels.loading : labels.save}
            </Button>
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              <XCircle className="h-4 w-4" />
              {labels.cancel}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
}
