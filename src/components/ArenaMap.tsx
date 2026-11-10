import { RUBRIC } from '../content'

// "Battle routing map" — every build flows Brief → Prompt → Build → AI Judge → Payout.
// Lanes are the 4 scoring dimensions; numbers are the real rubric weights.
const COLS = ['Brief', 'Prompt', 'Build', 'AI Judge', 'Payout']
const LANE_Y = [70, 120, 170, 220]
const X = [34, 152, 270, 388, 516]
const COLORS = ['var(--accent)', 'var(--accent2)', '#38BDF8', '#22D3A6']

export function ArenaMap() {
  return (
    <>
      <MapSvg />
      <div className="map-legend">
        {RUBRIC.map((r, i) => <span key={r.k}><i style={{ background: COLORS[i] }} />{r.k}<b>{r.w}%</b></span>)}
      </div>
    </>
  )
}

function MapSvg() {
  const lane = (y: number, i: number) => {
    const wob = (k: number) => y + Math.sin(i * 1.7 + k) * 14
    return `M${X[0]} ${wob(0)} C ${X[0] + 60} ${wob(0)}, ${X[1] - 60} ${wob(1)}, ${X[1]} ${wob(1)}
      S ${X[2] - 60} ${wob(2)}, ${X[2]} ${wob(2)} S ${X[3] - 60} ${y}, ${X[3]} ${y} S ${X[4] - 50} 145, ${X[4]} 145`
  }
  return (
    <svg className="arena-map" viewBox="0 0 560 250" role="img" aria-label="Battle flow from brief to payout, scored on code quality, performance, UI/UX and security">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" /></filter>
        <linearGradient id="col" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".0" /><stop offset=".5" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {COLS.map((c, i) => (
        <g key={c}>
          <text x={X[i]} y="30" textAnchor="middle" className="map-col">{c}</text>
          {i < 4 && <rect x={X[i] - 7} y="44" width="14" height="200" rx="7" fill="url(#col)" opacity=".5" />}
        </g>
      ))}
      {LANE_Y.map((y, i) => (
        <g key={i}>
          <path d={lane(y, i)} stroke={COLORS[i]} strokeWidth="14" fill="none" opacity=".22" filter="url(#glow)" />
          <path d={lane(y, i)} stroke={COLORS[i]} strokeWidth="3" fill="none" className="flow" style={{ animationDelay: `${i * -0.6}s` }} />
          {[0, 1, 2, 3].map((k) => (
            <circle key={k} cx={X[k]} cy={k === 3 ? y : y + Math.sin(i * 1.7 + k) * 14} r="4" fill={COLORS[i]} />
          ))}
        </g>
      ))}
      <circle cx={X[4]} cy="145" r="22" fill="none" stroke="var(--accent)" strokeWidth="2" />
      <circle cx={X[4]} cy="145" r="22" fill="var(--accent)" opacity=".18" filter="url(#glow)" />
      <path d={`M${X[4] - 9} 145 l6 6 12 -13`} stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
