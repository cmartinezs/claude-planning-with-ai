import { useState, useRef, useEffect } from 'react'
import { useLocale, type Locale } from '../context/LanguageContext'

const LOCALES: Record<Locale, { label: string; short: string }> = {
  es: { label: 'Español', short: 'ES' },
  en: { label: 'English', short: 'EN' },
}

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-mono text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
      >
        {LOCALES[locale].short}
        <svg
          className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 py-1 w-32 rounded-xl bg-surface-800 border border-surface-700/80 shadow-xl z-50">
          {(Object.keys(LOCALES) as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                l === locale
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-surface-300 hover:bg-surface-700'
              }`}
            >
              {LOCALES[l].label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
