import { createContext, useContext, useMemo, useState } from 'react'
import { MED_WAGE, wagesWith, hoursFor, minsFor } from '../data/staticSeries'

const WageContext = createContext(null)

export function WageProvider({ children }) {
  const [userWage, setUserWage] = useState(MED_WAGE)
  const [wageNote, setWageNote] = useState('Median 2026 (BLS AHETPI)')

  const value = useMemo(() => {
    const wages = wagesWith(userWage)
    return {
      userWage,
      setUserWage,
      wageNote,
      setWageNote,
      isMedian: userWage === MED_WAGE,
      medWage: MED_WAGE,
      wages,
      hoursArr: (key) => hoursFor(key, userWage),
      minsArr: (key) => minsFor(key, userWage),
    }
  }, [userWage, wageNote])

  return <WageContext.Provider value={value}>{children}</WageContext.Provider>
}

export const useWage = () => useContext(WageContext)
