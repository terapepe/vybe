import { useEffect, useState } from 'react'
import { caOf, Network } from '../config/chains'
import { Session } from './WalletContext'

export type Balances = { native?: number; token?: number; tokenSet: boolean; loading: boolean; error?: string }

// viem is loaded only after a wallet connects
const clients = new Map<string, any>()

async function evmBalances(n: Network, addr: string) {
  const { createPublicClient, erc20Abi, formatUnits, http, isAddress } = await import('viem')
  if (!clients.has(n.key)) clients.set(n.key, createPublicClient({ transport: http(n.rpc) }))
  const c = clients.get(n.key), ca = caOf(n), owner = addr as `0x${string}`
  const native = Number(formatUnits(await c.getBalance({ address: owner }), 18))
  if (!isAddress(ca)) return { native }
  const [raw, dec]: [bigint, number] = await Promise.all([
    c.readContract({ address: ca, abi: erc20Abi, functionName: 'balanceOf', args: [owner] }),
    c.readContract({ address: ca, abi: erc20Abi, functionName: 'decimals' }),
  ])
  return { native, token: Number(formatUnits(raw, dec)) }
}

const solRpc = async (url: string, method: string, params: unknown[]) => {
  const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }) })
  const j = await r.json()
  if (j.error) throw new Error(j.error.message)
  return j.result
}

async function solBalances(n: Network, addr: string) {
  const ca = caOf(n)
  const native = (await solRpc(n.rpc, 'getBalance', [addr, { commitment: 'confirmed' }])).value / 1e9
  if (!ca) return { native }
  const res = await solRpc(n.rpc, 'getTokenAccountsByOwner', [addr, { mint: ca }, { encoding: 'jsonParsed', commitment: 'confirmed' }])
  const token = res.value.reduce((s: number, a: any) => s + Number(a.account.data.parsed.info.tokenAmount.uiAmountString || 0), 0)
  return { native, token }
}

export function useBalances(session: Session | null, net: Network | null): Balances {
  const tokenSet = !!net && !!caOf(net)
  const [b, setB] = useState<Balances>({ tokenSet, loading: false })
  useEffect(() => {
    if (!session || !net) { setB({ tokenSet, loading: false }); return }
    let alive = true
    const load = () => {
      setB((p) => ({ ...p, tokenSet, loading: true }))
      ;(net.vm === 'evm' ? evmBalances(net, session.address) : solBalances(net, session.address))
        .then((r) => alive && setB({ ...r, tokenSet, loading: false }))
        .catch((e) => alive && setB({ tokenSet, loading: false, error: e?.shortMessage || e?.message || 'RPC error' }))
    }
    load()
    const t = setInterval(load, 30_000)
    return () => { alive = false; clearInterval(t) }
  }, [session?.address, net?.key, tokenSet])
  return b
}
