// ═══════════════════════════════════════════════════════════════
// SCAFFOLD ONLY — per brief, session 3-4 work. No data filled.
// Core metric: Hours In ÷ Hours of Freedom Out — how many hours of
// median labor to buy one hour of permanent freedom from labor.
//
// Planned charts:
//   1. Productivity vs Hours-to-Freedom Index (1971=100) — OPHNFB
//      vs hours to fund a freedom-threshold portfolio at median wage
//   2. The Ratio — single number, hours in / hours of freedom out
//   3. Freedom Cost by Asset Vehicle (dividends / rental / bonds /
//      paid-off home), hours required at 1971/1990/2010/2026
//   4. The Productivity Betrayal — productivity +400% vs actual
//      hours-to-freedom change; gap = extracted value
//
// Data sources (to wire via fredApi.js): OPHNFB, LES1252881600Q,
// GS10, DJDIVYR, MSPUS, CDC life expectancy at 65 (manual).
// ═══════════════════════════════════════════════════════════════
import { useState } from 'react'
import { useWage } from '../context/WageContext'

export const FREEDOM_VEHICLES = [
  { id: 'dividends', label: 'S&P dividend income' },
  { id: 'rental', label: 'Rental property cash flow' },
  { id: 'bonds', label: 'Treasury ladder' },
  { id: 'home', label: 'Paid-off median home' },
]

export default function HoursToFreedomTab() {
  // State structure per brief — vehicle toggle + wage anchor integration
  const [vehicle, setVehicle] = useState('dividends')
  const { userWage } = useWage()

  // TODO (session 3-4): theRatio = hoursIn / hoursOut, where
  //   hoursIn  = (freedomThreshold$ / medianAnnualWage) * 2080
  //   hoursOut = remaining life expectancy at median retirement age, in hours
  const theRatio = null // not calculated yet — do not fill data

  return (
    <>
      <div className="intro-card">
        <h2>Hours to Freedom</h2>
        <p>
          How many hours of your labor does it take to buy one hour where you don't have to labor? No
          institution publishes this metric.
        </p>
      </div>

      <div className="scaffold-note">
        🚧 <strong>Scaffolded — data wiring planned for a future session.</strong> Components below show the
        intended structure: The Ratio headline, freedom-vehicle toggle ({FREEDOM_VEHICLES.length} vehicles,
        currently "{FREEDOM_VEHICLES.find((v) => v.id === vehicle)?.label}"), Productivity vs
        Hours-to-Freedom chart, vehicle comparison, and the Productivity Betrayal chart. Wage anchor
        (${userWage.toFixed(2)}/hr) will personalize all calculations.
      </div>

      <div className="kn-row">
        <div className="kn gold">
          <div className="kl">The Ratio — 2026</div>
          <div className="kv">{theRatio ?? '—'}</div>
          <div className="ks">hours of labor per hour of permanent freedom</div>
        </div>
      </div>

      <div className="preset-row">
        {FREEDOM_VEHICLES.map((v) => (
          <button
            key={v.id}
            className={'wb-btn' + (vehicle === v.id ? ' active' : '')}
            onClick={() => setVehicle(v.id)}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="grid-2">
        <div className="chart-card">
          <h3>Chart 1: Productivity vs Hours-to-Freedom (1971 = 100)</h3>
          <div className="sub">FRED OPHNFB vs freedom-threshold hours — divergence = Cantillon extraction</div>
          <div className="cw scaffold-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pending data</div>
        </div>
        <div className="chart-card">
          <h3>Chart 3: Freedom Cost by Asset Vehicle</h3>
          <div className="sub">Hours of median labor to fund each vehicle — 1971 / 1990 / 2010 / 2026</div>
          <div className="cw scaffold-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pending data</div>
        </div>
      </div>
      <div className="chart-card">
        <h3>Chart 4: The Productivity Betrayal</h3>
        <div className="sub">Productivity +~400% since 1971 — if captured by workers, hours-to-freedom should be −75%</div>
        <div className="cw scaffold-note" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Pending data</div>
      </div>
    </>
  )
}
