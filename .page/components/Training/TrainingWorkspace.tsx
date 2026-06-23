import { useState } from 'react'
import TerminalAnimation, { Prompt } from '@/components/TerminalAnimation'
import CommandInput from './CommandInput'
import type { TrainingStep } from '@/types/training'

interface Props {
  step: TrainingStep
  isRunning: boolean
  isDone: boolean
  onRun: () => void
  onComplete: () => void
}

export default function TrainingWorkspace({ step, isRunning, isDone, onRun, onComplete }: Props) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/15 via-cyan-500/10 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-surface-600/70 bg-surface-950 shadow-2xl shadow-brand-500/10">
        <div className="grid min-h-[560px] grid-cols-[44px_1fr] md:grid-cols-[44px_minmax(128px,180px)_1fr] bg-surface-900/70">

          {/* Activity bar */}
          <div className="flex flex-col items-center gap-4 border-r border-surface-800 bg-surface-950 py-4 text-surface-500">
            <span className="text-lg text-surface-200">▣</span>
            <span className="text-lg">⌕</span>
            <span className="text-lg">⑂</span>
            <span className="mt-auto text-lg text-brand-400">⚙</span>
          </div>

          {/* File tree */}
          <aside className="hidden md:block border-r border-surface-800 bg-surface-900/80">
            <div className="border-b border-surface-800 px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-surface-500">
              Explorer
            </div>
            <div className="px-2 py-3">
              <div className="mb-2 px-1 text-[11px] font-semibold uppercase text-surface-400">
                user-auth-api
              </div>
              {step.files.map((file, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1.5 rounded px-1.5 py-1 text-xs ${
                    file.name === step.tab
                      ? 'bg-brand-500/10 text-brand-300'
                      : 'text-surface-400'
                  }`}
                  style={{ paddingLeft: `${file.level * 12 + 6}px` }}
                >
                  <span className={file.type === 'folder' ? 'text-brand-400' : 'text-cyan-500'}>
                    {file.type === 'folder' ? '▸' : file.done ? '✓' : 'md'}
                  </span>
                  <span className="truncate">{file.name}</span>
                </div>
              ))}
            </div>
          </aside>

          {/* Editor + terminal */}
          <div className="flex min-w-0 flex-col">
            <div className="flex border-b border-surface-800 bg-surface-900">
              <div className="border-r border-surface-800 bg-surface-950 px-4 py-2 text-xs font-mono text-surface-300">
                {step.tab}
              </div>
            </div>

            <div className="grid flex-1 grid-rows-[minmax(160px,1fr)_minmax(220px,300px)]">
              {/* Code viewer */}
              <pre className="overflow-hidden bg-surface-950/80 p-5 font-mono text-xs leading-6 text-surface-300">
                {step.code.map((line, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="w-6 shrink-0 text-right text-surface-700">{i + 1}</span>
                    <span className={
                      line.startsWith('#') ? 'text-brand-300' :
                      line.includes('DONE') || line.includes('[x]') ? 'text-green-400' :
                      line.startsWith('|') ? 'text-surface-400' :
                      'text-surface-300'
                    }>
                      {line || ' '}
                    </span>
                  </div>
                ))}
              </pre>

              {/* Terminal */}
              <div className="min-h-0 border-t border-surface-800 bg-surface-950 flex flex-col">
                <div className="flex items-center gap-5 border-b border-surface-800 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-surface-500 shrink-0">
                  <span>Problems</span>
                  <span>Output</span>
                  <span className="text-brand-400">Terminal</span>
                </div>

                {isRunning ? (
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <TerminalAnimation
                      key={step.command}
                      script={{ command: step.command, output: step.output }}
                      embedded
                      onComplete={onComplete}
                    />
                  </div>
                ) : (
                  <div className="flex-1 p-4">
                    <Prompt />
                    <span className="font-mono text-sm text-surface-600">
                      {isDone ? '' : 'esperando comando...'}
                    </span>
                  </div>
                )}

                <CommandInput
                  suggestion={step.command}
                  onRun={onRun}
                  disabled={isRunning}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
