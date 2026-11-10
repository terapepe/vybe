import site from './config/site.json'

const S = `$${site.symbol}`

export const STEPS = [
  { n: '01', t: 'Stake', d: `Join a lobby and lock your entry into the battle pool — in ${S} or the chain's native token. Funds sit in an escrow contract, not with us.` },
  { n: '02', t: 'Get the brief', d: 'The arena drops a challenge, e.g. "In 15 minutes, ship a dApp leaderboard with a Web3 wallet and live Pyth Oracle prices."' },
  { n: '03', t: 'Vibe-code it', d: 'Build with prompts only — your AI copilot, your style. The clock, the prompts and every build are hashed on-chain.' },
  { n: '04', t: 'AI judges', d: 'A panel of independent AI judges runs the build, tests it, audits it and scores it against a public rubric.' },
  { n: '05', t: 'Winner takes the pool', d: 'The contract pays out automatically. Your score mints into your Reputation SBT and Season ladder.' },
]

// AI scoring rubric (weights add up to 100)
export const RUBRIC = [
  { k: 'Code quality', w: 30, d: 'Structure, readability, gas & bundle efficiency, no dead code.' },
  { k: 'Performance', w: 25, d: 'Load time, response latency, oracle refresh speed under test load.' },
  { k: 'UI / UX', w: 25, d: 'Visual polish, clarity, mobile layout, wallet flow that just works.' },
  { k: 'Security', w: 20, d: 'Static analysis + AI audit: key handling, input validation, reentrancy, approvals.' },
]

export const MODES = [
  { icon: 'bolt', t: 'Blitz', tag: '15 min · 2–16 players', d: 'The classic. One brief, one clock, one pool. Fastest high-scoring build wins it all.' },
  { icon: 'duel', t: 'Duel', tag: '1v1 · challenge anyone', d: 'Call out a rival by wallet or X handle, set the stake, settle it in the arena.' },
  { icon: 'squad', t: 'Squad Wars', tag: '3v3 · shared repo', d: 'Team up: one prompter, one tester, one designer. Pool split by contribution.' },
  { icon: 'free', t: 'Free Play', tag: 'no stake · daily', d: 'Practice briefs with zero risk. Earn XP and climb toward your first ranked badge.' },
  { icon: 'eye', t: 'Spectate & Predict', tag: 'watch live', d: 'Watch builds stream in real time and back the coder you think will win.' },
  { icon: 'cup', t: 'Season Finals', tag: 'invite-only', d: 'Top of each ladder meets for the season crown and the biggest pool of the year.' },
]

export const CRYPTO = [
  { t: 'Wager pools', d: 'Escrowed, permissionless pools. Entry fees in, winner payout out — enforced by the contract, visible on-chain.' },
  { t: 'Season Pass NFT', d: 'Unlocks ranked ladders, bonus XP, exclusive briefs, cosmetic arena skins and Season Finals qualification.' },
  { t: 'Reputation SBT', d: 'A soulbound badge that records wins, scores and rank. Non-transferable — reputation you cannot buy.' },
  { t: 'Prompt replays', d: 'Every winning build is published with its prompt trail. Learn from the best vibe coders in the world.' },
]

export const RANKS = [
  { t: 'Rookie', d: 'Finish your first Free Play' },
  { t: 'Viber', d: 'Win a staked Blitz' },
  { t: 'Flow Coder', d: 'Hold a top-25% season score' },
  { t: 'Prompt Smith', d: 'Win 10 ranked battles' },
  { t: 'Vibe Lord', d: 'Season Finals champion' },
]

export const UTILITY = [
  { t: 'Enter battles', d: `Stake ${S} into Blitz, Duel and Squad pools.` },
  { t: 'Season Pass', d: `Mint the Season Pass NFT with ${S}.` },
  { t: 'Host lobbies', d: `Create custom briefs and private lobbies for your community.` },
  { t: 'Predict', d: `Back coders in Spectate & Predict markets.` },
  { t: 'Govern', d: `Vote on new brief categories, judge models and rubric weights.` },
]

export const ROADMAP = [
  { p: 'Phase 1', t: 'Ignition', items: [`${S} launch`, 'Community & X', 'Free Play beta'] },
  { p: 'Phase 2', t: 'Arena Live', items: ['Staked Blitz & Duel', 'AI judge panel v1', 'Reputation SBT'] },
  { p: 'Phase 3', t: 'Season One', items: ['Season Pass NFT', 'Ranked ladders', 'Spectate & Predict'] },
  { p: 'Phase 4', t: 'Open Arena', items: ['Squad Wars', 'Community-hosted briefs', 'On-chain governance'] },
]

export const FAQ = [
  { q: 'Do I need to know how to code?', a: 'No. VibeArena is about prompt engineering — describing what you want clearly and iterating fast. Start in Free Play, no stake required.' },
  { q: 'Who decides the winner?', a: 'A panel of independent AI judges scores each build against the public rubric (code quality, performance, UI/UX, security). Scores and build hashes are posted on-chain.' },
  { q: 'Where is my stake held?', a: 'In the battle escrow contract on the chain you play on. It is released only by the result — to the winner, or back to everyone if a battle is cancelled.' },
  { q: 'Can someone cheat with a pre-built project?', a: 'Briefs are revealed only when the clock starts, every prompt is logged and hashed, and builds are diffed against known templates.' },
  { q: 'Which chains are supported?', a: 'Solana, Robinhood, Base and BNB Chain. Robinhood, Base and BNB Chain share one EVM contract address.' },
  { q: `What is ${S}?`, a: `${site.tokenName} (${S}) is the arena token: stake it, mint the Season Pass, host lobbies and vote on how the arena evolves.` },
]
