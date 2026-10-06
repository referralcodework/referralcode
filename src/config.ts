// Single source of truth for every address, link and piece of site metadata.
export const TOKEN = {
  name: 'Referral Code',
  ticker: '$REFERRAL',
  mint: 'CvmRz15WYyhLRskuUFfRe6EybPjQdUqFA8URVcmSpump',
  pair: 'EUyunpwVybXKn6oXPqmf67HdoGrX8VSXQZRXkkBuRfBj',
  decimals: 6,
} as const;

export const SOL_MINT = 'So11111111111111111111111111111111111111112';

export const LINKS = {
  x: 'https://x.com/referralcodesol',
  xHandle: '@referralcodesol',
  telegram: 'https://t.me/referralcodecto',
  dexscreener: `https://dexscreener.com/solana/${TOKEN.pair}`,
  geckoterminal: `https://www.geckoterminal.com/solana/pools/${TOKEN.pair}`,
  jupiter: `https://jup.ag/swap/SOL-${TOKEN.mint}`,
  solscanToken: `https://solscan.io/token/${TOKEN.mint}`,
  solscanTx: (sig: string) => `https://solscan.io/tx/${sig}`,
  solscanAccount: (a: string) => `https://solscan.io/account/${a}`,
} as const;

export const API = {
  dexscreener: `https://api.dexscreener.com/latest/dex/tokens/${TOKEN.mint}`,
  geckoPool: `https://api.geckoterminal.com/api/v2/networks/solana/pools/${TOKEN.pair}`,
  // Browser-friendly public RPCs, tried in order (api.mainnet-beta blocks browser origins).
  rpc: ['https://solana-rpc.publicnode.com', 'https://api.mainnet-beta.solana.com'],
  jupiterPlugin: 'https://plugin.jup.ag/plugin-v1.js',
} as const;

export const SITE = {
  url: 'https://referralcode.work',
  title: '$REFERRAL • Referral Code | All you need is one referral code',
  description: 'Referral Code ($REFERRAL) — the community-owned Solana meme coin. Live on-chain stats, buy in one click, and make your own referral card.',
  ogImage: '/preview.jpg',
  themeColor: '#15803d',
} as const;

export const NAV = [
  { href: '/#trust', label: 'Trust' },
  { href: '/#live', label: 'Live' },
  { href: '/#buy', label: 'Buy' },
  { href: '/share', label: 'Share card' },
  { href: '/memes', label: 'Memes' },
  { href: '/#faq', label: 'FAQ' },
] as const;
