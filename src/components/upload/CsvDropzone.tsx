"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, UploadCloud } from "lucide-react";
import { parseScalableFiles } from "@/lib/csv/parseScalableCsv";
import { saveRawTransactions, saveTransactions } from "@/lib/storage/localPortfolioStore";
import { cn } from "@/lib/utils";
import { UploadErrors } from "./UploadErrors";
import { UploadSummary } from "./UploadSummary";

export function CsvDropzone() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [duplicates, setDuplicates] = useState(0);

  const fileKeySet = useMemo(() => new Set(files.map((file) => `${file.name}-${file.size}`)), [files]);

  const handleFiles = useCallback(async (incoming: FileList | File[]) => {
    const selected = Array.from(incoming);
    const invalid = selected.filter((file) => !file.name.toLowerCase().endsWith(".csv"));
    const valid = selected.filter((file) => file.name.toLowerCase().endsWith(".csv") && !fileKeySet.has(`${file.name}-${file.size}`));
    if (invalid.length) setErrors(invalid.map((file) => `${file.name} ist keine CSV-Datei.`));
    if (!valid.length) return;
    const nextFiles = [...files, ...valid];
    setFiles(nextFiles);
    setIsParsing(true);
    try {
      const parsed = await parseScalableFiles(nextFiles);
      saveRawTransactions(parsed.rawTransactions);
      saveTransactions(parsed.transactions);
      setTransactionCount(parsed.transactions.length);
      setDuplicates(parsed.duplicates);
      setErrors(parsed.warnings);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "CSV konnte nicht verarbeitet werden."]);
    } finally {
      setIsParsing(false);
    }
  }, [fileKeySet, files]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-xl shadow-slate-200/70 dark:border-neutral-800 dark:bg-neutral-900/90 dark:shadow-black/30 sm:p-6">
      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          void handleFiles(event.dataTransfer.files);
        }}
        className={cn(
          "grid min-h-72 place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center transition dark:border-neutral-700 dark:bg-neutral-950/60",
          isDragging && "border-teal-500 bg-teal-50 dark:bg-teal-950/30",
        )}
      >
        <div>
          <UploadCloud className="mx-auto h-12 w-12 text-teal-600 dark:text-teal-300" />
          <h2 className="mt-4 text-xl font-semibold text-slate-950 dark:text-white">Broker-CSV hochladen</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            Deine CSV wird lokal im Browser verarbeitet und nicht hochgeladen. Für Live-Marktdaten werden nur Ticker-Symbole an die Marktdaten-API gesendet, nicht deine Transaktionshistorie.
          </p>
          <label className="mt-5 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-md bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700">
            CSV auswählen
            <input className="sr-only" type="file" accept=".csv,text/csv" multiple onChange={(event) => event.target.files && void handleFiles(event.target.files)} />
          </label>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {isParsing && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            Parsing läuft...
          </div>
        )}
        <UploadSummary files={files} transactionCount={transactionCount} duplicates={duplicates} />
        <UploadErrors errors={errors} />
        {transactionCount > 0 && (
          <button onClick={() => router.push("/dashboard")} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            Dashboard öffnen <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
