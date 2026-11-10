import { useEffect } from 'react'
import site from '../config/site.json'
import { activeNetworks, isSingle, names, primary, xHandle, xUrl } from '../config/chains'
import { CRYPTO, FAQ, MODES, RANKS, RUBRIC, STEPS, UTILITY } from '../content'
import { HeroCA } from '../components/Contract'

const S = `$${site.symbol}`

const SECTIONS: { id: string; t: string; group: string; body: () => JSX.Element }[] = [
  { id: 'intro', t: 'Introduction', group: 'Overview', body: () => (<>
    <p><b>{site.brand}</b> is the On-Chain VibeArena: a gamified prompt-coding battleground where “Vibe Coders” compete to build the best bot or dApp in the shortest time — using AI and prompt engineering, not hand-written code.</p>
    <p>Players stake into a pool, receive a brief, build against the clock, and a panel of AI judges scores every submission. The winner takes the pool. Results, scores and reputation live on-chain.</p>
    <div className="callout">New here? Jump to <a href="#/docs/getting-started">Getting started</a> — your first battle can be Free Play with zero stake.</div>
  </>) },
  { id: 'getting-started', t: 'Getting started', group: 'Overview', body: () => (<>
    <ol className="doc-list">
      <li><b>Get a wallet.</b> {isSingle ? `Any ${primary.name}-compatible wallet.` : 'Phantom (or any Solana wallet) for Solana; MetaMask, Rabby, Coinbase Wallet or any EVM wallet for Robinhood, Base and BNB Chain.'}</li>
      <li><b>Pick your network.</b> {isSingle ? `${site.brand} runs on ${primary.name}.` : `Battles run on ${names(activeNetworks)}. Choose the chain you hold funds on.`}</li>
      <li><b>Start in Free Play.</b> No stake. Learn the brief format, the clock and how judging works while earning XP.</li>
      <li><b>Go ranked.</b> Join a staked Blitz or challenge someone to a Duel. Your entry is locked in escrow until the result.</li>
      <li><b>Climb.</b> Wins and scores mint into your Reputation SBT. Grab a Season Pass for ranked ladders and Season Finals.</li>
    </ol>
  </>) },
  { id: 'how-it-works', t: 'How a battle works', group: 'Arena', body: () => (<>
    <div className="doc-steps">{STEPS.map((s) => <div key={s.n}><span className="step-n">{s.n}</span><b>{s.t}</b><p className="muted">{s.d}</p></div>)}</div>
    <h4>Example brief</h4>
    <pre>{`⏱ 15:00
Build a dApp that shows a leaderboard,
integrates a Web3 wallet connect,
and updates prices live from the Pyth Oracle.`}</pre>
    <p>Submit before the clock hits zero. Late or broken builds score zero on performance.</p>
  </>) },
  { id: 'modes', t: 'Battle modes', group: 'Arena', body: () => (
    <table className="doc-table"><thead><tr><th>Mode</th><th>Format</th><th>Description</th></tr></thead>
      <tbody>{MODES.map((m) => <tr key={m.t}><td><b>{m.t}</b></td><td>{m.tag}</td><td>{m.d}</td></tr>)}</tbody></table>
  ) },
  { id: 'judging', t: 'AI judging & rubric', group: 'Arena', body: () => (<>
    <p>Each build is deployed into a sandbox, exercised by automated tests and reviewed by several independent AI judge models. The median score per dimension is used, so one model cannot swing the result.</p>
    <table className="doc-table"><thead><tr><th>Dimension</th><th>Weight</th><th>What is measured</th></tr></thead>
      <tbody>{RUBRIC.map((r) => <tr key={r.k}><td><b>{r.k}</b></td><td>{r.w}%</td><td>{r.d}</td></tr>)}</tbody></table>
    <p><b>Tie-break:</b> earliest valid submission wins. <b>Anti-cheat:</b> briefs revealed at start, prompts hashed on-chain, template/plagiarism diffing.</p>
  </>) },
  { id: 'wagering', t: 'Wager pools', group: 'Crypto', body: () => (<>
    <p>{CRYPTO[0].d}</p>
    <ul className="doc-list">
      <li>Entry is set per lobby; every player pays the same entry.</li>
      <li>The pool is held by the battle escrow contract on the battle's chain.</li>
      <li>On result, the contract pays the winner. If a battle is cancelled (not enough players, judge outage) entries are refunded.</li>
      <li>Any protocol fee is shown in the lobby before you join.</li>
    </ul>
  </>) },
  { id: 'season-pass', t: 'Season Pass NFT', group: 'Crypto', body: () => <p>{CRYPTO[1].d} Minted with {S}. Each season has its own pass, collectible after it ends.</p> },
  { id: 'reputation', t: 'Reputation SBT', group: 'Crypto', body: () => (<>
    <p>{CRYPTO[2].d}</p>
    <table className="doc-table"><thead><tr><th>Rank</th><th>How to earn</th></tr></thead>
      <tbody>{RANKS.map((r) => <tr key={r.t}><td><b>{r.t}</b></td><td>{r.d}</td></tr>)}</tbody></table>
  </>) },
  { id: 'token', t: `${S} token`, group: 'Token', body: () => (<>
    <p><b>{site.tokenName}</b> ({S}) powers the arena.</p>
    <ul className="doc-list">{UTILITY.map((u) => <li key={u.t}><b>{u.t}</b> — {u.d}</li>)}</ul>
    <HeroCA />
  </>) },
  { id: 'networks', t: 'Networks & contract', group: 'Token', body: () => (<>
    {isSingle
      ? <p>{site.brand} currently runs on <b>{primary.name}</b> — {primary.tagline.toLowerCase()}.</p>
      : <p>{site.brand} runs on <b>{names(activeNetworks)}</b>. Robinhood, Base and BNB Chain share <b>one EVM contract address</b>; Solana has its own SPL mint.</p>}
    <table className="doc-table"><thead><tr><th>Network</th><th>Why play here</th></tr></thead>
      <tbody>{activeNetworks.map((n) => <tr key={n.key}><td><img src={n.icon} width={18} height={18} alt="" className="chain-ic" /> <b>{n.name}</b></td><td>{n.perks.join(' · ')}</td></tr>)}</tbody></table>
  </>) },
  { id: 'safety', t: 'Safety', group: 'Help', body: () => (<>
    <ul className="doc-list">
      <li>Only trust the contract address shown on this site and on <a href={xUrl} target="_blank" rel="noreferrer">@{xHandle}</a>.</li>
      <li>The team will never DM you first or ask for your seed phrase.</li>
      <li>Never paste private keys into a brief or prompt — the security judge will flag it and you leak it.</li>
      <li>Wagering carries risk. Only stake what you can afford to lose and follow the laws where you live.</li>
    </ul>
  </>) },
  { id: 'faq', t: 'FAQ', group: 'Help', body: () => <>{FAQ.map((f) => <div key={f.q} className="doc-qa"><b>{f.q}</b><p className="muted">{f.a}</p></div>)}</> },
]

export function Docs({ section }: { section: string }) {
  useEffect(() => {
    const el = section && document.getElementById(`d-${section}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0 })
  }, [section])
  const groups = [...new Set(SECTIONS.map((s) => s.group))]
  return (
    <main className="wrap docs">
      <aside className="docs-nav">
        {groups.map((g) => (
          <div key={g}>
            <span className="eyebrow">{g}</span>
            {SECTIONS.filter((s) => s.group === g).map((s) => (
              <a key={s.id} href={`#/docs/${s.id}`} className={section === s.id ? 'on' : ''}>{s.t}</a>
            ))}
          </div>
        ))}
      </aside>
      <article className="docs-body">
        <span className="eyebrow">Docs</span>
        <h1>{site.brand} Documentation</h1>
        {SECTIONS.map((s) => (
          <section key={s.id} id={`d-${s.id}`} className="doc-sec">
            <h2>{s.t}</h2>
            {s.body()}
          </section>
        ))}
      </article>
    </main>
  )
}
