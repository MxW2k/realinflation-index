# Matt's Honest Inflation Index (MHIM)

React + Vite + Recharts refactor of realinflationindex.netlify.app, per
`realinflationindex_cowork_brief.md`.

## Run locally

```bash
npm install
npm run dev      # dev server
npm run build    # production build → dist/
```

## Deploy

`netlify.toml` is configured — connect the GitHub repo to Netlify and every
push auto-deploys (`npm run build`, publish `dist`).

## Architecture

```
src/
  config/manifest.js        ← drop-in module registry: add charts here, nothing else changes
  data/staticSeries.js      ← all data (extracted from the HTML prototype) — source of truth
  data/sourcesRegistry.js   ← all citation metadata; powers Sources drawers + References tab
  data/fredApi.js           ← FRED fetch layer (dormant — set VITE_FRED_API_KEY in .env)
  context/WageContext.jsx   ← wage anchor state shared by all tabs
  components/
    charts/primitives.jsx   ← TerminalChart + ChartCard (theme, Sources ↗ button)
    OverviewTab, Tier1/2/3 tabs, MHIMvsCPITab, GoldAnalysisTab,
    DataTableTab, SourcesDrawer, ReferencesTab
    HoursToFreedomTab.jsx   ← scaffold (enabled:false in manifest)
    UserWeightedMHIM.jsx    ← scaffold (not yet mounted)
```

## Adding a new chart module

1. Create `src/components/YourChart.jsx`
2. Add its sources to `src/data/sourcesRegistry.js` (with `usedIn: ['your-id']`)
3. Add an entry to `src/config/manifest.js`
4. Register the component in the `COMPONENTS` map in `App.jsx`

The References tab and Sources drawers populate automatically.
