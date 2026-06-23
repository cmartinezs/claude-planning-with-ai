import Link from 'next/link'
import { useTranslation } from '../locales'

export default function Commands() {
  const t = useTranslation()

  return (
    <section id="commands" className="relative py-24 md:py-32 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="section-title mb-4">
            {t.commands.titlePrefix}{' '}
            <span className="gradient-text">{t.commands.titleHighlight}</span>
          </h2>
          <p className="section-subtitle">
            {t.commands.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {t.commands.cards.map((card) => (
            <article key={card.title} className="glass-card-hover p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-surface-600 bg-surface-900/70 text-brand-300">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.iconPath} />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-surface-50">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-400">
                {card.description}
              </p>
              <Link href={card.href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-brand-300 hover:text-brand-200 transition-colors">
                {card.linkLabel}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
