import { HoldingDeepDivePage } from "@/components/holding/HoldingDeepDivePage";

export default async function HoldingPage({ params }: { params: Promise<{ isin: string }> }) {
  const { isin } = await params;
  return <HoldingDeepDivePage isin={decodeURIComponent(isin)} />;
}
