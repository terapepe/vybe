import site from '../config/site.json'
import { caOf, xHandle, xUrl } from '../config/chains'
import { MODES } from '../content'
import { ConnectButton, shortAddr } from '../components/Wallet'
import { ChainIcon, Icon, useCopy } from '../components/ui'
import { useBalances } from '../wallet/useBalances'
import { defaultEvm, useWallet } from '../wallet/WalletContext'

const S = `$${site.symbol}`
const fmt = (n?: number) => (n == null ? '—' : Intl.NumberFormat('en', { maximumFractionDigits: n < 1 ? 6 : 4 }).format(n))

function Player() {
  const { session, network, switchTo } = useWallet()
  const bal = useBalances(session, network)
  const { done, copy } = useCopy()
  if (!session) return null

  if (!network) {
    return (
      <div className="card play-card">
        <h3>Unsupported network</h3>
        <p className="muted">Your wallet is on chain ID {session.chainId}. Switch to {defaultEvm.name} to play.</p>
        <button className="btn primary" onClick={() => switchTo(defaultEvm)}>Switch to {defaultEvm.name}</button>
      </div>
    )
  }

  return (
    <div className="card play-card">
      <div className="card-head">
        <h3>Player</h3>
        <span className="live"><i /> Connected</span>
      </div>
      <div className="p-addr">
        <ChainIcon n={network} size={30} />
        <div>
          <code>{shortAddr(session.address)}</code>
          <small className="muted">{session.wallet.name} · {network.name}</small>
        </div>
        <button className="btn sm ghost" onClick={() => copy('addr', session.address)}>
          <Icon name={done === 'addr' ? 'check' : 'copy'} size={14} />
        </button>
        <a className="btn sm ghost" href={network.addrUrl + session.address} target="_blank" rel="noreferrer"><Icon name="ext" size={14} /></a>
      </div>
      <div className="p-stats">
        <div className="kpi"><div><small>{network.native} balance</small><b>{bal.loading && bal.native == null ? '…' : fmt(bal.native)}</b></div></div>
        <div className="kpi"><div><small>{S} balance</small><b>{!bal.tokenSet ? 'CA not set' : bal.loading && bal.token == null ? '…' : fmt(bal.token)}</b></div></div>
      </div>
      {bal.error && <p className="w-err small">RPC: {bal.error}</p>}
      {bal.tokenSet && <p className="muted small">Token: <a href={network.explorer + caOf(network)} target="_blank" rel="noreferrer">{shortAddr(caOf(network))}</a></p>}
    </div>
  )
}

export function Play() {
  const { session } = useWallet()
  return (
    <main className="section wrap play">
      <div className="sec-head">
        <span className="eyebrow">Play</span>
        <h2>Enter the <span className="grad">VibeArena</span></h2>
        <p className="muted">Connect your wallet to join lobbies, stake into pools and track your battles.</p>
      </div>

      {!session ? (
        <div className="card play-card play-gate">
          <img src="/logo.svg" width={64} height={64} alt="" className="float" />
          <h3>Connect a wallet to start</h3>
          <p className="muted">Your wallet is your arena identity — stakes, payouts and Reputation SBTs all live on it.</p>
          <ConnectButton big />
        </div>
      ) : (
        <div className="play-grid">
          <Player />
          <div className="card play-card">
            <div className="card-head"><h3>Live lobbies</h3><span className="tag">0 open</span></div>
            <div className="play-empty">
              <Icon name="bolt" size={26} />
              <p><b>No lobbies yet.</b></p>
              <p className="muted small">The battle escrow contract is not deployed. Lobbies will appear here once staked battles go live — follow <a href={xUrl} target="_blank" rel="noreferrer">@{xHandle}</a> for launch.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid3 play-modes">
        {MODES.map((m) => (
          <div key={m.t} className="card mode">
            <span className="mode-ic"><Icon name={m.icon} size={22} /></span>
            <div><h3>{m.t}</h3><span className="tag">{m.tag}</span></div>
            <p className="muted">{m.d}</p>
            <button className="btn sm ghost" disabled>{session ? 'Coming soon' : 'Connect wallet first'}</button>
          </div>
        ))}
      </div>
    </main>
  )
}
