import { useEffect, useRef, useState } from 'react'
import { activeNetworks, isSingle, Network, primary } from '../config/chains'
import { defaultEvm, useWallet } from '../wallet/WalletContext'
import { INSTALL } from '../wallet/providers'
import { ChainIcon, Icon } from './ui'

export const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

function WalletIcon({ icon, name, size = 26 }: { icon: string; name: string; size?: number }) {
  return icon
    ? <img src={icon} width={size} height={size} alt="" className="w-ic" />
    : <span className="w-ic w-ic-txt" style={{ width: size, height: size }}>{name[0]}</span>
}

export function ConnectButton({ big = false }: { big?: boolean }) {
  const { session, network, openModal, disconnect, switchTo } = useWallet()
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const on = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(false)
    document.addEventListener('mousedown', on)
    return () => document.removeEventListener('mousedown', on)
  }, [])

  if (!session) return <button className={`btn primary ${big ? '' : 'sm'}`} onClick={openModal}>Connect wallet</button>

  if (!network) {
    return <button className={`btn warn ${big ? '' : 'sm'}`} onClick={() => switchTo(defaultEvm)}>Switch to {defaultEvm.name}</button>
  }

  return (
    <div className="w-acct" ref={ref}>
      <button className={`btn ghost ${big ? '' : 'sm'}`} onClick={() => setMenu(!menu)}>
        <ChainIcon n={network} size={16} /> {shortAddr(session.address)}
      </button>
      {menu && (
        <div className="w-menu card">
          <div className="w-menu-head">
            <WalletIcon icon={session.wallet.icon} name={session.wallet.name} size={22} />
            <div><b>{session.wallet.name}</b><small className="muted">{network.name}</small></div>
          </div>
          {!isSingle && activeNetworks.filter((n) => n.key !== network.key).map((n) => (
            <button key={n.key} onClick={() => { setMenu(false); switchTo(n) }}><ChainIcon n={n} size={16} /> Switch to {n.name}</button>
          ))}
          <a href={network.addrUrl + session.address} target="_blank" rel="noreferrer"><Icon name="ext" size={14} /> View on explorer</a>
          <button onClick={() => { setMenu(false); disconnect() }}>Disconnect</button>
        </div>
      )}
    </div>
  )
}

export function WalletModal() {
  const { modal, closeModal, wallets, connect, connecting, error } = useWallet()
  const [net, setNet] = useState<Network>(primary)
  useEffect(() => {
    if (!modal) return
    const on = (e: KeyboardEvent) => e.key === 'Escape' && closeModal()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [modal, closeModal])
  if (!modal) return null

  const list = wallets.filter((w) => w.vm === net.vm)
  const install = INSTALL[net.vm]

  return (
    <div className="w-overlay" onMouseDown={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="w-modal card" role="dialog" aria-label="Connect wallet">
        <div className="card-head">
          <h3>Connect wallet</h3>
          <button className="w-x" onClick={closeModal} aria-label="Close">×</button>
        </div>

        {!isSingle && (
          <div className="w-nets">
            {activeNetworks.map((n) => (
              <button key={n.key} className={n.key === net.key ? 'on' : ''} onClick={() => setNet(n)}>
                <ChainIcon n={n} size={18} /> {n.short}
              </button>
            ))}
          </div>
        )}
        <p className="muted small">{isSingle ? `Sign in on ${net.name}.` : `Network: ${net.name}`}</p>

        <div className="w-list">
          {list.map((w) => (
            <button key={w.vm + w.id} className="w-opt" disabled={!!connecting} onClick={() => connect(w, net)}>
              <WalletIcon icon={w.icon} name={w.name} />
              <span>{w.name}</span>
              <small className="muted">{connecting === w.id ? 'Check wallet…' : ''}</small>
            </button>
          ))}
          {!list.length && (
            <a className="w-opt" href={install.url} target="_blank" rel="noreferrer">
              <span className="w-ic w-ic-txt">+</span><span>No {net.vm === 'evm' ? 'EVM' : 'Solana'} wallet found — install {install.name}</span>
            </a>
          )}
        </div>
        {error && <p className="w-err small">{error}</p>}
      </div>
    </div>
  )
}
