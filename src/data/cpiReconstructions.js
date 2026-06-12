// ═══════════════════════════════════════════════════════════════
// CPI METHODOLOGY RECONSTRUCTIONS — one-time calculation, static.
// Anchor years: 1971, 1980, 1990, 2000, 2010, 2020, 2025, 2026.
// All magnitudes BLS-sourced unless flagged. Approved June 12, 2026.
//
// Sources:
// - Geometric mean: BLS pre-implementation estimate, -0.2pp/yr
//   (bls.gov/opub/ted/1999/Mar/wk4/art03.htm)
// - CPI-U-RS: BLS research series 1978-1998 ran -0.45pp/yr vs
//   official; "widest differences prior to 1983" (housing)
// - Pre-1983 housing: simplified reconstruction — owner cost proxy =
//   median home price (MSPUS) x 30yr mortgage rate (Freddie PMMS
//   annual avg), 25% basket weight, spliced at 1983. Property taxes
//   omitted (no consistent series) — documented simplification.
// - Hedonics critic variant: +0.3pp/yr from 1998 — NOT a BLS number;
//   BLS's own cross-validation finds net effect ~0 and mixed-sign.
// - ShadowStats: +8pp/yr from 1980 (midpoint of 7-10pp claim).
//   Not peer-reviewed. Directional only.
// ═══════════════════════════════════════════════════════════════

// 30-yr mortgage rate, annual averages (Freddie Mac PMMS via FRED
// MORTGAGE30US). 2026 = June 11 weekly.
export const MORTGAGE_RATE = [7.54, 13.74, 10.13, 8.05, 4.69, 3.10, 6.70, 6.52]

// Official CPI-U, 1971=100 (matches COMPOSITE.dollar.CPI)
const OFFICIAL = [100, 212, 344, 485, 599, 730, 875, 900]

export const CPI_ERAS = {
  current: {
    label: '1999–present (official)',
    series: OFFICIAL,
    note: 'Headline CPI-U as published: OER housing, geometric mean formula, hedonic adjustments.',
  },
  pre99: {
    label: '1983–1998 method (no geometric mean)',
    // official with BLS's own -0.2pp/yr geomean estimate added back from 1999
    series: [100, 212, 344, 486, 612, 761, 922, 950],
    note: 'Adds back the geometric mean formula (Jan 1999) at BLS\'s own estimate of 0.2pp/yr. Arithmetic-mean fixed basket, OER housing.',
  },
  pre83: {
    label: 'Pre-1983 method (actual home prices + mortgage rates)',
    // 75% official + 25% owner-cost proxy (MSPUS x mortgage rate), spliced 1983
    series: [100, 212, 330, 437, 480, 557, 822, 838],
    note: 'Replaces OER with the pre-1983 asset-price housing method (home price x mortgage rate, 25% weight). Two-sided: reads BELOW official 1983–2020 (rates fell for four decades), then surges +50% from 2020–26 vs official +23% — the affordability shock the headline number never showed.',
  },
  pre78: {
    label: '1978 methods (BLS CPI-U-RS, inverted)',
    // pre99 series with CPI-U-RS gap (+0.45pp/yr, 1978-1998) added back
    series: [100, 214, 363, 532, 669, 832, 1009, 1039],
    note: 'BLS\'s own research series (CPI-U-RS) retroactively applies current methods to 1978+. It runs 0.45pp/yr below official over 1978–98 — inverting it approximates the full 1978 methodology carried forward.',
  },
}

// Optional overlays (checkboxes, not radio)
export const HEDONIC_CRITIC = {
  label: 'Hedonics — critic estimate (+0.3pp/yr from 1998) ⚠️ non-BLS',
  series: [100, 212, 344, 488, 621, 780, 949, 979],
  note: 'BLS\'s own cross-validation finds hedonics\' net effect ≈0 and mixed-sign (hedonic rent/apparel RAISED measured inflation; non-shelter hedonics cover ~2.9% of basket). This overlay shows the common critic assumption instead — flagged as non-BLS.',
}

export const SHADOWSTATS_SGS = {
  label: 'ShadowStats 1980-based (+8pp/yr) ⚠️ not peer-reviewed',
  series: [100, 212, 743, 2261, 6028, 15859, 27930, 31027],
  note: 'John Williams\' reconstruction reverses all post-1980 changes at ~8pp/yr (midpoint of the 7–10pp claim). Not independently peer-reviewed. Note where it lands relative to MHIM: even the maximalist critique makes MHIM (3,182) look conservative.',
}

// Items from the BLS improvements list with no directional effect on
// the headline number — shown on the tab for completeness.
export const OPERATIONAL_CHANGES = [
  '1978: CPI-U introduced, CPI-W renamed; expanded to 85 areas; probability sampling; checklists; sampling-error estimates',
  '1978–87: Point-of-Purchase Survey; outlet rotation (5-yr); area rotation',
  '1987: New weights (1982–84 survey); redesigned housing survey; estimation efficiency',
  '1987–98: Housing-sample aging fix; new-vehicle handling; seasonal adjustment; hospital services restructuring',
  '1998: New weights (1993–95); item reclassification; computer-assisted collection; TPOPS',
  '1999+: CPI-E (2008); C-CPI-U (2002 — separate index, not headline); all-business-day pricing (2004); 3-decimal publishing (2007); biennial weights (2002); 4-yr outlet rotation',
  '2018: Geographic sample from 2010 Census; new local/aggregate indexes',
]
