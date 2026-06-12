// ═══════════════════════════════════════════════════════════════
// SOURCES REGISTRY — single source of truth for all citations.
// Entries from the build brief, verbatim, plus entries added for the
// live site's hours-of-labor series and the folded-in gold analysis.
// `usedIn` ids map to module ids in /config/manifest.js. Ids for
// modules not yet built (cpi-methodology, wealth-share,
// hours-to-freedom) are kept so the References tab can group them
// under "Upcoming modules".
// ═══════════════════════════════════════════════════════════════

export const sources = {
  // ── From brief ──
  SP500: {
    label: 'S&P 500 Index',
    fredId: 'SP500',
    url: 'https://fred.stlouisfed.org/series/SP500',
    description: 'S&P 500 daily closing price. Indexed to 1971=100.',
    usedIn: ['overview', 'tier1-assets', 'mhim-cpi', 'gold-analysis', 'table'],
  },
  GOLD: {
    label: 'Gold Price (London Fix)',
    fredId: 'GOLDAMGBD228NLBM',
    url: 'https://fred.stlouisfed.org/series/GOLDAMGBD228NLBM',
    description:
      'Gold price USD per troy oz. Note: pre-1971 gold was fixed at $35/oz under Bretton Woods — 1971 baseline captures repricing of suppressed value, not just post-Nixon inflation.',
    usedIn: ['overview', 'tier1-assets', 'mhim-cpi', 'gold-analysis', 'table'],
  },
  MEDIAN_HOME: {
    label: 'Median US Home Sale Price',
    fredId: 'MSPUS',
    url: 'https://fred.stlouisfed.org/series/MSPUS',
    description:
      'Median sales price of existing homes. Note: CPI does NOT use this — it uses Owners Equivalent Rent (OER).',
    usedIn: ['overview', 'tier1-assets', 'mhim-cpi', 'cpi-methodology', 'gold-analysis', 'table'],
  },
  WAGE: {
    label: 'Average Hourly Earnings (Nominal)',
    fredId: 'CES0500000003',
    url: 'https://fred.stlouisfed.org/series/CES0500000003',
    description:
      'BLS average hourly earnings, all private employees. Nominal — not inflation adjusted. 2026 median: $32.23/hr.',
    usedIn: ['mhim-cpi'],
  },
  CPI: {
    label: 'CPI-U All Items',
    fredId: 'CPIAUCSL',
    url: 'https://fred.stlouisfed.org/series/CPIAUCSL',
    description:
      'Official BLS CPI for All Urban Consumers. Uses OER for housing, geometric mean formula, and hedonic quality adjustments. Excludes asset prices entirely.',
    usedIn: ['mhim-cpi', 'cpi-methodology'],
  },
  MORTGAGE30: {
    label: '30-Year Fixed Mortgage Rate',
    fredId: 'MORTGAGE30US',
    url: 'https://fred.stlouisfed.org/series/MORTGAGE30US',
    description:
      'Used in pre-1983 CPI reconstruction. Pre-83 methodology included mortgage interest payments directly in the housing basket. Peaked at ~18% in 1981.',
    usedIn: ['cpi-methodology'],
  },
  WEALTH_TOP1: {
    label: 'Top 1% Net Worth Share',
    fredId: 'WFRBST01134',
    url: 'https://fred.stlouisfed.org/series/WFRBST01134',
    description:
      'Federal Reserve Distributional Financial Accounts. Quarterly. Available from Q3 1989. Record: 31.7% in Q3 2025.',
    usedIn: ['wealth-share'],
  },
  FED_BALANCE: {
    label: 'Federal Reserve Total Assets',
    fredId: 'WALCL',
    url: 'https://fred.stlouisfed.org/series/WALCL',
    description:
      'Fed balance sheet in millions. Key expansion events: 2008–2014 (QE1-3), 2020–2022 (COVID QE).',
    usedIn: ['wealth-share'],
  },
  OER_CHANGE: {
    label: 'BLS: OER Methodology Change (1983)',
    fredId: null,
    url: 'https://www.bls.gov/opub/btn/volume-2/owners-equivalent-rent-and-the-consumer-price-index-30-years-and-counting.htm',
    description:
      'BLS documentation of the 1983 switch from actual home purchase prices to Owners Equivalent Rent. Timed with CPI being adopted for tax bracket indexing.',
    usedIn: ['cpi-methodology'],
  },
  BOSKIN: {
    label: 'Boskin Commission Report (1996)',
    fredId: null,
    url: 'https://www.bls.gov/opub/mlr/2008/08/art1full.pdf',
    description:
      'Commission finding CPI overstated inflation via substitution bias. Led to geometric mean adoption in 1999.',
    usedIn: ['cpi-methodology'],
  },
  HEDONIC: {
    label: 'BLS Hedonic Quality Adjustment Documentation',
    fredId: null,
    url: 'https://www.bls.gov/cpi/quality-adjustment/',
    description:
      'BLS methodology adjusting prices downward for quality improvements. One-directional — quality declines do not raise the index.',
    usedIn: ['cpi-methodology'],
  },
  SHADOWSTATS: {
    label: 'ShadowStats Alternate CPI (John Williams)',
    fredId: null,
    url: 'https://www.shadowstats.com',
    description:
      'Reconstruction reversing post-1980s methodology changes. Runs 7–10% above official CPI. ⚠️ Not independently peer-reviewed — treat as directional estimate.',
    usedIn: ['cpi-methodology'],
  },
  KFF_PREMIUMS: {
    label: 'KFF Employer Health Benefits Survey',
    fredId: null,
    url: 'https://www.kff.org/health-costs/report/employer-health-benefits-survey/',
    description:
      'Annual survey of employer-sponsored insurance. MHIM uses total family premium — the actual cost of coverage. 2025: $26,993 family average. CPI instead uses a retained earnings proxy that produced inverted signals during COVID.',
    usedIn: ['overview', 'mhim-cpi', 'tier2-necessities', 'table'],
  },
  CPI_HEALTH_METHOD: {
    label: 'BLS CPI Health Insurance Methodology',
    fredId: null,
    url: 'https://www.bls.gov/cpi/additional-resources/improvements-cpi-health-insurance-index.htm',
    description:
      'BLS retained earnings method — tracks insurer margin, not premium. Produced inverted inflation signals during COVID. BLS-acknowledged limitation.',
    usedIn: ['overview', 'cpi-methodology', 'tier2-necessities'],
  },
  MHIM_METHODOLOGY: {
    label: 'MHIM Methodology (Internal)',
    fredId: null,
    url: '/methodology',
    description:
      'MHIM weights: 40% assets (home equity + equities + gold + farmland), 45% necessities (KFF premiums, tuition, food, gasoline, rent), 15% discretionary. Asset weighting reflects cost-to-enter the wealth-building economy.',
    usedIn: ['overview', 'mhim-cpi'],
  },

  // ── Added: hours-of-labor series used on the live site ──
  AHETPI: {
    label: 'Avg Hourly Earnings — Production & Nonsupervisory (Wage Anchor)',
    fredId: 'AHETPI',
    url: 'https://fred.stlouisfed.org/series/AHETPI',
    description:
      'The wage anchor for all hours-of-labor calculations. 2026 median: $32.23/hr. Historical anchors: $3.63 (1971) → $31.83 (2025). User-entered wages replace the current-period anchor only.',
    usedIn: ['overview', 'tier1-assets', 'tier2-necessities', 'tier3-discretionary', 'mhim-cpi', 'table'],
  },
  USDA_FARMLAND: {
    label: 'USDA ERS Cropland Value per Acre',
    fredId: null,
    url: 'https://www.ers.usda.gov/data-products/farmland-value',
    description: 'USDA Economic Research Service average US cropland value per acre, annual.',
    usedIn: ['tier1-assets', 'table'],
  },
  SILVER_LBMA: {
    label: 'Silver Price (LBMA)',
    fredId: null,
    url: 'https://www.lbma.org.uk/prices-and-data/precious-metal-prices',
    description: 'Silver USD per troy oz, annual average. Pre-LBMA years use historical fix data.',
    usedIn: ['tier1-assets', 'table'],
  },
  NCES_TUITION: {
    label: 'NCES / College Board — Public 4-Year Tuition',
    fredId: null,
    url: 'https://nces.ed.gov/programs/digest/',
    description:
      'Average annual tuition at public 4-year institutions. Manual entry — no API. CPI treats tuition as discretionary; MHIM treats it as a necessity.',
    usedIn: ['overview', 'tier2-necessities', 'table'],
  },
  BLS_FOOD: {
    label: 'BLS Average Price Data — Food Staples',
    fredId: 'APU0000708111 (eggs) · APU0000703112 (ground beef)',
    url: 'https://www.bls.gov/cpi/data.htm',
    description: 'BLS average price series for eggs (dozen) and ground beef (lb). Available via FRED APU series.',
    usedIn: ['overview', 'tier2-necessities', 'table'],
  },
  GAS_PRICE: {
    label: 'Gasoline Price per Gallon (BLS/EIA)',
    fredId: 'APU000074714',
    url: 'https://fred.stlouisfed.org/series/APU000074714',
    description: 'US average retail gasoline price, all grades. Flat in hours-of-labor terms since 1971.',
    usedIn: ['overview', 'tier2-necessities', 'table'],
  },
  CENSUS_RENT: {
    label: 'Census Housing Vacancy Survey — Median Asking Rent',
    fredId: null,
    url: 'https://www.census.gov/housing/hvs/',
    description: 'Median monthly asking rent, US. Renters pay asset inflation as rent rather than building equity.',
    usedIn: ['tier2-necessities', 'table'],
  },
  CAR_PRICE: {
    label: 'Average New Car Transaction Price (NADA/KBB)',
    fredId: null,
    url: 'https://www.kbb.com/car-news/average-new-car-price/',
    description:
      'Average new vehicle transaction price. Hedonic counterargument acknowledged: modern vehicles are substantially better and longer-lived.',
    usedIn: ['tier3-discretionary', 'table'],
  },
  ELECTRONICS_PROXY: {
    label: 'Electronics Hours Proxy (BLS CPI Electronics + historical retail)',
    fredId: null,
    url: 'https://www.bls.gov/cpi/factsheets/televisions.htm',
    description:
      'Approximate hours of labor for an equivalent TV/computing device. Genuine deflation — the honest counterargument to the thesis.',
    usedIn: ['tier3-discretionary', 'table'],
  },

  // ── Added: expanded asset taxonomy (June 2026) ──
  DIV_YIELD: {
    label: 'S&P 500 Dividend Yield',
    fredId: null,
    url: 'https://www.multpl.com/s-p-500-dividend-yield/table/by-year',
    description:
      'Multpl/Robert Shiller data. 3.10% (1971) → 1.06% (June 2026). The yield collapse means ~3× more capital is required for the same dividend income — the quiet engine of rising freedom costs.',
    usedIn: ['tier1-assets'],
  },
  GS10_YIELD: {
    label: '10-Year Treasury Yield',
    fredId: 'GS10',
    url: 'https://fred.stlouisfed.org/series/GS10',
    description:
      'Annual averages. 6.16% (1971), 11.46% (1980), 0.89% (2020), 4.48% (May 2026). Used for the bond-ladder income calculation.',
    usedIn: ['tier1-assets'],
  },
  CASE_SHILLER_NAT: {
    label: 'Case-Shiller National Home Price Index',
    fredId: 'CSUSHPISA',
    url: 'https://fred.stlouisfed.org/series/CSUSHPISA',
    description:
      'Repeat-sales index (Jan 2000 = 100), series begins 1987. Tracks same-home appreciation — a cleaner read on metro housing than median sale price, which shifts with the mix of homes sold.',
    usedIn: ['tier1-assets'],
  },
  CAP_RATE_INTERNAL: {
    label: 'Residential Cap Rate (Internal Derivation)',
    fredId: null,
    url: '/methodology',
    description:
      'Derived as (median monthly rent × 12) ÷ median home price from series already on this site: 5.1% (1971) → 3.8% (2026). Gross yield — before taxes, maintenance, vacancy. Actual net cap rates run lower.',
    usedIn: ['tier1-assets'],
  },
  RETIREMENT_CALC: {
    label: 'Respectable Retirement Threshold (Internal)',
    fredId: null,
    url: '/methodology',
    description:
      '$60K/yr spending (2026 dollars, CPI-deflated for history) × 25 per the 4% withdrawal rule = $1.5M portfolio target, expressed in hours of median labor. No institution publishes this series.',
    usedIn: ['tier1-assets'],
  },
  METALS_SPOT_2026: {
    label: 'Metals Spot Prices (June 2026 refresh)',
    fredId: null,
    url: 'https://fortune.com/article/current-price-of-silver-6-10-2026/',
    description:
      'Gold $4,083/oz (June 11, 2026, 9am ET) and silver $64.29/oz (June 10, 2026, 9am ET). Static values with as-of date — both metals are highly volatile in mid-2026 (silver ranged $36→$80 over the trailing year).',
    usedIn: ['tier1-assets', 'gold-analysis', 'table'],
  },

  // ── Added: gold purchasing-power analysis sources ──
  USAGOLD_HIST: {
    label: 'USAGOLD Historical Gold Prices',
    fredId: null,
    url: 'https://www.usagold.com/daily-gold-price-history/',
    description:
      'Historical annual gold prices. 1980 uses year-average (~$615), not the Jan 1980 spike (~$850). 2026 = June 11 spot ($4,083).',
    usedIn: ['gold-analysis'],
  },
  BLS_WEEKLY_EARNINGS: {
    label: 'BLS Usual Weekly Earnings',
    fredId: null,
    url: 'https://www.bls.gov/news.release/wkyeng.nr0.htm',
    description:
      'Median usual weekly earnings, Q1 2026: $1,235. Pre-2000 wages use Census/CPS median family income proxies.',
    usedIn: ['gold-analysis'],
  },
  CENSUS_NEW_HOMES: {
    label: 'Census Bureau New Residential Sales',
    fredId: null,
    url: 'https://www.census.gov/construction/nrs/current/index.html',
    description: 'Median new home sales price. Q1 2026: $403,200.',
    usedIn: ['gold-analysis'],
  },

  // ── Added: CPI methodology era selector (June 2026) ──
  GEOMEAN_1999: {
    label: 'BLS: Geometric Mean Formula Estimate (1999)',
    fredId: null,
    url: 'https://www.bls.gov/opub/ted/1999/Mar/wk4/art03.htm',
    description:
      "BLS's own pre-implementation estimate: the geometric mean formula (Jan 1999, ~61% of basket) lowers the annual CPI rate by approximately 0.2 percentage point.",
    usedIn: ['cpi-methodology'],
  },
  CPI_U_RS: {
    label: 'BLS CPI-U-RS Research Series',
    fredId: null,
    url: 'https://www.bls.gov/cpi/research-series/r-cpi-u-rs-home.htm',
    description:
      "BLS's retroactive application of current methods to 1978+. Ran 0.45pp/yr below official CPI over 1978-98, with the widest gaps before 1983 (housing). BLS quantified the methodology effect themselves.",
    usedIn: ['cpi-methodology'],
  },
  HEDONIC_CROSSVAL: {
    label: 'BLS: Cross-Validation of Quality-Adjustment Methods (2018)',
    fredId: null,
    url: 'https://www.bls.gov/opub/mlr/2018/article/cross-validation-of-quality-adjustment-methods.htm',
    description:
      "BLS Monthly Labor Review study: hedonics' net effect is small and mixed-direction — hedonic rent and apparel indexes raised measured inflation. Non-shelter hedonics cover ~2.9% of the basket.",
    usedIn: ['cpi-methodology'],
  },
  BLS_HISTORY: {
    label: 'BLS: History of CPI Revisions and Improvements',
    fredId: null,
    url: 'https://www.bls.gov/opub/hom/cpi/history.htm',
    description:
      'The full BLS-published list of CPI revisions 1978-2018. Basis for the "moves the number" vs "operational" classification on the CPI Methodology tab.',
    usedIn: ['cpi-methodology'],
  },
}

// Modules that exist in the registry but aren't built yet — used by
// the References tab to group "Upcoming modules" separately.
export const UPCOMING_MODULE_IDS = ['wealth-share', 'hours-to-freedom']
