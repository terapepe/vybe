// Wallet discovery without extra libraries:
//  - EVM: EIP-6963 (every modern injected wallet announces itself) + window.ethereum fallback
//  - Solana: injected providers (Phantom, Solflare, Backpack)

export type Eip1193 = {
  request: (a: { method: string; params?: unknown[] | object }) => Promise<any>
  on?: (e: string, f: (...a: any[]) => void) => void
  removeListener?: (e: string, f: (...a: any[]) => void) => void
}
export type SolProvider = {
  publicKey?: { toString(): string } | null
  connect: (o?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString(): string } } | void>
  disconnect: () => Promise<void>
  on?: (e: string, f: (...a: any[]) => void) => void
  off?: (e: string, f: (...a: any[]) => void) => void
  removeListener?: (e: string, f: (...a: any[]) => void) => void
}

export type WalletOption =
  | { vm: 'evm'; id: string; name: string; icon: string; provider: Eip1193 }
  | { vm: 'svm'; id: string; name: string; icon: string; provider: SolProvider }

const w = window as any

// ---------- EVM (EIP-6963) ----------
const evm = new Map<string, WalletOption>()
const subs = new Set<() => void>()
const emit = () => subs.forEach((f) => f())

window.addEventListener('eip6963:announceProvider', (e: any) => {
  const { info, provider } = e.detail || {}
  if (!info?.rdns || !provider) return
  evm.set(info.rdns, { vm: 'evm', id: info.rdns, name: info.name, icon: info.icon, provider })
  emit()
})
window.dispatchEvent(new Event('eip6963:requestProvider'))

export function evmWallets(): WalletOption[] {
  const list = [...evm.values()]
  // legacy wallets that don't support EIP-6963
  if (!list.length && w.ethereum) list.push({ vm: 'evm', id: 'injected', name: w.ethereum.isMetaMask ? 'MetaMask' : 'Browser wallet', icon: '', provider: w.ethereum })
  return list
}

// ---------- Solana (injected) ----------
export function solWallets(): WalletOption[] {
  const out: WalletOption[] = []
  const add = (id: string, name: string, p: any) => p?.connect && out.push({ vm: 'svm', id, name, icon: '', provider: p })
  add('phantom', 'Phantom', w.phantom?.solana?.isPhantom ? w.phantom.solana : null)
  add('solflare', 'Solflare', w.solflare?.isSolflare ? w.solflare : null)
  add('backpack', 'Backpack', w.backpack?.solana ?? null)
  return out
}

export const onWalletsChange = (f: () => void) => { subs.add(f); return () => { subs.delete(f) } }

export const INSTALL = {
  evm: { name: 'MetaMask', url: 'https://metamask.io/download/' },
  svm: { name: 'Phantom', url: 'https://phantom.com/download' },
}
