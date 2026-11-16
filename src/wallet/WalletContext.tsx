import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { activeNetworks, Network, primary } from '../config/chains'
import { evmWallets, Eip1193, onWalletsChange, solWallets, SolProvider, WalletOption } from './providers'

export type Session = { vm: 'evm' | 'svm'; address: string; wallet: { id: string; name: string; icon: string }; chainId: number }

type Ctx = {
  session: Session | null
  network: Network | null // active network the wallet is on (null = unsupported chain)
  wallets: WalletOption[]
  connecting: string
  error: string
  modal: boolean
  openModal: () => void
  closeModal: () => void
  connect: (w: WalletOption, net: Network) => Promise<void>
  switchTo: (net: Network) => Promise<void>
  disconnect: () => void
}

const WalletCtx = createContext<Ctx | null>(null)
export const useWallet = () => useContext(WalletCtx)!

const KEY = 'vybe.wallet'
const hasEvm = activeNetworks.some((n) => n.vm === 'evm')
const hasSol = activeNetworks.some((n) => n.vm === 'svm')
const listWallets = () => [...(hasEvm ? evmWallets() : []), ...(hasSol ? solWallets() : [])]

const save = (v: { vm: string; id: string } | null) => { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY) } catch { /* storage blocked */ } }
const load = (): { vm: string; id: string } | null => { try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null } }

const hex = (n: number) => `0x${n.toString(16)}`

async function evmSwitch(p: Eip1193, net: Network) {
  try {
    await p.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: hex(net.chainId) }] })
  } catch (e: any) {
    if (e?.code !== 4902 && e?.data?.originalError?.code !== 4902) throw e
    await p.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: hex(net.chainId), chainName: net.name,
        nativeCurrency: { name: net.native, symbol: net.native, decimals: 18 },
        rpcUrls: [net.rpc], blockExplorerUrls: [net.addrUrl.replace(/address\/$/, '')],
      }],
    })
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [wallets, setWallets] = useState<WalletOption[]>(listWallets)
  const [connecting, setConnecting] = useState('')
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const active = useRef<WalletOption | null>(null)
  const unbind = useRef<() => void>(() => {})

  useEffect(() => onWalletsChange(() => setWallets(listWallets())), [])
  // Solana wallets inject after page load in some browsers
  useEffect(() => { const t = setTimeout(() => setWallets(listWallets()), 600); return () => clearTimeout(t) }, [])

  const reset = useCallback(() => { unbind.current(); unbind.current = () => {}; active.current = null; setSession(null); save(null) }, [])

  const bind = useCallback((w: WalletOption, address: string, chainId: number) => {
    unbind.current()
    active.current = w
    const info = { id: w.id, name: w.name, icon: w.icon }
    setSession({ vm: w.vm, address, wallet: info, chainId })
    save({ vm: w.vm, id: w.id })
    if (w.vm === 'evm') {
      const onAcc = (a: string[]) => (a[0] ? setSession((s) => s && { ...s, address: a[0] }) : reset())
      const onChain = (c: string) => setSession((s) => s && { ...s, chainId: parseInt(c, 16) })
      w.provider.on?.('accountsChanged', onAcc)
      w.provider.on?.('chainChanged', onChain)
      unbind.current = () => { w.provider.removeListener?.('accountsChanged', onAcc); w.provider.removeListener?.('chainChanged', onChain) }
    } else {
      const p = w.provider as SolProvider
      const onAcc = (pk: any) => (pk ? setSession((s) => s && { ...s, address: pk.toString() }) : reset())
      const onDis = () => reset()
      p.on?.('accountChanged', onAcc); p.on?.('disconnect', onDis)
      unbind.current = () => { (p.off || p.removeListener)?.call(p, 'accountChanged', onAcc); (p.off || p.removeListener)?.call(p, 'disconnect', onDis) }
    }
  }, [reset])

  const connect = useCallback(async (w: WalletOption, net: Network) => {
    setError(''); setConnecting(w.id)
    try {
      if (w.vm === 'evm') {
        const [addr] = await w.provider.request({ method: 'eth_requestAccounts' })
        if (!addr) throw new Error('No account returned')
        let chainId = parseInt(await w.provider.request({ method: 'eth_chainId' }), 16)
        if (chainId !== net.chainId) { await evmSwitch(w.provider, net); chainId = net.chainId }
        bind(w, addr, chainId)
      } else {
        const r = await w.provider.connect()
        const pk = (r && r.publicKey) || w.provider.publicKey
        if (!pk) throw new Error('No account returned')
        bind(w, pk.toString(), 0)
      }
      setModal(false)
    } catch (e: any) {
      setError(e?.code === 4001 ? 'Request rejected in wallet' : e?.message || 'Connection failed')
    } finally { setConnecting('') }
  }, [bind])

  const switchTo = useCallback(async (net: Network) => {
    const w = active.current
    if (!w) return
    setError('')
    if (w.vm === 'evm' && net.vm === 'evm') {
      try { await evmSwitch(w.provider, net) } catch (e: any) { setError(e?.code === 4001 ? 'Network switch rejected' : e?.message || 'Switch failed') }
    } else {
      // different VM → needs a different wallet
      setModal(true)
    }
  }, [])

  const disconnect = useCallback(() => {
    const w = active.current
    if (w?.vm === 'svm') w.provider.disconnect().catch(() => {})
    if (w?.vm === 'evm') w.provider.request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] }).catch(() => {})
    reset()
  }, [reset])

  // silent reconnect to the last wallet (no popup)
  useEffect(() => {
    const last = load()
    if (!last) return
    let done = false
    const tryIt = async () => {
      const w = listWallets().find((x) => x.vm === last.vm && x.id === last.id)
      if (!w || done) return
      done = true
      try {
        if (w.vm === 'evm') {
          const [addr] = await w.provider.request({ method: 'eth_accounts' })
          if (addr) bind(w, addr, parseInt(await w.provider.request({ method: 'eth_chainId' }), 16))
          else save(null)
        } else {
          const r = await w.provider.connect({ onlyIfTrusted: true })
          const pk = (r && r.publicKey) || w.provider.publicKey
          if (pk) bind(w, pk.toString(), 0)
        }
      } catch { save(null) }
    }
    tryIt()
    const off = onWalletsChange(tryIt)
    const t = setTimeout(tryIt, 700)
    return () => { off(); clearTimeout(t) }
  }, [bind])

  const network = !session ? null
    : session.vm === 'svm' ? activeNetworks.find((n) => n.vm === 'svm') || null
    : activeNetworks.find((n) => n.vm === 'evm' && n.chainId === session.chainId) || null

  return (
    <WalletCtx.Provider value={{
      session, network, wallets, connecting, error, modal,
      openModal: () => { setError(''); setModal(true) }, closeModal: () => setModal(false),
      connect, switchTo, disconnect,
    }}>
      {children}
    </WalletCtx.Provider>
  )
}

// default EVM network to switch to when the wallet is on an unsupported chain
export const defaultEvm = activeNetworks.find((n) => n.vm === 'evm') || primary
