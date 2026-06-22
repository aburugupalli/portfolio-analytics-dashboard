import { formatMoney } from "@/lib/formatting/money";
import type { PortfolioState } from "@/types/portfolio";

export function RealizedPnlTab({ state }: { state: PortfolioState }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-neutral-800"><tr>{["Sell Date", "Name", "Shares Sold", "Proceeds", "Cost Basis", "Fees", "Taxes", "Gross P&L", "Net P&L", "Holding Period"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
        <tbody>
          {state.realizedTrades.map((trade) => (
            <tr key={trade.id} className="border-b border-slate-100 last:border-0 dark:border-neutral-800">
              <td className="px-4 py-3">{trade.sellDate}</td>
              <td className="px-4 py-3 font-semibold">{trade.name}<div className="text-xs font-normal text-slate-500">{trade.isin}</div></td>
              <td className="px-4 py-3 number-tabular">{trade.sharesSold.toFixed(4)}</td>
              <td className="px-4 py-3 number-tabular">{formatMoney(trade.proceeds)}</td>
              <td className="px-4 py-3 number-tabular">{formatMoney(trade.costBasis)}</td>
              <td className="px-4 py-3 number-tabular">{formatMoney(trade.fees)}</td>
              <td className="px-4 py-3 number-tabular">{formatMoney(trade.taxes)}</td>
              <td className="px-4 py-3 number-tabular">{formatMoney(trade.grossPnl)}</td>
              <td className="px-4 py-3 number-tabular font-semibold">{formatMoney(trade.netPnl)}</td>
              <td className="px-4 py-3">{trade.holdingPeriodDays} days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
