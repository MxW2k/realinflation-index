import { useWage } from '../context/WageContext'
import {
  PRICES, YEARS, YR_LABELS, AS_OF, DIV_YIELD, GS10, CASE_SHILLER,
  capRateFor, passiveIncomeHours, retirementHours,
} from '../data/staticSeries'
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

function GroupIntro({ emoji, title, children }) {
  return (
    <div className="intro-card" style={{ marginTop: 26 }}>
      <h2>{emoji} {title}</h2>
      <p>{children}</p>
    </div>
  )
}

function PlaceholderCard({ title, sub, candidates }) {
  return (
    <div className="chart-card">
      <h3 style={{ color: 'var(--muted)' }}>{title}</h3>
      <div className="sub">{sub}</div>
      <div className="scaffold-note" style={{ minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        🚧 <strong>Placeholder — no defensible public data series yet.</strong>
        <span style={{ marginTop: 6 }}>Candidate sources under evaluation: {candidates}</span>
      </div>
    </div>
  )
}

// ── Group 1: Security — hours to fund $50K/yr passive income ──
function SecuritySection() {
  const { wages, medWage } = useWage()
  const fmt = (v) => Math.round(v).toLocaleString()

  const div = YR_LABELS.map((_, i) => passiveIncomeHours(DIV_YIELD[i], i, wages))
  const bond = YR_LABELS.map((_, i) => passiveIncomeHours(GS10[i], i, wages))
  const rental = YR_LABELS.map((_, i) => passiveIncomeHours(capRateFor(i), i, wages))

  const capToday = (yieldPct) => Math.round(50000 / (yieldPct / 100))

  return (
    <>
      <GroupIntro emoji="🛡️" title="Group 1: Security — Never Being Forced to Work">
        Hours of labor to fund <span className="hi">$50,000/yr of passive income</span> (2026 dollars,
        CPI-adjusted for history) through each vehicle. Capital required = income ÷ prevailing yield.
        Gross of taxes and expenses. Current datapoint uses your wage anchor.
      </GroupIntro>

      <div className="kn-row">
        <div className="kn gold"><div className="kl">Via S&P dividends today</div><div className="kv">${(capToday(DIV_YIELD[7]) / 1e6).toFixed(2)}M</div><div className="ks">{fmt(div[7])} hrs at your wage · 1.06% yield</div></div>
        <div className="kn grey"><div className="kl">Via 10-yr Treasury ladder</div><div className="kv">${(capToday(GS10[7]) / 1e6).toFixed(2)}M</div><div className="ks">{fmt(bond[7])} hrs · 4.48% yield</div></div>
        <div className="kn grey"><div className="kl">Via rental property</div><div className="kv">${(capToday(capRateFor(7)) / 1e6).toFixed(2)}M</div><div className="ks">{fmt(rental[7])} hrs · {capRateFor(7).toFixed(1)}% gross cap rate</div></div>
      </div>

      <ChartCard
        title="Hours of Labor to Fund $50K/yr Passive Income" titleColor={C.gold}
        sub="By vehicle — the dividend-yield collapse (3.10% → 1.06%) tripled the real capital required" tall
        sources={['DIV_YIELD', 'GS10_YIELD', 'CAP_RATE_INTERNAL', 'AHETPI']}
      >
        <TerminalChart rows={toRows(YEARS, { div, bond, rental })} height={320} series={[
          { key: 'div', label: 'S&P dividend income', color: C.gold },
          { key: 'bond', label: '10-yr Treasury ladder', color: C.blue },
          { key: 'rental', label: 'Rental property (gross cap rate)', color: C.teal },
        ]} />
      </ChartCard>

      <div className="fc" style={{ marginTop: 12 }}>
        <h4>🔑 The Yield Collapse Is Asset Inflation in Disguise</h4>
        <p>
          In 1971, replacing a salary with dividends took ~{fmt(div[0])} hours of median labor. Today it
          takes ~{fmt(50000 / (DIV_YIELD[7] / 100) / medWage)} at the median wage —
          not because dividends shrank, but because the <strong>price of yield</strong> tripled. Same
          freedom, three times the capital.
        </p>
      </div>
      <div className="fc bear">
        <h4>⚖️ The Honest Counterargument</h4>
        <p>
          The 2020 bond line (~{fmt(bond[5])} hrs at 0.89%) was the extreme, and it has already
          mean-reverted to ~{fmt(bond[7])} hrs at 4.48% — yields move both ways. Dividend yield also
          understates equity income: buybacks replaced dividends for tax reasons, so total shareholder
          yield is higher than 1.06%. And rental figures are gross — net of expenses the bar is higher
          than shown, which cuts the <em>other</em> way.
        </p>
      </div>
    </>
  )
}

// ── Group 2: Generational Transfer ──
function GenerationalSection() {
  const { wages } = useWage()
  // Case-Shiller starts 1987 → index both CS and wages to 1990 = 100
  const labels = YEARS.slice(2)
  const cs = CASE_SHILLER.slice(2).map((v) => Math.round((v / CASE_SHILLER[2]) * 100))
  const wageIdx = wages.slice(2).map((v) => Math.round((v / wages[2]) * 100))

  return (
    <>
      <GroupIntro emoji="🏛️" title="Group 2: Generational Transfer">
        Assets that move wealth across generations. Farmland is charted above; here,{' '}
        <span className="hi">same-home appreciation vs. wages</span> via Case-Shiller — a cleaner read
        than median sale price because it tracks repeat sales of the same homes.
      </GroupIntro>

      <div className="grid-2">
        <ChartCard
          title="Single-Family Home Appreciation vs. Wages (1990 = 100)" titleColor={C.purple}
          sub="Case-Shiller National repeat-sales index vs. nominal wage — series begins 1987"
          tall sources={['CASE_SHILLER_NAT', 'AHETPI']}
        >
          <TerminalChart rows={toRows(labels, { cs, wage: wageIdx })} height={320} series={[
            { key: 'cs', label: 'Case-Shiller National', color: C.purple, kind: 'area' },
            { key: 'wage', label: 'Nominal wage', color: C.teal, dashed: true },
          ]} />
        </ChartCard>
        <PlaceholderCard
          title="Small Business Acquisition Cost"
          sub="Cost to buy an income-producing business — SBA median sale multiples"
          candidates="BizBuySell quarterly Insight Reports, SBA 7(a) loan data, business-broker indices. None publish a consistent long-run series."
        />
      </div>

      <div className="fc info">
        <h4>📐 Why Two Housing Measures?</h4>
        <p>
          Median sale price (MSPUS, charted above) shifts with <em>which</em> homes sell; Case-Shiller
          tracks the <em>same</em> homes resold over time. From 1990 to 2026, Case-Shiller rose ~{cs[5] - 100}%
          while wages rose ~{wageIdx[5] - 100}%. The divergence is almost entirely post-2020 — before QE-era
          policy, same-home appreciation and wages tracked each other for three decades.
        </p>
      </div>
    </>
  )
}

// ── Group 3: Independence from the Financial System ──
function IndependenceSection() {
  const { userWage } = useWage()
  const fmt = (v) => Math.round(v).toLocaleString()
  return (
    <>
      <GroupIntro emoji="🌾" title="Group 3: Independence from the Financial System">
        Assets with <span className="hi">no counterparty</span> — nobody's promise, nobody's balance
        sheet. Gold and silver are charted above (spot as of {AS_OF}); the paid-off home is the same
        purchase charted above, reframed: once owned outright, shelter stops being a recurring claim on
        your labor.
      </GroupIntro>

      <div className="kn-row">
        <div className="kn gold"><div className="kl">Gold oz (no counterparty)</div><div className="kv">{(PRICES.gold[7] / userWage).toFixed(1)} hrs</div><div className="ks">${PRICES.gold[7].toLocaleString()} spot, {AS_OF}</div></div>
        <div className="kn grey"><div className="kl">Silver oz</div><div className="kv">{(PRICES.silver[7] / userWage).toFixed(1)} hrs</div><div className="ks">${PRICES.silver[7]} spot — up ~76% YoY</div></div>
        <div className="kn teal"><div className="kl">Paid-off median home</div><div className="kv">{fmt(PRICES.home[7] / userWage)} hrs</div><div className="ks">then ~{fmt((PRICES.rent[7] * 12) / userWage)} hrs/yr of rent never paid again</div></div>
      </div>

      <div className="grid-2">
        <div className="fc bear" style={{ marginBottom: 0 }}>
          <h4>⚖️ Both Sides of the Metals Coin</h4>
          <p>
            Silver doubled in dollar terms over the past year ($36 → $64) and touched $80 a month ago —
            holders gained, but that volatility is exactly why metals are a poor <em>unit of account</em>{' '}
            even when they're a good <em>store of value</em>. An independence allocation prices stability,
            not returns.
          </p>
        </div>
        <PlaceholderCard
          title="Water Rights / Mineral Rights"
          sub="Per-acre-foot water rights and royalty-acre mineral rights"
          candidates="State water-right auction records (CO, NV, CA), WestWater Research indices, mineral-rights brokerages. State-fragmented — no national series."
        />
      </div>
    </>
  )
}

// ── Group 4: Status / Social Mobility ──
function StatusSection() {
  const { wages } = useWage()
  const fmt = (v) => Math.round(v).toLocaleString()
  const retire = YR_LABELS.map((_, i) => retirementHours(i, wages))

  return (
    <>
      <GroupIntro emoji="🎓" title="Group 4: Status / Social Mobility Markers">
        The cost of <span className="hi">buying into the credential and retirement economy</span>.
        Tuition is charted on the Necessities tab (138 → 386 hrs/yr). Here: the "respectable retirement"
        — $60K/yr spending (2026 dollars) × 25, per the 4% rule — a series no institution publishes.
      </GroupIntro>

      <div className="grid-2">
        <ChartCard
          title='"Respectable Retirement" — Hours of Median Labor' titleColor={C.orange}
          sub="$1.5M-equivalent portfolio target (CPI-adjusted), ÷ wage. Current datapoint at your wage anchor."
          tall sources={['RETIREMENT_CALC', 'AHETPI']}
        >
          <TerminalChart rows={toRows(YEARS, { retire })} height={320} legend={false} series={[
            { key: 'retire', label: 'Hours to retirement target', color: C.orange, kind: 'area' },
          ]} />
        </ChartCard>
        <PlaceholderCard
          title="Starter Business Acquisition"
          sub="Entry cost to small-business ownership (multiples of earnings)"
          candidates="Same as Group 2 — BizBuySell/SBA multiples. Listed separately because the brief treats entry-level acquisition as a mobility marker, not just a transfer asset."
        />
      </div>

      <div className="fc bear">
        <h4>⚖️ The Surprising Honest Finding: The Target Is Flat — The Path Isn't</h4>
        <p>
          A CPI-indexed retirement target has cost roughly <strong>{fmt(Math.min(...retire))}–{fmt(Math.max(...retire.filter(Number.isFinite)))} hours</strong>{' '}
          of median labor for five decades — because wages tracked CPI. The catch is the <em>path</em>:
          you accumulate those dollars by buying the assets in Group 1, whose price per unit of yield
          tripled. The destination held still; the road to it got three times longer. That's the
          difference between measuring consumption and measuring accumulation.
        </p>
      </div>
    </>
  )
}

export default function Tier1AssetsTab() {
  const { hoursArr } = useWage()

  const homeRows = toRows(YEARS, { home: hoursArr('home') })
  const farmRows = toRows(YEARS, { farm: hoursArr('farm') })
  const spRows = toRows(YEARS, { sp: hoursArr('sp500') })
  const metalRows = toRows(YEARS, { gold: hoursArr('gold'), silver: hoursArr('silver') })

  return (
    <>
      <div className="intro-card">
        <h2>Tier 1: Intergenerational Assets</h2>
        <p>
          The items that <span className="hi">preserve purchasing power across generations</span>. Current
          datapoint recalculates at your wage anchor. Below the core four: the expanded taxonomy, grouped
          by <span className="hi">what people actually want</span> — security, transfer, independence,
          mobility. Metals spot as of {AS_OF}.
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
          sub={`Annual avg price ÷ hourly wage · 2026 = spot as of ${AS_OF}`}
          sources={['GOLD', 'SILVER_LBMA', 'METALS_SPOT_2026', 'AHETPI']}>
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

      <SecuritySection />
      <GenerationalSection />
      <IndependenceSection />
      <StatusSection />
    </>
  )
}
