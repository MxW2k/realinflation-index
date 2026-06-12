// ═══════════════════════════════════════════════════════════════
// FRED API layer — per brief spec. DORMANT until a key is provided.
// Get a free key: https://fred.stlouisfed.org/docs/api/api_key.html
// Store it in .env as: VITE_FRED_API_KEY=yourkey
// Until then, all charts read from staticSeries.js.
// ═══════════════════════════════════════════════════════════════

const BASE = 'https://api.stlouisfed.org/fred/series/observations'
const FRED_API_KEY = import.meta.env.VITE_FRED_API_KEY

export const FRED_SERIES = {
  CPI: 'CPIAUCSL',
  MORTGAGE30: 'MORTGAGE30US',
  MEDIAN_HOME: 'MSPUS',
  CASE_SHILLER: 'CSUSHPISA',
  GOLD: 'GOLDAMGBD228NLBM',
  SP500: 'SP500',
  WAGE: 'CES0500000003',
  WAGE_ANCHOR: 'AHETPI',
  WEALTH_TOP1: 'WFRBST01134',
  FED_BALANCE: 'WALCL',
  PRODUCTIVITY: 'OPHNFB',
  MEDIAN_WEEKLY_EARNINGS: 'LES1252881600Q',
  TREASURY_10Y: 'GS10',
}

export function hasFredKey() {
  return Boolean(FRED_API_KEY)
}

export async function fetchFredSeries(seriesId, startDate = '1971-01-01') {
  if (!FRED_API_KEY) {
    throw new Error('VITE_FRED_API_KEY is not set — using static data instead.')
  }
  const res = await fetch(
    `${BASE}?series_id=${seriesId}&observation_start=${startDate}&api_key=${FRED_API_KEY}&file_type=json`
  )
  if (!res.ok) throw new Error(`FRED request failed: ${res.status}`)
  const data = await res.json()
  return data.observations
}
