import { useEffect, useState } from 'react'
import site from '../config/site.json'
import { activeNetworks, isSingle, names, primary, xHandle, xUrl } from '../config/chains'
import { CRYPTO, FAQ, MODES, RANKS, ROADMAP, RUBRIC, STEPS, UTILITY } from '../content'
import { ArenaMap } from '../components/ArenaMap'
import { HeroCA, Markets, NetworkSection } from '../components/Contract'
import { ChainIcon, ChainStack, Icon, XIcon } from '../components/ui'

const S = `$${site.symbol}`

function Clock() {
  const [s, setS] = useState(15 * 60)
  useEffect(() => { const t = setInterval(() => setS((v) => (v <= 0 ? 15 * 60 : v - 1)), 1000); return () => clearInterval(t) }, [])
  return <span className="clock">{String(Math.floor(s / 60)).padStart(2, '0')}:{String(s % 60).padStart(2, '0')}</span>
}

function Console() {
  return (
    <div className="console card">
      <div className="console-bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="muted small">VibeArena · Battle Command Center</span>
        <span className="live"><i /> Preview</span>
      </div>
      <div className="kpis">
        <div className="kpi"><span className="kpi-ic"><Icon name="bolt" /></span><div><small>Blitz clock</small><b>15:00</b></div></div>
        <div className="kpi"><span className="kpi-ic"><Icon name="shield" /></span><div><small>AI scoring</small><b>{RUBRIC.length}</b></div></div>
        <div className="kpi"><span className="kpi-ic"><Icon name="cup" /></span><div><small>Pool payout</small><b>Winner</b></div></div>
        <div className="kpi"><span className="kpi-ic">{isSingle ? <ChainIcon n={primary} size={20} /> : <Icon name="layers" />}</span><div><small>{isSingle ? 'Network' : 'Networks'}</small><b>{isSingle ? primary.short : activeNetworks.length}</b></div></div>
      </div>
      <div className="console-body">
        <div className="panel map-panel">
          <div className="card-head"><h4>Battle routing map</h4><span className="muted small">Rubric weights</span></div>
          <ArenaMap />
        </div>
        <div className="panel brief">
          <div className="card-head"><h4>Sample brief</h4><Clock /></div>
          <p>“Ship a dApp leaderboard with a Web3 wallet connect and live <b>Pyth Oracle</b> prices.”</p>
          <ul className="checks">
            <li><Icon name="check" size={14} /> Wallet connect</li>
            <li><Icon name="check" size={14} /> Oracle feed, auto-refresh</li>
            <li><Icon name="check" size={14} /> Sorted leaderboard UI</li>
            <li><Icon name="check" size={14} /> No exposed keys</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Section({ id, eyebrow, title, sub, children }: { id: string; eyebrow: string; title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="section wrap">
      <div className="sec-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {sub && <p className="muted">{sub}</p>}
      </div>
      {children}
    </section>
  )
}

export function Home() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <main>
      <section className="hero wrap">
        <div className="hero-copy">
          <span className="chip">
            {isSingle ? <><ChainIcon n={primary} size={18} /> Live on {primary.name} · {primary.tagline}</> : <><ChainStack size={18} /> Multi-chain · {names(activeNetworks)}</>}
          </span>
          <h1>The On-Chain <span className="grad">VibeArena</span></h1>
          <p className="lead">
            Prompt-coding battles with real stakes. Lock into the pool, get a brief, build a dApp with AI in 15 minutes —
            AI judges score it, and the <b>winner takes the whole pool</b>.
          </p>
          <div className="cta">
            <a className="btn primary" href="#/docs/getting-started">Enter the Arena <Icon name="arrow" size={16} /></a>
            <a className="btn ghost" href="#/docs"><Icon name="book" size={16} /> Read the Docs</a>
          </div>
          <HeroCA />
        </div>
        <Console />
      </section>

      <Section id="how" eyebrow="How it works" title="Stake. Prompt. Ship. Win." sub="Five steps from lobby to payout — every one of them verifiable on-chain.">
        <div className="steps">
          {STEPS.map((s) => (
            <div key={s.n} className="card step"><span className="step-n">{s.n}</span><h3>{s.t}</h3><p className="muted">{s.d}</p></div>
          ))}
        </div>
      </Section>

      <Section id="modes" eyebrow="Battle modes" title="A battle for every vibe" sub="From zero-stake practice to the Season Finals. Pick your arena.">
        <div className="grid3">
          {MODES.map((m) => (
            <div key={m.t} className="card mode">
              <span className="mode-ic"><Icon name={m.icon} size={22} /></span>
              <div><h3>{m.t}</h3><span className="tag">{m.tag}</span></div>
              <p className="muted">{m.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="judge" eyebrow="AI judging" title="Scored by machines, verified on-chain" sub="A panel of independent AI judges runs, tests and audits every build against one public rubric.">
        <div className="judge">
          <div className="card rubric">
            {RUBRIC.map((r) => (
              <div key={r.k} className="rub">
                <div className="rub-top"><b>{r.k}</b><span>{r.w}%</span></div>
                <div className="bar"><i style={{ width: `${r.w * 3}%` }} /></div>
                <p className="muted small">{r.d}</p>
              </div>
            ))}
          </div>
          <div className="card judge-side">
            <h3>Fair by design</h3>
            <ul className="perks">
              <li><Icon name="check" size={14} /> Brief revealed only when the clock starts</li>
              <li><Icon name="check" size={14} /> Every prompt & build hashed on-chain</li>
              <li><Icon name="check" size={14} /> Multiple judge models, median score wins</li>
              <li><Icon name="check" size={14} /> Template & plagiarism diffing</li>
              <li><Icon name="check" size={14} /> Full scorecards published after each battle</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section id="onchain" eyebrow="Crypto layer" title="Wagers, seasons and reputation" sub="Built so skill — not hype — is what gets rewarded.">
        <div className="grid4">
          {CRYPTO.map((c, i) => (
            <div key={c.t} className="card crypto"><span className="num">0{i + 1}</span><h3>{c.t}</h3><p className="muted">{c.d}</p></div>
          ))}
        </div>
        <div className="ranks card">
          <h3>Reputation ladder <span className="muted small">· soulbound</span></h3>
          <div className="ladder">
            {RANKS.map((r, i) => (
              <div key={r.t} className="rank" style={{ ['--i' as string]: i }}>
                <span className="rank-gem" /><b>{r.t}</b><small className="muted">{r.d}</small>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section
        id="networks"
        eyebrow={isSingle ? 'Network' : 'Networks'}
        title={isSingle ? `Built on ${primary.name}` : 'Play on any of four chains'}
        sub={isSingle ? primary.tagline : 'Robinhood, Base and BNB Chain share one EVM contract address. Solana runs natively.'}
      >
        <NetworkSection />
      </Section>

      <Section id="token" eyebrow="Token" title={`${site.tokenName} · ${S}`} sub="The fuel of the arena.">
        <div className="token">
          <div className="grid-util">
            {UTILITY.map((u) => <div key={u.t} className="card util"><h3>{u.t}</h3><p className="muted small">{u.d}</p></div>)}
          </div>
          <Markets />
        </div>
      </Section>

      <Section id="roadmap" eyebrow="Roadmap" title="From ignition to open arena">
        <div className="roadmap">
          {ROADMAP.map((r) => (
            <div key={r.p} className="card phase">
              <span className="tag">{r.p}</span><h3>{r.t}</h3>
              <ul>{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </Section>

      <Section id="faq" eyebrow="FAQ" title="Questions, answered">
        <div className="faq">
          {FAQ.map((f, i) => (
            <div key={f.q} className={`card qa ${open === i ? 'open' : ''}`}>
              <button onClick={() => setOpen(open === i ? null : i)}>{f.q}<span>{open === i ? '−' : '+'}</span></button>
              {open === i && <p className="muted">{f.a}</p>}
            </div>
          ))}
        </div>
      </Section>

      <section className="wrap">
        <div className="cta-band card">
          <img src="/logo.svg" width={72} height={72} alt="" className="float" />
          <div>
            <h2>Ready to vibe for the pot?</h2>
            <p className="muted">Follow <a href={xUrl} target="_blank" rel="noreferrer">@{xHandle}</a> for the first Free Play briefs and arena launch.</p>
          </div>
          <div className="cta">
            <a className="btn primary" href={xUrl} target="_blank" rel="noreferrer"><XIcon size={14} /> Follow @{xHandle}</a>
            <a className="btn ghost" href="#/docs">Docs</a>
          </div>
        </div>
      </section>
    </main>
  )
}
