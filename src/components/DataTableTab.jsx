import { useWage } from '../context/WageContext'
import { PRICES } from '../data/staticSeries'

const YL = ['1971', '1980', '1990', '2000', '2010', '2020', '2025', '→ Now']

function PriceRow({ name, k, decimals = 0 }) {
  const { wages } = useWage()
  const prices = PRICES[k]
  const hrs = prices.map((p, i) => p / wages[i])
  const pctChg = ((hrs[7] - hrs[0]) / hrs[0]) * 100
  const cls = pctChg > 0 ? 'tr' : 'tg'
  return (
    <tr>
      <td>{name}</td>
      {prices.map((p, i) => {
        const pStr = decimals === 0 ? '$' + p.toLocaleString() : p.toFixed(2)
        const hStr = hrs[i] < 1 ? (hrs[i] * 60).toFixed(1) + 'm' : hrs[i].toFixed(1) + 'h'
        return (
          <td key={i}>
            {pStr}
            <br />
            <small style={{ color: 'var(--muted)' }}>{hStr}</small>
          </td>
        )
      })}
      <td className={cls}>{(pctChg > 0 ? '+' : '') + pctChg.toFixed(0)}%</td>
    </tr>
  )
}

function TierTable({ title, rows, sourcesText }) {
  return (
    <div className="chart-card" style={{ marginBottom: 18 }}>
      <h3 style={{ marginBottom: 12 }}>{title}</h3>
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              {YL.map((y) => <th key={y}>{y}</th>)}
              <th>Hrs Δ</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <div className="src">Sources: {sourcesText}</div>
    </div>
  )
}

export default function DataTableTab() {
  const { userWage } = useWage()
  return (
    <>
      <div className="intro-card">
        <h2>Full Data Table</h2>
        <p>
          Raw data for all categories.{' '}
          <span className="hi">Current period hours recalculate at your wage anchor.</span>
        </p>
      </div>

      <div className="chart-card" style={{ marginBottom: 18 }}>
        <h3 style={{ marginBottom: 12 }}>Wage Anchor History (AHETPI)</h3>
        <div className="tbl-wrap">
          <table>
            <tbody>
              <tr>
                <th>Year</th><th>1971</th><th>1980</th><th>1990</th><th>2000</th>
                <th>2010</th><th>2020</th><th>2025</th><th>2026 (you)</th>
              </tr>
              <tr>
                <td>Avg Hourly Wage</td><td>$3.63</td><td>$6.85</td><td>$10.18</td><td>$14.00</td>
                <td>$19.06</td><td>$24.36</td><td>$31.83</td><td>${userWage.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <TierTable
        title="Tier 1: Assets — Nominal Price & Hours of Labor"
        sourcesText="FRED MSPUS, USDA ERS, MetalCharts/LBMA, Multpl/S&P Global"
        rows={
          <>
            <PriceRow name="Median Home" k="home" />
            <PriceRow name="Farmland/acre" k="farm" />
            <PriceRow name="Gold/oz" k="gold" />
            <PriceRow name="Silver/oz" k="silver" decimals={2} />
          </>
        }
      />
      <TierTable
        title="Tier 2: Necessities — Nominal Price & Hours of Labor"
        sourcesText="KFF EHBS, BLS Avg Price series (FRED), NCES/College Board, Census HVS, EIA"
        rows={
          <>
            <PriceRow name="College tuition/yr" k="tuition" />
            <PriceRow name="Family health premium/yr" k="health" />
            <PriceRow name="Monthly rent" k="rent" />
            <PriceRow name="Eggs/dozen" k="eggs" decimals={2} />
            <PriceRow name="Gasoline/gal" k="gas" decimals={2} />
            <PriceRow name="Ground beef/lb" k="beef" decimals={2} />
          </>
        }
      />
      <TierTable
        title="Tier 3: Discretionary — Hours of Labor"
        sourcesText="NADA/KBB, BLS CPI Electronics, historical retail pricing"
        rows={
          <>
            <PriceRow name="New car (avg)" k="car" />
            <PriceRow name="TV/electronics equiv." k="elec" />
          </>
        }
      />
    </>
  )
}
