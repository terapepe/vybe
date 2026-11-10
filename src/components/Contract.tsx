import site from '../config/site.json'
import { caGroups, inkOn, isSingle, primary, xHandle, xUrl } from '../config/chains'
import { useMarkets } from '../hooks/useMarkets'
import { ChainIcon, Icon, useCopy } from './ui'

const short = (a: string) => (a.length > 16 ? `${a.slice(0, 6)}…${a.slice(-6)}` : a)
const usd = (n?: number) =>
  n == null || Number.isNaN(n) ? '—'
    : n < 1 ? `$${n.toPrecision(4)}`
    : `$${Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 2 }).format(n)}`

// Prominent CA block in the hero — one row per CA group (EVM shared: RH / BASE / BSC, + SOL)
export function HeroCA() {
  const { done, copy } = useCopy()
  return (
    <div className="hero-ca">
      <div className="hero-ca-head">
        <span className="eyebrow">${site.symbol} contract address</span>
        <span className="muted small">Verify on <a href={xUrl} target="_blank" rel="noreferrer">@{xHandle}</a></span>
      </div>
      {caGroups.map((g) => {
        const c = g.nets.length === 1 ? g.nets[0].color : undefined
        return (
          <div key={g.id} className="ca-row" style={c ? { ['--net' as string]: c } : undefined}>
            <span className="ca-chains">
              {g.nets.map((n) => <ChainIcon key={n.key} n={n} size={26} />)}
            </span>
            <div className="ca-text">
              <span className="ca-tag">{g.tag}</span>
              <code className={g.ca ? '' : 'pending'}>{g.ca || 'Contract address coming soon'}</code>
            </div>
            <button
              className="btn copy-btn"
              disabled={!g.ca}
              style={c && g.ca ? { background: c, color: inkOn(c) } : undefined}
              onClick={() => copy(g.id, g.ca)}
            >
              <Icon name={done === g.id ? 'check' : 'copy'} size={16} />
              {done === g.id ? 'Copied' : 'Copy CA'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// Network section: single = one themed card for that chain · multi = one card per CA group
export function NetworkSection() {
  const { done, copy } = useCopy()
  return (
    <div className={`net-grid ${caGroups.length === 1 ? 'one' : ''}`}>
      {caGroups.map((g) => {
        const lead = g.nets[0]
        return (
          <article key={g.id} className="card net-card" style={{ ['--net' as string]: g.nets.length === 1 ? lead.color : 'var(--accent)' }}>
            <div className="net-card-top">
              <span className="ca-chains">{g.nets.map((n) => <ChainIcon key={n.key} n={n} size={34} />)}</span>
              <div>
                <h3>{g.nets.length > 1 ? `One EVM address · ${g.nets.length} chains` : lead.name}</h3>
                <p className="muted small">{g.nets.length > 1 ? g.nets.map((n) => n.name).join(' · ') : lead.tagline}</p>
              </div>
            </div>
            <ul className="perks">
              {(g.nets.length > 1 ? g.nets.map((n) => `${n.name}: ${n.tagline}`) : lead.perks).map((p) => (
                <li key={p}><Icon name="check" size={14} /> {p}</li>
              ))}
            </ul>
            <button className="ca-line" disabled={!g.ca} onClick={() => copy(g.id, g.ca)} title="Copy contract address">
              <code>{g.ca ? short(g.ca) : 'CA coming soon'}</code>
              {g.ca && <span><Icon name={done === g.id ? 'check' : 'copy'} size={14} /> {done === g.id ? 'Copied' : 'Copy'}</span>}
            </button>
            {g.ca && (
              <div className="row-links">
                {g.nets.map((n) => (
                  <a key={n.key} href={n.explorer + g.ca} target="_blank" rel="noreferrer">{n.short} explorer <Icon name="ext" size={12} /></a>
                ))}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

// Live market data from DexScreener (empty until a CA is set)
export function Markets() {
  const data = useMarkets()
  const anyCa = data.some((m) => m.address)
  return (
    <div className="card markets">
      <div className="card-head">
        <h3>${site.symbol} markets</h3>
        <span className="live"><i /> {anyCa ? 'Live · DexScreener' : 'Waiting for CA'}</span>
      </div>
      <div className="mrow mhead"><span>Network</span><span>Price</span><span>24h</span><span>Liquidity</span><span>Volume 24h</span><span /></div>
      {data.map((m) => (
        <div className="mrow" key={m.network.key}>
          <span className="mnet"><ChainIcon n={m.network} size={20} /> {m.network.name}</span>
          <span>{usd(m.priceUsd)}</span>
          <span className={m.change24h == null ? '' : m.change24h >= 0 ? 'up' : 'down'}>
            {m.change24h == null ? '—' : `${m.change24h > 0 ? '+' : ''}${m.change24h.toFixed(1)}%`}
          </span>
          <span>{usd(m.liquidityUsd)}</span>
          <span>{usd(m.volume24h)}</span>
          <span>{m.pairUrl ? <a href={m.pairUrl} target="_blank" rel="noreferrer">Chart <Icon name="ext" size={12} /></a> : <span className="muted">{m.address ? 'No pair yet' : 'CA soon'}</span>}</span>
        </div>
      ))}
      {!anyCa && <p className="muted small pad">Live price, liquidity and volume appear here automatically once the contract address is published{isSingle ? ` on ${primary.name}` : ''}.</p>}
    </div>
  )
}
