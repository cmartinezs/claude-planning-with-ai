import { useState, useEffect, useCallback } from 'react'

const slides = [
  {
    icon: '🎯',
    question: '¿Tus historias de usuario llegan sin criterios de aceptación claros?',
    answer: 'Después vienen los malentendidos. Y el retrabajo.',
  },
  {
    icon: '⏳',
    question: '¿Pasas más tiempo organizando tareas que escribiendo código?',
    answer: 'El caos no planificado consume tu energía creativa.',
  },
  {
    icon: '📅',
    question: '¿Tus planes de proyecto se desactualizan en cuestión de días?',
    answer: 'El software es cambio constante. Tu plan debería adaptarse.',
  },
  {
    icon: '🤖',
    question: '¿Te gustaría que Claude Code ejecute planes completos por sí solo?',
    answer: 'Idea → Expansión → Ejecución → Archivo. Sin supervisión constante.',
  },
]

const SLIDE_DURATION = 6000

export default function SplashScreen({ onDismiss }: { onDismiss: () => void }) {
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
  }, [current])

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
    const t = setTimeout(onDismiss, 8000)
    return () => clearTimeout(t)
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
                Planning with AI resuelve{' '}
                <span className="gradient-text">todo esto</span>.
              </h2>
              <p className="text-lg text-surface-400 max-w-xl mx-auto">
                Un plugin para Claude Code que estructura cada fase de tu proyecto.
                Desde la idea hasta el archivo, con trazabilidad completa.
              </p>
              <button
                onClick={onDismiss}
                className="btn-primary text-base px-8 py-4 animate-pulse-glow"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                Ver el plugin
              </button>
            </div>
          )}
        </div>
      </div>

      {!revealed && (
        <div className="pb-8 text-center animate-fade-in">
          <p className="text-sm text-surface-600 mb-3">¿Te sientes identificado?</p>
          <div className="flex justify-center">
            <button
              onClick={onDismiss}
              className="text-xs text-surface-500 hover:text-surface-300 transition-colors underline underline-offset-4"
            >
              Saltar introducción
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
