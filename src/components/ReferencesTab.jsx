import { useState } from 'react'
import { sources, UPCOMING_MODULE_IDS } from '../data/sourcesRegistry'
import { modules } from '../config/manifest'

// Auto-populated from sourcesRegistry usedIn fields — grouped by
// chart/module. No manual maintenance (per brief). Copy Citation
// per source + full CSV download.

function citation(s) {
  const fred = s.fredId ? ` FRED series ${s.fredId}.` : ''
  return `${s.label}.${fred} ${s.url}. Accessed June 2026.`
}

function CopyButton({ source }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(citation(source))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <button className={'rc-btn' + (copied ? ' copied' : '')} onClick={copy}>
      {copied ? '✓ Copied' : 'Copy Citation'}
    </button>
  )
}

function RefCard({ id, source }) {
  return (
    <div className="ref-card" key={id}>
      <div className="rc-main">
        <span className="rc-label">{source.label}</span>
        {source.fredId && <span className="si-fred">FRED: {source.fredId}</span>}
        <div className="rc-desc">{source.description}</div>
      </div>
      <div className="rc-actions">
        <CopyButton source={source} />
        <a href={source.url} target="_blank" rel="noopener noreferrer">
          <button className="rc-btn">Open ↗</button>
        </a>
      </div>
    </div>
  )
}

function downloadCsv() {
  const esc = (v) => '"' + String(v ?? '').replaceAll('"', '""') + '"'
  const header = 'Label,FRED ID,URL,Description,Used In'
  const lines = Object.entries(sources).map(([, s]) =>
    [s.label, s.fredId ?? '', s.url, s.description, (s.usedIn || []).join('; ')].map(esc).join(',')
  )
  const blob = new Blob([header + '\n' + lines.join('\n')], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'mhim-sources.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

export default function ReferencesTab() {
  const liveModules = modules.filter((m) => m.enabled !== false && m.id !== 'references')

  const byModule = (moduleId) =>
    Object.entries(sources).filter(([, s]) => s.usedIn?.includes(moduleId))

  const upcoming = Object.entries(sources).filter(([, s]) =>
    s.usedIn?.some((id) => UPCOMING_MODULE_IDS.includes(id)) &&
    !s.usedIn?.some((id) => liveModules.some((m) => m.id === id))
  )

  return (
    <>
      <div className="intro-card">
        <h2>References</h2>
        <p>
          Every data source used on this site, grouped by chart.{' '}
          <span className="hi">Auto-populated from the sources registry</span> — when a new chart module is
          added to the manifest, its sources appear here automatically.
        </p>
      </div>

      <div className="ref-toolbar">
        <button className="rc-btn" onClick={downloadCsv}>⬇ Download full list (CSV)</button>
      </div>

      {liveModules.map((m) => {
        const items = byModule(m.id)
        if (items.length === 0) return null
        return (
          <div className="ref-group" key={m.id}>
            <h3>{m.label}</h3>
            {items.map(([id, s]) => <RefCard key={id} id={id} source={s} />)}
          </div>
        )
      })}

      {upcoming.length > 0 && (
        <div className="ref-group upcoming">
          <h3>Upcoming modules (CPI Methodology · Wealth Share · Hours to Freedom)</h3>
          {upcoming.map(([id, s]) => <RefCard key={id} id={id} source={s} />)}
        </div>
      )}
    </>
  )
}
