"use client";

import { useState } from "react";
import { ImageOff, Trash2, Upload } from "lucide-react";

import { readAuthTokenFromDocument } from "@/features/auth/client";
import type { StaticAssetDto } from "@/server/repository";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

interface AdminStaticAssetsFormProps {
  initialAssets: StaticAssetDto[];
}

const ASSET_ACTION_LABELS = {
  chooseFile: "Choose a file before uploading.",
  delete: "Delete",
  noPreview: "No preview",
  unknownMimeType: "unknown",
  upload: "Upload",
  uploading: "Uploading...",
} as const;

export function AdminStaticAssetsForm({
  initialAssets,
}: AdminStaticAssetsFormProps) {
  const [assets, setAssets] = useState(initialAssets);
  const [busyKey, setBusyKey] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Record<string, File | null>>({});

  function authorizationHeaders(): HeadersInit {
    const token = readAuthTokenFromDocument();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async function uploadAsset(asset: StaticAssetDto) {
    const file = selectedFiles[asset.key];
    if (!file) {
      setMessage(ASSET_ACTION_LABELS.chooseFile);
      return;
    }

    const formData = new FormData();
    formData.set("key", asset.key);
    formData.set("label", asset.label);
    formData.set("file", file);
    setBusyKey(asset.key);
    setMessage("");

    try {
      const response = await fetch("/api/v1/static-assets", {
        method: "POST",
        headers: authorizationHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const updated = (await response.json()) as StaticAssetDto;
      setAssets((current) =>
        current.map((item) => item.key === updated.key ? updated : item),
      );
      setSelectedFiles((current) => ({ ...current, [asset.key]: null }));
      setMessage(`${updated.label} updated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusyKey("");
    }
  }

  async function deleteAsset(asset: StaticAssetDto) {
    setBusyKey(asset.key);
    setMessage("");

    try {
      const response = await fetch(`/api/v1/static-assets/${encodeURIComponent(asset.key)}`, {
        method: "DELETE",
        headers: authorizationHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      setAssets((current) => current.filter((item) => item.key !== asset.key));
      setSelectedFiles((current) => {
        const next = { ...current };
        delete next[asset.key];
        return next;
      });
      setMessage(`${asset.label} deleted.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setBusyKey("");
    }
  }

  return (
    <div className="mt-8 space-y-5">
      {message ? (
        <div className="rounded-lg border border-primary/20 bg-primary-subtle px-4 py-3 text-sm font-medium text-primary">
          {message}
        </div>
      ) : null}

      <section className="admin-table-shell">
        <Table className="admin-crud-table min-w-[1190px] table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[260px]">Asset</TableHead>
              <TableHead className="w-[170px]">Preview</TableHead>
              <TableHead className="w-[320px]">Current file</TableHead>
              <TableHead className="w-[220px]">Replacement</TableHead>
              <TableHead className="admin-action-header w-[280px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
        {assets.map((asset) => (
          <TableRow key={asset.key}>
            <TableCell>
              <p className="truncate font-semibold text-primary-dark">{asset.label}</p>
              <p className="mt-1 truncate text-xs text-gray-500">{asset.key}</p>
            </TableCell>
            <TableCell>
              <div className="flex h-24 items-center justify-center rounded-lg border border-border bg-surface p-3">
                {asset.mime_type?.startsWith("image/") || /\.(svg|png|jpe?g|webp|ico)$/i.test(asset.url) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.url}
                    alt={asset.label}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="inline-flex items-center gap-2 text-xs text-gray-500">
                    <ImageOff className="h-4 w-4" />
                    {ASSET_ACTION_LABELS.noPreview}
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <p className="truncate text-sm text-gray-600">{asset.url}</p>
              <p className="mt-1 text-xs text-gray-400">
                {asset.mime_type ?? ASSET_ACTION_LABELS.unknownMimeType} {asset.size_bytes ? `| ${asset.size_bytes} bytes` : ""}
              </p>
            </TableCell>
            <TableCell>
              <Input
                className="cursor-pointer text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary-subtle file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary"
                type="file"
                accept="image/*,.ico"
                disabled={busyKey === asset.key}
                onChange={(event) => setSelectedFiles((current) => ({
                  ...current,
                  [asset.key]: event.target.files?.[0] ?? null,
                }))}
              />
            </TableCell>
            <TableCell className="admin-action-cell">
              <div className="flex flex-nowrap justify-end gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={busyKey === asset.key || !selectedFiles[asset.key]}
                  onClick={() => void uploadAsset(asset)}
                >
                  <Upload className="h-4 w-4" />
                  {busyKey === asset.key ? ASSET_ACTION_LABELS.uploading : ASSET_ACTION_LABELS.upload}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={busyKey === asset.key}
                  onClick={() => void deleteAsset(asset)}
                >
                  <Trash2 className="h-4 w-4" />
                  {ASSET_ACTION_LABELS.delete}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
