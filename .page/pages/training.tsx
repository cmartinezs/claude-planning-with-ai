import Head from 'next/head'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTrainingProgress } from '@/hooks/useTrainingProgress'
import type { Difficulty } from '@/types/training'
import { useState } from 'react'

const DIFFICULTY_STARS: Record<Difficulty, string> = {
  basic: '★☆☆',
  intermediate: '★★☆',
  advanced: '★★★',
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  basic: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
}

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  basic: 'text-green-400 border-green-500/30 bg-green-500/10',
  intermediate: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  advanced: 'text-red-400 border-red-500/30 bg-red-500/10',
}

interface ScenarioCard {
  id: string
  title: string
  description: string
  difficulty: Difficulty
  durationMin: number
  commands: string[]
  available: boolean
}

const SCENARIOS: ScenarioCard[] = [
  {
    id: 'first-planning',
    title: 'Primer planning',
    description: 'Flujo base completo: inicializa el sistema, crea un planning, expándelo, ejecuta una story y archívalo.',
    difficulty: 'basic',
    durationMin: 8,
    commands: ['/plan-init', '/plan-new', '/plan-expand', '/plan-story', '/plan-done', '/plan-retrospective', '/plan-archive'],
    available: true,
  },
  {
    id: 'from-epic',
    title: 'Desde un epic',
    description: 'Convierte user stories existentes en un planning ejecutable con tareas atómicas.',
    difficulty: 'basic',
    durationMin: 7,
    commands: ['/us-status', '/us-enrich', '/plan-from-epic', '/plan-atomize', '/plan-task'],
    available: true,
  },
  {
    id: 'plan-changes',
    title: 'Plan que cambia',
    description: 'Adapta un planning activo: agrega stories, divide una demasiado grande y omite trabajo obsoleto.',
    difficulty: 'intermediate',
    durationMin: 6,
    commands: ['/plan-enrich-epic', '/plan-split-story', '/plan-edge-case', '/plan-story-skip'],
    available: true,
  },
  {
    id: 'backlog-first',
    title: 'Backlog primero',
    description: 'Enriquece un epic crudo antes de planificar: agrega DoD, detecta gaps y genera el planning.',
    difficulty: 'intermediate',
    durationMin: 7,
    commands: ['/us-new', '/us-enrich', '/epic-enrich', '/us-status', '/plan-from-epic'],
    available: true,
  },
  {
    id: 'release',
    title: 'Gestión de release',
    description: 'Agrupa plannings bajo una versión semántica y rastrea su estado en tiempo real.',
    difficulty: 'intermediate',
    durationMin: 6,
    commands: ['/release-init', '/release-new', '/release-add', '/release-status'],
    available: true,
  },
  {
    id: 'autonomous',
    title: 'Pipeline autónomo',
    description: 'Describe trabajo en lenguaje natural y deja que el pipeline lo cree, expanda y ejecute solo.',
    difficulty: 'advanced',
    durationMin: 5,
    commands: ['/plan-run', '/plan-agent-plan', '/plan-agent-execute', '/plan-agent-validate'],
    available: true,
  },
  {
    id: 'recovery',
    title: 'Recuperación',
    description: 'Diagnostica y recupera un planning bloqueado: valida, revierte y reintenta stories en mal estado.',
    difficulty: 'advanced',
    durationMin: 6,
    commands: ['/plan-health', '/plan-validate', '/plan-edge-case', '/plan-rollback', '/plan-retry'],
    available: true,
  },
  {
    id: 'context-switch',
    title: 'Cambio de contexto',
    description: 'Cambia de story de forma segura: detección automática de conflicto, pausa con STANDBY y reanudación sin perder progreso.',
    difficulty: 'intermediate',
    durationMin: 5,
    commands: ['/plan-status', '/plan-story'],
    available: true,
  },
  {
    id: 'advisory-audit',
    title: 'Decisión y auditoría',
    description: 'Usa el flujo de estado, métricas, auditoría documental y validación estructural del plugin.',
    difficulty: 'intermediate',
    durationMin: 6,
    commands: ['/plan-status', '/plan-report', '/plan-audit-docs', '/plan-doctor'],
    available: true,
  },
  {
    id: 'smoke-config',
    title: 'Smoke tests',
    description: 'Configura el plan de smoke tests del proyecto para que cada tarea termine con validaciones reales del stack.',
    difficulty: 'intermediate',
    durationMin: 6,
    commands: ['/plan-smoke-config'],
    available: true,
  },
]

type Filter = 'all' | Difficulty

export default function TrainingCatalogPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const { completedIds } = useTrainingProgress()

  const filtered = filter === 'all'
    ? SCENARIOS
    : SCENARIOS.filter((s) => s.difficulty === filter)

  return (
    <>
      <Head>
        <title>Entrenamientos — Planning with AI</title>
        <meta name="description" content="Practica el plugin con escenarios reales paso a paso. 10 entrenamientos que cubren el ciclo de vida completo." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Header />
      <main className="min-h-screen bg-surface">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-300 transition-colors mb-8"
            >
              <span aria-hidden="true">←</span>
              Volver al landing
            </Link>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400 mb-4">
              Práctica interactiva
            </p>
            <h1 className="text-4xl md:text-6xl font-bold text-surface-50 text-balance">
              Entrenamientos
            </h1>
            <p className="mt-6 text-lg md:text-xl text-surface-400 leading-relaxed max-w-3xl">
              Practica el plugin con escenarios reales paso a paso. Cada entrenamiento cubre una situación concreta de principio a fin.
            </p>
          </div>
        </section>

        {/* Catalog */}
        <section className="pb-24 md:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
              <div className="flex flex-wrap gap-2">
                {(['all', 'basic', 'intermediate', 'advanced'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                      filter === f
                        ? 'border-brand-500/50 bg-brand-500/15 text-brand-300'
                        : 'border-surface-700 bg-surface-900/50 text-surface-400 hover:border-surface-600 hover:text-surface-300'
                    }`}
                  >
                    {f === 'all' ? 'Todos' : DIFFICULTY_LABEL[f]}
                  </button>
                ))}
              </div>
              {completedIds.size > 0 && (
                <span className="text-sm font-medium text-green-400">
                  ✓ {completedIds.size} completado{completedIds.size !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((s, i) => (
                <article
                  key={s.id}
                  className={`glass-card flex flex-col p-6 ${s.available ? 'glass-card-hover' : 'opacity-60'}`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-mono ${DIFFICULTY_COLOR[s.difficulty]}`}>
                          {DIFFICULTY_STARS[s.difficulty]} {DIFFICULTY_LABEL[s.difficulty]}
                        </span>
                        {completedIds.has(s.id) && (
                          <span className="inline-block rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-400">
                            ✓ Completado
                          </span>
                        )}
                      </div>
                      <h2 className="text-lg font-semibold text-surface-50 leading-tight">
                        {i + 1}. {s.title}
                      </h2>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-surface-500">~{s.durationMin} min</span>
                  </div>

                  <p className="text-sm text-surface-400 leading-relaxed flex-1">
                    {s.description}
                  </p>

                  {/* Command badges */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.commands.map((cmd) => (
                      <code
                        key={cmd}
                        className="rounded border border-surface-700 bg-surface-900/70 px-2 py-0.5 text-[11px] text-brand-300"
                      >
                        {cmd}
                      </code>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-5">
                    {s.available ? (
                      <Link
                        href={`/training/${s.id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-brand-500/40 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-300 transition-colors hover:bg-brand-500/20"
                      >
                        → Iniciar entrenamiento
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-xl border border-surface-700 bg-surface-900/40 px-4 py-2 text-sm font-medium text-surface-600">
                        Próximamente
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
