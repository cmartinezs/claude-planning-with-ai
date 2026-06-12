import { useState, useEffect, useRef } from 'react'

export interface TerminalScript {
  command: string
  output: string[]
}

interface Props {
  script: TerminalScript
  embedded?: boolean
  onComplete?: () => void
}

export function Prompt() {
  const [time, setTime] = useState('00:00')

  useEffect(() => {
    setTime(new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }))
  }, [])

  return (
    <span className="font-mono text-sm leading-relaxed">
      <span className="text-cyan-400">┌─</span>[{time}]
      <span className="text-yellow-400">─</span>[<span className="text-brand-400">user</span>@<span className="text-cyan-400">devbox</span>]
      <span className="text-yellow-400">─</span>[<span className="text-blue-400">~/dev/mi-proyecto</span>]
      <span className="text-yellow-400">─</span>[<span className="text-green-400">main</span>]
      <br />
      <span className="text-cyan-400">└─</span>
      <span className="text-yellow-400">▪</span>{' '}
    </span>
  )
}

function Blinker() {
  return <span className="inline-block w-2 h-[1.1em] bg-brand-400 animate-pulse ml-0.5 align-text-bottom" />
}

export default function TerminalAnimation({ script, embedded = false, onComplete }: Props) {
  const [typed, setTyped] = useState('')
  const [outputLines, setOutputLines] = useState<string[]>([])
  const [phase, setPhase] = useState<'typing' | 'output' | 'done'>('typing')
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (!scrollArea) return

    scrollArea.scrollTop = scrollArea.scrollHeight
  }, [typed, outputLines])

  useEffect(() => {
    if (phase !== 'typing') return

    let i = 0
    const interval = setInterval(() => {
      i++
      setTyped(script.command.slice(0, i))
      if (i >= script.command.length) {
        clearInterval(interval)
        setPhase('output')
      }
    }, 22)

    return () => clearInterval(interval)
  }, [phase, script])

  useEffect(() => {
    if (phase !== 'output') return

    let lineIndex = 0
    const interval = setInterval(() => {
      setOutputLines((prev) => [...prev, script.output[lineIndex]])
      lineIndex++
      if (lineIndex >= script.output.length) {
        clearInterval(interval)
        setPhase('done')
        onComplete?.()
      }
    }, 80)

    return () => clearInterval(interval)
  }, [phase, script, onComplete])

  return (
    <div className={`${embedded ? 'h-full' : 'terminal-card w-full shadow-2xl shadow-brand-500/5 rounded-2xl border border-surface-700'} flex flex-col overflow-hidden bg-surface-900/80`}>
      {!embedded && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 border-b border-surface-700 shrink-0">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <span className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <span className="text-xs text-surface-600 font-mono ml-2">user@devbox:~/dev/mi-proyecto — zsh (oh-my-zsh)</span>
        </div>
      )}

      <div ref={scrollAreaRef} className={`${embedded ? 'min-h-0' : 'min-h-[320px] max-h-[400px]'} p-4 sm:p-5 flex-1 overflow-y-auto scrollbar-dark bg-surface-950/50`}>
        <div className="mb-1">
          <Prompt />
          <span className="text-brand-300 font-mono text-sm">{typed}</span>
          {phase === 'typing' && <Blinker />}
        </div>

        {outputLines.map((line, i) => {
          const display = line ?? ''

          if (display === '') {
            return <div key={i} className="h-3" />
          }

          if (display.startsWith('✓') || display.startsWith('  ✓')) {
            return (
              <div key={i} className="mb-0.5">
                <span className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">{display}</span>
              </div>
            )
          }

          if (display.startsWith('⟳') || display.startsWith('  ⟳')) {
            return (
              <div key={i} className="mb-0.5">
                <span className="text-yellow-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">{display}</span>
              </div>
            )
          }

          if (
            display.startsWith('    ') ||
            display.startsWith('  📁') ||
            display.startsWith('  ├') ||
            display.startsWith('  └')
          ) {
            return (
              <div key={i} className="mb-0.5">
                <span className="text-surface-500 font-mono text-sm whitespace-pre-wrap leading-relaxed">{display}</span>
              </div>
            )
          }

          if (display.startsWith('  ➜') || display.startsWith('  Siguiente:')) {
            return (
              <div key={i} className="mb-0.5">
                <span className="text-cyan-500 font-mono text-sm whitespace-pre-wrap leading-relaxed">{display}</span>
              </div>
            )
          }

          return (
            <div key={i} className="mb-0.5">
              <span className="text-surface-300 font-mono text-sm whitespace-pre-wrap leading-relaxed">{display}</span>
            </div>
          )
        })}

        {phase === 'done' && (
          <div className="mt-1">
            <Prompt />
            <Blinker />
          </div>
        )}
      </div>
    </div>
  )
}
