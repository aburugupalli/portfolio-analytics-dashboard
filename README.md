# Portfolio Intelligence Dashboard

Modern local-first portfolio analytics for Scalable Capital CSV exports.

## Features

- Client-side CSV parsing for semicolon-separated Scalable Capital exports
- German number parsing, duplicate detection, executed-only calculation filtering
- FIFO lot matching, realized P&L, open positions, dividends, fees and taxes
- Portfolio XIRR with Newton-Raphson and bisection fallback
- Transaction-driven daily and monthly development
- Local symbol mapping from ISIN to Yahoo Finance symbols
- Server-side Yahoo Finance API routes for search, quotes, charts, summaries and news
- Light/dark/system theme support
- Responsive dashboard, holdings table, market data tab, settings and holding deep dives
- Local JSON export/import and static HTML report export

## Privacy

CSV files are parsed in the browser and are not uploaded. The only data sent to the market-data API is the Yahoo ticker symbol needed for quotes, charts, summaries or news.

Do not commit real broker exports, private screenshots or personal transaction data.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

Open `http://localhost:3000` for the upload page, or `http://localhost:3000/demo` for anonymized demo data.

## GitHub

If the GitHub CLI is installed and authenticated:

```bash
gh repo create portfolio-analytics-dashboard --public --source=. --remote=origin --push
```

## Vercel

If the Vercel CLI is installed and authenticated:

```bash
vercel
vercel deploy --prod
```
