// Folded-in from purchasing_power_gold_analysis.html — wages vs.
// housing vs. gold purchasing power, 1970–2026 (decade series).
// NOTE: this module uses its own fixed decade dataset (1970 base,
// median *annual* wages) and intentionally does NOT recalculate at
// the wage anchor — it predates the hours-of-labor standard.
import { GOLD_PAGE } from '../data/staticSeries'
import { TerminalChart, ChartCard, C, toRows } from './charts/primitives'

const { years, gold, wages, homes, sp500 } = GOLD_PAGE
const hourlyWage = wages.map((w) => w / 2080)
const hrsForGold = gold.map((g, i) => +(g / hourlyWage[i]).toFixed(1))
const salaryInGold = gold.map((g, i) => +(wages[i] / g).toFixed(1))
const homeInGold = gold.map((g, i) => +(homes[i] / g).toFixed(0))
const homeWageRatio = wages.map((w, i) => +(homes[i] / w).toFixed(2))
const sp500Idx = sp500.map((v) => +((v / sp500[0]) * 100).toFixed(1))
const goldIdx = gold.map((v) => +((v / gold[0]) * 100).toFixed(1))

const kpis = [
  { lbl: 'Gold (May 2026)', val: '$4,501', sub: 'per troy oz', chg: '+35.7% vs. 1 yr ago', cls: 'up' },
  { lbl: 'Median Weekly Wage', val: '$1,235', sub: 'Q1 2026 (BLS)', chg: '+3.4% YoY', cls: 'dn' },
  { lbl: 'Median Home Price', val: '$403,200', sub: 'Q1 2026 (Census)', chg: '−4.7% vs. Q1 2025', cls: 'up' },
  { lbl: 'Hours to Buy 1 oz Gold', val: '146 hrs', sub: 'vs. 12 hrs in 1970', chg: '12× harder', cls: 'up' },
  { lbl: 'Home Cost in Gold', val: '90 oz', sub: 'vs. 639 oz in 1970', chg: '86% cheaper in gold', cls: 'dn' },
  { lbl: 'Annual Salary in Gold', val: '14.3 oz', sub: 'vs. 172 oz in 1970', chg: '92% collapse', cls: 'up' },
]

const hoursCellColors = hrsForGold.map((h) => (h > 100 ? C.red : h > 50 ? '#fbbf24' : C.green))

export default function GoldAnalysisTab() {
  return (
    <>
      <div className="intro-card">
        <h2>Wages · Housing · Gold — Purchasing Power 1970–2026</h2>
        <p>
          How many hours must a median worker work to buy a home, an ounce of gold, or basic assets?{' '}
          <span className="hi">Fixed decade dataset (1970 base, median annual wages)</span> — does not
          recalculate at the wage anchor.
        </p>
      </div>

      <div className="stat-grid">
        {kpis.map((k) => (
          <div className="sc" key={k.lbl}>
            <div className="lbl">{k.lbl}</div>
            <div className="val">{k.val}</div>
            <div className="chg nt">{k.sub}</div>
            <div className={'chg ' + k.cls}>{k.chg}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <ChartCard title="Hours of Median Work to Buy 1 Troy Oz of Gold"
          sub="Gold spot price ÷ median hourly wage — higher bar = less purchasing power" tall
          sources={['USAGOLD_HIST', 'BLS_WEEKLY_EARNINGS']}>
          <TerminalChart rows={toRows(years, { hrs: hrsForGold })} height={320} legend={false} series={[
            { key: 'hrs', label: 'Hours per 1 oz gold', color: C.gold, kind: 'bar', cellColors: hoursCellColors },
          ]} />
        </ChartCard>
        <ChartCard title="Median Annual Salary in Troy Ounces of Gold"
          sub="Annual salary ÷ gold spot price" tall
          sources={['USAGOLD_HIST', 'BLS_WEEKLY_EARNINGS']}>
          <TerminalChart rows={toRows(years, { oz: salaryInGold })} height={320} legend={false} series={[
            { key: 'oz', label: 'Salary in gold (oz)', color: C.gold, kind: 'bar' },
          ]} />
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="Median Home Price in Troy Ounces of Gold"
          sub="Home price ÷ gold price — homes are now far cheaper in gold terms than 1970" tall
          sources={['CENSUS_NEW_HOMES', 'USAGOLD_HIST', 'MEDIAN_HOME']}>
          <TerminalChart rows={toRows(years, { oz: homeInGold })} height={320} legend={false} series={[
            { key: 'oz', label: 'Home in gold (oz)', color: '#22d3ee', kind: 'area' },
          ]} />
        </ChartCard>
        <ChartCard title="Median Home Price as Multiple of Median Annual Wage"
          sub="Years of full median income to buy a median home — before taxes or financing" tall
          sources={['CENSUS_NEW_HOMES', 'BLS_WEEKLY_EARNINGS']}>
          <TerminalChart rows={toRows(years, { ratio: homeWageRatio })} height={320} legend={false} series={[
            { key: 'ratio', label: 'Home / annual wage', color: C.red, kind: 'area' },
          ]} />
        </ChartCard>
      </div>

      <ChartCard title="S&P 500 vs. Gold — Indexed to 1970 = 100"
        sub="Price-only comparison (no dividends — would favor S&P significantly)" tall
        sources={['SP500', 'USAGOLD_HIST']} style={{ marginBottom: 20 }}>
        <TerminalChart rows={toRows(years, { sp: sp500Idx, gold: goldIdx })} height={320} series={[
          { key: 'sp', label: 'S&P 500 (price only, 1970=100)', color: C.blue, kind: 'area' },
          { key: 'gold', label: 'Gold (1970=100)', color: C.gold, dashed: true },
        ]} />
      </ChartCard>

      <div className="fc">
        <h4>🔑 Key Insight</h4>
        <p>
          In 1970 a median worker needed <strong>~12 hours</strong> to afford 1 oz of gold. By Q1 2026 that
          figure is <strong>~146 hours</strong> — a 12× deterioration in gold-denominated purchasing power.
          The biggest jumps occurred during 1978–80 (inflation + gold surge) and 2020–26 (monetary expansion
          + commodity rally).
        </p>
      </div>
      <div className="fc bear">
        <h4>⚖️ The Contrarian View — Both Sides of the Coin</h4>
        <p>
          A median US home cost <strong>639 oz of gold in 1970</strong> and costs only <strong>~90 oz
          today</strong> — in gold terms, housing got 86% <em>cheaper</em>. The problem isn't that housing got
          expensive; it's that <em>the dollar got cheap</em>. And gold cuts both ways: in 2000 a median salary
          bought 118 oz — nearly as good as 1970 — because gold was depressed. The real affordability crisis
          is a <strong>wage-to-gold</strong> problem, not a housing-to-gold problem.
        </p>
      </div>
      <div className="fc info">
        <h4>📈 The Real vs. Nominal Tension</h4>
        <p>
          The S&P 500 rose ~8,000% since 1970 (price only); gold ~12,400%. With dividends reinvested,
          equities would substantially outperform gold. But gold's outperformance since 2000 reflects
          declining confidence in fiat currency — and a CAPE near ~35× suggests equities may be pricing in
          continued dollar depreciation, making gold's strength partly self-confirming.
        </p>
      </div>

      <div className="fc info">
        <h4>📋 Raw Data — All Metrics by Decade</h4>
        <div className="tbl-wrap" style={{ marginTop: 8 }}>
          <table>
            <thead>
              <tr>
                <th>Year</th><th>Gold ($/oz)</th><th>Median Annual Wage</th><th>Median Home</th>
                <th>S&P 500</th><th>Hrs/oz Gold</th><th>Salary in Gold (oz)</th>
                <th>Home in Gold (oz)</th><th>Home/Wage</th>
              </tr>
            </thead>
            <tbody>
              {years.map((y, i) => (
                <tr key={y}>
                  <td>{y}{y === '2026' ? '*' : ''}</td>
                  <td>${gold[i].toLocaleString()}</td>
                  <td>${wages[i].toLocaleString()}</td>
                  <td>${homes[i].toLocaleString()}</td>
                  <td>{sp500[i].toLocaleString()}</td>
                  <td>{hrsForGold[i]}</td>
                  <td>{salaryInGold[i]}</td>
                  <td>{homeInGold[i]}</td>
                  <td>{homeWageRatio[i]}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.72rem', marginTop: 8 }}>
          * 2026: Gold = May 28 spot; Wage = Q1 2026 BLS; Home = Q1 2026 Census; S&P = May 26 close. Wages
          pre-2000 use Census/CPS median family income proxies. Gold 1980 uses year-average (~$615), not the
          Jan 1980 spike (~$850).
        </p>
      </div>
    </>
  )
}
