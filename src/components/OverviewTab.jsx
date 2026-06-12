import { useWage } from '../context/WageContext'
import { PRICES, HIST_WAGES, YR_LABELS, idx } from '../data/staticSeries'
import { TerminalChart, ChartCard, C, toRows } from './charts/primitives'

function PersonalCalc() {
  const { userWage: w, medWage, isMedian } = useWage()
  const annualHrs = 2080

  const items = [
    { name: 'Median Home', price: PRICES.home[7], format: (v) => v.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' hrs', sub: (v) => `~${(v / annualHrs).toFixed(1)} yrs gross income` },
    { name: 'Gold oz', price: PRICES.gold[7], format: (v) => v.toFixed(1) + ' hrs', sub: (v) => `${((v / annualHrs) * 100).toFixed(2)}% of annual hrs` },
    { name: 'Silver oz', price: PRICES.silver[7], format: (v) => v.toFixed(2) + ' hrs', sub: (v) => `${(v * 60).toFixed(1)} min of work` },
    { name: 'S&P 500 unit', price: PRICES.sp500[7], format: (v) => v.toFixed(1) + ' hrs', sub: (v) => `${(v / 8).toFixed(1)} work days` },
    { name: 'Annual Tuition', price: PRICES.tuition[7], format: (v) => v.toFixed(0) + ' hrs', sub: (v) => `${((v / annualHrs) * 100).toFixed(1)}% of annual hrs` },
    { name: 'Health Premium/yr', price: PRICES.health[7], format: (v) => v.toFixed(0) + ' hrs', sub: (v) => `${((v / annualHrs) * 100).toFixed(1)}% of annual hrs` },
    { name: 'Monthly Rent', price: PRICES.rent[7], format: (v) => v.toFixed(1) + ' hrs', sub: (v) => `${((v / annualHrs) * 12 * 100).toFixed(1)}% of annual hrs` },
    { name: 'New Car (avg)', price: PRICES.car[7], format: (v) => v.toFixed(0) + ' hrs', sub: (v) => `${(v / annualHrs).toFixed(2)} yrs gross income` },
  ]

  const annual = (w * 2080).toLocaleString(undefined, { maximumFractionDigits: 0 })
  const subtitle = isMedian
    ? `At the median wage of $${w.toFixed(2)}/hr ($${annual}/yr) — all figures in hours of work at your wage`
    : `At your wage of $${w.toFixed(2)}/hr (~$${annual}/yr) — compared to median $${medWage.toFixed(2)}/hr`

  return (
    <div id="personal-calc">
      <h2>📍 Your Personal Position</h2>
      <div className="sub">{subtitle}</div>
      <div className="pc-grid">
        {items.map((item) => {
          const yourHrs = item.price / w
          const medHrs = item.price / medWage
          const diff = (((yourHrs - medHrs) / medHrs) * 100).toFixed(1)
          const better = yourHrs < medHrs
          const cls = isMedian ? '' : better ? 'above-median' : 'below-median'
          const vsText = isMedian
            ? ''
            : better
              ? `▲ ${Math.abs(diff)}% fewer hours than median`
              : `▼ ${Math.abs(diff)}% more hours than median`
          return (
            <div className="pc-item" key={item.name}>
              <div className="pi-name">{item.name}</div>
              <div className="pi-val">{item.format(yourHrs)}</div>
              <div className="pi-sub">{item.sub(yourHrs)}</div>
              {vsText && <div className={'pi-vs ' + cls}>{vsText}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OverviewStats() {
  const { userWage } = useWage()
  const v71 = (key) => PRICES[key][0] / HIST_WAGES[0]
  const vNow = (key) => PRICES[key][7] / userWage
  const pct = (key) => (((vNow(key) - v71(key)) / v71(key)) * 100).toFixed(0)

  const stats = [
    { lbl: 'Home (hours)', val: vNow('home').toFixed(0) + ' hrs', chg: (pct('home') > 0 ? '↑ ' : '') + pct('home') + '% vs 1971', cls: 'up' },
    { lbl: 'Tuition (hrs/yr)', val: vNow('tuition').toFixed(0) + ' hrs', chg: '↑ ' + pct('tuition') + '% vs 1971', cls: 'up' },
    { lbl: 'Farmland/acre', val: vNow('farm').toFixed(0) + ' hrs', chg: '↑ ' + pct('farm') + '% vs 1971', cls: 'up' },
    { lbl: 'S&P entry (hrs)', val: vNow('sp500').toFixed(1) + ' hrs', chg: '↑ ' + pct('sp500') + '% vs 1971', cls: 'up' },
    { lbl: 'Gold oz (hrs)', val: vNow('gold').toFixed(1) + ' hrs', chg: '↑ ' + pct('gold') + '% vs 1971', cls: 'up' },
    { lbl: 'Eggs (minutes)', val: (vNow('eggs') * 60).toFixed(1) + ' min', chg: '↓ ' + (((v71('eggs') - vNow('eggs')) / v71('eggs')) * 100).toFixed(0) + '% vs 1971', cls: 'dn' },
    { lbl: 'Gasoline (min)', val: (vNow('gas') * 60).toFixed(1) + ' min', chg: pct('gas') + '% vs 1971', cls: 'nt' },
  ]

  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div className="sc" key={s.lbl}>
          <div className="lbl">{s.lbl}</div>
          <div className={'val ' + s.cls}>{s.val}</div>
          <div className={'chg ' + s.cls}>{s.chg}</div>
        </div>
      ))}
    </div>
  )
}

export default function OverviewTab() {
  const { hoursArr, minsArr } = useWage()

  const assetRows = toRows(YR_LABELS, {
    home: idx(hoursArr('home')),
    sp: idx(hoursArr('sp500')),
    gold: idx(hoursArr('gold')),
    tuition: idx(hoursArr('tuition')),
  })
  const consumerRows = toRows(YR_LABELS, {
    eggs: idx(minsArr('eggs')),
    gas: idx(minsArr('gas')),
    beef: idx(minsArr('beef')),
  })

  return (
    <>
      <div className="intro-card">
        <h2>The Bifurcation Thesis — Confirmed &amp; Complicated</h2>
        <p>
          Everything priced in hours of labor — no CPI methodology choices. The inflation is{' '}
          <span className="hi">split by category type</span>: assets and necessity services have become
          dramatically more expensive in labor terms; consumer goods stayed flat or got cheaper. Adjust the{' '}
          <strong>Wage Anchor</strong> above to see where <em>you personally</em> sit vs. the median worker.
        </p>
      </div>

      <PersonalCalc />
      <OverviewStats />

      <div className="grid-2">
        <ChartCard
          title="Asset Cost in Hours of Labor (Indexed 1971 = 100)"
          sub="Current datapoint uses your wage anchor" tall
          sources={['MEDIAN_HOME', 'SP500', 'GOLD', 'NCES_TUITION', 'AHETPI']}
        >
          <TerminalChart rows={assetRows} height={320} series={[
            { key: 'home', label: 'Median Home', color: C.gold },
            { key: 'sp', label: 'S&P 500 entry', color: C.blue },
            { key: 'gold', label: 'Gold/oz', color: C.orange },
            { key: 'tuition', label: 'College tuition', color: C.purple },
          ]} />
        </ChartCard>
        <ChartCard
          title="Consumer Goods in Hours of Labor (Indexed 1971 = 100)"
          sub="The honest counterargument — consumption deflation is real" tall
          sources={['BLS_FOOD', 'GAS_PRICE', 'AHETPI']}
        >
          <TerminalChart rows={consumerRows} height={320} series={[
            { key: 'eggs', label: 'Eggs/dozen (min)', color: C.teal },
            { key: 'gas', label: 'Gasoline/gal (min)', color: C.silver },
            { key: 'beef', label: 'Ground beef/lb (min)', color: C.red },
          ]} />
        </ChartCard>
      </div>

      <div className="fc">
        <h4>🔑 Core Finding: The Wealth Ladder is Inflating, Not Everything</h4>
        <p>
          Things that let you <strong>build and pass on wealth</strong> — a home, farmland, equities, gold —
          cost 2–8× more work hours than in 1971. Things you <strong>consume and replace</strong> — eggs,
          fuel, clothing — cost the same or less. This is Cantillon in action: asset holders see net worth
          expand while wage earners find the on-ramp to asset ownership steeper each decade.
        </p>
      </div>
      <div className="fc bear">
        <h4>⚖️ The Honest Counterargument</h4>
        <p>
          Eggs at 4 minutes vs. 8.7 in 1971 is real. Gasoline is flat. Electronics collapsed to near-zero
          hours of work. The standard of living for consumables has genuinely improved. The crisis is
          specifically <strong>asset access and wealth accumulation</strong>, not subsistence survival.
        </p>
      </div>
    </>
  )
}
