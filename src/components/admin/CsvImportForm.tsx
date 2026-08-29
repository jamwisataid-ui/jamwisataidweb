"use client";

import { useRef, useState } from "react";
import { Download, FileCheck2, LoaderCircle, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

type Result = { ok?: boolean; preview?: boolean; rows?: number; summary?: Record<string, number>; issues?: string[]; error?: string };

export function CsvImportForm() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [validated, setValidated] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  async function run(commit: boolean) {
    const file = input.current?.files?.[0];
    if (!file) { setResult({ error: "Pilih file CSV terlebih dahulu." }); return; }
    setBusy(true);
    try {
      const body = new FormData(); body.set("file", file); body.set("commit", String(commit));
      const response = await fetch("/api/admin/management/import", { method: "POST", body });
      const data = await response.json() as Result;
      setResult(data); setValidated(Boolean(response.ok && data.preview));
      if (response.ok && commit) { setValidated(false); router.refresh(); }
    } catch { setResult({ error: "CSV gagal dibaca." }); } finally { setBusy(false); }
  }
  return <div className="management-import"><a href="/api/admin/management/import"><Download />Download template CSV</a><label><span>Pilih CSV</span><input ref={input} type="file" accept=".csv,text/csv" onChange={() => { setValidated(false); setResult(null); }} /></label>{result ? <div className={`management-feedback ${result.ok ? "success" : "error"}`}>{result.ok ? <FileCheck2 /> : <Upload />}<span>{result.error ?? (result.preview ? `${result.rows} baris valid dan siap diimport.` : `${result.rows} baris berhasil diimport.`)}{result.issues?.length ? <small>{result.issues.join(" • ")}</small> : null}</span></div> : null}<div><button type="button" disabled={busy} onClick={() => run(false)}>{busy ? <LoaderCircle /> : <FileCheck2 />}Periksa CSV</button><button type="button" disabled={busy || !validated} onClick={() => run(true)}><Upload />Import data</button></div></div>;
}
