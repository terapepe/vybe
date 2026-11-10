import { useState } from 'react'
import site from '../config/site.json'
import { activeNetworks, isSingle, Network, primary, xHandle, xUrl } from '../config/chains'

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <a href="#/" className="logo" aria-label={site.brand}>
      <img src="/logo.svg" width={size} height={size} alt="" />
      <span>VYBE<em>.FUN</em></span>
    </a>
  )
}

const PATHS: Record<string, string> = {
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  duel: 'M14.5 17.5 3 6V3h3l11.5 11.5M13 19l6-6M16 16l4 4M19 21l2-2M9.5 17.5 21 6V3h-3L6.5 14.5M11 19l-6-6M8 16l-4 4M5 21l-2-2',
  squad: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  free: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM10 8l6 4-6 4V8z',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  cup: 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3',
  copy: 'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
  check: 'M20 6 9 17l-5-5',
  ext: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  arrow: 'M5 12h14M12 5l7 7-7 7',
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
}
export function Icon({ name, size = 18 }: { name: keyof typeof PATHS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  )
}

export function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export const ChainIcon = ({ n, size = 22 }: { n: Network; size?: number }) => (
  <img className="chain-ic" src={n.icon} width={size} height={size} alt={n.name} title={n.name} />
)

export function ChainStack({ size = 22 }: { size?: number }) {
  return <span className="chain-stack">{activeNetworks.map((n) => <ChainIcon key={n.key} n={n} size={size} />)}</span>
}

export function useCopy() {
  const [done, setDone] = useState('')
  const copy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => {})
    setDone(id); setTimeout(() => setDone(''), 1400)
  }
  return { done, copy }
}

export function Nav({ page }: { page: 'home' | 'docs' }) {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <Logo />
        <nav className="nav-links">
          <a href="#/" className={page === 'home' ? 'on' : ''}>Arena</a>
          <a href="#/docs" className={page === 'docs' ? 'on' : ''}>Docs</a>
          <a href="#/docs/token">Token</a>
        </nav>
        <div className="nav-right">
          <span className="net-pill" title={isSingle ? primary.tagline : 'Multi-chain'}>
            <ChainStack size={18} />
            <span>{isSingle ? primary.name : `${activeNetworks.length} chains`}</span>
          </span>
          <a className="btn sm ghost" href={xUrl} target="_blank" rel="noreferrer"><XIcon size={14} /> @{xHandle}</a>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div>
          <Logo size={28} />
          <p className="muted small">The On-Chain VibeArena. Prompt it. Ship it. Win the pool.</p>
        </div>
        <div className="foot-links">
          <a href="#/docs">Docs</a>
          <a href="#/docs/how-it-works">How it works</a>
          <a href="#/docs/safety">Safety</a>
          <a href={xUrl} target="_blank" rel="noreferrer">X / Twitter</a>
        </div>
        <p className="muted small foot-note">
          ${site.symbol} is a community token with no promise of profit. Battles involve risk — only stake what you can afford to lose and check local laws before wagering.
        </p>
      </div>
    </footer>
  )
}
