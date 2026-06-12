// ═══════════════════════════════════════════════════════════════
// SCAFFOLD ONLY — per brief, session 2-3 work. No data recalc yet.
// "Your Personal Inflation Rate" — user self-weights asset classes;
// default MHIM (40/45/15) remains the baseline. Placement: panel on
// the MHIM vs CPI tab, below the main chart (wire in when built).
//
// Props (per brief spec): defaultWeights, onWeightChange, chartData
// State: weights object, active preset
// Output: recalculated MHIM series passed back to parent chart
// ═══════════════════════════════════════════════════════════════
import { useMemo, useState } from 'react'

export const weightCategories = [
  // Assets
  { id: 'home', label: 'Home Ownership', tier: 'asset', defaultWeight: 15 },
  { id: 'equities', label: 'Stock Market', tier: 'asset', defaultWeight: 10 },
  { id: 'rental', label: 'Rental Property', tier: 'asset', defaultWeight: 8 },
  { id: 'gold', label: 'Precious Metals', tier: 'asset', defaultWeight: 5 },
  { id: 'farmland', label: 'Land / Farmland', tier: 'asset', defaultWeight: 2 },
  // Necessities
  { id: 'healthcare', label: 'Healthcare Premiums', tier: 'necessity', defaultWeight: 15 },
  { id: 'housing_cost', label: 'Rent / Housing Cost', tier: 'necessity', defaultWeight: 12 },
  { id: 'tuition', label: 'College Tuition', tier: 'necessity', defaultWeight: 8 },
  { id: 'food', label: 'Food Staples', tier: 'necessity', defaultWeight: 6 },
  { id: 'energy', label: 'Energy / Gas', tier: 'necessity', defaultWeight: 4 },
  // Discretionary
  { id: 'vehicle', label: 'Vehicle', tier: 'discretionary', defaultWeight: 8 },
  { id: 'electronics', label: 'Electronics', tier: 'discretionary', defaultWeight: 7 },
]
// Note: brief's defaults sum to 100 across these sliders.

export const presets = [
  { id: 'accumulator', label: '📈 Early Accumulator' },
  { id: 'housing', label: '🏠 Housing-Focused' },
  { id: 'independence', label: '🌾 Independence-Focused' },
  { id: 'credential', label: '🎓 Credential Economy' },
  { id: 'retirement', label: '🏦 Near Retirement' },
  { id: 'custom', label: '⚙️ Custom' },
]

export default function UserWeightedMHIM({
  defaultWeights = Object.fromEntries(weightCategories.map((c) => [c.id, c.defaultWeight])),
  onWeightChange = () => {},
  chartData = null, // recalculated series will be passed back to parent chart
}) {
  const [weights, setWeights] = useState(defaultWeights)
  const [activePreset, setActivePreset] = useState('custom')

  const total = useMemo(() => Object.values(weights).reduce((a, b) => a + b, 0), [weights])

  const setWeight = (id, value) => {
    const next = { ...weights, [id]: value }
    setWeights(next)
    setActivePreset('custom')
    onWeightChange(next)
  }

  // TODO (session 2-3): preset weight maps; recalculate personal MHIM
  // series from weights + staticSeries PRICES; render personal line on
  // parent chart; headline "Your personal inflation rate since 1971:
  // Xx vs CPI's 8.75x"; URL-encoded share hook.

  return (
    <div id="personal-calc" style={{ marginTop: 18 }}>
      <h2>Your Personal Inflation Rate</h2>
      <div className="sub">
        Self-weight the categories to your goals — the default MHIM (40/45/15) stays as baseline.
      </div>

      <div className="scaffold-note">
        🚧 <strong>Scaffolded — recalculation and presets planned for a future session.</strong> Sliders and
        the 100%-sum check are live; the personal MHIM line and share hook are not wired yet.
      </div>

      <div className="preset-row">
        {presets.map((p) => (
          <button
            key={p.id}
            className={'wb-btn' + (activePreset === p.id ? ' active' : '')}
            onClick={() => setActivePreset(p.id)}
            disabled={p.id !== 'custom'}
            title={p.id !== 'custom' ? 'Preset weights coming in a future session' : undefined}
          >
            {p.label}
          </button>
        ))}
      </div>

      {weightCategories.map((c) => (
        <div className="uw-row" key={c.id}>
          <span className="uw-label">{c.label} <small>({c.tier})</small></span>
          <input
            type="range" min="0" max="50" step="1"
            value={weights[c.id]}
            onChange={(e) => setWeight(c.id, +e.target.value)}
          />
          <span className="uw-val">{weights[c.id]}%</span>
        </div>
      ))}

      <div className={'uw-total ' + (total === 100 ? 'ok' : 'bad')}>
        Total: {total}% {total === 100 ? '✓' : '— must sum to 100%'}
      </div>
    </div>
  )
}
