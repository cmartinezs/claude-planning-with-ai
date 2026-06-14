import { useTranslation } from '../locales'

export default function Hero() {
  const t = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-brand-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-gradient-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            {t.hero.badge}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-surface-50 leading-tight mb-6 animate-slide-up">
            {t.hero.titleLine1}
            <br />
            <span className="gradient-text">{t.hero.titleHighlight}</span>{' '}
            {t.hero.titleBetween}
            <br />
            {t.hero.titleLine2}
          </h1>

          <p
            className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 animate-slide-up"
            style={{ animationDelay: '0.15s' }}
          >
            {t.hero.subtitle}
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <a href="#installation" className="btn-primary text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.hero.installBtn}
            </a>
            <a href="#what-it-does" className="btn-secondary text-base px-8 py-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t.hero.demoBtn}
            </a>
          </div>

          <div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.45s' }}
          >
            {t.hero.stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl bg-surface-800/50 border border-surface-700/50">
                <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-surface-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </section>
  )
}
