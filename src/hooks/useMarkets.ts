import { useEffect, useState } from 'react'
import { activeNetworks, caOf, Network } from '../config/chains'

export type Market = { network: Network; address: string; priceUsd?: number; change24h?: number; liquidityUsd?: number; volume24h?: number; fdv?: number; pairUrl?: string }

// Live data from DexScreener — only fetched for networks that have a CA
async function fetchMarket(n: Network): Promise<Market> {
  const address = caOf(n)
  const m: Market = { network: n, address }
  if (!address) return m
  const r = await fetch(`https://api.dexscreener.com/tokens/v1/${n.dex}/${address}`)
  if (!r.ok) return m
  const pairs: any[] = await r.json()
  if (!Array.isArray(pairs) || !pairs.length) return m
  const p = [...pairs].sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0]
  return {
    ...m,
    priceUsd: Number(p.priceUsd),
    change24h: p.priceChange?.h24,
    liquidityUsd: pairs.reduce((s, x) => s + (x.liquidity?.usd ?? 0), 0),
    volume24h: pairs.reduce((s, x) => s + (x.volume?.h24 ?? 0), 0),
    fdv: p.fdv,
    pairUrl: p.url,
  }
}

export function useMarkets() {
  const [data, setData] = useState<Market[]>(() => activeNetworks.map((n) => ({ network: n, address: caOf(n) })))
  useEffect(() => {
    if (!activeNetworks.some(caOf)) return
    let alive = true
    const load = () => Promise.all(activeNetworks.map((n) => fetchMarket(n).catch(() => ({ network: n, address: caOf(n) }))))
      .then((d) => alive && setData(d))
    load()
    const t = setInterval(load, 60_000)
    return () => { alive = false; clearInterval(t) }
  }, [])
  return data
}
