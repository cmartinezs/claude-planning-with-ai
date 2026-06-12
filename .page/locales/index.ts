import { useLocale } from '../context/LanguageContext'
import es from './es'
import en from './en'

export type Translations = typeof es

const translations = { es, en }

export function useTranslation(): Translations {
  const { locale } = useLocale()
  return translations[locale]
}
