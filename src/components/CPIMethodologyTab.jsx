// CPI Methodology Era Selector — the same price history recalculated
// under each era's rules. Makes the methodology argument from inside
// CPI's own framework. Magnitudes BLS-sourced except where flagged.
import { useState } from 'react'
import { YEARS, COMPOSITE } from '../data/staticSeries'
import { CPI_ERAS, HEDONIC_CRITIC, SHADOWSTATS_SGS, OPERATIONAL_CHANGES, MORTGAGE_RATE } from '../data/cpiReconstructions'
import { TerminalChart, C, toRows } from './charts/primitives'
import SourcesDrawer from './SourcesDrawer'

export default function CPIMethodologyTab() {
  const [era, setEra] = useState('pre83')
  const [showHedonic, setShowHedonic] = useState(false)
  const [showSGS, setShowSGS] = useState(false)
  const [logScale, setLogScale] = useState(false)
  const [opsOpen, setOpsOpen] = useState(false)
  const [srcOpen, setSrcOpen] = useState(false)

  const eraData = CPI_ERAS[era]
  const useLog = logScale || showSGS

  const seriesMap = {
    mhim: COMPOSITE.dollar.MHIM,
    official: CPI_ERAS.current.series,
    ...(era !== 'current' && { era: eraData.series }),
    ...(showHedonic && { hed: HEDONIC_CRITIC.series }),
    ...(showSGS && { sgs: SHADOWSTATS_SGS.series }),
  }
  const rows = toRows(YEARS, seriesMap)

  const chartSeries = [
    { key: 'mhim', label: 'MHIM (reference)', color: C.gold, kind: 'area' },
    { key: 'official', label: 'Official CPI (current method)', color: C.muted, width: 2 },
    ...(era !== 'current' ? [{ key: 'era', label: eraData.label, color: C.teal, width: 2.5 }] : []),
    ...(showHedonic ? [{ key: 'hed', label: 'Hedonics critic estimate ⚠️', color: C.purple, dashed: true, width: 1.2, dot: 2 }] : []),
    ...(showSGS ? [{ key: 'sgs', label: 'ShadowStats ⚠️', color: C.red, dashed: true, width: 1.5, dot: 2 }] : []),
  ]

  const eraEnd = eraData.series[7]
  const gapVsOfficial = ((eraEnd / 900 - 1) * 100).toFixed(0)

  return (
    <>
      <div className="intro-card">
        <h2>CPI Methodology Time Machine — Same Prices, Each Era's Rules</h2>
        <p>
          Every methodology change BLS lists, sorted into <span className="hi">changes that move the
          headline number</span> (reconstructed below, at BLS-sourced magnitudes) and operational changes
          that don't. Select an era to see what CPI would read today under those rules — the argument made
          from <span className="hi">inside CPI's own framework</span>.
        </p>
      </div>

      <div className="toggle-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        {Object.entries(CPI_ERAS).map(([id, e]) => (
          <button key={id} className={'wb-btn' + (era === id ? ' active' : '')} onClick={() => setEra(id)}>
            {e.label}
          </button>
        ))}
      </div>
      <div className="toggle-row" style={{ flexWrap: 'wrap', gap: 8 }}>
        <button className={'wb-btn' + (showHedonic ? ' active' : '')} onClick={() => setShowHedonic(!showHedonic)}>
          {showHedonic ? '✓ ' : ''}Hedonics critic estimate ⚠️
        </button>
        <button className={'wb-btn' + (showSGS ? ' active' : '')} onClick={() => setShowSGS(!showSGS)}>
          {showSGS ? '✓ ' : ''}ShadowStats overlay ⚠️
        </button>
        <button className={'wb-btn' + (useLog ? ' active' : '')} onClick={() => setLogScale(!logScale)} disabled={showSGS}
          title={showSGS ? 'Log scale forced on while ShadowStats is visible' : ''}>
          {useLog ? '✓ ' : ''}Log scale
        </button>
      </div>

      <div className="kn-row">
        <div className="kn grey"><div className="kl">Official CPI — 2026</div><div className="kv">900</div><div className="ks">1971 = 100</div></div>
        {era !== 'current' && (
          <div className="kn teal"><div className="kl">{eraData.label} — 2026</div><div className="kv">{eraEnd.toLocaleString()}</div><div className="ks">{gapVsOfficial > 0 ? '+' : ''}{gapVsOfficial}% vs official</div></div>
        )}
        <div className="kn gold"><div className="kl">MHIM — 2026</div><div className="kv">3,182</div><div className="ks">the wealth-building basket</div></div>
      </div>

      <div className="chart-card" style={{ marginBottom: 14 }}>
        <h3>Indexed 1971 = 100 {useLog ? '(log scale)' : ''}</h3>
        <div className="sub">{eraData.note}</div>
        <div className="cw-tall">
          <TerminalChart rows={rows} height={330} logY={useLog} series={chartSeries} />
        </div>
        <div className="src-btn-row">
          <button className={'src-btn' + (srcOpen ? ' open' : '')} onClick={() => setSrcOpen(!srcOpen)}>Sources ↗</button>
        </div>
        {srcOpen && <SourcesDrawer sourceIds={['GEOMEAN_1999', 'CPI_U_RS', 'OER_CHANGE', 'MORTGAGE30', 'MEDIAN_HOME', 'HEDONIC', 'HEDONIC_CROSSVAL', 'SHADOWSTATS', 'BOSKIN', 'BLS_HISTORY']} />}
      </div>

      {showHedonic && (
        <div className="fc info"><h4>📱 Hedonics — What the Evidence Actually Shows</h4><p>{HEDONIC_CRITIC.note}</p></div>
      )}
      {showSGS && (
        <div className="fc info"><h4>⚠️ ShadowStats — Read With Care</h4><p>{SHADOWSTATS_SGS.note}</p></div>
      )}

      <div className="fc">
        <h4>🔑 The Two Changes That Measurably Deflated the Number</h4>
        <p>
          <strong>Housing (1983):</strong> the switch from actual home prices + mortgage rates to Owners
          Equivalent Rent — BLS's own CPI-U-RS shows the pre/post gap averaged 0.45pp/yr over 1978–98,
          "widest prior to 1983." <strong>Formula (1999):</strong> the geometric mean, at BLS's own
          estimate of 0.2pp/yr. Compounded over 27 years, that formula change alone is ~5.5% of price
          level. Everything else on BLS's published list is operational plumbing.
        </p>
      </div>
      <div className="fc bear">
        <h4>⚖️ The Honest Two-Sided Finding</h4>
        <p>
          The pre-1983 method is <em>not</em> uniformly higher. Mortgage rates fell for four decades
          (13.7% in 1980 → 3.1% in 2020 → {MORTGAGE_RATE[7]}% now), so the old method reads <em>below</em> official
          CPI through the 2010s — in 1982 it famously showed housing at −3.1% while rental equivalence
          showed +3.5%. Where it explodes is 2020–26: home prices and mortgage rates rose <em>together</em>,
          and the pre-83 method shows ~50% cumulative inflation vs the official ~23%. The headline number
          structurally cannot see an affordability shock — that's the takeaway, not "every change was a
          conspiracy." And note ShadowStats: even the maximalist critique towers over MHIM, making this
          site's index the conservative middle ground.
        </p>
      </div>

      <div className="fc info">
        <h4 style={{ cursor: 'pointer' }} onClick={() => setOpsOpen(!opsOpen)}>
          {opsOpen ? '▾' : '▸'} Operational changes — no directional effect on the headline number ({OPERATIONAL_CHANGES.length} groups, from BLS's published list)
        </h4>
        {opsOpen && (
          <ul style={{ margin: '8px 0 0 18px', lineHeight: 1.7, color: 'var(--muted)', fontSize: '0.8rem' }}>
            {OPERATIONAL_CHANGES.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        )}
      </div>
    </>
  )
}
