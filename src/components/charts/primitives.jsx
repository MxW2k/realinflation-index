// Shared Recharts primitives — dark terminal theme matching the
// original Chart.js styling (similar, intentionally not identical).
import { useState } from 'react'
import {
  ResponsiveContainer, ComposedChart, Line, Area, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts'
import SourcesDrawer from '../SourcesDrawer'

export const C = {
  gold: '#d4a843', silver: '#9ca3af', blue: '#58a6ff', green: '#3fb950',
  red: '#f85149', orange: '#f0883e', purple: '#bc8cff', teal: '#39d353',
  muted: '#8b949e',
}

const GRID = '#21262d'
const AXIS = '#30363d'
const TICK = { fill: '#8b949e', fontSize: 10 }

// Zip parallel arrays into Recharts row objects: toRows(labels, {home:[...], gold:[...]})
export function toRows(labels, seriesMap) {
  return labels.map((label, i) => {
    const row = { x: label }
    for (const [key, arr] of Object.entries(seriesMap)) row[key] = arr[i]
    return row
  })
}

const fmt = (v) =>
  typeof v === 'number'
    ? v.toLocaleString(undefined, { maximumFractionDigits: 1 })
    : v

/**
 * TerminalChart — one chart component for every chart on the site.
 * series: [{ key, label, color, kind: 'line'|'area'|'bar', dashed,
 *            width, dot, axis: 'left'|'right', cellColors }]
 */
export function TerminalChart({
  rows, series, height = 250,
  leftLabel, leftLabelColor, rightLabel, rightLabelColor,
  legend = true, xTicks, logY = false,
}) {
  const hasRight = series.some((s) => s.axis === 'right')
  // Numeric x values → time-proportional axis: 1971→1980 spans 9× the
  // width of 2025→2026, instead of every label getting an equal slot.
  const numericX = typeof rows[0]?.x === 'number'
  const ticks = numericX ? (xTicks ?? rows.map((r) => r.x)) : undefined
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={rows} margin={{ top: 6, right: 14, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID} vertical={false} />
        <XAxis
          dataKey="x" tick={TICK} stroke={AXIS} tickLine={false}
          {...(numericX && {
            type: 'number',
            scale: 'linear',
            domain: ['dataMin', 'dataMax'],
            ticks,
            allowDecimals: false,
            tickFormatter: (v) => String(v),
          })}
        />
        <YAxis
          yAxisId="left" tick={TICK} stroke={AXIS} tickLine={false} width={52}
          tickFormatter={fmt}
          scale={logY ? 'log' : 'auto'} domain={logY ? ['auto', 'auto'] : undefined} allowDataOverflow={logY}
          label={leftLabel ? { value: leftLabel, angle: -90, position: 'insideLeft', fill: leftLabelColor || '#8b949e', fontSize: 9 } : undefined}
        />
        {hasRight && (
          <YAxis
            yAxisId="right" orientation="right" tick={TICK} stroke={AXIS}
            tickLine={false} width={52} tickFormatter={fmt}
            label={rightLabel ? { value: rightLabel, angle: 90, position: 'insideRight', fill: rightLabelColor || '#8b949e', fontSize: 9 } : undefined}
          />
        )}
        <Tooltip
          contentStyle={{ backgroundColor: '#1c2128', border: '1px solid #30363d', borderRadius: 8, fontSize: 11 }}
          labelStyle={{ color: '#e6edf3', fontWeight: 600 }}
          itemStyle={{ color: '#8b949e' }}
          formatter={(v, name) => [fmt(v), name]}
          cursor={{ stroke: '#30363d' }}
        />
        {legend && <Legend wrapperStyle={{ fontSize: 10, color: '#8b949e' }} iconSize={9} />}
        {series.map((s) => {
          const axis = s.axis === 'right' ? 'right' : 'left'
          if (s.kind === 'bar') {
            return (
              <Bar key={s.key} yAxisId={axis} dataKey={s.key} name={s.label}
                fill={s.color + '88'} stroke={s.color} strokeWidth={1} radius={[3, 3, 0, 0]}
                barSize={numericX ? 9 : undefined}>
                {s.cellColors && rows.map((_, i) => <Cell key={i} fill={s.cellColors[i] + '88'} stroke={s.cellColors[i]} />)}
              </Bar>
            )
          }
          if (s.kind === 'area') {
            return (
              <Area key={s.key} yAxisId={axis} type="monotone" dataKey={s.key} name={s.label}
                stroke={s.color} strokeWidth={s.width ?? 2} fill={s.color + '18'}
                dot={s.dot === 0 ? false : { r: s.dot ?? 3, fill: s.color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            )
          }
          return (
            <Line key={s.key} yAxisId={axis} type="monotone" dataKey={s.key} name={s.label}
              stroke={s.color} strokeWidth={s.width ?? 2}
              strokeDasharray={s.dashed ? '5 4' : undefined}
              dot={s.dot === 0 ? false : { r: s.dot ?? 3, fill: s.color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
          )
        })}
      </ComposedChart>
    </ResponsiveContainer>
  )
}

/**
 * ChartCard — panel wrapper with title, subtitle, and a per-chart
 * "Sources ↗" button opening an inline drawer (per brief).
 * sources: array of sourcesRegistry keys.
 */
export function ChartCard({ title, titleColor, sub, sources, tall = false, children, style }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="chart-card" style={style}>
      {title && <h3 style={titleColor ? { color: titleColor } : undefined}>{title}</h3>}
      {sub && <div className="sub">{sub}</div>}
      <div className={tall ? 'cw-tall' : 'cw'}>{children}</div>
      {sources?.length > 0 && (
        <>
          <div className="src-btn-row">
            <button className={'src-btn' + (open ? ' open' : '')} onClick={() => setOpen(!open)}>
              Sources ↗
            </button>
          </div>
          {open && <SourcesDrawer sourceIds={sources} />}
        </>
      )}
    </div>
  )
}
