import { useWage } from '../context/WageContext'
import { YEARS } from '../data/staticSeries'
import { TerminalChart, ChartCard, C, toRows } from './charts/primitives'

export default function Tier3DiscretionaryTab() {
  const { hoursArr } = useWage()

  const carRows = toRows(YEARS, { car: hoursArr('car') })
  const elecRows = toRows(YEARS, { elec: hoursArr('elec') })

  return (
    <>
      <div className="intro-card">
        <h2>Tier 3: Discretionary Consumption — The Honest Counterargument</h2>
        <p>
          Data that <span className="hi">cuts against the thesis</span>. Required by intellectual honesty.
          Electronics and apparel are genuinely cheaper in hours-worked terms.
        </p>
      </div>

      <div className="grid-2">
        <ChartCard title="New Car — Hours of Labor" titleColor={C.blue}
          sub="Average transaction price ÷ wage" tall sources={['CAR_PRICE', 'AHETPI']}>
          <TerminalChart rows={carRows} height={320} series={[
            { key: 'car', label: 'Hours to buy avg new car', color: C.blue, kind: 'bar' },
          ]} />
        </ChartCard>
        <ChartCard title="Electronics — Hours (Declining)" titleColor={C.silver}
          sub="Approximate hours for equivalent TV / computing device" tall sources={['ELECTRONICS_PROXY', 'AHETPI']}>
          <TerminalChart rows={elecRows} height={320} series={[
            { key: 'elec', label: 'Hours for equiv. TV/electronics', color: C.silver, kind: 'area' },
          ]} />
        </ChartCard>
      </div>

      <div className="fc info">
        <h4>🚗 New Cars: More Expensive, But Genuinely Better</h4>
        <p>
          964 hours in 1971 → ~1,609 today (+67%). This is where hedonic argument has <em>most</em> merit —
          airbags, ABS, 200k+ mile longevity vs. 100k. A fair-minded analysis acknowledges this while noting
          the trend is still upward.
        </p>
      </div>
      <div className="fc info">
        <h4>📱 Electronics: Genuine Productivity Deflation</h4>
        <p>
          A color TV cost ~250 hours in 1971. A 65" 4K TV today costs ~8 hours. A smartphone costs ~35 hours.
          This deflation is real and should not be dismissed — but you cannot live in a cheap TV. The
          categories that deflated are the ones that don't determine your economic trajectory.
        </p>
      </div>
      <div className="fc">
        <h4>📐 The CPI Weighting Problem</h4>
        <p>
          CPI weights electronics at ~4–5% and shelter at ~33%. The categories that deflated receive low
          weights. The categories most distorted (healthcare premiums, asset prices excluded entirely)
          receive inadequate weight. Not conspiracy — it reflects CPI's design goal of measuring{' '}
          <em>consumption</em> price inflation, not cost-of-life inflation.
        </p>
      </div>
    </>
  )
}
