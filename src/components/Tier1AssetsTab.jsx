import { useWage } from '../context/WageContext'
import { PRICES, YR_LABELS } from '../data/staticSeries'
import { TerminalChart, ChartCard, C, toRows } from './charts/primitives'

function AssetStats() {
  const { userWage: w } = useWage()
  const rows = [
    ['Home 1971', '6,948 hrs', null],
    ['Home now', (PRICES.home[7] / w).toFixed(0) + ' hrs', 'up'],
    ['Farm/ac 1971', '56 hrs', null],
    ['Farm/ac now', (PRICES.farm[7] / w).toFixed(0) + ' hrs', 'up'],
    ['S&P 1971', '25.8 hrs', null],
    ['S&P now', (PRICES.sp500[7] / w).toFixed(1) + ' hrs', 'up'],
    ['Gold 1971', '11.3 hrs', null],
    ['Gold now', (PRICES.gold[7] / w).toFixed(1) + ' hrs', 'up'],
  ]
  return (
    <div className="stat-grid">
      {rows.map(([lbl, val, cls]) => (
        <div className="sc" key={lbl}>
          <div className="lbl">{lbl}</div>
          <div className={'val ' + (cls || 'nt')}>{val}</div>
        </div>
      ))}
    </div>
  )
}

export default function Tier1AssetsTab() {
  const { hoursArr } = useWage()

  const homeRows = toRows(YR_LABELS, { home: hoursArr('home') })
  const farmRows = toRows(YR_LABELS, { farm: hoursArr('farm') })
  const spRows = toRows(YR_LABELS, { sp: hoursArr('sp500') })
  const metalRows = toRows(YR_LABELS, { gold: hoursArr('gold'), silver: hoursArr('silver') })

  return (
    <>
      <div className="intro-card">
        <h2>Tier 1: Intergenerational Assets</h2>
        <p>
          The items that <span className="hi">preserve purchasing power across generations</span>. Current
          datapoint recalculates at your wage anchor.
        </p>
      </div>

      <div className="grid-2">
        <ChartCard title="Median Home — Hours of Labor" titleColor={C.gold}
          sub="Median US home price ÷ hourly wage" tall sources={['MEDIAN_HOME', 'AHETPI']}>
          <TerminalChart rows={homeRows} height={320} series={[
            { key: 'home', label: 'Hours to buy median home', color: C.gold, kind: 'bar' },
          ]} />
        </ChartCard>
        <ChartCard title="Farmland per Acre — Hours of Labor" titleColor={C.teal}
          sub="USDA avg cropland value ÷ hourly wage" tall sources={['USDA_FARMLAND', 'AHETPI']}>
          <TerminalChart rows={farmRows} height={320} series={[
            { key: 'farm', label: 'Hours per acre', color: C.teal, kind: 'bar' },
          ]} />
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="S&P 500 — Hours per Index Unit" titleColor={C.blue}
          sub="Hours to buy 1 unit of the S&P 500" sources={['SP500', 'AHETPI']}>
          <TerminalChart rows={spRows} height={250} series={[
            { key: 'sp', label: 'Hours per S&P unit', color: C.blue, kind: 'area' },
          ]} />
        </ChartCard>
        <ChartCard title="Gold & Silver — Hours per Ounce" titleColor={C.gold}
          sub="Annual avg price ÷ hourly wage" sources={['GOLD', 'SILVER_LBMA', 'AHETPI']}>
          <TerminalChart rows={metalRows} height={250}
            leftLabel="Gold (hrs)" leftLabelColor={C.gold}
            rightLabel="Silver (hrs)" rightLabelColor={C.silver}
            series={[
              { key: 'gold', label: 'Gold/oz (hrs)', color: C.gold },
              { key: 'silver', label: 'Silver/oz (hrs)', color: C.silver, axis: 'right' },
            ]} />
        </ChartCard>
      </div>

      <AssetStats />

      <div className="fc">
        <h4>🏠 Housing: The Intergenerational Trap</h4>
        <p>
          A 1971 worker needed ~3.4 years of gross income for the median home. In 2026 at median wage it's
          ~6.7 years. <strong>At your current wage anchor</strong>, see the "Your Position" panel on Overview
          for your personal ratio.
        </p>
      </div>
      <div className="fc bear">
        <h4>⚖️ The Honest Housing Counterargument</h4>
        <p>
          The 2000–2010 data shows home prices in hours-of-labor were <em>falling</em> — the 2008 crash
          briefly made housing more accessible. The post-2020 spike is largely monetary (QE → asset
          inflation) not structural. If real rates stay elevated, mean reversion is possible. The trend is
          real; it's not perfectly monotonic.
        </p>
      </div>
    </>
  )
}
