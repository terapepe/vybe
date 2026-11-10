# VYBE.FUN — The On-Chain VibeArena

Gamified prompt-coding battles: stake into a pool, vibe-code a dApp with AI against the clock, AI judges score it, winner takes the pool.
Token: **vybecode ($VYBE)** · X: [@vybefun](https://x.com/vybefun)

Vite + React + TypeScript. Pages: Arena (`#/`) and Docs (`#/docs/<section>`).

## Config — everything editable in `src/config/site.json`

| Key | Meaning |
|---|---|
| `mode` | `"single"` = only `singleNetwork` · `"multi"` = always Solana, Robinhood, Base, BNB Chain |
| `singleNetwork` | `solana` \| `robinhood` \| `base` \| `bsc` — theme color, hero chip, CA card, docs follow this network |
| `multiOrder` | Display order in multi mode |
| `evmAddress` | One CA shared by Robinhood / Base / BSC |
| `solanaAddress` | Solana SPL mint |
| `chains.<key>.ca` | Optional per-chain CA override (empty → shared address) |
| `chains.<key>.name/short/color/color2/tagline/perks` | Per-network branding & copy |
| `x` | X handle (`vybefun`) |
| `brand`, `tokenName`, `symbol` | Branding |

Networks with the same CA are grouped into one card and one **Copy CA** button (e.g. `RH / BASE / BSC`).
Live price / liquidity / volume come from DexScreener once a CA is set — nothing is shown before that.

Page copy (battle modes, rubric, roadmap, FAQ) lives in `src/content.ts`.

## Dev
```
npm i
npm run dev
npm run build
```
Deploy: Vercel (`vercel.json` included) or any static host serving `dist/`.
