"use client";

export type LocalAlert = {
  id: string;
  isin?: string;
  symbol?: string;
  type: "price-above" | "price-below" | "weight-above" | "gain-above" | "loss-below" | "daily-drop" | "market-stale";
  threshold: number;
  enabled: boolean;
};

const key = "portfolio.alerts";

export function loadAlerts(): LocalAlert[] {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

export function saveAlerts(alerts: LocalAlert[]) {
  window.localStorage.setItem(key, JSON.stringify(alerts));
}
