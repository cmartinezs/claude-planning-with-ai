import { useRef, useState } from 'react'
import { useTranslation } from '../locales'

const categoryColors = [
  'border-l-brand-500',
  'border-l-cyan-500',
  'border-l-emerald-500',
  'border-l-amber-500',
  'border-l-purple-500',
  'border-l-rose-500',
]

export default function Commands() {
  const t = useTranslation()
  const categories = t.commands.categories.map((cat, i) => ({
    ...cat,
    color: categoryColors[i % categoryColors.length],
  }))
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children) as HTMLElement[]
    const center = track.scrollLeft + track.clientWidth / 2
    const closest = cards.reduce((best, card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      return Math.abs(cardCenter - center) < Math.abs(best.distance) ? { index: i, distance: cardCenter - center } : best
    }, { index: 0, distance: Infinity })
    setActiveSlide(closest.index)
    setAtStart(track.scrollLeft <= 4)
    setAtEnd(track.scrollLeft >= track.scrollWidth - track.clientWidth - 4)
  }

  const scrollToSlide = (i: number) => {
    const track = trackRef.current
    const card = track?.children[i] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollTo({ left: card.offsetLeft - (track.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' })
  }

  const scrollByCard = (dir: number) => {
    const track = trackRef.current
    const card = track?.children[0] as HTMLElement | undefined
    if (!track || !card) return
    track.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: 'smooth' })
  }

  return (
    <section id="comandos" className="relative py-24 md:py-32 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">
            {t.commands.titlePrefix}{' '}
            <span className="gradient-text">{t.commands.titleHighlight}</span>
          </h2>
          <p className="section-subtitle">
            {t.commands.subtitle}
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous"
            className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-surface-700 bg-surface-900/90 text-surface-300 transition-all hover:border-brand-500/50 hover:text-brand-400 disabled:opacity-30 disabled:hover:border-surface-700 disabled:hover:text-surface-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Next"
            className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full border border-surface-700 bg-surface-900/90 text-surface-300 transition-all hover:border-brand-500/50 hover:text-brand-400 disabled:opacity-30 disabled:hover:border-surface-700 disabled:hover:text-surface-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 pb-2"
          >
            {categories.map((cat) => (
              <div
                key={cat.title}
                className={`glass-card overflow-hidden ${cat.color} border-l-2 shrink-0 snap-center w-full sm:w-[420px] md:w-[380px]`}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-surface-50 mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-surface-500 mb-5">{cat.description}</p>
                  <div className="space-y-3">
                    {cat.commands.map((c) => (
                      <div key={c.cmd} className="group">
                        <div className="code-block p-3">
                          <code className="text-brand-400 text-xs leading-relaxed block">
                            {c.cmd}
                          </code>
                        </div>
                        <p className="text-xs text-surface-500 mt-1.5 pl-1">
                          {c.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat.title}
              type="button"
              onClick={() => scrollToSlide(i)}
              aria-label={`${i + 1} / ${categories.length}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeSlide === i ? 'w-6 bg-brand-400' : 'w-2 bg-surface-600'
              }`}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="https://github.com/cmartinezs/claude-planning-with-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            {t.commands.docsLink}
          </a>
        </div>
      </div>
    </section>
  )
}
