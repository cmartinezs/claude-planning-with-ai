import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from '../locales'

const SLIDE_DURATION = 6000

export default function SplashScreen({ onDismiss }: { onDismiss: () => void }) {
  const t = useTranslation()
  const slides = t.splash.slides

  const [current, setCurrent] = useState(0)
  const [phase, setPhase] = useState<'question' | 'answer'>('question')
  const [revealed, setRevealed] = useState(false)

  const advance = useCallback(() => {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1)
      setPhase('question')
    } else {
      setRevealed(true)
    }
  }, [current, slides.length])

  useEffect(() => {
    if (revealed) return
    const t1 = setTimeout(() => setPhase('answer'), 2200)
    const t2 = setTimeout(advance, SLIDE_DURATION)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [current, advance, revealed])

  useEffect(() => {
    if (!revealed) return
    const timer = setTimeout(onDismiss, 8000)
    return () => clearTimeout(timer)
  }, [revealed, onDismiss])

  return (
    <section className="fixed inset-0 z-[100] bg-surface flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-3xl mx-auto w-full text-center">
          {!revealed ? (
            <div key={current} className="space-y-8">
              <div className="text-6xl animate-bounce" style={{ animationDuration: '1.5s' }}>
                {slides[current].icon}
              </div>

              <div className="overflow-hidden">
                <p className="text-xl sm:text-2xl md:text-3xl text-surface-50 font-semibold leading-relaxed animate-slide-up">
                  {slides[current].question}
                </p>
              </div>

              <div
                className={`overflow-hidden transition-all duration-700 ease-out ${
                  phase === 'answer' ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-lg sm:text-xl text-brand-400/80 italic flex items-center justify-center gap-3">
                  <span className="w-8 h-px bg-brand-500/30" />
                  {slides[current].answer}
                  <span className="w-8 h-px bg-brand-500/30" />
                </p>
              </div>

              <div className="flex justify-center gap-2 pt-4">
                {slides.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      i === current
                        ? 'bg-brand-400 w-6'
                        : i < current
                          ? 'bg-brand-500/40'
                          : 'bg-surface-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-fade-in">
              <div className="text-6xl">📋</div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-50 leading-tight">
                {t.splash.revealTitle}{' '}
                <span className="gradient-text">{t.splash.revealGradient}</span>.
              </h2>
              <p className="text-lg text-surface-400 max-w-xl mx-auto">
                {t.splash.revealSubtitle}
              </p>
              <button
                onClick={onDismiss}
                className="btn-primary text-base px-8 py-4 animate-pulse-glow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {t.splash.revealBtn}
              </button>
            </div>
          )}
        </div>
      </div>

      {!revealed && (
        <div className="pb-16 sm:pb-20 text-center animate-fade-in">
          <p className="text-sm text-surface-600 mb-3">{t.splash.identify}</p>
          <div className="flex justify-center">
            <button
              onClick={onDismiss}
              className="px-3 py-2 text-lg text-surface-500 hover:text-surface-300 transition-colors underline underline-offset-4"
            >
              {t.splash.skip}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
