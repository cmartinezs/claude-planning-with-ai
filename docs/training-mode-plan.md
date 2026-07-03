# Training Mode — Plan de implementación

Sistema de entrenamientos interactivos para practicar el plugin desde la landing page.

---

## Contexto

La landing page (`/.page`) es un sitio Next.js/Tailwind. Ya existe:
- `TerminalAnimation` — componente con efecto typewriter
- `WorkspaceMock` (en `Installation.tsx`) — panel VS Code con árbol de archivos + editor + terminal
- Páginas `/commands` y `/tutorials`

El Training Mode agrega `/training` (catálogo) y `/training/[id]` (runner) como nuevas rutas.

---

## Wireframes

### Catálogo `/training`

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Volver al landing          ENTRENAMIENTOS            [ES | EN]    │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   Practica el plugin con escenarios reales                           │
│   Cada entrenamiento cubre una situación concreta de principio a fin │
│                                                                      │
│   [Todos]  [Básico]  [Intermedio]  [Avanzado]     3 completados ✓   │
│                                                                      │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ ★☆☆  ~8 min      │ │ ★☆☆  ~7 min      │ │ ★★☆  ~6 min      │    │
│  │                  │ │                  │ │                  │    │
│  │ 1. Primer        │ │ 2. Desde un epic │ │ 3. Plan que      │    │
│  │    planning      │ │                  │ │    cambia        │    │
│  │                  │ │                  │ │                  │    │
│  │ /plan-init       │ │ /plan-from-epic  │ │ /plan-enrich-epic│    │
│  │ /plan-new        │ │ /plan-atomize    │ │ /plan-split-story│    │
│  │ /plan-expand     │ │ /plan-task       │ │ /plan-story-skip │    │
│  │ /plan-story      │ │ /plan-done       │ │                  │    │
│  │                  │ │                  │ │                  │    │
│  │  ✓ Completado    │ │  [→ Iniciar]     │ │  [→ Iniciar]     │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘    │
│                                                                      │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐    │
│  │ ★★☆  ~7 min      │ │ ★★☆  ~6 min      │ │ ★★★  ~5 min      │    │
│  │ 4. Backlog       │ │ 5. Gestión de    │ │ 6. Pipeline      │    │
│  │    primero       │ │    release       │ │    autónomo      │    │
│  │  [→ Iniciar]     │ │  [→ Iniciar]     │ │  [→ Iniciar]     │    │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘    │
│                                                                      │
│  ┌──────────────────┐                                               │
│  │ ★★★  ~6 min      │                                               │
│  │ 7. Recuperación  │                                               │
│  │  [→ Iniciar]     │                                               │
│  └──────────────────┘                                               │
└──────────────────────────────────────────────────────────────────────┘
```

### Runner `/training/[id]`

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← Catálogo    Entrenamiento 1 — Primer planning    ★☆☆  Paso 3/7   │
│                ██████████░░░░░░░░░░░░░░░░░░░░ 40%                   │
├────────────────────────┬─────────────────────────────────────────────┤
│  PASOS                 │  WORKSPACE                                  │
│                        │                                             │
│  ✓ 1. /plan-init       │  ┌─ Explorer ──┬─────────────────────────┐ │
│  ✓ 2. /plan-new        │  │ .planning/  │ 01-expansion.md         │ │
│  ▶ 3. /plan-expand     │  │  active/    │─────────────────────────│ │
│    4. /plan-story      │  │   001-auth/ │ # EXPANSION: user-auth  │ │
│    5. /plan-done       │  │    00-init  │                         │ │
│    6. /plan-status     │  │    01-exp ● │ | # | Story | Status |  │ │
│    7. /plan-archive    │  │  finished/  │ | 1 | Login | TODO   |  │ │
│                        │  └────────────┴─────────────────────────┘ │
│  ┌─────────────────┐   │                                             │
│  │ Contexto        │   │  ┌─ Terminal ────────────────────────────┐ │
│  │                 │   │  │ ┌─[10:24]─[user@devbox]─[main]──     │ │
│  │ Quieres ver las │   │  │ └─▪ /plan-expand 001-user-auth        │ │
│  │ stories que     │   │  │   ⟳ Expandiendo planning...          │ │
│  │ Claude generó   │   │  │   ✓ story-01: Registro de usuario    │ │
│  │ para tu         │   │  │   ✓ story-02: Login con JWT          │ │
│  │ planning.       │   │  │   ✓ story-03: Refresh de tokens      │ │
│  └─────────────────┘   │  │                                      │ │
│                        │  │  ┌──────────────────────────────────┐ │ │
│  ┌─────────────────┐   │  │  │ Sugerencia: /plan-story ...      │ │ │
│  │ Siguiente paso  │   │  │  │ $ _________________________      │ │ │
│  │                 │   │  │  │                    [→ Ejecutar]  │ │ │
│  │ Ejecuta la      │   │  │  └──────────────────────────────────┘ │ │
│  │ primera story   │   │  └──────────────────────────────────────┘ │
│  │ con plan-story  │   │                                             │
│  └─────────────────┘   │                                             │
└────────────────────────┴─────────────────────────────────────────────┘
```

---

## Arquitectura

### Estructura de archivos

```
.page/
├── types/
│   └── training.ts                     ← contratos TypeScript
├── data/
│   └── training/
│       ├── scenario-01-first-planning.ts
│       ├── scenario-02-from-epic.ts
│       ├── scenario-03-plan-changes.ts
│       ├── scenario-04-backlog-first.ts
│       ├── scenario-05-release.ts
│       ├── scenario-06-autonomous.ts
│       └── scenario-07-recovery.ts
├── components/
│   └── Training/
│       ├── TrainingCatalog.tsx         ← grid de cards del catálogo
│       ├── TrainingCard.tsx            ← card individual
│       ├── TrainingRunner.tsx          ← orquestador del entrenamiento
│       ├── TrainingStepList.tsx        ← panel izquierdo (pasos)
│       ├── TrainingWorkspace.tsx       ← panel derecho (árbol+editor+terminal)
│       └── CommandInput.tsx            ← campo con sugerencia + botón ejecutar
├── hooks/
│   └── useTrainingProgress.ts          ← localStorage: escenarios completados
└── pages/
    ├── training.tsx                    ← catálogo /training
    └── training/
        └── [id].tsx                    ← runner /training/[id]
```

### Tipos centrales (`types/training.ts`)

```typescript
export interface FileEntry {
  name: string
  level: number
  type: 'file' | 'folder'
  done?: boolean
}

export interface TrainingStep {
  command: string      // comando canónico esperado
  output: string[]     // líneas del terminal (usa prefijos ✓ ⟳ ➜ como TerminalAnimation)
  files: FileEntry[]   // árbol .planning/ después de ejecutar este paso
  tab: string          // archivo activo en el editor
  code: string[]       // contenido del editor
  hint: string         // panel "Contexto" — qué está pasando antes de ejecutar
  nextHint: string     // panel "Siguiente paso" — qué viene después
}

export interface TrainingScenario {
  id: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  durationMin: number
  commands: string[]   // badges del catálogo
  steps: TrainingStep[]
}
```

### Capa común de ejecución

`TrainingRunner` es el motor compartido. Recibe un `TrainingScenario` y gestiona:
- `currentStep`: índice del paso activo
- `completedSteps`: set de pasos terminados
- Avance al siguiente paso cuando `TerminalAnimation` llama `onComplete`

`CommandInput` acepta texto libre:
- Si el texto coincide con `step.command` → ejecuta
- Si no coincide → muestra pista: `"El comando empieza con /plan-..."` sin bloquear

`TrainingWorkspace` es `WorkspaceMock` de `Installation.tsx` refactorizado como componente genérico que acepta los campos de `TrainingStep`.

### Progreso (`useTrainingProgress`)

```typescript
// Lee/escribe en localStorage bajo la clave 'training-progress'
// Devuelve: completedIds: Set<string>, markComplete(id), reset()
```

Muestra badge `✓ Completado` en las cards del catálogo y contador global `N completados`.

---

## Los 7 entrenamientos

### 1. Primer planning ★☆☆ — ~8 min
**Escenario:** Acabas de instalar el plugin en tu proyecto `user-auth-api`.

| Paso | Comando | Qué demuestra |
|------|---------|---------------|
| 1 | `/plan-init` | Crea `.planning/`, detecta áreas AP y DO |
| 2 | `/plan-new 001-user-auth -- Autenticación JWT` | Planning en INITIAL |
| 3 | `/plan-expand 001-user-auth` | 3 stories generadas, → EXPANSION |
| 4 | `/plan-story 001-user-auth story-01` | Rama, tareas, commits, push, PR, limpieza local de ramas mergeadas |
| 5 | `/plan-done 001-user-auth story-01` | Story DONE, PR confirmado, limpieza local posterior al merge |
| 6 | `/plan-status` | Vista general del planning |
| 7 | `/plan-archive 001-user-auth` | → `finished/` |

---

### 2. Desde un epic ★☆☆ — ~7 min
**Escenario:** Tienes user stories en `docs/product/epic-checkout/`. Quieres convertirlas en un planning ejecutable.

| Paso | Comando | Qué demuestra |
|------|---------|---------------|
| 1 | `/us-status docs/product/epic-checkout/` | 3 stories, 1 sin DoD |
| 2 | `/us-enrich docs/product/epic-checkout/03-payment.md` | Agrega DoD + Technical Notes |
| 3 | `/plan-from-epic 002-checkout docs/product/epic-checkout/` | Planning activo generado |
| 4 | `/plan-atomize 002-checkout story-01` | Story → 3 tareas atómicas |
| 5 | `/plan-task 002-checkout story-01 task-01` | Ejecuta tarea + commit convencional + PR a story |
| 6 | `/plan-task 002-checkout story-01 task-02` | Segunda tarea tras merge y limpieza local de la rama anterior |
| 7 | `/plan-done 002-checkout story-01` | Push + PR final, limpieza local posterior al merge |

---

### 3. Plan que cambia ★★☆ — ~6 min
**Escenario:** `003-inventory-api` está en DEEPENING. El cliente agregó 2 requisitos nuevos y una story es demasiado grande.

| Paso | Comando | Qué demuestra |
|------|---------|---------------|
| 1 | `/plan-status` | 2 stories DONE, 1 IN PROGRESS, 1 TODO |
| 2 | `/plan-enrich-epic 003-inventory-api` | 2 stories nuevas agregadas |
| 3 | `/plan-split-story 003-inventory-api story-03` | Divide story grande en 2 |
| 4 | `/plan-story-skip 003-inventory-api story-06 -- No aplica en MVP` | Skip con razón registrada |
| 5 | `/plan-story 003-inventory-api story-03a` | Ejecuta primera mitad del split |

---

### 4. Backlog primero ★★☆ — ~7 min
**Escenario:** Epic nuevo en `docs/product/epic-notifications/` con ideas crudas. Hay que enriquecer antes de planificar.

| Paso | Comando | Qué demuestra |
|------|---------|---------------|
| 1 | `/us-new docs/product/epic-notifications/` | Crea nueva story interactiva |
| 2 | `/us-enrich docs/product/epic-notifications/01-email.md` | DoD + Technical Notes |
| 3 | `/epic-enrich docs/product/epic-notifications/` | Detecta 2 gaps, agrega stories |
| 4 | `/us-status docs/product/epic-notifications/` | Todas enriched → listas |
| 5 | `/plan-from-epic 004-notifications docs/product/epic-notifications/` | Planning generado |

---

### 5. Gestión de release ★★☆ — ~6 min
**Escenario:** Dos plannings activos que hay que agrupar bajo `v2.0.0` y rastrear.

| Paso | Comando | Qué demuestra |
|------|---------|---------------|
| 1 | `/release-init` | Crea `.releases/` |
| 2 | `/release-new v2.0.0 -- Módulo de pagos y notificaciones` | Release en DRAFT |
| 3 | `/release-add v2.0.0 002-checkout 004-notifications` | 2 plannings vinculados |
| 4 | `/release-status` | Tabla resumen con estados en vivo |
| 5 | `/release-status v2.0.0` | Detalle completo |
| 6 | `/release-status v2.0.0 --mark-in-progress` | Transición de estado |

---

### 6. Pipeline autónomo ★★★ — ~5 min
**Escenario:** Describes trabajo en lenguaje natural. El pipeline crea, expande y ejecuta sin intervención.

| Paso | Comando | Qué demuestra |
|------|---------|---------------|
| 1 | `/plan-run "Exportación de reportes en PDF"` | Crea planning + inicia ciclo completo |
| 2 | *(output automático)* agente plan | INITIAL → EXPANSION sin pausas |
| 3 | *(output automático)* agente execute | Stories en paralelo, PRs por task |
| 4 | *(output automático)* agente validate | Validación + archive |
| 5 | `/plan-status` | Planning en `finished/` |

> Los pasos 2–4 son salida extendida del paso 1; no requieren input del usuario.

---

### 7. Recuperación ★★★ — ~6 min
**Escenario:** `006-reporting` está bloqueado. Una story quedó en mal estado. Hay que diagnosticar y recuperar.

| Paso | Comando | Qué demuestra |
|------|---------|---------------|
| 1 | `/plan-health` | Scan global: planning bloqueado, archivos inconsistentes |
| 2 | `/plan-validate 006-reporting` | Validación específica: story-02 corrupta |
| 3 | `/plan-rollback 006-reporting story-02` | Revierte story-02 a TODO |
| 4 | `/plan-retry 006-reporting` | Resetea todos los BLOCKED |
| 5 | `/plan-story 006-reporting story-02` | Re-ejecuta limpiamente |

---

## Tareas de implementación

| # | Tarea | Archivos | Commit |
|---|-------|----------|--------|
| 1 | Tipos TypeScript | `types/training.ts` | `feat: add training types` |
| 2 | Datos escenario 1 | `data/training/scenario-01-first-planning.ts` | `feat: add scenario 1 data` |
| 3 | Componentes core | `TrainingRunner`, `TrainingWorkspace`, `CommandInput`, `TrainingStepList` | `feat: add training runner components` |
| 4 | Página runner | `pages/training/[id].tsx` — funcional con escenario 1 | `feat: add training page with scenario 1` |
| 5 | Página catálogo | `pages/training.tsx`, `TrainingCatalog`, `TrainingCard` | `feat: add training catalog page` |
| 6 | Datos escenarios 2–4 | `scenario-02`, `scenario-03`, `scenario-04` | `feat: add scenarios 2-4 data` |
| 7 | Datos escenarios 5–7 | `scenario-05`, `scenario-06`, `scenario-07` | `feat: add scenarios 5-7 data` |
| 8 | Progress tracking | `hooks/useTrainingProgress.ts` + badges en catálogo | `feat: add training progress tracking` |
| 9 | Integración nav + landing | Header, card en sección Commands, locales EN | `feat: integrate training into nav and landing` |
