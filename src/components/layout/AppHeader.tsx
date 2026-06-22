"use client";

import Link from "next/link";
import { Activity, BarChart3, Database, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <Activity className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold leading-5 text-slate-950 dark:text-white">Portfolio Intelligence</span>
            <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">Scalable CSV Analytics</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link href="/dashboard" title="Dashboard" className="grid h-10 w-10 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-neutral-900 dark:hover:text-white">
            <BarChart3 className="h-5 w-5" />
          </Link>
          <Link href="/demo" title="Demo" className="grid h-10 w-10 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-neutral-900 dark:hover:text-white">
            <Database className="h-5 w-5" />
          </Link>
          <Link href="/settings" title="Settings" className="grid h-10 w-10 place-items-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-neutral-900 dark:hover:text-white">
            <Settings className="h-5 w-5" />
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
