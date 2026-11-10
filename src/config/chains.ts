import site from './site.json'

type Overrides = { name?: string; short?: string; color?: string; color2?: string; tagline?: string; ca?: string; perks?: string[] }
const OV = (site as { chains?: Record<string, Overrides> }).chains || {}

// Fixed per-network data. Display fields (name/short/color/tagline/perks/ca) are overridden from site.json → chains
const BASE = [
  { key: 'solana', icon: '/chains/solana.svg', vm: 'svm', dex: 'solana', explorer: 'https://solscan.io/token/' },
  { key: 'robinhood', icon: '/chains/robinhood.svg', vm: 'evm', dex: 'robinhood', explorer: 'https://robinhoodchain.blockscout.com/token/' },
  { key: 'base', icon: '/chains/base.svg', vm: 'evm', dex: 'base', explorer: 'https://basescan.org/token/' },
  { key: 'bsc', icon: '/chains/bnb.svg', vm: 'evm', dex: 'bsc', explorer: 'https://bscscan.com/token/' },
] as const

export type Network = (typeof BASE)[number] & { name: string; short: string; color: string; color2: string; tagline: string; ca: string; perks: string[] }

const clean = (o: Overrides = {}) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null))
export const networks: Network[] = BASE.map((n) => ({ name: n.key, short: n.key.toUpperCase(), color: '#8B5CF6', color2: '#3B82F6', tagline: '', ca: '', perks: [], ...n, ...clean(OV[n.key]) }))

const byKey = (k: string) => networks.find((n) => n.key === k)

// mode "single" → only singleNetwork · mode "multi" → always all 4 (Solana, Robinhood, Base, BSC), ordered by multiOrder
export const isSingle = site.mode !== 'multi'
export const activeNetworks: Network[] = isSingle
  ? [byKey(site.singleNetwork) || networks[0]]
  : [...new Set([...(site.multiOrder || []), ...networks.map((n) => n.key)])].map(byKey).filter((n): n is Network => !!n)
export const primary = activeNetworks[0]

// CA: chains.<key>.ca → else evmAddress (shared by Robinhood/Base/BSC) / solanaAddress
export const caOf = (n: Network) => (n.ca || (n.vm === 'svm' ? site.solanaAddress : site.evmAddress) || '').trim()

// Networks with the same CA are grouped into one card / one Copy button
export type CaGroup = { id: string; ca: string; nets: Network[]; tag: string }
export const caGroups: CaGroup[] = activeNetworks.reduce<CaGroup[]>((acc, n) => {
  const ca = caOf(n), id = ca ? ca.toLowerCase() : n.vm === 'evm' && !isSingle ? 'evm' : n.key
  const g = acc.find((x) => x.id === id)
  if (g) { g.nets.push(n); g.tag = g.nets.map((x) => x.short).join(' / ') } else acc.push({ id, ca, nets: [n], tag: n.short })
  return acc
}, [])

export const names = (list: Network[], sep = 'and') => list.map((n) => n.name).join(', ').replace(/, ([^,]*)$/, ` ${sep} $1`)
export const xHandle = site.x.replace(/^@/, '').split('/').pop() || ''
export const xUrl = `https://x.com/${xHandle}`

// readable text color on a chain color
export const inkOn = (hex: string) => {
  const v = parseInt(hex.slice(1), 16)
  return (0.299 * (v >> 16) + 0.587 * ((v >> 8) & 255) + 0.114 * (v & 255)) / 255 > 0.6 ? '#0a0918' : '#ffffff'
}

// theme accent: single → the network colors · multi → brand violet/blue
export const accent = isSingle ? primary.color : '#8B5CF6'
export const accent2 = isSingle ? primary.color2 : '#3B82F6'
