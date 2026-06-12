// ═══════════════════════════════════════════════════════════════
// MANIFEST — drop-in architecture per brief.
// Add new charts here; nothing else changes. App.jsx reads this to
// build nav tabs and render components. `sources` keys reference
// /data/sourcesRegistry.js. Set enabled:false to scaffold without
// rendering.
// ═══════════════════════════════════════════════════════════════

export const modules = [
  {
    id: 'overview',
    label: 'Overview',
    component: 'OverviewTab',
    sources: ['AHETPI', 'MEDIAN_HOME', 'SP500', 'GOLD', 'NCES_TUITION', 'BLS_FOOD', 'GAS_PRICE'],
  },
  {
    id: 'tier1-assets',
    label: 'Tier 1: Assets',
    component: 'Tier1AssetsTab',
    sources: ['MEDIAN_HOME', 'USDA_FARMLAND', 'SP500', 'GOLD', 'SILVER_LBMA', 'AHETPI'],
  },
  {
    id: 'tier2-necessities',
    label: 'Tier 2: Necessities',
    component: 'Tier2NecessitiesTab',
    sources: ['NCES_TUITION', 'KFF_PREMIUMS', 'BLS_FOOD', 'GAS_PRICE', 'CENSUS_RENT', 'AHETPI'],
  },
  {
    id: 'tier3-discretionary',
    label: 'Tier 3: Discretionary',
    component: 'Tier3DiscretionaryTab',
    sources: ['CAR_PRICE', 'ELECTRONICS_PROXY', 'AHETPI'],
  },
  {
    id: 'mhim-cpi',
    label: 'MHIM vs CPI',
    component: 'MHIMvsCPITab',
    sources: ['CPI', 'MHIM_METHODOLOGY', 'KFF_PREMIUMS', 'SP500', 'GOLD', 'MEDIAN_HOME', 'WAGE'],
  },
  {
    id: 'cpi-methodology',
    label: 'CPI Methodology',
    component: 'CPIMethodologyTab',
    sources: ['GEOMEAN_1999', 'CPI_U_RS', 'OER_CHANGE', 'MORTGAGE30', 'HEDONIC', 'HEDONIC_CROSSVAL', 'SHADOWSTATS', 'BOSKIN', 'BLS_HISTORY', 'CPI'],
  },
  {
    id: 'gold-analysis',
    label: 'Gold Analysis',
    component: 'GoldAnalysisTab',
    sources: ['USAGOLD_HIST', 'BLS_WEEKLY_EARNINGS', 'CENSUS_NEW_HOMES', 'MEDIAN_HOME', 'SP500'],
  },
  {
    id: 'table',
    label: 'Full Data Table',
    component: 'DataTableTab',
    sources: [
      'AHETPI', 'MEDIAN_HOME', 'USDA_FARMLAND', 'GOLD', 'SILVER_LBMA',
      'KFF_PREMIUMS', 'NCES_TUITION', 'CENSUS_RENT', 'BLS_FOOD', 'GAS_PRICE',
      'CAR_PRICE', 'ELECTRONICS_PROXY',
    ],
  },
  {
    id: 'references',
    label: 'References',
    component: 'ReferencesTab',
    sources: [],
  },

  // ── Scaffolded, not yet enabled ──
  {
    id: 'hours-to-freedom',
    label: 'Hours to Freedom',
    component: 'HoursToFreedomTab',
    enabled: false,
    sources: ['AHETPI', 'MEDIAN_HOME', 'SP500'],
    // future: PRODUCTIVITY (OPHNFB), MEDIAN_WAGE (LES1252881600Q), GS10, DJDIVYR
  },
]
