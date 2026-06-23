import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrainingRunner from '@/components/Training/TrainingRunner'
import scenario01 from '@/data/training/scenario-01-first-planning'
import type { TrainingScenario } from '@/types/training'

const SCENARIOS: Record<string, TrainingScenario> = {
  'first-planning': scenario01,
}

const META_ES: Record<string, { title: string; description: string }> = {
  'first-planning': {
    title: 'Primer planning',
    description: 'Aprende el flujo base: init, new, expand, story, done y archive.',
  },
}

const RUNNER_META = {
  stepLabel: 'Paso',
  ofLabel: 'de',
  contextLabel: 'Contexto',
  nextLabel: 'Siguiente paso',
  difficultyLabel: 'Dificultad',
  completedLabel: 'Completado',
  finishedTitle: '¡Entrenamiento completado!',
  finishedSubtitle: 'Practicaste el flujo completo del plugin. Elige otro entrenamiento para seguir aprendiendo.',
  backLabel: 'Volver al catálogo',
  restartLabel: 'Repetir',
}

export default function TrainingPage() {
  const router = useRouter()
  const id = typeof router.query.id === 'string' ? router.query.id : ''
  const scenario = SCENARIOS[id]
  const pageMeta = META_ES[id]

  if (!scenario || !pageMeta) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-surface flex items-center justify-center">
          <div className="text-center">
            <p className="text-surface-400">Entrenamiento no encontrado.</p>
            <Link href="/training" className="mt-4 inline-block text-brand-300 hover:text-brand-200">
              ← Volver al catálogo
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{pageMeta.title} — Training · Planning with AI</title>
        <meta name="description" content={pageMeta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <main className="min-h-screen bg-surface">
        <div className="relative pt-28 pb-24">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/training"
              className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-300 transition-colors mb-8"
            >
              <span aria-hidden="true">←</span>
              Catálogo de entrenamientos
            </Link>

            <TrainingRunner
              scenario={scenario}
              meta={{ ...RUNNER_META, title: pageMeta.title }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
