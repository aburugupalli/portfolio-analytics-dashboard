"use client";

import Link from "next/link";
import { ArrowRight, BadgeEuro, BarChart3, FileText, LineChart, LockKeyhole, RefreshCw, ShieldCheck } from "lucide-react";
import { AppHeader } from "@/components/layout/AppHeader";
import { CsvDropzone } from "@/components/upload/CsvDropzone";

const features = [
  ["FIFO P&L", BadgeEuro],
  ["XIRR", LineChart],
  ["Realized & Unrealized P&L", BarChart3],
  ["Yahoo Finance Prices", RefreshCw],
  ["Stock Deep Dives", FileText],
  ["Taxes & Fees", ShieldCheck],
  ["Daily Development", BarChart3],
  ["Benchmark Comparison", LineChart],
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <AppHeader />
      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-8 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:pt-14">
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-teal-200 bg-white/70 px-3 py-1 text-sm font-medium text-teal-800 shadow-sm dark:border-teal-900/70 dark:bg-neutral-900/80 dark:text-teal-200">
            <LockKeyhole className="h-4 w-4" />
            Local-first portfolio analytics
          </div>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Turn your broker CSV into a premium portfolio dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Upload your Scalable Capital transaction history and unlock deep portfolio analytics, FIFO P&L, XIRR, live prices and stock deep dives.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/demo" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              Demo öffnen <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/settings" className="inline-flex min-h-11 items-center rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200 dark:hover:bg-neutral-800">
              Symbol Mapping
            </Link>
          </div>
        </div>
        <CsvDropzone />
      </section>
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(([label, Icon]) => (
            <div key={label as string} className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/80">
              <Icon className="h-5 w-5 text-teal-600 dark:text-teal-300" />
              <p className="mt-3 text-sm font-semibold text-slate-850 dark:text-slate-100">{label as string}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
