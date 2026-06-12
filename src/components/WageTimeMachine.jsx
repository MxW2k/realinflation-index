// Wage Time Machine — enter a wage from any year; see what CPI says it
// should be today vs. what MHIM (and each tier) says, vs. what actual
// median wage growth delivered. Values between anchor years are
// log-interpolated (constant compound growth between anchors).
import { useState } from 'react'
import { YEARS, HIST_WAGES, MED_WAGE, COMPOSITE, interpSeries } from '../data/staticSeries'
import { TerminalChart, C } from './charts/primitives'
import SourcesDrawer from './SourcesDrawer'

const CUR_YEAR = 2026
const fmtMoney = (v, annual) =>
  annual
    ? '$' + Math.round(v).toLocaleString()
    : '$' + v.toFixed(2)

export default function WageTimeMachine() {
  const [yearInput, setYearInput] = useState('2016')
  const [amountInput, setAmountInput] = useState('70000')
  const [mode, setMode] = useState('annual') // 'annual' | 'hourly'
  const [showTiers, setShowTiers] = useState(true)
  const [result, setResult] = useState(null)
  const [srcOpen, setSrcOpen] = useState(false)

  const generate = () => {
    const year = Math.round(parseFloat(yearInput))
    const amount = parseFloat(amountInput)
    if (!year || year < YEARS[0] || year >= CUR_YEAR || !amount || amount <= 0) {
      setResult({ error: `Enter a year between ${YEARS[0]} and ${CUR_YEAR - 1} and a positive wage.` })
      return
    }
    const annual = mode === 'annual'
    // Median wages array (always median — the "actual" path measures the
    // economy's wage growth, not the user's personal raises)
    const medWages = [...HIST_WAGES.slice(0, 7), MED_WAGE]

    const factor = (series, y) => interpSeries(series, y) / interpSeries(series, year)
    const path = (series) => (y) => amount * factor(series, y)

    const lines = {
      cpi: path(COMPOSITE.dollar.CPI),
      mhim: path(COMPOSITE.dollar.MHIM),
      t1: path(COMPOSITE.dollar.T1),
      t2: path(COMPOSITE.dollar.T2),
      t3: path(COMPOSITE.dollar.T3),
      actual: path(medWages),
    }

    const yearsOut = []
    for (let y = year; y <= CUR_YEAR; y++) yearsOut.push(y)
    const rows = yearsOut.map((y) => ({
      x: y,
      cpi: +lines.cpi(y).toFixed(annual ? 0 : 2),
      mhim: +lines.mhim(y).toFixed(annual ? 0 : 2),
      actual: +lines.actual(y).toFixed(annual ? 0 : 2),
      ...(showTiers && {
        t1: +lines.t1(y).toFixed(annual ? 0 : 2),
        t2: +lines.t2(y).toFixed(annual ? 0 : 2),
        t3: +lines.t3(y).toFixed(annual ? 0 : 2),
      }),
    }))

    const span = CUR_YEAR - year
    const ticks =
      span <= 12
        ? yearsOut
        : YEARS.filter((y) => y >= year).concat(year).sort((a, b) => a - b).filter((v, i, a) => a.indexOf(v) === i)

    setResult({
      year, amount, annual, rows, ticks,
      now: {
        cpi: lines.cpi(CUR_YEAR),
        mhim: lines.mhim(CUR_YEAR),
        t1: lines.t1(CUR_YEAR),
        t2: lines.t2(CUR_YEAR),
        t3: lines.t3(CUR_YEAR),
        actual: lines.actual(CUR_YEAR),
      },
    })
  }

  const r = result && !result.error ? result : null
  const isAnchor = r && YEARS.includes(r.year)

  return (
    <div id="personal-calc" style={{ marginTop: 18 }}>
      <h2>⏳ Wage Time Machine — Did Your Income Keep Up?</h2>
      <div className="sub">
        Enter a wage from any year. See what CPI inflation says it should be in {CUR_YEAR} — versus what
        MHIM says it would take to keep buying the wealth-building basket.
      </div>

      <div className="toggle-row" style={{ flexWrap: 'wrap', gap: 10 }}>
        <div className="wb-input-wrap">
          <label>Year</label>
          <input className="wb-input" type="number" min={YEARS[0]} max={CUR_YEAR - 1} step="1"
            value={yearInput} onChange={(e) => setYearInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()} style={{ width: 72 }} />
        </div>
        <div className="wb-input-wrap">
          <label>{mode === 'annual' ? 'Annual salary $' : 'Hourly wage $'}</label>
          <input className="wb-input" type="number" min="0" step={mode === 'annual' ? 500 : 0.25}
            value={amountInput} onChange={(e) => setAmountInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()} />
        </div>
        <button className={'wb-btn' + (mode === 'annual' ? ' active' : '')} onClick={() => setMode('annual')}>Annual</button>
        <button className={'wb-btn' + (mode === 'hourly' ? ' active' : '')} onClick={() => setMode('hourly')}>Hourly</button>
        <button className={'wb-btn' + (showTiers ? ' active' : '')} onClick={() => setShowTiers(!showTiers)}>
          {showTiers ? '✓ ' : ''}Show tiers
        </button>
        <button className="wb-apply" onClick={generate}>Generate</button>
      </div>

      {result?.error && <div className="scaffold-note">{result.error}</div>}

      {r && (
        <>
          <div className="kn-row" style={{ marginTop: 14 }}>
            <div className="kn grey">
              <div className="kl">CPI says you'd need</div>
              <div className="kv">{fmtMoney(r.now.cpi, r.annual)}</div>
              <div className="ks">to match official inflation since {r.year}</div>
            </div>
            <div className="kn teal">
              <div className="kl">Actual median wage growth</div>
              <div className="kv">{fmtMoney(r.now.actual, r.annual)}</div>
              <div className="ks">
                {Math.abs(r.now.actual / r.now.cpi - 1) < 0.06
                  ? 'almost exactly the CPI path — wages tracked CPI'
                  : r.now.actual > r.now.cpi ? 'ahead of the CPI path' : 'behind even the CPI path'}
              </div>
            </div>
            <div className="kn gold">
              <div className="kl">MHIM says you'd need</div>
              <div className="kv">{fmtMoney(r.now.mhim, r.annual)}</div>
              <div className="ks">
                to keep buying the wealth-building basket — {(r.now.mhim / r.now.cpi).toFixed(1)}× the CPI answer
              </div>
            </div>
          </div>

          {showTiers && (
            <div className="kn-row">
              <div className="kn grey"><div className="kl">Tier 1: Assets only</div><div className="kv" style={{ fontSize: '1rem', color: 'var(--red)' }}>{fmtMoney(r.now.t1, r.annual)}</div></div>
              <div className="kn grey"><div className="kl">Tier 2: Necessities</div><div className="kv" style={{ fontSize: '1rem', color: 'var(--orange)' }}>{fmtMoney(r.now.t2, r.annual)}</div></div>
              <div className="kn grey"><div className="kl">Tier 3: Discretionary</div><div className="kv" style={{ fontSize: '1rem', color: 'var(--green)' }}>{fmtMoney(r.now.t3, r.annual)}</div></div>
            </div>
          )}

          <div className="chart-card" style={{ marginBottom: 12 }}>
            <h3>Your {r.year} {r.annual ? 'salary' : 'wage'} of {fmtMoney(r.amount, r.annual)} — three futures</h3>
            <div className="sub">
              {isAnchor ? '' : `${r.year} values log-interpolated between anchor years. `}
              Solid lines: CPI path, MHIM path, actual median wage growth. Dashed: tier baskets.
            </div>
            <div className="cw-tall">
              <TerminalChart rows={r.rows} height={320} xTicks={r.ticks} series={[
                { key: 'mhim', label: 'MHIM-adjusted', color: C.gold, kind: 'area' },
                { key: 'cpi', label: 'CPI-adjusted', color: C.muted, width: 2 },
                { key: 'actual', label: 'Actual median wage growth', color: C.teal, width: 2 },
                ...(showTiers ? [
                  { key: 't1', label: 'Tier 1: Assets', color: C.red, dashed: true, width: 1.2, dot: 0 },
                  { key: 't2', label: 'Tier 2: Necessities', color: C.orange, dashed: true, width: 1.2, dot: 0 },
                  { key: 't3', label: 'Tier 3: Discretionary', color: C.green, dashed: true, width: 1.2, dot: 0 },
                ] : []),
              ]} />
            </div>
            <div className="src-btn-row">
              <button className={'src-btn' + (srcOpen ? ' open' : '')} onClick={() => setSrcOpen(!srcOpen)}>Sources ↗</button>
            </div>
            {srcOpen && <SourcesDrawer sourceIds={['CPI', 'MHIM_METHODOLOGY', 'AHETPI']} />}
          </div>

          <div className="fc bear" style={{ marginBottom: 0 }}>
            <h4>⚖️ How to Read This Honestly</h4>
            <p>
              The MHIM line is a <strong>purchasing-power claim about the wealth-building basket</strong> — not
              a claim that wages should mechanically track any basket (wages are set by labor markets and
              productivity, not indexation). The honest takeaway is narrower and sharper: if your raises
              matched CPI, you can still consume like you did in {r.year} — but you fall{' '}
              <strong>{((1 - r.now.cpi / r.now.mhim) * 100).toFixed(0)}% short</strong> of the income needed to
              keep climbing the asset ladder at the same pace. Tier 3 (discretionary, {fmtMoney(r.now.t3, r.annual)})
              usually lands <em>below</em> CPI — consumption got cheaper while accumulation got dearer.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
