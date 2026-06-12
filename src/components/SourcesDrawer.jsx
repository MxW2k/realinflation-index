import { sources } from '../data/sourcesRegistry'

// Inline citation drawer — renders below a chart when "Sources ↗"
// is clicked. Shows each series, its FRED ID, direct link, and
// methodology caveat (per brief).
export default function SourcesDrawer({ sourceIds }) {
  const items = sourceIds.map((id) => ({ id, ...sources[id] })).filter((s) => s.label)
  return (
    <div className="src-drawer">
      {items.map((s) => (
        <div className="src-item" key={s.id}>
          <span className="si-label">{s.label}</span>
          {s.fredId && <span className="si-fred">FRED: {s.fredId}</span>}
          <div className="si-desc">{s.description}</div>
          <a href={s.url} target="_blank" rel="noopener noreferrer">
            {s.url} ↗
          </a>
        </div>
      ))}
    </div>
  )
}
