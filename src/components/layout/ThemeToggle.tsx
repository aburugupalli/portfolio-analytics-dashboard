"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="inline-flex rounded-md border border-slate-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            "grid h-8 w-9 place-items-center rounded-sm text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white",
            theme === value && "bg-slate-100 text-slate-950 dark:bg-neutral-800 dark:text-white",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
