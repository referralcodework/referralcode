// Build-time job: counts $REFERRAL holders via Helius and writes public/data/holders.json.
// Runs in GitHub Actions with the HELIUS_API_KEY secret. Without a key it writes a stub and the UI hides the stat.
import { mkdir, writeFile } from 'node:fs/promises';

const MINT = 'CvmRz15WYyhLRskuUFfRe6EybPjQdUqFA8URVcmSpump';
const PAIR = 'EUyunpwVybXKn6oXPqmf67HdoGrX8VSXQZRXkkBuRfBj';
const OUT = new URL('../public/data/holders.json', import.meta.url);
const key = process.env.HELIUS_API_KEY;

async function write(obj) {
  await mkdir(new URL('.', OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(obj));
}

async function rpc(method, params) {
  const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 'holders', method, params }),
  });
  if (!res.ok) throw new Error(`Helius HTTP ${res.status}`);
  const json = await res.json();
  if (json.error) throw new Error(json.error.message);
  return json.result;
}

async function main() {
  if (!key) {
    console.log('[holders] HELIUS_API_KEY not set, writing stub');
    return write({ available: false });
  }
  const balances = new Map();
  for (let page = 1; page <= 50; page++) {
    const r = await rpc('getTokenAccounts', { mint: MINT, page, limit: 1000 });
    const accounts = r.token_accounts ?? [];
    for (const a of accounts) {
      const amt = Number(a.amount);
      if (amt > 0) balances.set(a.owner, (balances.get(a.owner) ?? 0) + amt);
    }
    if (accounts.length < 1000) break;
  }
  const mint = await rpc('getAccountInfo', [MINT, { encoding: 'jsonParsed' }]);
  const supply = Number(mint.value.data.parsed.info.supply);

  // Exclude the liquidity pool so the count and concentration reflect real wallets.
  balances.delete(PAIR);
  const sorted = [...balances.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 10).map(([owner, amt]) => ({ owner, pct: +((amt / supply) * 100).toFixed(3) }));
  const out = {
    updatedAt: new Date().toISOString(),
    holders: sorted.length,
    top10Pct: +top.reduce((s, t) => s + t.pct, 0).toFixed(2),
    top,
  };
  await write(out);
  console.log(`[holders] ${out.holders} holders, top10 ${out.top10Pct}%`);
}

main().catch(async (err) => {
  // Never fail the deploy over a stats hiccup.
  console.warn('[holders] failed:', err.message);
  await write({ available: false });
});
