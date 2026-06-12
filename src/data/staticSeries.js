// ═══════════════════════════════════════════════════════════════
// STATIC DATA — extracted verbatim from realinflation_index.html
// (June 2026 prototype) and purchasing_power_gold_analysis.html.
// This file is the single source of truth for all chart data until
// the FRED API layer (fredApi.js) is activated.
// ═══════════════════════════════════════════════════════════════

export const YEARS = [1971, 1980, 1990, 2000, 2010, 2020, 2025, 2026]
export const YR_LABELS = ['1971', '1980', '1990', '2000', '2010', '2020', '2025', '2026']
export const MED_WAGE = 32.23

// Historical median wages (AHETPI) — last slot is replaced by the user's wage anchor
export const HIST_WAGES = [3.63, 6.85, 10.18, 14.0, 19.06, 24.36, 31.83, 32.23]

// ── Nominal prices (fixed) ──
export const PRICES = {
  home:    [25225, 64750, 122300, 167550, 222700, 339000, 430000, 440000],
  farm:    [203, 737, 683, 1090, 2100, 3160, 4350, 4350],
  gold:    [41, 615, 383, 279, 1225, 1770, 2860, 4503],
  silver:  [1.55, 20.63, 4.82, 4.95, 20.19, 20.55, 32, 32],
  sp500:   [93.49, 110.9, 339.97, 1425.6, 1123.6, 3278.2, 5979.5, 7583],
  tuition: [500, 800, 1780, 3349, 7600, 10560, 11600, 11600],
  health:  [500, 1000, 3000, 6438, 13770, 21342, 26993, 26993],
  rent:    [108, 243, 447, 602, 855, 1098, 1350, 1400],
  eggs:    [0.53, 0.84, 1.01, 0.91, 1.18, 1.46, 3.5, 2.25],
  gas:     [0.36, 1.19, 1.15, 1.51, 2.78, 2.17, 3.4, 3.3],
  beef:    [0.6, 1.2, 1.53, 1.57, 2.37, 4.38, 5.75, 5.5],
  car:     [3500, 7200, 15900, 24000, 29200, 36600, 48000, 48400],
  elec:    [250, 120, 60, 25, 12, 8, 8, 8], // approx TV hours
}

// ── Composite MHIM vs CPI series (precomputed, 1971 = 100) ──
export const COMPOSITE = {
  dollar: {
    MHIM: [100, 269, 422, 736, 1251, 2010, 3182, 3182],
    CPI:  [100, 212, 344, 485, 599, 730, 875, 900],
    T1:   [100, 404, 474, 850, 1264, 2310, 4591, 4591],
    T2:   [100, 187, 422, 750, 1504, 2224, 2742, 2742],
    T3:   [100, 154, 282, 391, 459, 566, 745, 745],
  },
  hours: {
    MHIM: [100, 147, 153, 187, 238, 300, 322, 322],
    CPI:  [100, 112, 123, 126, 114, 109, 100, 100],
    T1:   [100, 214, 169, 220, 240, 344, 417, 417],
    T2:   [100, 102, 150, 183, 285, 332, 314, 314],
    T3:   [100, 100, 121, 114, 93, 88, 93, 93],
  },
}

// ── Wage vs asset divergence (nominal, 1971 = 100) ──
export const DIVERGENCE = {
  WAGE_IDX: [100, 189, 280, 386, 525, 671, 877, 888],
  HOME_NOM: [100, 257, 485, 664, 883, 1344, 1705, 1745],
  GOLD_NOM: [100, 1500, 934, 680, 2988, 4317, 6975, 10983],
  SP_NOM:   [100, 119, 364, 1526, 1202, 3506, 6396, 8110],
}

// ── Gold purchasing-power analysis (decade series, 1970 base) ──
// From purchasing_power_gold_analysis.html. 2026: gold = May 28 spot;
// wage = Q1 2026 BLS; home = Q1 2026 Census; S&P = May 26 close.
export const GOLD_PAGE = {
  years: ['1970', '1980', '1990', '2000', '2010', '2020', '2026'],
  gold:  [36, 615, 383, 272, 1225, 1770, 4501],
  wages: [6186, 15757, 24962, 32154, 40872, 54132, 64220],
  homes: [23000, 62200, 122900, 165300, 179900, 329000, 403200],
  sp500: [92, 119, 330, 1469, 1115, 3756, 7519],
}

// ── Helpers ──

// Index an array to first value = 100
export const idx = (arr) => arr.map((v) => Math.round((v / arr[0]) * 100))

// Wages array with the user's wage substituted in the current slot
export const wagesWith = (userWage) => {
  const w = [...HIST_WAGES]
  w[7] = userWage
  return w
}

// Hours of labor for a price series at a given wage anchor
export const hoursFor = (key, userWage) => {
  const w = wagesWith(userWage)
  return PRICES[key].map((p, i) => +(p / w[i]).toFixed(2))
}

// Minutes of labor
export const minsFor = (key, userWage) => hoursFor(key, userWage).map((h) => +(h * 60).toFixed(1))
