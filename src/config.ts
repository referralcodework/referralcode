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
  x: 'https://x.com/pumpreferrals',
  xHandle: '@pumpreferrals',
  xCommunity: 'https://x.com/i/communities/2015843647540068814',
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
  { href: '/cult', label: 'Cult' },
  { href: '/share', label: 'Share card' },
  { href: '/pfp', label: 'PFP' },
  { href: '/memes', label: 'Memes' },
  { href: '/#faq', label: 'FAQ' },
] as const;

// Cult ranks: earned in public, shown on PFP frames.
export const RANKS = [
  { name: 'Referrer', how: 'Hold the code and post your referral card with #UseMyCode. Welcome in.' },
  { name: 'Recruiter', how: 'Bring others in. Your card link is out there and people are joining because of it.' },
  { name: 'Codeholder', how: 'Show up every day: the morning "use my code", the raids, the Code Calls. Conviction, not wallet size.' },
  { name: 'Code Master', how: 'Make the memes everyone reposts, win contests, get the shoutout from @pumpreferrals.' },
] as const;
