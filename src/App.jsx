import { useState } from 'react'
import { WageProvider } from './context/WageContext'
import { modules } from './config/manifest'
import WageAnchorBar from './components/WageAnchorBar'
import OverviewTab from './components/OverviewTab'
import Tier1AssetsTab from './components/Tier1AssetsTab'
import Tier2NecessitiesTab from './components/Tier2NecessitiesTab'
import Tier3DiscretionaryTab from './components/Tier3DiscretionaryTab'
import MHIMvsCPITab from './components/MHIMvsCPITab'
import GoldAnalysisTab from './components/GoldAnalysisTab'
import CPIMethodologyTab from './components/CPIMethodologyTab'
import DataTableTab from './components/DataTableTab'
import ReferencesTab from './components/ReferencesTab'
import HoursToFreedomTab from './components/HoursToFreedomTab'

// Drop-in architecture: the manifest controls what loads and in what
// order. Register new components here once, add a manifest entry, done.
const COMPONENTS = {
  OverviewTab,
  Tier1AssetsTab,
  Tier2NecessitiesTab,
  Tier3DiscretionaryTab,
  MHIMvsCPITab,
  CPIMethodologyTab,
  GoldAnalysisTab,
  DataTableTab,
  ReferencesTab,
  HoursToFreedomTab,
}

export default function App() {
  const enabled = modules.filter((m) => m.enabled !== false && COMPONENTS[m.component])
  const [activeId, setActiveId] = useState(enabled[0]?.id)

  return (
    <WageProvider>
      <header>
        <div>
          <h1>📊 Matt's Honest Inflation Index</h1>
          <p>Hours-of-Labor Standard · 1971 → 2026 · Full Bifurcation Analysis</p>
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'right' }}>
          Data: BLS · FRED · USDA · KFF · LBMA · S&P Global
        </div>
      </header>

      <WageAnchorBar />

      <nav>
        {enabled.map((m) => (
          <button
            key={m.id}
            className={activeId === m.id ? 'active' : ''}
            onClick={() => setActiveId(m.id)}
          >
            {m.label}
          </button>
        ))}
      </nav>

      {enabled.map((m) => {
        const Component = COMPONENTS[m.component]
        return (
          <div key={m.id} className={'tab' + (activeId === m.id ? ' active' : '')}>
            {activeId === m.id && <Component moduleId={m.id} />}
          </div>
        )
      })}
    </WageProvider>
  )
}
