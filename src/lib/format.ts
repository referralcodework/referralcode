const compact = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 });
const compactNum = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 });

export function num(v: unknown): number | null {
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

/** Tiny meme-coin prices: $0.0₅2905 style subscript for leading zeros. */
export function price(v: unknown, plain = false): string {
  const n = num(v);
  if (n === null || n <= 0) return '—';
  if (n >= 1) return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 4 });
  const s = n.toFixed(20);
  const zeros = (s.split('.')[1].match(/^0*/) ?? [''])[0].length;
  const sig = n.toPrecision(4).replace(/e.*$/, '');
  const digits = sig.replace(/^0\.0*/, '').replace('.', '').replace(/0+$/, '') || '0';
  if (zeros < 4 || plain) return '$' + n.toFixed(zeros + 4).replace(/0+$/, '');
  const sub = String(zeros).split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[+d]).join('');
  return `$0.0${sub}${digits}`;
}

export const usd = (v: unknown) => { const n = num(v); return n === null || n < 0 ? '—' : compact.format(n); };
export const count = (v: unknown) => { const n = num(v); return n === null ? '—' : compactNum.format(n); };
export const pct = (v: unknown) => { const n = num(v); return n === null ? '—' : `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`; };
export const short = (a: string, n = 4) => (a.length > n * 2 + 1 ? `${a.slice(0, n)}…${a.slice(-n)}` : a);

export function ago(iso: string | number): string {
  const t = typeof iso === 'number' ? iso : Date.parse(iso);
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/** Strip anything that isn't a safe display name for referral links. */
export function cleanRef(v: string | null | undefined): string | null {
  if (!v) return null;
  const s = v.normalize('NFKC').replace(/[^\p{L}\p{N}_ .-]/gu, '').trim().slice(0, 24);
  return s.length ? s : null;
}
