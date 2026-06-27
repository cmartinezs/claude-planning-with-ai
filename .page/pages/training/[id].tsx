import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TrainingRunner from '@/components/Training/TrainingRunner'
import { useTrainingProgress } from '@/hooks/useTrainingProgress'
import { useTranslation } from '@/locales'
import scenario01 from '@/data/training/scenario-01-first-planning'
import scenario02 from '@/data/training/scenario-02-from-epic'
import scenario03 from '@/data/training/scenario-03-plan-changes'
import scenario04 from '@/data/training/scenario-04-backlog-first'
import scenario05 from '@/data/training/scenario-05-release'
import scenario06 from '@/data/training/scenario-06-autonomous'
import scenario07 from '@/data/training/scenario-07-recovery'
import scenario08 from '@/data/training/scenario-08-context-switch'
import scenario09 from '@/data/training/scenario-09-advisory-audit'
import scenario10 from '@/data/training/scenario-10-smoke-config'
import type { TrainingScenario } from '@/types/training'

const SCENARIOS: Record<string, TrainingScenario> = {
  'first-planning': scenario01,
  'from-epic': scenario02,
  'plan-changes': scenario03,
  'backlog-first': scenario04,
  'release': scenario05,
  'autonomous': scenario06,
  'recovery': scenario07,
  'context-switch': scenario08,
  'advisory-audit': scenario09,
  'smoke-config': scenario10,
}

const META_ES: Record<string, { title: string; description: string }> = {
  'first-planning': {
    title: 'Primer planning',
    description: 'Aprende el flujo base: init, new, expand, story, done y archive.',
  },
  'from-epic': {
    title: 'Desde un epic',
    description: 'Convierte user stories existentes en un planning ejecutable con tareas atómicas.',
  },
  'plan-changes': {
    title: 'Plan que cambia',
    description: 'Adapta un planning activo: agrega stories, divide y omite trabajo obsoleto.',
  },
  'backlog-first': {
    title: 'Backlog primero',
    description: 'Enriquece un epic crudo antes de planificar: DoD, gaps y plan-from-epic.',
  },
  'release': {
    title: 'Gestión de release',
    description: 'Agrupa plannings bajo una versión semántica y rastrea su estado en tiempo real.',
  },
  'autonomous': {
    title: 'Pipeline autónomo',
    description: 'Describe trabajo en lenguaje natural y deja que el pipeline lo ejecute solo.',
  },
  'recovery': {
    title: 'Recuperación',
    description: 'Diagnostica y recupera un planning bloqueado con health, validate y rollback.',
  },
  'context-switch': {
    title: 'Cambio de contexto',
    description: 'Cambia de story de forma segura: el plugin detecta el conflicto, pausa con STANDBY y permite reanudar sin perder progreso.',
  },
  'advisory-audit': {
    title: 'Decisión y auditoría',
    description: 'Practica /plan-status, métricas, auditoría documental y verificación estructural del plugin.',
  },
  'smoke-config': {
    title: 'Smoke tests',
    description: 'Configura el plan de smoke tests del proyecto para validar arranque, conectividad y migraciones antes del code review humano.',
  },
}

export default function TrainingPage() {
  const router = useRouter()
  const t = useTranslation()
  const id = typeof router.query.id === 'string' ? router.query.id : ''
  const scenario = SCENARIOS[id]
  const pageMeta = META_ES[id]
  const { markComplete } = useTrainingProgress()

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
              meta={{ ...t.training.runner, title: pageMeta.title }}
              onComplete={() => markComplete(id)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
