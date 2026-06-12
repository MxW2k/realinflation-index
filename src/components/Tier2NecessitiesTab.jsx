import { useWage } from '../context/WageContext'
import { YR_LABELS } from '../data/staticSeries'
import { TerminalChart, ChartCard, C, toRows } from './charts/primitives'

export default function Tier2NecessitiesTab() {
  const { hoursArr, minsArr } = useWage()

  const tuitionRows = toRows(YR_LABELS, { tuition: hoursArr('tuition') })
  const healthRows = toRows(YR_LABELS, { health: hoursArr('health') })
  const foodRows = toRows(YR_LABELS, { eggs: minsArr('eggs'), beef: minsArr('beef') })
  const gasRentRows = toRows(YR_LABELS, { gas: minsArr('gas'), rent: hoursArr('rent') })

  return (
    <>
      <div className="intro-card">
        <h2>Tier 2: Non-Discretionary Necessities</h2>
        <p>
          Items you <span className="hi">cannot meaningfully substitute away from</span>. No hedonic
          adjustments applied. Current datapoint at your wage anchor.
        </p>
      </div>

      <div className="grid-2">
        <ChartCard title="College Tuition — Hours per Year" titleColor={C.orange}
          sub="4-year public university annual tuition ÷ wage" tall sources={['NCES_TUITION', 'AHETPI']}>
          <TerminalChart rows={tuitionRows} height={320} series={[
            { key: 'tuition', label: 'Hours of work per academic year', color: C.orange, kind: 'area' },
          ]} />
        </ChartCard>
        <ChartCard title="Family Health Insurance — Hours per Year" titleColor={C.purple}
          sub="KFF employer-sponsored annual family premium ÷ wage" tall sources={['KFF_PREMIUMS', 'CPI_HEALTH_METHOD', 'AHETPI']}>
          <TerminalChart rows={healthRows} height={320} series={[
            { key: 'health', label: 'Hours of work for family premium', color: C.purple, kind: 'bar' },
          ]} />
        </ChartCard>
      </div>

      <div className="grid-2">
        <ChartCard title="Food Staples — Minutes of Labor"
          sub="Eggs (dozen) & Ground Beef (lb)" sources={['BLS_FOOD', 'AHETPI']}>
          <TerminalChart rows={foodRows} height={250} series={[
            { key: 'eggs', label: 'Eggs/dozen (min)', color: C.teal },
            { key: 'beef', label: 'Ground beef/lb (min)', color: C.red },
          ]} />
        </ChartCard>
        <ChartCard title="Gasoline & Monthly Rent — Labor"
          sub="Gas in minutes / Rent in hours" sources={['GAS_PRICE', 'CENSUS_RENT', 'AHETPI']}>
          <TerminalChart rows={gasRentRows} height={250}
            leftLabel="Gas (min)" leftLabelColor={C.silver}
            rightLabel="Rent (hrs)" rightLabelColor={C.blue}
            series={[
              { key: 'gas', label: 'Gas/gal (min)', color: C.silver },
              { key: 'rent', label: 'Monthly rent (hrs)', color: C.blue, axis: 'right' },
            ]} />
        </ChartCard>
      </div>

      <div className="fc">
        <h4>🎓 Education: The Financialized Credentialing Tax</h4>
        <p>
          138 hours of work per year in 1971 → 386 today. Federal loan guarantees removed price discipline;
          institutions raised prices knowing financing was available. <strong>Cantillon inside academia:</strong>{' '}
          money flows to the institution, not the student's wage value.
        </p>
      </div>
      <div className="fc bear">
        <h4>⚖️ Food Is the Honest Counterargument</h4>
        <p>
          Eggs are 52% cheaper in work-minutes. Gasoline is flat. Ground beef is mixed. The CPI is actually{' '}
          <em>honest about food</em>. It's dishonest about shelter (OER), healthcare (premium methodology),
          and education (treated as discretionary).
        </p>
      </div>
    </>
  )
}
