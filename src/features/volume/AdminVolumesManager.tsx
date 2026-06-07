"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

import { readAuthTokenFromDocument } from "@/features/auth/client";
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

export interface VolumeDto {
  id: number;
  journal_id: number;
  volume_number: number;
  year: number;
  published: boolean;
  created_at: string;
  updated_at: string;
  issues_count: number;
}

interface VolumeFormState {
  id: number | null;
  journalId: number;
  volumeNumber: number;
  year: number;
  published: boolean;
}

interface AdminVolumesManagerProps {
  initialVolumes: VolumeDto[];
  labels: {
    add: string;
    delete: string;
    edit: string;
    issues: string;
    journalId: string;
    published: string;
    reset: string;
    save: string;
    title: string;
    unpublished: string;
    volumeNumber: string;
    year: string;
  };
}

function defaultForm(): VolumeFormState {
  return {
    id: null,
    journalId: 1,
    volumeNumber: 1,
    year: new Date().getFullYear(),
    published: false,
  };
}

function authorizationHeaders(): HeadersInit {
  const token = readAuthTokenFromDocument();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function volumeToForm(volume: VolumeDto): VolumeFormState {
  return {
    id: volume.id,
    journalId: volume.journal_id,
    volumeNumber: volume.volume_number,
    year: volume.year,
    published: volume.published,
  };
}

function toPayload(form: VolumeFormState) {
  return {
    journal_id: form.journalId,
    volume_number: form.volumeNumber,
    year: form.year,
    published: form.published,
  };
}

export function AdminVolumesManager({
  initialVolumes,
  labels,
}: AdminVolumesManagerProps) {
  const [volumes, setVolumes] = useState(initialVolumes);
  const [form, setForm] = useState<VolumeFormState>(() => defaultForm());
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const sortedVolumes = useMemo(
    () => [...volumes].sort((left, right) => right.year - left.year || right.volume_number - left.volume_number),
    [volumes],
  );

  async function reloadVolumes() {
    const response = await fetch("/api/v1/volumes", {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Volume list failed: ${response.status}`);
    }

    setVolumes((await response.json()) as VolumeDto[]);
  }

  async function saveVolume() {
    const response = await fetch(form.id ? `/api/v1/volumes/${form.id}` : "/api/v1/volumes", {
      method: form.id ? "PUT" : "POST",
      headers: {
        ...authorizationHeaders(),
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(toPayload(form)),
    });

    if (!response.ok) {
      throw new Error(`Volume save failed: ${response.status}`);
    }

    await reloadVolumes();
    setForm(defaultForm());
    setModalOpen(false);
    setMessage(labels.save);
  }

  async function deleteVolume(volume: VolumeDto) {
    const response = await fetch(`/api/v1/volumes/${volume.id}`, {
      method: "DELETE",
      headers: authorizationHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Volume delete failed: ${response.status}`);
    }

    await reloadVolumes();
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
        <Table className="admin-crud-table min-w-[940px] table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[240px]">{labels.title}</TableHead>
              <TableHead className="w-[140px]">{labels.year}</TableHead>
              <TableHead className="w-[160px]">{labels.published}</TableHead>
              <TableHead className="w-[140px]">{labels.issues}</TableHead>
              <TableHead className="admin-action-header w-[240px] text-right">{labels.edit}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedVolumes.map((volume) => (
              <TableRow key={volume.id}>
                <TableCell className="font-semibold text-primary-dark">{labels.title} {volume.volume_number}</TableCell>
                <TableCell className="text-gray-600">{volume.year}</TableCell>
                <TableCell className="text-gray-600">
                  <Badge variant={volume.published ? "success" : "neutral"}>
                    {volume.published ? labels.published : labels.unpublished}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{volume.issues_count}</TableCell>
                <TableCell className="admin-action-cell">
                  <div className="flex flex-nowrap justify-end gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      setForm(volumeToForm(volume));
                      setModalOpen(true);
                    }}>
                      <Pencil className="h-4 w-4" />
                      {labels.edit}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => void deleteVolume(volume)}>
                      <Trash2 className="h-4 w-4" />
                      {labels.delete}
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
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>{labels.journalId}</Label>
              <Input type="number" value={form.journalId} onChange={(event) => setForm({ ...form, journalId: Number(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.volumeNumber}</Label>
              <Input type="number" value={form.volumeNumber} onChange={(event) => setForm({ ...form, volumeNumber: Number(event.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>{labels.year}</Label>
              <Input type="number" value={form.year} onChange={(event) => setForm({ ...form, year: Number(event.target.value) })} />
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input className="h-4 w-4 rounded border-border accent-primary" type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} />
            {labels.published}
          </label>
          <div className="flex flex-wrap gap-3 border-t border-border pt-5">
            <Button type="button" onClick={() => void saveVolume()}>
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
