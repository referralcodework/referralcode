import { API, TOKEN } from '../config';
import { num } from './format';

export interface Market {
  priceUsd: number | null;
  priceNative: number | null;
  change: { m5: number | null; h1: number | null; h6: number | null; h24: number | null };
  marketCap: number | null;
  liquidity: number | null;
  volume24: number | null;
  txns24: { buys: number; sells: number };
  pairCreatedAt: number | null;
  dex: string;
}

export interface Trade { kind: 'buy' | 'sell'; usd: number | null; tokens: number | null; sol: number | null; at: string; tx: string; wallet: string }
export interface Candle { t: number; o: number; h: number; l: number; c: number; v: number }
export interface MintInfo { mintAuthority: string | null; freezeAuthority: string | null; updateAuthority: string | null; supply: number; program: string }
export interface Holders { updatedAt: string; holders: number; top10Pct: number; top: { owner: string; pct: number }[] }

async function getJSON<T>(url: string, init: RequestInit = {}, timeoutMs = 9000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchMarket(): Promise<Market> {
  const data = await getJSON<{ pairs?: any[] | null }>(API.dexscreener);
  const pairs = (data.pairs ?? []).filter((p) => p?.baseToken?.address === TOKEN.mint);
  if (!pairs.length) throw new Error('no-pair');
  // Use the deepest pool so a dust pool can never hijack the numbers.
  const p = pairs.sort((a, b) => (num(b.liquidity?.usd) ?? 0) - (num(a.liquidity?.usd) ?? 0))[0];
  return {
    priceUsd: num(p.priceUsd),
    priceNative: num(p.priceNative),
    change: { m5: num(p.priceChange?.m5), h1: num(p.priceChange?.h1), h6: num(p.priceChange?.h6), h24: num(p.priceChange?.h24) },
    marketCap: num(p.marketCap ?? p.fdv),
    liquidity: num(p.liquidity?.usd),
    volume24: num(p.volume?.h24),
    txns24: { buys: p.txns?.h24?.buys ?? 0, sells: p.txns?.h24?.sells ?? 0 },
    pairCreatedAt: num(p.pairCreatedAt),
    dex: String(p.dexId ?? ''),
  };
}

export async function fetchTrades(): Promise<Trade[]> {
  const data = await getJSON<{ data: any[] }>(`${API.geckoPool}/trades`);
  return data.data.slice(0, 25).map(({ attributes: a }) => {
    const buy = a.kind === 'buy';
    return {
      kind: buy ? 'buy' : 'sell',
      usd: num(a.volume_in_usd),
      tokens: num(buy ? a.to_token_amount : a.from_token_amount),
      sol: num(buy ? a.from_token_amount : a.to_token_amount),
      at: a.block_timestamp,
      tx: a.tx_hash,
      wallet: a.tx_from_address,
    };
  });
}

export async function fetchCandles(timeframe: 'minute' | 'hour' | 'day', aggregate: number, limit: number): Promise<Candle[]> {
  const url = `${API.geckoPool}/ohlcv/${timeframe}?aggregate=${aggregate}&limit=${limit}&currency=usd`;
  const data = await getJSON<{ data: { attributes: { ohlcv_list: number[][] } } }>(url);
  return data.data.attributes.ohlcv_list
    .map(([t, o, h, l, c, v]) => ({ t: t * 1000, o, h, l, c, v }))
    .sort((a, b) => a.t - b.t);
}

export async function fetchMintInfo(): Promise<MintInfo> {
  const body = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getAccountInfo', params: [TOKEN.mint, { encoding: 'jsonParsed' }] });
  let data: any;
  for (const url of API.rpc) {
    try { data = await getJSON<any>(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }); break; }
    catch { /* try the next endpoint */ }
  }
  const v = data?.result?.value;
  const info = v?.data?.parsed?.info;
  if (!info) throw new Error('bad-mint');
  const meta = (info.extensions ?? []).find((e: any) => e.extension === 'tokenMetadata');
  return {
    mintAuthority: info.mintAuthority ?? null,
    freezeAuthority: info.freezeAuthority ?? null,
    updateAuthority: meta?.state?.updateAuthority ?? null,
    supply: Number(info.supply) / 10 ** (info.decimals ?? TOKEN.decimals),
    program: v.data.program,
  };
}

export async function fetchHolders(): Promise<Holders | null> {
  try {
    const h = await getJSON<Holders & { available?: boolean }>('/data/holders.json', { cache: 'no-cache' }, 5000);
    return h.available === false ? null : h;
  } catch {
    return null;
  }
}

/**
 * Poll a task with one request in flight at a time, pausing while the tab is hidden.
 * Returns a function that forces an immediate refresh.
 */
export function poll(task: () => Promise<unknown>, everyMs: number): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    clearTimeout(timer);
    try { await task(); } catch { /* task renders its own error state */ }
    running = false;
    if (!document.hidden) timer = setTimeout(run, everyMs);
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearTimeout(timer);
    else run();
  });
  run();
  return run;
}
