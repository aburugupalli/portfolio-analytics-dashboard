"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer";
import { demoMappings, demoTransactions } from "@/lib/demo/demoData";
import { saveMappings, saveTransactions } from "@/lib/storage/localPortfolioStore";

export default function DemoPage() {
  const router = useRouter();
  useEffect(() => {
    saveTransactions(demoTransactions());
    saveMappings(demoMappings);
    router.replace("/dashboard");
  }, [router]);
  return (
    <main className="min-h-screen">
      <AppHeader />
      <ResponsiveContainer className="py-10">
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-neutral-800 dark:bg-neutral-900">
          <h1 className="text-2xl font-semibold">Demo wird geladen...</h1>
        </div>
      </ResponsiveContainer>
    </main>
  );
}
