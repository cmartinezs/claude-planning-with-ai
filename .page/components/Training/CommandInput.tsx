import { useState, type KeyboardEvent } from 'react'

interface Props {
  suggestion: string
  onRun: () => void
  disabled?: boolean
}

export default function CommandInput({ suggestion, onRun, disabled = false }: Props) {
  const [value, setValue] = useState('')
  const [hint, setHint] = useState('')

  const handleRun = () => {
    if (disabled) return
    const trimmed = value.trim()
    if (trimmed === '' || trimmed === suggestion) {
      setValue('')
      setHint('')
      onRun()
      return
    }
    // Partial match: first word of suggestion vs first word typed
    const expectedFirst = suggestion.split(' ')[0]
    const typedFirst = trimmed.split(' ')[0]
    if (typedFirst === expectedFirst) {
      setValue('')
      setHint('')
      onRun()
    } else {
      setHint(`Pista: el comando esperado empieza con ${expectedFirst}`)
    }
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleRun()
    if (e.key === 'Tab') {
      e.preventDefault()
      setValue(suggestion)
      setHint('')
    }
  }

  return (
    <div className="border-t border-surface-800 bg-surface-950 p-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-cyan-400 shrink-0">$</span>
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setHint('') }}
          onKeyDown={handleKey}
          disabled={disabled}
          placeholder={suggestion}
          className="flex-1 bg-transparent font-mono text-sm text-brand-300 placeholder-surface-600 outline-none disabled:opacity-40"
        />
        <button
          onClick={handleRun}
          disabled={disabled}
          className="shrink-0 rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 font-mono text-xs text-brand-300 transition-colors hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          → Ejecutar
        </button>
      </div>
      {hint && (
        <p className="mt-1.5 font-mono text-xs text-yellow-500">{hint}</p>
      )}
      <p className="mt-1 font-mono text-[10px] text-surface-700">
        Tab para autocompletar · Enter para ejecutar
      </p>
    </div>
  )
}
