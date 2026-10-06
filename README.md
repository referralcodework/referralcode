# referralcode.work

Official site for **Referral Code ($REFERRAL)**, a community-owned Solana meme coin.

Built with [Astro](https://astro.build) + TypeScript + Tailwind CSS v4. Static output, deployed to GitHub Pages by GitHub Actions.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run check      # type-check
```

## Where things live

| Path | What |
| --- | --- |
| `src/config.ts` | **Single source of truth**: contract address, pool, links, API endpoints, nav |
| `src/pages/` | `index` (home), `share` (referral card), `memes` (meme generator), `404` |
| `src/components/` | Home page sections: Hero, Trust, Live, Buy, Spread, Faq, plus Nav/Footer |
| `src/lib/market.ts` | Live data: DexScreener (market), GeckoTerminal (trades, chart), Solana RPC (mint authorities) |
| `src/lib/canvas.ts` | Shared drawing helpers for the card and meme generators |
| `scripts/fetch-holders.mjs` | Build-time holder count via Helius; writes `public/data/holders.json` |
| `.github/workflows/deploy.yml` | Builds on every push/PR, deploys `main`, rebuilds every 30 min for fresh holder stats |

## Secrets

- `HELIUS_API_KEY` (optional, repo secret). Enables the holder count. Without it the build still succeeds and the stat is hidden.
