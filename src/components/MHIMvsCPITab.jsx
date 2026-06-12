import { useState } from 'react'
import { YEARS, COMPOSITE, DIVERGENCE } from '../data/staticSeries'
import { TerminalChart, ChartCard, C, toRows } from './charts/primitives'
import WageTimeMachine from './WageTimeMachine'

export default function MHIMvsCPITab() {
  const [mode, setMode] = useState('dollar') // 'dollar' | 'hours'
  const isDollar = mode === 'dollar'
  const d = isDollar ? COMPOSITE.dollar : COMPOSITE.hours
  const mhimColor = isDollar ? C.gold : C.teal

  const compositeRows = toRows(YEARS, {
    mhim: d.MHIM, cpi: d.CPI, t1: d.T1, t2: d.T2, t3: d.T3,
  })
  const divergenceRows = toRows(YEARS, {
    wage: DIVERGENCE.WAGE_IDX, home: DIVERGENCE.HOME_NOM,
    gold: DIVERGENCE.GOLD_NOM, sp: DIVERGENCE.SP_NOM,
  })

  return (
    <>
      <div className="intro-card">
        <h2>MHIM vs. Official CPI — Two Honest Comparisons</h2>
        <p>
          Toggle between <span className="hi">dollar terms</span> (both measured in nominal dollars, 1971=100)
          and <span className="hi">hours-of-labor terms</span> (both measured in work hours — eliminates wage
          growth as a variable). These are different questions and should not be shown on the same scale.
        </p>
      </div>

      <div className="toggle-row">
        <span className={'tl' + (isDollar ? ' active' : '')}>💵 Dollar Terms</span>
        <div className={'tt' + (isDollar ? '' : ' on')} onClick={() => setMode(isDollar ? 'hours' : 'dollar')}>
          <div className="tt-thumb" />
        </div>
        <span className={'tl' + (isDollar ? '' : ' active')}>⏱ Hours-of-Labor Terms</span>
      </div>

      {isDollar ? (
        <div className="explain explain-a">
          <strong>What you're seeing:</strong>{' '}
          <span>
            Every category priced in nominal dollars, indexed 1971=100. MHIM weights assets (40%) and
            necessities (45%). CPI blends all spending categories. By 2025, MHIM reaches{' '}
            <strong style={{ color: 'var(--gold)' }}>3,182</strong> vs CPI's <strong>875</strong> — the
            wealth-building basket outpaced official inflation by{' '}
            <strong style={{ color: 'var(--gold)' }}>3.6×</strong>.
          </span>
        </div>
      ) : (
        <div className="explain explain-b">
          <strong>What you're seeing:</strong>{' '}
          <span>
            Every price divided by the hourly wage for that year. Wages tracked CPI almost exactly over 55
            years, so the CPI basket in labor hours is{' '}
            <strong style={{ color: 'var(--teal)' }}>essentially flat (100 → 100)</strong>. But the MHIM
            basket rose to <strong style={{ color: 'var(--teal)' }}>322</strong> — 3.2× more work hours for
            the wealth-building basket. The Cantillon extraction made visible.
          </span>
        </div>
      )}

      {isDollar ? (
        <div className="kn-row">
          <div className="kn gold"><div className="kl">MHIM — 2025</div><div className="kv">3,182</div><div className="ks">vs 100 in 1971 (+3,082%)</div></div>
          <div className="kn grey"><div className="kl">CPI — 2025</div><div className="kv">875</div><div className="ks">vs 100 in 1971 (+775%)</div></div>
          <div className="kn gold"><div className="kl">MHIM outpaces CPI by</div><div className="kv">3.6×</div><div className="ks">in dollar terms</div></div>
        </div>
      ) : (
        <div className="kn-row">
          <div className="kn teal"><div className="kl">MHIM — 2025 (labor hrs)</div><div className="kv">322</div><div className="ks">vs 100 in 1971 (+222%)</div></div>
          <div className="kn grey"><div className="kl">CPI — 2025 (labor hrs)</div><div className="kv">~100</div><div className="ks">Wages tracked CPI (+0%)</div></div>
          <div className="kn teal"><div className="kl">Extra work hrs for wealth basket</div><div className="kv">+222%</div><div className="ks">above wage-adjusted baseline</div></div>
        </div>
      )}

      <ChartCard tall style={{ marginBottom: 18 }}
        sources={['CPI', 'MHIM_METHODOLOGY', 'KFF_PREMIUMS', 'AHETPI']}>
        <TerminalChart rows={compositeRows} height={320} series={[
          { key: 'mhim', label: 'MHIM — Asset/Necessity Basket', color: mhimColor, kind: 'area' },
          { key: 'cpi', label: 'Official CPI', color: C.muted, dashed: true, width: 1.5, dot: 2 },
          { key: 't1', label: 'Tier 1: Assets only', color: C.red, dashed: true, width: 1.2, dot: 2 },
          { key: 't2', label: 'Tier 2: Necessities', color: C.orange, dashed: true, width: 1.2, dot: 2 },
          { key: 't3', label: 'Tier 3: Discretionary', color: isDollar ? C.green : C.blue, dashed: true, width: 1.2, dot: 2 },
        ]} />
      </ChartCard>

      <WageTimeMachine />

      <ChartCard
        title="Nominal Wage vs. Asset Prices — Divergence (1971 = 100)"
        sub="Dollar terms — shows the compounding gap between labor income and asset appreciation"
        tall sources={['WAGE', 'MEDIAN_HOME', 'GOLD', 'SP500']}
      >
        <TerminalChart rows={divergenceRows} height={320} series={[
          { key: 'wage', label: 'Nominal Wage', color: C.teal },
          { key: 'home', label: 'Median Home', color: C.gold },
          { key: 'gold', label: 'Gold', color: C.orange },
          { key: 'sp', label: 'S&P 500', color: C.blue },
        ]} />
      </ChartCard>

      <div className="fc" style={{ marginTop: 18 }}>
        <h4>📐 Why Dollar Mode &gt; Hours-Labor Mode for Public Argument</h4>
        <p>
          Dollar mode (MHIM 3,182 vs CPI 875) is the better rhetorical tool because it doesn't require
          explaining the hours-of-labor standard. The S&P at +8,010%, housing at +1,645%, gold at +9,859% vs
          CPI at +775% is immediately legible. Hours-labor mode is more analytically honest but requires more
          setup.
        </p>
      </div>
      <div className="fc bear">
        <h4>⚖️ The Strongest Steelman Against MHIM</h4>
        <p>
          MHIM's 40% weighting to assets is a choice. Someone who doesn't own assets and doesn't plan to
          doesn't experience asset inflation directly. For a household focused purely on consumption, official
          CPI may be closer to their lived experience. MHIM is honest about <em>what it measures</em>: the
          cost of the wealth-building trajectory — not the cost of subsistence consumption.
        </p>
      </div>
    </>
  )
}
