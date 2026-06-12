import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Locale = 'es' | 'en'

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LanguageContext = createContext<LanguageContextType>({
  locale: 'es',
  setLocale: () => {},
})

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'es'
  const saved = localStorage.getItem('locale') as Locale | null
  if (saved === 'es' || saved === 'en') return saved
  const browser = navigator.language.split('-')[0]
  return browser === 'en' ? 'en' : 'es'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es')

  useEffect(() => {
    setLocaleState(detectLocale())
  }, [])

  const setLocale = (next: Locale) => {
    localStorage.setItem('locale', next)
    setLocaleState(next)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLocale() {
  return useContext(LanguageContext)
}
