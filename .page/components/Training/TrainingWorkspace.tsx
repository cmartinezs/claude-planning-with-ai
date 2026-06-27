import { useEffect, useRef, useState } from 'react'
import type { ReactNode, PointerEvent as ReactPointerEvent } from 'react'
import TerminalAnimation, { Prompt } from '@/components/TerminalAnimation'
import CommandInput from './CommandInput'
import type { TrainingStep, WorkspaceState } from '@/types/training'

interface Props {
  step: TrainingStep
  /** When provided, overrides step.files/tab/code (used to show pre-command state) */
  viewState?: WorkspaceState
  isRunning: boolean
  isExecuted: boolean
  onRun: () => void
  onComplete: () => void
}

const DEFAULT_EXPLORER_SIZE = 25
const DEFAULT_EDITOR_SIZE = 65
const EXPLORER_MIN_SIZE = 18
const EXPLORER_MAX_SIZE = 42
const TERMINAL_MIN_SIZE = 22
const TERMINAL_MAX_SIZE = 60
const EDITOR_MIN_SIZE = 100 - TERMINAL_MAX_SIZE
const EDITOR_MAX_SIZE = 100 - TERMINAL_MIN_SIZE

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function fileIcon(fileType: string, done?: boolean) {
  if (fileType === 'folder') return '▸'
  return done ? '✓' : 'md'
}

function explorerLabel(files: WorkspaceState['files']) {
  const folders = files.filter((file) => file.type === 'folder').length
  const documents = files.length - folders
  return `${folders} folders · ${documents} files`
}

function ExplorerPanel({ display }: { display: WorkspaceState }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-950/95">
      <div className="flex items-center justify-between border-b border-surface-800 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500">
            Explorer
          </p>
          <p className="mt-0.5 text-xs text-surface-400">{explorerLabel(display.files)}</p>
        </div>
        <span className="rounded-full border border-surface-700 bg-surface-900/80 px-2 py-0.5 font-mono text-[10px] text-surface-500">
          user-auth-api
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 scrollbar-dark">
        {display.files.length > 0 ? (
          display.files.map((file, index) => (
            <div
              key={`${file.level}-${file.name}-${index}`}
              className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-xs transition-colors ${
                file.name === display.tab
                  ? 'bg-brand-500/10 text-brand-300'
                  : 'text-surface-400 hover:bg-surface-900/80 hover:text-surface-300'
              }`}
              style={{ paddingLeft: `${file.level * 12 + 6}px` }}
            >
              <span className={file.type === 'folder' ? 'text-brand-400' : 'text-cyan-500'}>
                {fileIcon(file.type, file.done)}
              </span>
              <span className="truncate">{file.name}</span>
            </div>
          ))
        ) : (
          <p className="px-2 text-xs italic text-surface-600">proyecto vacío</p>
        )}
      </div>
    </div>
  )
}

function EditorPanel({ display }: { display: WorkspaceState }) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-950/95">
      <div className="flex items-center gap-2 border-b border-surface-800 bg-surface-900/70 px-4 py-2.5">
        <span className="rounded-md border border-surface-700 bg-surface-950 px-2 py-1 font-mono text-xs text-brand-300">
          {display.tab || 'README.md'}
        </span>
        <span className="text-[11px] text-surface-500">modified</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-surface-950/80 p-5 font-mono text-xs leading-6 text-surface-300 scrollbar-dark">
        {display.code.length > 0 ? (
          display.code.map((line, lineNumber) => (
            <div key={`${lineNumber}-${line}`} className="flex gap-4">
              <span className="w-6 shrink-0 text-right text-surface-700">
                {lineNumber + 1}
              </span>
              <span
                className={
                  line.startsWith('#')
                    ? 'text-brand-300'
                    : line.includes('DONE') || line.includes('[x]')
                      ? 'text-green-400'
                      : line.startsWith('|')
                        ? 'text-surface-400'
                        : 'text-surface-300'
                }
              >
                {line || ' '}
              </span>
            </div>
          ))
        ) : (
          <span className="text-surface-700 italic">ejecuta el comando para ver los cambios</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-surface-800 bg-surface-900/80 px-4 py-2 text-[11px] text-surface-500">
        <span>{display.tab || 'README.md'}</span>
        <span>Ln {display.code.length || 1}, Col 1</span>
        <span className="text-brand-400">main</span>
      </div>
    </div>
  )
}

function TerminalLine({ line }: { line: string }) {
  const display = line ?? ''

  if (display === '') {
    return <div className="h-3" />
  }

  if (display.startsWith('✓') || display.startsWith('  ✓')) {
    return <span className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-green-400">{display}</span>
  }

  if (display.startsWith('⟳') || display.startsWith('  ⟳')) {
    return <span className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-yellow-400">{display}</span>
  }

  if (
    display.startsWith('    ') ||
    display.startsWith('  📁') ||
    display.startsWith('  ├') ||
    display.startsWith('  └')
  ) {
    return <span className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-surface-500">{display}</span>
  }

  if (display.startsWith('  ➜') || display.startsWith('  Siguiente:')) {
    return <span className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-cyan-500">{display}</span>
  }

  return <span className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-surface-300">{display}</span>
}

function CompletedTerminal({ step }: { step: TrainingStep }) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto bg-surface-950/50 p-4 scrollbar-dark">
      <div className="mb-1">
        <Prompt />
        <span className="font-mono text-sm text-brand-300">{step.command}</span>
      </div>

      {step.output.map((line, i) => (
        <div key={i} className="mb-0.5">
          <TerminalLine line={line} />
        </div>
      ))}

      <div className="mt-3 rounded-lg border border-brand-500/20 bg-brand-500/5 px-3 py-2">
        <p className="font-mono text-xs text-brand-300">
          Comando ejecutado. Revisa el resultado y usa Siguiente para avanzar.
        </p>
      </div>
    </div>
  )
}

function TerminalPanel({
  step,
  isRunning,
  isExecuted,
  onRun,
  onComplete,
}: {
  step: TrainingStep
  isRunning: boolean
  isExecuted: boolean
  onRun: () => void
  onComplete: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-surface-950/95">
      <div className="flex items-center gap-5 border-b border-surface-800 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
        <span>Problems</span>
        <span>Output</span>
        <span className="text-brand-400">Terminal</span>
      </div>

      <div className="min-h-0 flex-1">
        {isRunning ? (
          <TerminalAnimation
            key={step.command}
            script={{ command: step.command, output: step.output }}
            embedded
            onComplete={onComplete}
          />
        ) : isExecuted ? (
          <CompletedTerminal step={step} />
        ) : (
          <div className="p-4">
            <Prompt />
            <span className="font-mono text-sm text-surface-600">esperando comando...</span>
          </div>
        )}
      </div>

      <CommandInput
        suggestion={step.command}
        onRun={onRun}
        disabled={isRunning || isExecuted}
      />
    </div>
  )
}

type SplitOrientation = 'horizontal' | 'vertical'

interface SplitPaneProps {
  orientation: SplitOrientation
  firstSize: number
  onFirstSizeChange: (size: number) => void
  firstMin: number
  firstMax: number
  first: ReactNode
  second: ReactNode
  handleLabel: string
  handleClassName: string
}

function SplitPane({
  orientation,
  firstSize,
  onFirstSizeChange,
  firstMin,
  firstMax,
  first,
  second,
  handleLabel,
  handleClassName,
}: SplitPaneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{
    startPosition: number
    startSize: number
    totalSize: number
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (event: PointerEvent) => {
      const drag = dragRef.current
      if (!drag || !containerRef.current) return

      const currentPosition = orientation === 'horizontal' ? event.clientX : event.clientY
      const delta = currentPosition - drag.startPosition
      const nextSize = clamp(
        drag.startSize + (delta / drag.totalSize) * 100,
        firstMin,
        firstMax,
      )

      onFirstSizeChange(nextSize)
    }

    const handleUp = () => {
      setIsDragging(false)
      dragRef.current = null
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [firstMax, firstMin, isDragging, onFirstSizeChange, orientation])

  const onHandlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const totalSize = orientation === 'horizontal' ? rect.width : rect.height
    if (totalSize <= 0) return

    dragRef.current = {
      startPosition: orientation === 'horizontal' ? event.clientX : event.clientY,
      startSize: firstSize,
      totalSize,
    }

    document.body.style.userSelect = 'none'
    document.body.style.cursor = orientation === 'horizontal' ? 'col-resize' : 'row-resize'
    setIsDragging(true)
  }

  const firstStyle =
    orientation === 'horizontal'
      ? { flexBasis: `${firstSize}%`, minWidth: 0, minHeight: 0 }
      : { flexBasis: `${firstSize}%`, minWidth: 0, minHeight: 0 }

  const handleStyle =
    orientation === 'horizontal'
      ? 'h-full w-2 cursor-col-resize'
      : 'h-2 w-full cursor-row-resize'

  return (
    <div
      ref={containerRef}
      className={orientation === 'horizontal' ? 'flex h-full w-full flex-row min-h-0' : 'flex h-full w-full flex-col min-h-0'}
    >
      <div className="min-w-0 min-h-0" style={firstStyle}>
        {first}
      </div>

      <button
        type="button"
        aria-label={handleLabel}
        className={`${handleStyle} ${handleClassName} relative shrink-0 touch-none select-none outline-none after:absolute after:inset-0 after:content-['']`}
        onPointerDown={onHandlePointerDown}
      />

      <div className="min-w-0 min-h-0 flex-1" style={{ minWidth: 0, minHeight: 0 }}>
        {second}
      </div>
    </div>
  )
}

export default function TrainingWorkspace({ step, viewState, isRunning, isExecuted, onRun, onComplete }: Props) {
  const display = viewState ?? { files: step.files, tab: step.tab, code: step.code }
  const [explorerSize, setExplorerSize] = useState(DEFAULT_EXPLORER_SIZE)
  const [editorSize, setEditorSize] = useState(DEFAULT_EDITOR_SIZE)

  const resetLayout = () => {
    setExplorerSize(DEFAULT_EXPLORER_SIZE)
    setEditorSize(DEFAULT_EDITOR_SIZE)
  }

  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-cyan-500/10 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-surface-600/70 bg-surface-950 shadow-2xl shadow-brand-500/10">
        <div className="relative">
          <button
            type="button"
            onClick={resetLayout}
            className="absolute right-4 top-4 z-30 rounded-lg border border-surface-700 bg-surface-950/90 px-3 py-1.5 font-mono text-[11px] text-surface-300 transition-colors hover:border-brand-500/40 hover:text-brand-300"
          >
            Reset layout
          </button>

          <div className="h-[620px] min-h-[620px] w-full bg-surface-900/70">
            <SplitPane
              orientation="horizontal"
              firstSize={explorerSize}
              onFirstSizeChange={setExplorerSize}
              firstMin={EXPLORER_MIN_SIZE}
              firstMax={EXPLORER_MAX_SIZE}
              handleLabel="Resize explorer and main editor"
              handleClassName="bg-surface-800/90 hover:bg-brand-500/30"
              first={<ExplorerPanel display={display} />}
              second={
                <SplitPane
                  orientation="vertical"
                  firstSize={editorSize}
                  onFirstSizeChange={setEditorSize}
                  firstMin={EDITOR_MIN_SIZE}
                  firstMax={EDITOR_MAX_SIZE}
                  handleLabel="Resize editor and terminal"
                  handleClassName="bg-surface-800/90 hover:bg-brand-500/30"
                  first={<EditorPanel display={display} />}
                  second={
                    <div className="min-h-0 h-full">
                      <TerminalPanel
                        step={step}
                        isRunning={isRunning}
                        isExecuted={isExecuted}
                        onRun={onRun}
                        onComplete={onComplete}
                      />
                    </div>
                  }
                />
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
