"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, FileSpreadsheet, Loader2, UploadCloud } from "lucide-react";
import { parseScalableFiles } from "@/lib/csv/parseScalableCsv";
import { calculatePortfolio } from "@/lib/portfolio/calculations";
import { saveRawTransactions, saveTransactions } from "@/lib/storage/localPortfolioStore";
import { cn } from "@/lib/utils";
import { UploadErrors } from "./UploadErrors";
import { UploadSummary } from "./UploadSummary";

export function CsvDropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseStatus, setParseStatus] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [duplicates, setDuplicates] = useState(0);
  const [ignoredCount, setIgnoredCount] = useState(0);
  const [holdingsCount, setHoldingsCount] = useState<number | undefined>();

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
    setParseStatus("Reading file...");
    try {
      setParseStatus("Parsing transactions...");
      const parsed = await parseScalableFiles(nextFiles);
      setParseStatus("Building portfolio...");
      const portfolio = calculatePortfolio(parsed.transactions);
      saveRawTransactions(parsed.rawTransactions);
      saveTransactions(parsed.transactions);
      setTransactionCount(parsed.transactions.length);
      setDuplicates(parsed.duplicates);
      setIgnoredCount(parsed.transactions.filter((transaction) => !transaction.includedInCalculations).length);
      setHoldingsCount(portfolio.positions.length);
      setErrors(parsed.warnings);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "CSV konnte nicht verarbeitet werden."]);
    } finally {
      setIsParsing(false);
      setParseStatus("");
    }
  }, [fileKeySet, files]);

  return (
    <div id="upload" className="scroll-mt-24 rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-2xl shadow-slate-200/60 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90 dark:shadow-black/30 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Upload & analyze CSV</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Scalable Capital transaction exports supported</p>
        </div>
        <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-400 sm:block">.csv · multiple files</div>
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
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
          "grid min-h-72 place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-6 text-center transition duration-300 hover:border-teal-400 hover:bg-teal-50/40 focus:outline-none focus:ring-2 focus:ring-teal-500/30 dark:border-neutral-700 dark:bg-neutral-900/50 dark:hover:border-teal-700 dark:hover:bg-teal-950/20",
          isDragging && "scale-[1.01] border-teal-500 bg-teal-50 dark:bg-teal-950/30",
        )}
      >
        <div className="max-w-md">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-teal-100 bg-white text-teal-700 shadow-sm dark:border-teal-900/70 dark:bg-neutral-950 dark:text-teal-300">
            <FileSpreadsheet className="h-8 w-8" />
          </div>
          <h2 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">Drop your CSV here</h2>
          <p className="mx-auto mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            or browse files to start your local portfolio analysis.
          </p>
          <span className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
            <UploadCloud className="h-4 w-4" />
            Browse CSV
          </span>
          <input ref={inputRef} className="sr-only" type="file" accept=".csv,text/csv" multiple onChange={(event) => event.target.files && void handleFiles(event.target.files)} />
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Supports .csv files and multiple broker exports.</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {isParsing && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Loader2 className="h-4 w-4 animate-spin" />
            {parseStatus || "Parsing transactions..."}
          </div>
        )}
        <UploadSummary files={files} transactionCount={transactionCount} duplicates={duplicates} ignoredCount={ignoredCount} holdingsCount={holdingsCount} />
        <UploadErrors errors={errors} />
        {transactionCount > 0 && (
          <button onClick={() => router.push("/dashboard")} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40">
            Open analysis <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
