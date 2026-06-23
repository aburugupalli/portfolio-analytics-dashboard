"use client";

import Link from "next/link";
import { ArrowRight, BadgeEuro, BarChart3, CheckCircle2, Database, FileUp, LineChart, LockKeyhole, PieChart, ShieldCheck, UploadCloud, WalletCards } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { CsvDropzone } from "@/components/upload/CsvDropzone";

const navLinks = [
  { label: "Upload", href: "#upload" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Privacy", href: "#privacy" },
];

const trustPills = ["No login required", "CSV stays local", "Scalable Capital ready", "Yahoo Finance data"];

const features = [
  {
    title: "Performance",
    description: "Realized and unrealized P&L, ROI and XIRR.",
    icon: LineChart,
  },
  {
    title: "Holdings",
    description: "Understand weights, winners, losers and open positions.",
    icon: PieChart,
  },
  {
    title: "Costs",
    description: "See fees, taxes and dividends clearly separated.",
    icon: BadgeEuro,
  },
  {
    title: "Market Data",
    description: "Map symbols and enrich your portfolio with Yahoo Finance quotes.",
    icon: BarChart3,
  },
];

const steps = [
  {
    title: "Upload CSV",
    description: "Export your transaction history from Scalable Capital and drop it here.",
    icon: FileUp,
  },
  {
    title: "Analyze locally",
    description: "Your browser parses transactions, matches FIFO lots and calculates portfolio metrics.",
    icon: WalletCards,
  },
  {
    title: "Open dashboard",
    description: "Explore holdings, performance, activity and market data.",
    icon: ArrowRight,
  },
];

const privacyItems = [
  "CSV stays in your browser",
  "No account required",
  "No raw transaction history sent to Yahoo",
  "You control exports and local data",
];

const pageContainer = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-950 dark:bg-neutral-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(20,184,166,0.13),transparent_34rem),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.09),transparent_30rem)] dark:bg-[radial-gradient(circle_at_50%_-10%,rgba(20,184,166,0.12),transparent_32rem),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.08),transparent_30rem)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] dark:opacity-45" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-neutral-800/90 dark:bg-neutral-950/80">
        <nav aria-label="Primary" className={`${pageContainer} grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]`}>
          <Link href="/" className="flex min-w-0 items-center gap-3 justify-self-start rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500/40">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-white shadow-sm dark:bg-white dark:text-slate-950">
              <UploadCloud className="h-4 w-4" />
            </span>
            <span className="truncate text-sm font-semibold text-slate-950 dark:text-white">Portfolio Intelligence</span>
          </Link>

          <div className="hidden items-center gap-1 justify-self-center md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:text-slate-400 dark:hover:bg-neutral-900 dark:hover:text-white">
                {link.label}
              </a>
            ))}
            <Link href="/demo" className="rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-teal-500/40 dark:text-slate-400 dark:hover:bg-neutral-900 dark:hover:text-white">
              Demo
            </Link>
          </div>

          <div className="justify-self-end md:col-start-3">
            <ThemeToggle />
          </div>
        </nav>
        <nav aria-label="Landing sections mobile" className={`${pageContainer} flex gap-1 overflow-x-auto pb-3 md:hidden`}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-300">
              {link.label}
            </a>
          ))}
          <Link href="/demo" className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 dark:border-neutral-800 dark:bg-neutral-950 dark:text-slate-300">
            Demo
          </Link>
        </nav>
      </header>

      <section className={`${pageContainer} flex flex-col items-center pb-8 pt-14 text-center lg:pt-20`}>
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/75 px-3 py-1 text-sm font-medium text-teal-800 shadow-sm dark:border-teal-900/70 dark:bg-neutral-950/75 dark:text-teal-200">
          <LockKeyhole className="h-4 w-4" />
          Private, local-first portfolio analytics
        </div>
        <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
          Upload your broker CSV. Get instant portfolio insights.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
          Turn thousands of Scalable Capital transactions into a clean dashboard for performance, P&L, fees, taxes, XIRR and live market data.
        </p>
        <div className="mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
          {trustPills.map((pill) => (
            <span key={pill} className="inline-flex min-h-8 items-center rounded-full border border-slate-200 bg-white/75 px-3 text-xs font-medium text-slate-600 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/75 dark:text-slate-300">
              {pill}
            </span>
          ))}
        </div>
      </section>

      <section id="upload" className={`${pageContainer} scroll-mt-28 pb-16`}>
        <div className="mx-auto w-full max-w-4xl">
          <CsvDropzone />
        </div>
      </section>

      <section id="features" className="scroll-mt-24 py-12">
        <div className={pageContainer}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Features</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">Everything useful, nothing noisy.</h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 text-slate-800 dark:bg-neutral-900 dark:text-slate-100">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 py-12">
        <div className={pageContainer}>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">How it works</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">From export to analysis in three steps.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map(({ title, description, icon: Icon }, index) => (
              <article key={title} className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700 dark:bg-teal-950/40 dark:text-teal-200">{index + 1}</span>
                  <Icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-950 dark:text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="privacy" className="scroll-mt-24 py-12">
        <div className={pageContainer}>
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-xl shadow-slate-200/50 dark:border-neutral-800 dark:bg-neutral-950/85 dark:shadow-black/20 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-200">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-3xl font-semibold tracking-normal text-slate-950 dark:text-white">Private by design</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Your CSV is processed locally in your browser and is not uploaded. For market data, only ticker symbols are requested through the market data API — never your full transaction history.
                </p>
              </div>
              <div className="grid gap-3 text-sm">
                {privacyItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className={pageContainer}>
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200/80 bg-slate-950 p-6 text-center text-white shadow-xl shadow-slate-300/40 dark:border-neutral-800 dark:bg-white dark:text-slate-950 dark:shadow-black/20 sm:p-8">
            <Database className="mx-auto h-8 w-8 opacity-80" />
            <h2 className="mt-4 text-2xl font-semibold tracking-normal">No CSV right now?</h2>
            <p className="mt-2 text-sm text-slate-300 dark:text-slate-600">Open an anonymized portfolio and explore the dashboard flow.</p>
            <Link href="/demo" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800">
              View demo dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
