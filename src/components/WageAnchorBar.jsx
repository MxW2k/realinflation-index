import { useState } from 'react'
import { useWage } from '../context/WageContext'

export default function WageAnchorBar() {
  const { userWage, setUserWage, wageNote, setWageNote, isMedian, medWage } = useWage()
  const [hourlyInput, setHourlyInput] = useState('')
  const [annualInput, setAnnualInput] = useState('')

  const setMedian = () => {
    setUserWage(medWage)
    setWageNote('Median 2026 (BLS AHETPI)')
    setHourlyInput('')
    setAnnualInput('')
  }

  const applyHourly = () => {
    const v = parseFloat(hourlyInput)
    if (!v || v < 1) return
    setUserWage(v)
    setWageNote(`Custom wage · $${((v * 2080) / 1000).toFixed(1)}k/yr est.`)
  }

  const applyAnnual = () => {
    const v = parseFloat(annualInput)
    if (!v || v < 20000) return
    setUserWage(+(v / 2080).toFixed(2))
    setWageNote(`Custom · $${(v / 1000).toFixed(1)}k/yr ÷ 2,080 hrs`)
  }

  return (
    <div id="wage-bar">
      <span className="wb-label">⚙️ Wage Anchor:</span>
      <span className="wb-current">${userWage.toFixed(2)} / hr</span>
      <button className={'wb-btn' + (isMedian ? ' active' : '')} onClick={setMedian}>
        📊 Use Median
      </button>
      <span className="wb-sep">|</span>
      <div className="wb-input-wrap">
        <label>Hourly $</label>
        <input
          className="wb-input" type="number" min="1" max="500" step="0.25"
          placeholder="e.g. 46.88" value={hourlyInput}
          onChange={(e) => setHourlyInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyHourly()}
        />
        <button className="wb-apply" onClick={applyHourly}>Apply</button>
      </div>
      <span className="wb-sep">|</span>
      <div className="wb-input-wrap">
        <label>Annual salary $</label>
        <input
          className="wb-input" type="number" min="20000" max="2000000" step="1000"
          placeholder="e.g. 97500" value={annualInput}
          onChange={(e) => setAnnualInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyAnnual()}
        />
        <button className="wb-apply" onClick={applyAnnual}>Apply</button>
      </div>
      <span className="wb-note">{wageNote}</span>
    </div>
  )
}
