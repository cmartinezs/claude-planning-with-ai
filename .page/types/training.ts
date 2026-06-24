export interface FileEntry {
  name: string
  level: number
  type: 'file' | 'folder'
  /** Mark a file as completed (shows ✓ instead of icon) */
  done?: boolean
}

export interface TrainingStep {
  /** The canonical command the user should run */
  command: string
  /** Terminal output lines — use ✓ ⟳ ➜ prefixes for coloring (same as TerminalAnimation) */
  output: string[]
  /** .planning/ file tree state after this step executes */
  files: FileEntry[]
  /** Active file tab shown in the editor panel */
  tab: string
  /** Editor content lines shown alongside the file tree */
  code: string[]
  /** "Contexto" panel — what situation the user is in before running the command */
  hint: string
  /** "Siguiente paso" panel — what comes next after this step completes */
  nextHint: string
  /**
   * "Antes de continuar" panel — shown after the animation completes when this step
   * reads files with checklists or done criteria. Instructs the user to open the file
   * shown in the editor and verify that all checks are satisfied before advancing.
   */
  reviewNote?: string
}

export type Difficulty = 'basic' | 'intermediate' | 'advanced'

export interface WorkspaceState {
  files: FileEntry[]
  tab: string
  code: string[]
}

export interface TrainingScenario {
  id: string
  difficulty: Difficulty
  durationMin: number
  /** Command badges shown in the catalog card */
  commands: string[]
  /** Workspace state shown BEFORE the first command runs */
  initial?: WorkspaceState
  steps: TrainingStep[]
}

/** Locale-aware metadata kept separate from the data (steps are locale-neutral) */
export interface TrainingScenarioMeta {
  id: string
  title: string
  subtitle: string
  description: string
  difficulty: Difficulty
  durationMin: number
  commands: string[]
}
